import React from 'react';
import { siteConfig } from '../config/site';

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border py-2">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between gap-4">
          <div className="w-full md:w-auto">
            <h3 className="text-sm font-semibold mb-1">关于博客</h3>
            <p className="text-xs text-muted-foreground">{siteConfig.description}</p>
          </div>
          <div className="w-full md:w-auto">
            <h3 className="text-sm font-semibold mb-1">快速链接</h3>
            <ul className="flex flex-wrap gap-2">
              {siteConfig.mainNav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="text-xs text-muted-foreground hover:text-foreground transition-colors">{item.title}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className="w-full md:w-auto">
            <h3 className="text-sm font-semibold mb-1">联系方式</h3>
            <div className="text-xs text-muted-foreground">
              邮箱: <a href={`mailto:${siteConfig.email}`} className='hover:text-foreground transition-colors'>{siteConfig.email}</a> | 
              GitHub: <a href={siteConfig.github} className='hover:text-foreground transition-colors'>{siteConfig.github}</a>
            </div>
          </div>
        </div>
        <div className="mt-2 pt-2 border-t border-border text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} {siteConfig.name}. 保留所有权利.</p>
        </div>
      </div>
    </footer>
  );
} 