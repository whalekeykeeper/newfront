<template>
  <div class="about">
    <v-progress-circular class="text-center" indeterminate v-if="isLoading" />
    <div v-else>
      <h1>Word List</h1>
      <v-card-text v-if="wordList.length === 0" class="empty-list-message">
        Your list is empty. <br> Try watching some videos to populate it.
        <span class="ascii-smile">:-)</span>
<!--        <span class="blinking-cursor">█</span>-->
      </v-card-text>

      <div v-else>

        <v-card v-for="(entry, index) in filteredWordList" :key="index" class="mt-5 ">
          <v-card-title>
          </v-card-title>
          <v-card-text>
            <span v-html="highlightChosenWord(entry.text, entry.word)"></span>
          </v-card-text>
          <v-card-actions>
<!--            <v-btn @click="onCheckChange(entry[0])" :disabled="entry[1]">-->
<!--              {{ entry[1] ? 'Known' : 'Got it!' }}-->
<!--            </v-btn>-->
            <v-btn
                @click="onCheckChange(entry.id)"
                :color="entry.checked ? 'deep-purple-accent-4' : 'grey-lighten-2'"
                class="text-white"
            >
              {{ entry.checked ? 'Known' : 'Mark as known' }}
            </v-btn>
          </v-card-actions>
        </v-card>


      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import api from '../api/backend-api'

export default defineComponent({
  name: 'WordListView',
  data() {
    return {
      isLoading: false,
      wordList: []
    }
  },
  mounted() {
    this.fetchWordList()
  },
  methods: {
    async fetchWordList() {
      this.isLoading = true
      try {
        const response = await api.getWordList()
        if (response.status === 200) {
          this.wordList = response.data
        } else {
          console.error('Failed to fetch word list:', response.statusText)
          this.wordList = 'Error loading word list.'
        }
      } catch (error) {
        console.error('Error fetching word list:', error)
        this.wordList = 'Error loading word list.'
      } finally {
        this.isLoading = false
      }
    },

    onCheckChange(wordId) {
      const word = this.wordList.find((entry) => entry[0] === wordId);
      console.log(word)
      if (word) {
        api.acquireWord(wordId).then(response => {
          console.log(response.data);
          word[1] = true;
        });
      }
    },

    highlightChosenWord(sentence, chosenWord) {
      if (!sentence || !chosenWord) return sentence;
      const regex = new RegExp(`\\b(${chosenWord})\\b`, 'gi');
      return sentence.replace(
          regex,
          '<strong style="color: #f39c12;">$1</strong>'
      );
    }
  },
  computed: {
    filteredWordList() {
      const uniqueWords = new Map()
      this.wordList.forEach(([id, checked, word, , text]) => {
        if (!uniqueWords.has(word)) {
          uniqueWords.set(word, { id, checked, word, text })
        }
      })
      return Array.from(uniqueWords.values())
    }
  }
})
</script>


<style scoped>
.text-muted {
  color: #6c757d;
}

.empty-list-message {
  font-size: 20px;
  text-align: left;
  margin-top: 20px;
}

.ascii-smile {
  font-family: 'Courier New', Courier, monospace;
  font-size: 40px;
  color: #00FF00;
  margin-left: 10px;
}

.blinking-cursor {
  font-family: 'Courier New', Courier, monospace;
  font-size: 40px;
  color: #00FF00;
  margin-left: 5px;
  animation: blink 1s step-start infinite;
}


@keyframes blink {
  50% {
    opacity: 0;
  }
}


</style>
