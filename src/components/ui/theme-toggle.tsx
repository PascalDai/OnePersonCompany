import React, { useEffect, useState } from 'react';
import { Button } from './button';

type Theme = 'light' | 'dark' | 'system';

// 添加全局window对象的扩展声明
declare global {
  interface Window {
    toggleTheme?: () => void;
    updateMermaidTheme?: () => void;
    mermaidConfig?: {
      theme: string;
    };
    mermaid?: any;
  }
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light');
  
  // 初始化主题
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // 检查系统主题偏好
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
      }
    }
  }, []);

  // 监听主题变化以更新显示
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'theme' && e.newValue) {
        setTheme(e.newValue as Theme);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // 切换主题 - 通过设置data-theme-toggle属性，让主布局中的事件监听器处理
  return (
    <Button 
      variant="outline" 
      size="icon" 
      onClick={() => {
        // 简单的本地状态更新，实际的主题切换在BaseLayout中处理
        setTheme(theme === 'light' ? 'dark' : 'light');
      }}
      aria-label={`切换到${theme === 'light' ? '深色' : '浅色'}模式`}
      data-theme-toggle="true"
    >
      {theme === 'light' ? (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="h-[1.2rem] w-[1.2rem]"
          data-theme-toggle="true"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      ) : (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="h-[1.2rem] w-[1.2rem]"
          data-theme-toggle="true"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
      )}
    </Button>
  );
} 