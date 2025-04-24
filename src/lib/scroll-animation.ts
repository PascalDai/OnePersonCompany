// 使用IntersectionObserver进行滚动监听和切换
export function setupScrollAnimation() {
  // 获取DOM元素
  const sections = document.querySelectorAll('section[id]');
  
  // 配置选项
  const options = {
    root: null, // 使用视口作为根
    rootMargin: '0px',
    threshold: 0.5 // 当50%的目标元素可见时触发回调
  };

  // 记录当前激活的部分
  let activeSection: string | null = null;
  let isScrolling = false;

  // 创建观察者
  const observer = new IntersectionObserver((entries) => {
    if (isScrolling) return; // 如果正在滚动，不处理

    entries.forEach(entry => {
      // 如果元素可见
      if (entry.isIntersecting) {
        activeSection = entry.target.id;
      }
    });
  }, options);

  // 观察所有部分
  sections.forEach(section => {
    observer.observe(section);
  });

  // 添加滚轮事件处理
  window.addEventListener('wheel', (event) => {
    if (isScrolling) return; // 如果正在滚动中，不处理

    const delta = event.deltaY;
    
    // 确定当前激活的section的索引
    let currentIndex = -1;
    sections.forEach((section, index) => {
      if (section.id === activeSection) {
        currentIndex = index;
      }
    });

    if (currentIndex === -1) return;

    let targetIndex;
    
    // 向下滚动，切换到下一个section
    if (delta > 0 && currentIndex < sections.length - 1) {
      targetIndex = currentIndex + 1;
      event.preventDefault(); // 阻止默认滚动
    } 
    // 向上滚动，切换到上一个section
    else if (delta < 0 && currentIndex > 0) {
      targetIndex = currentIndex - 1;
      event.preventDefault(); // 阻止默认滚动
    } else {
      return; // 已经在第一个或最后一个section，不处理
    }

    // 滚动到目标section
    if (targetIndex !== undefined) {
      isScrolling = true;
      sections[targetIndex].scrollIntoView({
        behavior: 'smooth'
      });

      // 动画完成后重置isScrolling状态
      setTimeout(() => {
        isScrolling = false;
        activeSection = sections[targetIndex].id;
      }, 1000); // 动画时间约为1秒
    }
  }, { passive: false }); // passive: false允许我们阻止默认滚动

  // 初始化：滚动到第一个section
  setTimeout(() => {
    if (sections.length > 0) {
      sections[0].scrollIntoView({ behavior: 'auto' });
      activeSection = sections[0].id;
    }
  }, 100);
} 