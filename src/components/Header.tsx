import React from 'react';
import { Button } from './ui/button';
import { ThemeToggle } from './ui/theme-toggle';
import { siteConfig } from '../config/site';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <a href="/" className="text-2xl font-bold tracking-tight">
            {siteConfig.name}
          </a>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          {siteConfig.mainNav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {item.title}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button variant="outline" size="sm">
            订阅
          </Button>
        </div>
      </div>
    </header>
  );
} 