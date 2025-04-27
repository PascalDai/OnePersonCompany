// 监听主题变化并更新Mermaid图表
document.addEventListener("DOMContentLoaded", () => {
  function updateMermaidTheme() {
    const isDark = document.documentElement.classList.contains("dark");

    // 获取所有Mermaid图表容器
    const mermaidDivs = document.querySelectorAll(".mermaid");

    if (window.mermaid) {
      // 重新初始化所有图表
      window.mermaid.initialize({
        theme: isDark ? "dark" : "default",
        // 自定义主题变量，使其与网站主题匹配
        themeVariables: {
          primaryColor: isDark ? "#80CBC4" : "#26A69A",
          primaryTextColor: isDark ? "#E6EDF3" : "#333333",
          lineColor: isDark ? "#ADBAC7" : "#2A3F54",
          textColor: isDark ? "#E6EDF3" : "#333333",
          mainBkg: isDark ? "#1E293B" : "#FFFFFF",
          nodeBorder: isDark ? "#3E4C5E" : "#CCCCCC",
        },
      });

      // 保存原始图表定义并清空容器
      mermaidDivs.forEach((div, index) => {
        // 如果还没有保存过原始定义，就保存一下
        if (!div.getAttribute("data-graph-definition")) {
          div.setAttribute("data-graph-definition", div.textContent);
        }

        // 获取保存的原始定义
        const graphDefinition = div.getAttribute("data-graph-definition");

        // 只有在有定义的情况下才重新渲染
        if (graphDefinition) {
          // 清空容器
          div.innerHTML = "";

          // 重新渲染
          try {
            window.mermaid
              .render(`mermaid-${Date.now()}-${index}`, graphDefinition)
              .then((result) => {
                div.innerHTML = result.svg;
              })
              .catch((error) => {
                console.error("Mermaid渲染失败:", error);
                div.innerHTML = `<div style="color: red; border: 1px solid red; padding: 10px; margin: 10px 0;">图表渲染错误: ${error.message}</div>`;
              });
          } catch (error) {
            console.error("Mermaid执行异常:", error);
          }
        }
      });
    }
  }

  // 初始运行
  // 等待页面完全加载和mermaid初始化
  setTimeout(() => {
    if (window.mermaid) {
      updateMermaidTheme();
    } else {
      console.warn("Mermaid库未加载，无法应用主题");
    }
  }, 1000);

  // 监听主题变化
  document.addEventListener("themeChanged", updateMermaidTheme);
});
