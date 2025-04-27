// 监听主题变化并更新Mermaid图表
document.addEventListener("DOMContentLoaded", () => {
  // remark-mermaidjs将用到的类名
  const MERMAID_CLASS = "mermaid";

  // 检查mermaid是否已加载，如果没有则加载它
  function loadMermaidIfNeeded() {
    if (window.mermaid) {
      console.log("Mermaid已加载");
      return Promise.resolve();
    }

    console.log("Mermaid未加载，正在动态加载...");
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js";
      script.async = true;
      script.onload = () => {
        console.log("Mermaid加载完成");
        if (window.mermaid) {
          window.mermaid.initialize({
            startOnLoad: false, // 由我们手动控制初始化
          });
          resolve();
        } else {
          reject(new Error("Mermaid加载失败"));
        }
      };
      script.onerror = () => reject(new Error("无法加载Mermaid脚本"));
      document.head.appendChild(script);
    });
  }

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

  async function updateMermaidTheme() {
    try {
      // 确保mermaid已加载
      await loadMermaidIfNeeded();

      const isDark = document.documentElement.classList.contains("dark");

      // 只有在window.mermaid存在时才执行
      if (window.mermaid) {
        console.log("Mermaid主题更新，当前模式: ", isDark ? "深色" : "浅色");

        // 保存原始定义（如果尚未保存）
        saveOriginalDefinitions();

        // 重新初始化所有图表
        window.mermaid.initialize({
          startOnLoad: false,
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
            window.mermaid.init(undefined, div);
          } catch (error) {
            console.error("Mermaid重新渲染失败:", error);
          }
        });
      }
    } catch (error) {
      console.error("Mermaid主题更新失败:", error);
    }
  }

  // MutationObserver用于检测DOM变化，当Mermaid图表被渲染后立即应用主题
  const observer = new MutationObserver((mutations) => {
    // 检查是否有新的mermaid图表添加到页面
    const hasMermaidDivs =
      document.querySelectorAll(`.${MERMAID_CLASS}`).length > 0;

    if (hasMermaidDivs) {
      // 保存原始定义
      saveOriginalDefinitions();

      // 应用当前主题
      updateMermaidTheme().then(() => {
        console.log("Mermaid图表已检测到并应用主题");
      });

      // 添加对主题变化的监听
      document.addEventListener("themeChanged", updateMermaidTheme);
    }
  });

  // 开始观察文档变化
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // 如果页面加载时已经有渲染好的Mermaid图表
  if (document.querySelectorAll(`.${MERMAID_CLASS}`).length > 0) {
    saveOriginalDefinitions();
    updateMermaidTheme().then(() => {
      console.log("页面加载时已存在Mermaid图表，已应用主题");
    });
    document.addEventListener("themeChanged", updateMermaidTheme);
  }

  // 5秒后如果没有检测到图表，尝试主动初始化，因为某些remark插件可能延迟添加类
  setTimeout(async () => {
    if (
      document.querySelectorAll(`.${MERMAID_CLASS}`).length > 0 &&
      !areMermaidDiagramsRendered()
    ) {
      console.log("检测到未渲染的Mermaid图表，尝试初始化");
      await updateMermaidTheme();
    } else if (document.querySelectorAll(`.${MERMAID_CLASS}`).length === 0) {
      observer.disconnect();
      console.log("未检测到Mermaid图表，停止观察");
    }
  }, 5000);
});
