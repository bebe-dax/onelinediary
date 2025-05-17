import React from 'react';
import Header from '@components/Header';

export default function Home() {
  return (
    <div>
      <Header title="Home" />
      <main className="flex flex-col items-center justify-center pt-30 px-4">
        <h1 className="text-2xl font-bold mb-4 text-center">今日の日記を登録してみよう</h1>
        <div className="flex items-center justify-center w-full max-w-mg gap-2">
          <input
            type="text"
            placeholder="ここに日記を入力..."
            className="border border-gray-300 rounded-lg px-4 py-2 w-full max-w-md focus:outline-none focus:fing-2 focus:ring-blue-500"
            />
          <button
            type="button"
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          >
            登録
          </button>
        </div>
      </main>
    </div>
  );
}