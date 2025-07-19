"use client"

import React, { useState } from 'react';
import Header from '@components/Header';

export default function Home() {
  const [diary, setDiary] = useState('');
  const [mood, setMood] = useState(3);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  };

  const today = getCurrentDate();

  // 気分の選択肢とラベルのマッピング
  const moodOptions = [
    { value: 1, label: 'すごくいい' },
    { value: 2, label: 'いい' },
    { value: 3, label: 'ふつう' },
    { value: 4, label: 'わるい' },
    { value: 5, label: 'すごくわるい' }
  ];

  const handleSubmit = async () => {
    // 日記の内容がからの場合は処理を中断
    if (!diary.trim()) {
      alert('日記の内容を入力してください。')
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/diaryContents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // diaryIdはUserIDから取得するように修正
          diaryId: 1,
          date: today,
          content: diary,
          mood: mood
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // 成功時の処理
      console.log('日記が正常に登録されました:', result);
      alert('日記が正常に登録されました！');

      // フォームをリセット
      setDiary('');
      setMood(3);
      
    } catch (error) {
      console.error('日記の登録中にエラーが発生しました:', error);
      alert('日記の登録に失敗しました。もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Header title="Home" />
      <main className="flex flex-col items-center justify-center pt-30 px-4">
        <h1 className="text-2xl font-bold mb-4 text-center">今日の日記を登録してみよう</h1>
        <div className="w-full max-w-md space-y-4">
          {/* 日記入力エリア */}
          <div className="flex items-center justify-center w-full max-w-md gap-2">
            <input
              type="text"
              placeholder="ここに日記を入力..."
              value={diary}
              onChange={(e) => setDiary(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:fing-2 focus:ring-blue-500"
              disabled={isSubmitting}
              />
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`px-4 py-2 rounded-lg whitespace-nowrap text-white ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              {isSubmitting ? '登録中 ...' : '登録'}
            </button>
          </div>

          {/* 気分選択コンボボックス */}
          <div className="flex items-center justify-center gap-2">
            <label htmlFor="mood" className="text-sm font-medium text-gray-700">
              今日の気分:
            </label>
            <select
              id="mood"
              value={mood}
              onChange={(e) => setMood(Number(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
               disabled={isSubmitting}
            >
              {moodOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </main>
    </div>
  );
}