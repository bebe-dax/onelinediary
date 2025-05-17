"use client"

import React, { useState } from 'react';
import Header from '@components/Header';

export default function SearchPage() {
  const [formData, setFormData] = useState({
    date: '',
    word: '',
    mood: '',
    favorite: false,
  });

  const [rows, setRows] = useState([
    { id: 1, date: '2025-05-10', diary: '今日は散歩して気分が良かった。', mood: 'いい' },
    { id: 2, date: '2025-05-11', diary: '仕事が忙しくて疲れた日だった。', mood: 'ふつう' },
    { id: 3, date: '2025-05-12', diary: 'カフェでゆっくり過ごした。', mood: 'すごくいい' },
    { id: 4, date: '2025-05-13', diary: '風邪気味で体調が悪い。', mood: 'わるい' },
    { id: 5, date: '2025-05-14', diary: '友達と電話して楽しかった。', mood: 'いい' },
  ]);

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const moods = ['すごくいい', 'いい', 'ふつう', 'わるい', 'すごくわるい'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('検索条件：', formData);
  };

  const handleCheckboxChange = (id: number, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((item) => item !== id)
    );
  };

  const handleDelete = () => {
    setRows((prev) => prev.filter((row) => !selectedIds.includes(row.id)));
    setSelectedIds([]);
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
                value={formData.date}
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
                <option value="">選択してください</option>
                {moods.map((mood, index) => (
                  <option key={index} value={mood}>
                    {mood}
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
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                登録
              </button>
            </div>
          </div>
        </form>

        <div className="w-full mt-8 px-4">
          <div className="flex justify-end mb-2">
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              削除
            </button>
          </div>
        </div>
        
        <div className="w-full overflow-x-auto mt-8">
          <table className="table-suto w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2 w-[10%]">日付</th>
                <th className="border border-gray-300 px-4 py-2 w-[70%]">日記</th>
                <th className="border border-gray-300 px-4 py-2 w-[10%]">気分</th>
                <th className="border border-gray-300 px-4 py-2 w-[5%]">お気に入り</th>
                <th className="border border-gray-300 px-4 py-2 w-[5%]">削除</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2 text-center">2025-05-10</td>
                <td className="border border-gray-300 px-4 py-2">今日は散歩して気分が良かった。</td>
                <td className="border border-gray-300 px-4 py-2 text-center">いい</td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <input type="checkbox" />
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <input type="checkbox" />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 text-center">2025-05-11</td>
                <td className="border border-gray-300 px-4 py-2">仕事が忙しかった。</td>
                <td className="border border-gray-300 px-4 py-2 text-center">ふつう</td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <input type="checkbox" />
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <input type="checkbox" />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 text-center">2025-05-12</td>
                <td className="border border-gray-300 px-4 py-2">カフェでゆっくり過ごした。</td>
                <td className="border border-gray-300 px-4 py-2 text-center">すごくいい</td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <input type="checkbox" />
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <input type="checkbox" />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 text-center">2025-05-13</td>
                <td className="border border-gray-300 px-4 py-2">風邪引いた。</td>
                <td className="border border-gray-300 px-4 py-2 text-center">わるい</td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <input type="checkbox" />
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <input type="checkbox" />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 text-center">2025-05-14</td>
                <td className="border border-gray-300 px-4 py-2">友達と電話して楽しかった。</td>
                <td className="border border-gray-300 px-4 py-2 text-center">いい</td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <input type="checkbox" />
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <input type="checkbox" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}