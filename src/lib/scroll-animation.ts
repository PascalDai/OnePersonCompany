// 使用IntersectionObserver进行滚动监听和切换
export function setupScrollAnimation() {
  // 获取DOM元素
  const sections = document.querySelectorAll('section[id]');
  const footer = document.querySelector('footer');
  
  // 如果没有找到部分或者少于2个部分，不需要设置滚动动画
  if (sections.length < 2) return;
  
  const options = {
    root: null, // 使用视口作为根
    rootMargin: '0px',
    threshold: 0.3 // 当30%的目标元素可见时触发回调
  };

  // 记录当前激活的部分
  let activeSection: string | null = null;
  let isScrolling = false;
  let lastScrollTime = 0;
  const scrollCooldown = 800; // 滚动冷却时间，毫秒

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
    const now = Date.now();
    
    // 检查是否在冷却时间内，限制滚动频率
    if (now - lastScrollTime < scrollCooldown) return;
    
    // 如果正在滚动中，不处理
    if (isScrolling) return;
    
    // 检查是否已经滚动到底部附近或顶部附近
    const isNearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
    const isNearTop = window.scrollY < 100;
    
    // 如果已经在底部且继续向下滚动，或者在顶部且继续向上滚动，允许正常滚动
    if ((isNearBottom && event.deltaY > 0) || (isNearTop && event.deltaY < 0)) {
      return;
    }
    
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

    // 更新最后滚动时间
    lastScrollTime = now;
    
    // 滚动到目标section
    if (targetIndex !== undefined) {
      isScrolling = true;
      sections[targetIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

      // 动画完成后重置isScrolling状态
      setTimeout(() => {
        isScrolling = false;
        activeSection = sections[targetIndex].id;
      }, scrollCooldown); // 动画时间与冷却时间一致
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