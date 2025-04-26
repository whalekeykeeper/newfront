<template>
  <div>
    <watch-component />
  </div>
</template>


<script>
import {defineComponent} from 'vue'
import WatchComponent from "@/components/WatchComponent.vue";

export default defineComponent({
  name: "HomeView",
  components: {WatchComponent}
})
</script>

<style scoped>

</style>
