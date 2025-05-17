"use client"

import React, { useState } from 'react';
import Header from '@components/Header';

export default function SettingPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [visibility, setVisibility] = useState(true);

  const handleSave = () => {
    console.log('ユーザー名:', username);
    console.log('パスワード:', password);
    console.log('公開設定:', visibility);
  };

  return (
    <div>
      <Header title="Settings" />
      <main className="flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-md space-y-6 bg-white p-6 border rounded shadow">
          <div>
            <label className="block mb-1 font-semibold">ユーザー名の変更</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="新しいユーザー名を入力"
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">パスワードの変更</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="新しいパスワードを入力"
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">公開設定の変更</label>
            <div className="flex gap-4">
              <label>
                <input
                  type="radio"
                  name="visibility"
                  checked={visibility === true}
                  onChange={() => setVisibility(true)}
                  className="mr-1"
                />
                公開
              </label>
              <label>
                <input
                  type="radio"
                  name="visibility"
                  checked={visibility === false}
                  onChange={() => setVisibility(false)}
                  className="mr-1"
                />
                非公開
              </label>
            </div>
          </div>

          <div className="text-right">
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              保存
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}