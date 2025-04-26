import React from 'react';
import { siteConfig } from '../config/site';

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border py-4">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">关于博客</h3>
            <p className="text-muted-foreground">
              {siteConfig.description}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">快速链接</h3>
            <ul className="flex space-x-4">
              {siteConfig.mainNav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="text-muted-foreground hover:text-foreground transition-colors">
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">联系方式</h3>
            <ul className="space-y-2">
              <li className="text-muted-foreground">
                邮箱: <a href={`mailto:${siteConfig.email}`} className='text-muted-foreground hover:text-foreground transition-colors'>{siteConfig.email}</a>
              </li>
              <li className="text-muted-foreground">
                GitHub: <a href={siteConfig.github} className='text-muted-foreground hover:text-foreground transition-colors'>{siteConfig.github}</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t border-border text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} {siteConfig.name}. 保留所有权利.</p>
        </div>
      </div>
    </footer>
  );
} 