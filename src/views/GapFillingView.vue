<template>
  <div>
    <v-progress-circular class="text-center" indeterminate v-if="isLoading" />
    <div v-else class="exercise-container">
      <h1>Exercises</h1>
      <p>Select the correct lemma that fits all sentences displayed.</p>

      <div v-for="(exercise, index) in exercises" :key="index" class="exercise">
        <v-divider class="my-4" />
        <h3 :class="solutionColorClass(index, exercise)">
          Exercise {{ index + 1 }}
        </h3>

        <div v-for="(wordForm, wordIndex) in exercise.select_list" :key="wordIndex">
          <div v-for="(sentence, sentenceIndex) in wordForm.sentences" :key="sentenceIndex" class="sentence">
            <p>
              {{ wordIndex + sentenceIndex + 1 }}. {{ sentence }}
              <span v-if="showSolution" class="solution-word">({{ wordForm.word }})</span>
            </p>
          </div>
        </div>

        <v-select
            v-model="selectedAnswers[index].selected_word"
            :items="formattedItems(index, exercise)"
            label="Choose the correct word"
            item-title="text"
            item-value="value"
            outlined
            dense
            class="dropdown-select mt-5"
            :class="selectSolutionClass(index, exercise)"
        />
      </div>

      <v-btn @click="submitAnswers" color="primary" :disabled="showSolution || !canSubmit">
        Submit
      </v-btn>

      <div v-if="showSolution" class="summary mt-5">
        <p >You answered {{ correctCount }} out of {{ exercises.length }} correctly. ({{
            correctPercentage
          }}%)</p>
      </div>
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
      correctCount: 0,
    }
  },
  computed: {
    canSubmit() {
      return this.selectedAnswers.every(answer => answer.selected_word)
    },
    correctPercentage() {
      return ((this.correctCount / this.exercises.length) * 100).toFixed(1)
    }
  },
  created() {
    this.fetchGapFilling()
  },
  methods: {
    shuffleArray(array) {
      return array
          .map(item => ({ item, sort: Math.random() }))
          .sort((a, b) => a.sort - b.sort)
          .map(({ item }) => item)
    },
    initializeSelectedAnswers() {
      this.selectedAnswers = this.exercises.map(exercise => ({
        node_id: exercise.node_id,
        exercise_id: exercise.exercise_id,
        correct_or_not: false,
        selected_word: '',
        solution: exercise.correct_answer_lemma
      }))
    },
    submitAnswers() {
      const result = this.selectedAnswers.map(answer => ({
        node_id: answer.node_id,
        exercise_id: answer.exercise_id,
        correct_or_not: answer.selected_word === answer.solution
      }))

      api.submitGapFilling(result).then(() => {
        this.correctCount = result.filter(r => r.correct_or_not).length
        this.showSolution = true
        window.scrollTo({ top: 0, behavior: 'smooth' })
      })
    },
    fetchGapFilling() {
      this.isLoading = true
      api.getGapFilling().then(response => {
        this.exercises = response.data
        this.initializeSelectedAnswers()
        this.isLoading = false
      })
    },
    solutionColorClass(index, exercise) {
      if (!this.showSolution) return 'text-black'
      return this.selectedAnswers[index].selected_word === exercise.correct_answer_lemma
          ? 'text-success'
          : 'text-error'
    },
    selectSolutionClass(index, exercise) {
      if (!this.showSolution) return ''
      return this.selectedAnswers[index].selected_word === exercise.correct_answer_lemma
          ? 'correct-select'
          : 'incorrect-select'
    },
    formattedItems(index, exercise) {
      const options = this.shuffleArray([...exercise.distractors, exercise.correct_answer_lemma])
      return options.map(option => {
        if (this.showSolution) {
          const isCorrect = option === exercise.correct_answer_lemma
          const isSelected = this.selectedAnswers[index].selected_word === option
          if (isSelected && isCorrect) {
            return { text: option + '  ✔️', value: option }
          } else if (isSelected && !isCorrect) {
            return { text: option + '  ❌', value: option }
          } else {
            return { text: option, value: option }
          }
        }
        return { text: option, value: option }
      })
    }
  }
}
</script>

<style scoped>
.exercise-container {
  width: 80vw;
  font-size: 1.2rem;
  margin: 0 auto;
}

.dropdown-select {
  width: 100%;
  max-width: 80vw;
  margin: 0 auto;
}

.v-input {
  width: 100%;
}

.correct-select .v-input__control {
  background-color: #d4edda;
  border: 2px solid #28a745;
  color: green;
}

.incorrect-select .v-input__control {
  background-color: #f8d7da;
  border: 2px solid #dc3545;
}

.solution-word {
  color: green;
}

.text-success {
  color: green;
}

.text-error {
  color: red;
}

.summary {
  font-size: 1.2rem;
  text-align: center;
  font-weight: bold;
}
</style>
