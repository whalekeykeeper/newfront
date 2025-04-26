<template>
  <div class="about">
    <v-progress-circular class="text-center" indeterminate v-if="isLoading" />
    <div v-else>
      <h1>Word List</h1>
      <v-card-text v-if="wordList.length === 0"
        >Your list is empty. Try watching some videos to populate it.
      </v-card-text>
      <div v-else>
        <v-card v-for="(entry, index) in filteredWordList" :key="index" class="mt-5">
          <v-card-title>
          </v-card-title>
          <v-card-text> {{ entry.text }} </v-card-text>
          <v-card-actions>
            <v-btn @click="onCheckChange(entry.id)" :disabled="entry.checked"
              >{{ entry.checked ? 'Known' : 'Mark as known' }}
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
          this.wordList = response.data // Assuming `api.getWordlist` returns the string in `response.data`
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
</style>
