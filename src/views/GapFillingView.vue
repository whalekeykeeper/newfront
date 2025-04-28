<template>
  <div>
    <v-progress-circular class="text-center" indeterminate v-if="isLoading" />
    <div v-else style="width: 80vw; font-size: 1.2rem" class="large-text">
      <h1>Exercises</h1>
      <p>Select the correct word that fits all sentences displayed.</p>
      <div v-for="(exercise, index) in exercises" :key="index" class="exercise">
              <v-divider class="mb-4 mt-4"/>
        <h3
          :style="{
            color: !showSolution
              ? 'black'
              : selectedAnswers[index]['selected_word'] === exercise.correct_answer_lemma
              ? 'green'
              : 'red'
          }"
        >
          Exercise {{ index + 1 }}
        </h3>
<!--        <p-->
<!--          v-if="showSolution"-->
<!--          :style="{-->
<!--            color:-->
<!--              selectedAnswers[index]['selected_word'] === exercise.correct_answer_lemma-->
<!--                ? 'green'-->
<!--                : 'red'-->
<!--          }"-->
<!--        >-->
<!--          {{ selectedAnswers[index]['selected_word'] }} / {{ exercise.correct_answer_lemma }}-->
<!--        </p>-->
        <div v-for="(wordForm, wordIndex) in exercise.select_list" :key="wordIndex" class="word-form">
          <div
            v-for="(sentence, sentenceIndex) in wordForm.sentences"
            :key="sentenceIndex"
            class="sentence"
          >
            <p>
              {{ wordIndex + sentenceIndex + 1 }}. {{ sentence }}
              <span v-if="showSolution" style="color: green">({{ wordForm.word }})</span>
            </p>
          </div>
        </div>
<!--        <v-select-->
<!--          v-model="selectedAnswers[index]['selected_word']"-->
<!--          :items="shuffleArray([...exercise.distractors, exercise.correct_answer_lemma])"-->
<!--          label="Choose the correct word"-->
<!--          outlined-->
<!--          dense-->
<!--          class="w-50 mt-5"-->
<!--        ></v-select>-->
        <div class="dropdown-container">
<!--          <v-select-->
<!--              v-model="selectedAnswers[index]['selected_word']"-->
<!--              :items="shuffleArray([...exercise.distractors, exercise.correct_answer_lemma])"-->
<!--              label="Choose the correct word"-->
<!--              outlined-->
<!--              dense-->
<!--          ></v-select>-->
          <v-select
              v-model="selectedAnswers[index]['selected_word']"
              :items="shuffleArray([...exercise.distractors, exercise.correct_answer_lemma])"
              label="Choose the correct word"
              outlined
              dense
              class="mt-5"
              :class="{
                'correct-select': showSolution && selectedAnswers[index]['selected_word'] === exercise.correct_answer_lemma,
                'incorrect-select': showSolution && selectedAnswers[index]['selected_word'] !== exercise.correct_answer_lemma
              }"
          />

        </div>
      </div>

      <v-btn @click="submitAnswers" color="primary" :disabled="showSolution || !canSubmit"
        >Submit
      </v-btn>
    </div>
  </div>
</template>

<script>
import api from '../api/backend-api'

export default {
  name: 'GapFillingView',
  data() {
    return {
      isLoading: false,
      exercises: [],
      selectedAnswers: [],
      showSolution: false,
    }
  },
  computed: {
    canSubmit() {
      return this.selectedAnswers.every((answer) => answer.selected_word !== '')
    }
  },
  created() {
    this.fetchGapFilling()
  },
  methods: {
    shuffleArray(array) {
      return array
        .map((item) => ({ item, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ item }) => item)
    },

    initializeSelectedAnswers() {
      for (const exercise of this.exercises) {
        this.selectedAnswers.push({
          node_id: exercise.node_id,
          exercise_id: exercise.exercise_id,
          correct_or_not: false,
          selected_word: '',
          solution: exercise.correct_answer_lemma
        })
      }
    },
    submitAnswers() {
      const result = this.selectedAnswers.map((answer) => ({
        node_id: answer.node_id,
        exercise_id: answer.exercise_id,
        correct_or_not: answer.selected_word === answer.solution
      }))

      api.submitGapFilling(result).then((response) => {
        console.log(response.data)
        this.showSolution = true;
      })
    },
    fetchGapFilling() {
      this.isLoading = true;
      api.getGapFilling().then((response) => {
        console.log(response.data)
        this.exercises = response.data;
        this.initializeSelectedAnswers()
        this.isLoading = false;
      })
    }
  }
}
</script>

<style scoped>
.dropdown-container {
  width: 100%;
  max-width: 600px; /* 或者800px，看你需要多宽 */
  margin: 0 auto;
}

.v-select {
  width: 100%;
}
.correct-select .v-input__control {
  background-color: #d4edda; /* 淡绿色背景 */
  border: 2px solid #28a745; /* 深绿边框 */
}

.incorrect-select .v-input__control {
  background-color: #f8d7da; /* 淡红色背景 */
  border: 2px solid #dc3545; /* 深红边框 */
}

</style>
