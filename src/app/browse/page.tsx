"use client"

import React, { useState } from 'react';
import Header from '@components/Header';

export default function BrowsePage() {
  const [formData, setFormData] = useState({
      user: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
      };
    
      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('検索条件：', formData);
      };
    
  return (
    <div>
      <Header title="Others' Diaries" />
      <main className="flex flex-col items-center min-h-screen pt-4 px-4">
        <form onSubmit={handleSubmit} className="w-full max-w-5xl p-6 border rounded-md bg-white shadow">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="col-span-2">
              <label className="block mb-1 font-semibold">ユーザー</label>
              <input
                type="text"
                name="user"
                value={formData.user}
                onChange={handleChange}
                className="border rounded px-2 py-1 w-full"
                />
            </div>
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
            検索
          </button>
        </form>

        <div className="w-full overflow-x-auto mt-8">
          <table className="table-suto w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2 w-[20%]">ユーザー</th>
                <th className="border border-gray-300 px-4 py-2 w-[80%]">日記</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2 text-center">山本 たけし</td>
                <td className="border border-gray-300 px-4 py-2">今日は散歩して気分が良かった。</td>            
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 text-center">坂本 裕二</td>
                <td className="border border-gray-300 px-4 py-2">美味しいアイスコーヒーを飲んだ。</td>            
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 text-center">yasaka mituhiro</td>
                <td className="border border-gray-300 px-4 py-2">何もしない休日だった。</td>            
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 text-center">kimura</td>
                <td className="border border-gray-300 px-4 py-2">月9の撮影をした。</td>            
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 text-center">キンパ大臣</td>
                <td className="border border-gray-300 px-4 py-2">作ったたらこパスタが想像以上に美味しくできた。</td>            
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
