import React from 'react';
import { Button } from './ui/button';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <a href="/" className="text-2xl font-bold tracking-tight">
            我的博客
          </a>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <a href="/" className="text-sm font-medium hover:text-primary transition-colors">
            首页
          </a>
          <a href="#projects" className="text-sm font-medium hover:text-primary transition-colors">
            项目
          </a>
          <a href="#tasks" className="text-sm font-medium hover:text-primary transition-colors">
            任务
          </a>
          <a href="/about" className="text-sm font-medium hover:text-primary transition-colors">
            关于
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            订阅
          </Button>
        </div>
      </div>
    </header>
  );
} 