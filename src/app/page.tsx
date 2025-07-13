"use client"

import React, { useState } from 'react';
import Header from '@components/Header';

export default function Home() {
  const [diary, setDiary] = useState('');
  const [mood, setMood] = useState(3);

  // 気分の選択肢とラベルのマッピング
  const moodOptions = [
    { value: 1, label: 'すごくいい' },
    { value: 2, label: 'いい' },
    { value: 3, label: 'ふつう' },
    { value: 4, label: 'わるい' },
    { value: 5, label: 'すごくわるい' }
  ];

  const handleSubmit = () => {
    console.log('日記:', diary);
    console.log('気分:', mood);
  }

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
              />
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 whitespace-nowrap"
            >
              登録
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