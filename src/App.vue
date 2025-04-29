<script setup>
import { RouterView } from 'vue-router'
import api from './api/backend-api'
import { onMounted, ref } from 'vue'

const isUUIDSet = ref(false)

const checkAndSetUUID = async () => {
  let uuid = localStorage.getItem('uuid')

  if (!uuid) {
    try {
      const response = await api.createUuid({ uuid: "" });

      if (response.status === 200) {
        uuid = response.data.uuid
        localStorage.setItem('uuid', uuid)
        isUUIDSet.value = true
      } else {
        console.error('Failed to fetch UUID:', response.statusText)
      }
    } catch (error) {
      console.error('Error fetching UUID:', error)
    }
  } else {
    try {

      const response = await api.createUuid({ uuid });
      if (response.status === 200) {
        isUUIDSet.value = true
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.warn('Invalid UUID found. Resetting...')
        localStorage.removeItem('uuid')
        await checkAndSetUUID()
      } else {
        console.error('Unexpected error:', error)
      }
    }
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
        >FRAME
      </v-app-bar-title>
      <v-btn to="/about">About FRAME</v-btn>
      <v-btn to="/wordlist">My word list</v-btn>
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
