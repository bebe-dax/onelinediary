"use client"

import React, { useState } from 'react';
import Header from '@components/Header';
import { format } from 'date-fns';

export default function SearchPage() {
  const [formData, setFormData] = useState({
    date: '',
    word: '',
    mood:  '',
    favorite: false,
  });

  interface DiaryRow {
    id: string;
    date: string;
    diary: string;
    mood: string;
    favorite?: boolean;
    isEditing?: boolean;
    originalData?: {
      diary: string;
      mood: string;
      favorite: boolean;
    };
  }

  const [rows, setRows] = useState<DiaryRow[]>([]);
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const moodMap: Record<number, string> = {
    0: '',
    1: 'すごくいい',
    2: 'いい',
    3: 'ふつう',
    4: 'わるい',
    5: 'すごくわるい',
  }

  const reverseMoodMap: Record<string, number> = {
    'すごくいい': 1,
    'いい': 2,
    'ふつう': 3,
    'わるい': 4,
    'すごくわるい': 5,
  };

  const moods = Object.entries(moodMap);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    let newValue: string | number = value;

    if (name === 'mood') {
      newValue = value === '0' ? '' : Number(value);
    } else if (name === 'date') {
      newValue = format(value, 'yyyyMMdd');
    } else if (name === 'favorite') {
      newValue = value ? Number(1) : Number(0);
    }

    setFormData(prev => (
      { ...prev,
        [name]: newValue,
      }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('検索条件：', formData);
    setHasSearched(true);

    try {
      const query = new URLSearchParams({
        date: formData.date,
        word: formData.word,
        mood: formData.mood,
        favorite: String(formData.favorite),
      });

      const res = await fetch(`/api/diaryContents?${query.toString()}`, {
        method: 'GET',
      });

      if (!res.ok) throw new Error('検索失敗');

      const data = await res.json();
      console.log('取得したデータ：', data);

      // APIデータを画面用の形式に変換
      const mappedData = data.map((item: any) => ({
        id: item.ContentID,
        date: `${item.Date.slice(0, 4)}-${item.Date.slice(4, 6)}-${item.Date.slice(6, 8)}`,
        diary: item.Content,
        mood: moodMap[item.Mood] || '',
        favorite: item.Favorite === 1,
        isEditing: false,
      }))

      setRows(mappedData);
    } catch (error) {
      console.error('検索中にエラーが発生しました：', error);
    }
  };

  const handleCheckboxChange = (id: string | number, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((item) => item !== id)
    );
  };

  const handleFavoriteChange = (id: string, checked: boolean) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === id ? {...row, favorite: checked } : row
      )
    );
  };

  // 編集モードを開始
  const handleEdit = (id: string) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === id 
          ? {
              ...row, 
              isEditing: true,
              originalData: {
                diary: row.diary,
                mood: row.mood,
                favorite: row.favorite || false
              }
            }
          : row
      )
    );
  };

  // 編集をキャンセル
  const handleCancelEdit = (id: string) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === id && row.originalData
          ? {
              ...row,
              diary: row.originalData.diary,
              mood: row.originalData.mood,
              favorite: row.originalData.favorite,
              isEditing: false,
              originalData: undefined
            }
          : row
      )
    );
  };

  // 編集内容を保存
  const handleSaveEdit = async (id: string) => {
    const row = rows.find(r => r.id === id);
    if (!row) return;

    try {
      const updateData = {
        contentId: id,
        content: row.diary,
        mood: reverseMoodMap[row.mood] || 0,
        favorite: row.favorite ? 1 : 0
      };

      const res = await fetch('/api/diaryContents', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!res.ok) {
        throw new Error('更新処理に失敗しました');
      }

      const result = await res.json();
      console.log('更新結果：', result);

      // 編集モードを終了
      setRows((prev) =>
        prev.map((row) =>
          row.id === id 
            ? { ...row, isEditing: false, originalData: undefined }
            : row
        )
      );

      alert('日記を更新しました');
    } catch (error) {
      console.error('更新中にエラーが発生しました：', error);
      alert('更新処理に失敗しました');
    }
  };

  // 行内編集用の変更ハンドラ
  const handleRowEdit = (id: string, field: 'diary' | 'mood' | 'favorite', value: string | boolean) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, [field]: value } : row
      )
    );
  };

  const handleDelete = async () => {
    if (selectedIds.length === 0) return;

    try {
      // 選択されたContentIDsを配列として送信
      const contentIds = selectedIds.map(id => String(id));

      console.log('削除対象のContentID：', contentIds);

      const res = await fetch('/api/diaryContents', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contentIds: contentIds
        }),
      });

      if (!res.ok) {
        throw new Error('削除処理に失敗しました');
      }

      const result = await res.json();
      console.log('削除結果：', result);

      // API削除成功後、画面からも削除
      setRows((prev) => prev.filter((row) => !selectedIds.includes(row.id)));
      setSelectedIds([]);

      alert('選択したデータを削除しました');
    } catch (error) {
      console.error('削除中にエラーが発生しました：', error);
      alert('削除処理に失敗しました');
    }
  }

  return (
    <div>
      <Header title="My Diaries" />
      <main className="flex flex-col items-center min-h-screen pt-4 px-4">
        <form onSubmit={handleSubmit} className="w-full max-w-5xl p-6 border rounded-md bg-white shadow">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="col-span-1">
              <label className="block mb-1 font-semibold">日付</label>
              <input
                type="date"
                name="date"
                value={
                  formData.date
                    ? `${formData.date.slice(0, 4)}-${formData.date.slice(4, 6)}-${formData.date.slice(6, 8)}`
                    : ''
                }
                onChange={handleChange}
                className="border rounded px-2 py-1 w-full"
                />
            </div>

            <div className="col-span-2">
              <label className="block mb-1 font-semibold">ワード</label>
              <input
                type="text"
                name="word"
                value={formData.word}
                onChange={handleChange}
                placeholder="検索ワードを入力"
                className="border rounded px-2 py-1 w-full"
                />
            </div>

            <div className="col-span-1">
              <label className="block mb-1 font-semibold">気分</label>
              <select
                name="mood"
                value={formData.mood}
                onChange={handleChange}
                className="border rounded px-2 py-1 w-full"
                >
                <option value="" disabled hidden>
                  選択して下さい
                </option>
                {moods.map(([value, label]) => (
                  <option key={`mood-${value}`} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-6">
            <div>
              <label className="block mb-1 font-semibold">お気に入り</label>
              <label>
                <input
                  type="checkbox"
                  name="favorite"
                  checked={formData.favorite}
                  onChange={(e) =>
                    setFormData((prev) => ({...prev, favorite: e.target.checked }))
                  }
                  className="mr-1"
                  />
                  お気に入りのみ表示
              </label>
            </div>
          </div>

          <div className="w-full mt-8 px-4">
            <div className="flex mb-2 justify-between">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                検索
              </button>
            </div>
          </div>
        </form>

        {rows.length > 0 && (
          <>
            <div className="w-full mt-8 px-4">
              <div className="flex justify-end mp-2">
                <button
                  onClick={handleDelete}
                  disabled={selectedIds.length === 0}
                  className={`px-4 py-2 rounded text-white ${
                    selectedIds.length === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-red-500 hover:bg-red-600'
                  }`}
                >
                  削除 ({selectedIds.length})
                </button>
              </div>
            </div>
        
            <div className="w-full overflow-x-auto mt-8">
              <table className="table-auto w-full border-collapse border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 w-[10%]">日付</th>
                    <th className="border border-gray-300 px-4 py-2 w-[55%]">日記</th>
                    <th className="border border-gray-300 px-4 py-2 w-[10%]">気分</th>
                    <th className="border border-gray-300 px-4 py-2 w-[8%]">お気に入り</th>
                    <th className="border border-gray-300 px-4 py-2 w-[12%]">操作</th>
                    <th className="border border-gray-300 px-4 py-2 w-[5%]">削除</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr key={`diary-${index}-${row.id || 'no-id'}`}>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        {row.date}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {row.isEditing ? (
                          <textarea
                            value={row.diary}
                            onChange={(e) => handleRowEdit(row.id, 'diary', e.target.value)}
                            className="w-full border rounded px-2 py-1 min-h-[60px] resize-y"
                          />
                        ) : (
                          <div className="whitespace-pre-wrap">{row.diary}</div>
                        )}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        {row.isEditing ? (
                          <select
                            value={row.mood}
                            onChange={(e) => handleRowEdit(row.id, 'mood', e.target.value)}
                            className="border rounded px-2 py-1 w-full"
                          >
                            <option value="">選択</option>
                            {Object.entries(moodMap).slice(1).map(([value, label]) => (
                              <option key={`edit-mood-${value}`} value={label}>
                                {label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          row.mood
                        )}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        <input
                          type="checkbox"
                          checked={row.favorite || false}
                          disabled={!row.isEditing}
                          onChange={(e) => {
                            if (row.isEditing) {
                              handleRowEdit(row.id, 'favorite', e.target.checked);
                            } else {
                              handleFavoriteChange(row.id, e.target.checked);
                            }
                          }}
                          />
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        {row.isEditing ? (
                          <div className="flex gap-1 justify-center">
                            <button
                              onClick={() => handleSaveEdit(row.id)}
                              className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
                            >
                              保存
                            </button>
                            <button
                              onClick={() => handleCancelEdit(row.id)}
                              className="bg-gray-500 text-white px-2 py-1 rounded text-xs hover:bg-gray-600"
                            >
                              キャンセル
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleEdit(row.id)}
                            className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
                          >
                            編集
                          </button>
                        )}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(String(row.id || index))}
                          onChange={(e) => handleCheckboxChange(row.id || index, e.target.checked)}
                          />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {hasSearched && rows.length === 0 && (
          <div className="w-full mt-8 px-4">
            <div className="text-center text-gray-500 py-8">
              検索結果がありません
            </div>
          </div>
        )}
      </main>
    </div>
  );
}