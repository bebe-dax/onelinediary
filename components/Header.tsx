"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import '@styles/header.css';

type HeaderProps = {
    title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="bg-white shadow-md px-4 py-3">
      <div className="flex justify-between items-center">
        {/* ロゴ */}
        <div className="text-xl font-bold text-blue-600">
          <Link href="/">OneLineDiary</Link>
        </div>

        {/* ハンバーガーアイコン（モバイル用） */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"
              viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* メニュー（PC表示） */}
        <nav className="hidden md:flex space-x-6">
        <Link href="/" className="block text-gray-700 hover:text-blue-500">Home</Link>
          <Link href="/search" className="block text-gray-700 hover:text-blue-500">My Diaries</Link>
          <Link href="/browse" className="block text-gray-700 hover:text-blue-500">Others' Diaries</Link>
          <Link href="/settings" className="block text-gray-700 hover:text-blue-500">Setting</Link>
        </nav>
      </div>

      {/* メニュー（モバイル表示） */}
      {isOpen && (
        <nav className="md:hidden mt-2 space-y-2">
          <Link href="/" className="block text-gray-700 hover:text-blue-500">Home</Link>
          <Link href="/search" className="block text-gray-700 hover:text-blue-500">My Diaries</Link>
          <Link href="/browse" className="block text-gray-700 hover:text-blue-500">Others' Diaries</Link>
          <Link href="/settings" className="block text-gray-700 hover:text-blue-500">Setting</Link>
        </nav>
      )}

      {/* ページタイトル */}
      <div className="mt-4 px-2 md:px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center">{title}</h1>
      </div>
    </header>
  );
};

export default Header;
