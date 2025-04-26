<script setup>
import { RouterView } from 'vue-router'
import api from './api/backend-api'
import { onMounted, ref } from 'vue'

const isUUIDSet = ref(false)

const checkAndSetUUID = async () => {
  let uuid = localStorage.getItem('user_uuid')

  if (!uuid) {
    try {
      const response = await api.createUuid()

      if (response.status === 200) {
        uuid = response.data.uuid
        localStorage.setItem('user_uuid', uuid)
        isUUIDSet.value = true
      } else {
        console.error('Failed to fetch UUID:', response.statusText)
      }
    } catch (error) {
      console.error('Error fetching UUID:', error)
    }
  } else {
    isUUIDSet.value = true
  }
}

onMounted(() => {
  checkAndSetUUID()
})
</script>

<template>
  <v-app app class="bg-white" fluid v-if="isUUIDSet">
    <v-app-bar>
      <v-app-bar-title @click="$router.push('/')" style="cursor: pointer"
        >Learning by Watching
      </v-app-bar-title>
      <v-btn to="/about">About</v-btn>
      <v-btn to="/wordlist">Wordlist</v-btn>
      <v-btn to="/gapfilling">Exercises</v-btn>
      <v-btn to="/graph">Knowledge Graph</v-btn>
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
  <div v-else class="text-center">
    <v-progress-circular indeterminate color="primary" class="my-5" />
    <p>Loading...</p>
  </div>
</template>

<style scoped></style>
