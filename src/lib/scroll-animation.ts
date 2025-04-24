/**
 * 设置页面滚动动画效果
 */
export function setupScrollAnimation() {
  const scrollContainer = document.querySelector('.scroll-container') as HTMLElement;
  if (!scrollContainer) {
    console.error('滚动容器未找到');
    return;
  }

  const footer = document.querySelector('.fixed-footer') as HTMLElement;
  const sections = document.querySelectorAll('.scroll-container > section') as NodeListOf<HTMLElement>;
  
  if (sections.length < 2) {
    // 如果不是多section的页面，不需要设置滚动捕捉
    return;
  }

  // 更新Footer的padding
  if (footer) {
    const updatePadding = () => {
      const footerHeight = footer.clientHeight;
      const lastSection = sections[sections.length - 1];
      if (lastSection) {
        lastSection.style.marginBottom = `${footerHeight}px`;
      }
    };

    // 初始化时更新一次
    updatePadding();
    
    // 窗口大小改变时重新计算
    window.addEventListener('resize', updatePadding);
  }

  // 为滚动添加平滑效果
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(this: HTMLAnchorElement, e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // 记录当前激活的部分
  let activeSection: string | null = null;
  let isScrolling = false;

  // 添加滚轮事件处理
  scrollContainer.addEventListener('wheel', (event) => {
    if (isScrolling) return; // 如果正在滚动中，不处理

    const delta = event.deltaY;
    
    // 确定当前激活的section的索引
    let currentIndex = -1;
    sections.forEach((section, index) => {
      if (section.id === activeSection) {
        currentIndex = index;
      }
    });

    // 如果没有激活的section，根据可见性确定当前section
    if (currentIndex === -1) {
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
          currentIndex = index;
          activeSection = section.id;
        }
      });
    }

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

  // 添加IntersectionObserver来检测当前可见的section
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !isScrolling) {
        activeSection = (entry.target as HTMLElement).id;
      }
    });
  }, {
    threshold: 0.5
  });

  sections.forEach(section => {
    observer.observe(section);
  });
} 