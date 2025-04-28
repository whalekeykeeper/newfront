<template>
  <div class="about-page">
    <div class="card english-card">
      <h1>About This Project</h1>
      <p>
        This project transforms watching YouTube videos into a powerful language learning experience.
        By using bilingual subtitles, personalized vocabulary tracking, and adaptive exercises,
        it helps you grow your vocabulary naturally while enjoying authentic content.
      </p>
      <p><strong>Key Features:</strong></p>
      <ul>
        <li>🖥️ Watch videos with synchronized bilingual subtitles.</li>
        <li>🧠 Automatically collect new words into your personal wordlist.</li>
        <li>🎯 Practice with gap-filling exercises generated from real video sentences.</li>
        <li>📈 Track your vocabulary growth over time through an interactive word graph.</li>
      </ul>
    </div>

    <div class="card chinese-card">
      <h1>关于本项目</h1>
      <p>
        本项目致力于将观看 YouTube 视频转变为高效的语言学习体验。
        通过双语字幕、个性化词汇追踪以及自适应练习，
        帮助你在享受真实内容的过程中，自然积累并掌握词汇。
      </p>
      <p><strong>核心功能：</strong></p>
      <ul>
        <li>🖥️ 支持中英文同步双语字幕播放。</li>
        <li>🧠 自动收集新词汇并加入个人词表。</li>
        <li>🎯 基于真实视频句子生成填空练习。</li>
        <li>📈 通过交互式词汇图谱追踪词汇增长。</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.about-page {
  background: #f5f5f5;
  min-height: 100vh;
  padding: 4rem 2rem;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 4rem;
}

.card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  padding: 3rem;
  width: 600px; /* 🛠️ 直接定死宽度600px，不跟随浏览器变化 */
  font-size: 1.1rem;
  line-height: 1.7;
}

.english-card {
  font-family: 'Courier New', Courier, monospace;
}

.chinese-card {
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Microsoft YaHei", sans-serif;
}

ul {
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

li {
  margin-bottom: 0.7rem;
}
</style>
