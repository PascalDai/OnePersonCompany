import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">关于博客</h3>
            <p className="text-muted-foreground">
              这是一个个人博客网站，记录我的项目和任务进展，分享学习心得。
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">快速链接</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  首页
                </a>
              </li>
              <li>
                <a href="#projects" className="text-muted-foreground hover:text-foreground transition-colors">
                  项目
                </a>
              </li>
              <li>
                <a href="#tasks" className="text-muted-foreground hover:text-foreground transition-colors">
                  任务
                </a>
              </li>
              <li>
                <a href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  关于
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">联系方式</h3>
            <ul className="space-y-2">
              <li className="text-muted-foreground">
                邮箱: example@example.com
              </li>
              <li className="text-muted-foreground">
                GitHub: @username
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} 我的博客. 保留所有权利.</p>
        </div>
      </div>
    </footer>
  );
} 