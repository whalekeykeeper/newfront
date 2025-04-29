<template>
  <div class="about-page">
    <div class="card english-card">
      <h1>About This Project</h1>
      <p>
        The FRAME app transforms watching YouTube videos into a powerful language learning experience.
        By using bilingual subtitles, personalized vocabulary tracking, and adaptive exercises,
        it helps you grow your vocabulary naturally while enjoying authentic content.
      </p>
      <br>
      <p><strong>Key Features:</strong></p>
      <ul>
        <li>🖥️ Watch videos with synchronized bilingual subtitles.</li>
        <li>🧠 Automatically collect new words into your personal vocabulary graph.</li>
        <li>🖱️ Click on English subtitle words or press Shift to add interesting words to your My Word List.</li>
        <li>🎯 Practice with gap-filling exercises generated from real video sentences.</li>
        <li>📈 Track your vocabulary growth over time through an interactive word graph.</li>
        <li>🔄 Sync your vocabulary data across devices.</li>
      </ul>
    </div>

    <div class="card chinese-card">
      <h1>关于本项目</h1>
      <p>
        FRAME应用致力于将观看 YouTube 视频转变为高效的语言学习体验。
        通过双语字幕、个性化词汇追踪以及自适应练习，
        帮助你在享受真实内容的过程中，自然积累并掌握词汇。
      </p>
      <br>
      <p><strong>核心功能：</strong></p>
      <ul>
        <li>🖥️ 支持中英文同步双语字幕播放。</li>
        <li>🧠 自动收集新词汇并加入个人词汇空间。</li>
        <li>🖱️ 点击英文字幕或按下 Shift 键快速添加单词到My word list。</li>
        <li>🎯 基于真实视频句子生成填空练习。</li>
        <li>📈 通过交互式词汇图谱追踪词汇增长。</li>
        <li>🔄 支持跨设备同步词汇数据。</li>
      </ul>

      <p class="survey-section">
        <p>如果你愿意，请点击一下按钮，帮我们做一份调查！谢谢！</p>
        <button @click="goToSurvey" class="survey-button">
          参加调查问卷
        </button>
      </p>
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

.about-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.survey-section {
  margin-top: 2rem;
}

.survey-button {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  font-size: 1.1rem;
  font-weight: bold;
  background-color: #4CAF50;       /* 绿色背景 */
  color: white;                    /* 白色文字 */
  border: none;                    /* 去掉默认边框 */
  border-radius: 8px;              /* 圆角按钮 */
  cursor: pointer;                 /* 鼠标悬停变成小手 */
  transition: background-color 0.3s ease;
}

.survey-button:hover {
  background-color: #45a049;       /* 悬浮时变深一点的绿色 */
}

</style>


<script setup>
import { ref, onMounted } from 'vue';
// // test link
// const formBaseUrl =
//     "https://docs.google.com/forms/d/e/1FAIpQLSdKlLr9dmLYluPwfuUXSl5twUg-nG90nhxtFZen8iq5GnUyVw/viewform?usp=pp_url"
//

const formBaseUrl = "https://docs.google.com/forms/d/e/1FAIpQLSeVQvejRq4dQGMiO2GNqbCFM_3Xitdcg5azii6ogNTTpJZ8Xg/viewform?usp=pp_url";
const uuidFieldId = "entry.572579868";

const uuid = ref('');

onMounted(() => {
  uuid.value = localStorage.getItem("uuid") || '';
});

const goToSurvey = () => {
  if (!uuid.value) {
    alert("Didn't find uuid, can not jump, please reload or re-visit.");
    return;
  }
  const finalUrl = `${formBaseUrl}&${uuidFieldId}=${encodeURIComponent(uuid.value)}`;
  window.open(finalUrl, "_blank");
};
</script>