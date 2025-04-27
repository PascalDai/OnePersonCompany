// 监听主题变化并更新Mermaid图表
document.addEventListener("DOMContentLoaded", () => {
  // remark-mermaidjs将用到的类名
  const MERMAID_CLASS = "mermaid";

  // 用于存储每个图表的原始定义
  const graphDefinitions = new Map();

  // 检查页面上的Mermaid元素是否已经被渲染了
  function areMermaidDiagramsRendered() {
    const mermaidDivs = document.querySelectorAll(`.${MERMAID_CLASS}`);
    if (mermaidDivs.length === 0) return false;

    // 如果任何一个div包含svg，表示已经被渲染过
    for (const div of mermaidDivs) {
      if (div.querySelector("svg")) {
        return true;
      }
    }
    return false;
  }

  // 保存所有图表的原始定义
  function saveOriginalDefinitions() {
    const mermaidDivs = document.querySelectorAll(`.${MERMAID_CLASS}`);

    mermaidDivs.forEach((div, index) => {
      // 如果还没有保存过此图表的原始定义
      if (!graphDefinitions.has(div)) {
        // 保存原始内容
        graphDefinitions.set(div, div.textContent);
      }
    });
  }

  function updateMermaidTheme() {
    const isDark = document.documentElement.classList.contains("dark");

    // 只有在window.mermaid存在且图表已经被渲染后才执行
    if (window.mermaid) {
      console.log("Mermaid主题更新，当前模式: ", isDark ? "深色" : "浅色");

      // 保存原始定义（如果尚未保存）
      saveOriginalDefinitions();

      // 重新初始化所有图表
      window.mermaid.initialize({
        startOnLoad: true,
        theme: isDark ? "dark" : "default",
        themeVariables: {
          primaryColor: isDark ? "#80CBC4" : "#26A69A",
          primaryTextColor: isDark ? "#E6EDF3" : "#333333",
          lineColor: isDark ? "#ADBAC7" : "#2A3F54",
          textColor: isDark ? "#E6EDF3" : "#333333",
          mainBkg: isDark ? "#1E293B" : "#FFFFFF",
          nodeBorder: isDark ? "#3E4C5E" : "#CCCCCC",
          // 使用网站颜色变量
          primaryBorderColor: isDark
            ? "hsl(var(--primary))"
            : "hsl(var(--primary))",
          secondaryColor: isDark
            ? "hsl(var(--secondary))"
            : "hsl(var(--secondary))",
          tertiaryColor: isDark ? "hsl(var(--muted))" : "hsl(var(--accent))",
        },
      });

      // 重新渲染所有图表
      graphDefinitions.forEach((content, div) => {
        try {
          // 清空当前内容
          div.innerHTML = content;

          // 通过mermaid API重新渲染
          // 这将触发mermaid自己的渲染流程
          window.mermaid.init(undefined, div);
        } catch (error) {
          console.error("Mermaid重新渲染失败:", error);
        }
      });
    }
  }

  // MutationObserver用于检测DOM变化，当Mermaid图表被渲染后立即应用主题
  const observer = new MutationObserver((mutations) => {
    // 如果发现Mermaid图表被渲染了，立即更新主题
    if (areMermaidDiagramsRendered()) {
      // 停止观察以防止循环
      observer.disconnect();

      // 保存原始定义
      saveOriginalDefinitions();

      // 应用当前主题
      updateMermaidTheme();

      // 添加对主题变化的监听
      document.addEventListener("themeChanged", updateMermaidTheme);

      console.log("Mermaid图表已检测到并应用主题");
    }
  });

  // 开始观察文档变化
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // 如果页面加载时已经有渲染好的Mermaid图表
  if (areMermaidDiagramsRendered()) {
    saveOriginalDefinitions();
    updateMermaidTheme();
    document.addEventListener("themeChanged", updateMermaidTheme);
    console.log("页面加载时已存在Mermaid图表，已应用主题");
  }

  // 如果2秒后还没有检测到图表渲染，清理资源
  setTimeout(() => {
    if (!areMermaidDiagramsRendered()) {
      observer.disconnect();
      console.log("未检测到Mermaid图表，停止观察");
    }
  }, 2000);
});
