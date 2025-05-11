"use client"

import React, { useState } from 'react';
import Header from '@components/Header';

export default function SearchPage() {
  const [diary, setDiary] = useState('');
  return (
    <div>
      <Header title="My Diaries" />
      <h1 class="motion-safe:[transition:0.25s_transform_var(--spring-standard),0.2s_opacity_var(--spring-standard),0.3s_visibility_var(--spring-standard)] text-[28px] leading-[34px] font-semibold tracking-[0.38px] opacity-100" aria-hidden="false" style="transform: translateY(0px);"><div class="px-1 text-pretty whitespace-pre-wrap">お手伝いできることはありますか？</div></h1>
    </div>
  )
}