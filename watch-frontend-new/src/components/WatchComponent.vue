<template>
  <h1 class="mb-5">Learning by Watching</h1>
  <div>
    <v-text-field
      v-model="youtube_url"
      :append-icon="'mdi-send'"
      density="compact"
      label="Enter YouTube video link"
      type="url"
      name="url"
      @click:append="getVideo"
      @keyup.enter="getVideo(youtube_url)"
      clearable
    >
    </v-text-field>

    <v-progress-circular v-if="isLoading" indeterminate />
    <div v-else>
      <video
        v-if="stream_url !== ''"
        ref="video-player"
        width="800"
        height="450"
        controls
        :src="stream_url"
        type="video/mp4"
        crossorigin="anonymous"
        @timeupdate="updateCurrentCues"
      >
        <track
          default
          kind="metadata"
          label="BILINGUAL"
          srclang="bi"
          :src="vtt_url"
          ref="bilingual-caption"
        />
      </video>

      <div>
        <div v-for="(cue, index) in currentCues" :key="index" class="mt-0 mb-0 bg-black">
          <span v-for="(mono_cue, index) in cue.text.split('§')" :key="index">
            <span
              v-for="(word, index) in mono_cue.split(' ')"
              :key="index"
              @click="getSubtitleLine(cue)"
              class="text-h5 click"
            >
              {{ word }}&nbsp;
            </span>
          </span>
        </div>
      </div>
    </div>

    <v-snackbar
      v-model="snackbar"
      :timeout="1000"
      rounded
      variant="tonal"
      color="deep-purple-accent-4"
    >
      Updated wordlist
    </v-snackbar>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import TextareaAndButtonComponent from '@/components/icons/TextareaAndButtonComponent.vue'
import api from '../api/backend-api'

export default defineComponent({
  name: 'WatchComponent',
  components: { TextareaAndButtonComponent },
  data() {
    return {
      snackbar: false,
      isLoading: false,
      isTranslating: false,
      youtube_url: 'https://www.youtube.com/watch?v=LMt8xm4t7XQ',
      video_id: '',
      stream_url: '',
      vtt_url: '',
      currentCues: [],
      word: '',
      sentence: '',
      clicked: []
    }
  },

  mounted() {
    window.addEventListener('keydown', this.handleSpacebar)
    // Check if this.$refs.videoPlayer is defined
    if (this.$refs.videoPlayer) {
      const videoPlayer = this.$refs.videoPlayer

      // Add an event listener to the video element for the "click" event
      videoPlayer.addEventListener('click', (e) => {
        const progressBar = videoPlayer.getBoundingClientRect()
        const clickedPosition = e.clientX - progressBar.left
        const progressBarWidth = progressBar.width
        const duration = videoPlayer.duration

        // Calculate the new time based on the clicked position and duration
        const newTime = (clickedPosition / progressBarWidth) * duration

        // Set the video's currentTime to the new time
        videoPlayer.currentTime = newTime
      })
    }
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleSpacebar)
  },

  methods: {
    async getTest() {
      const response = await api.getTest()
      console.log(response.data)
    },
    getVideo() {
      this.isLoading = true

      const baseStreamUrl = 'http://192.168.2.104:8000/api/videos/stream/'
      const baseVttUrl = 'http://192.168.2.104:8000/api/videos/vtt/'
      const payload = {
        video_url: this.youtube_url,
        uuid: '123e4567-e89b-12d3-a456-426614174012'
      }

      api
        .getVideo(payload)
        .then((response) => {
          if (response.status === 200) {
            const { id } = response.data
            this.video_id = id
            this.stream_url = `${baseStreamUrl}${id}`
            this.vtt_url = `${baseVttUrl}${id}`
          } else {
            console.error('Failed to get the video/subtitle:', response.statusText)
          }
        })
        .catch((error) => {
          console.error('Error fetching video:', error)
        })
        .finally(() => {
          this.isLoading = false
        })
    },

    updateCurrentCues() {
      const trackElement = this.$refs['bilingual-caption']
      if (trackElement && trackElement.track && trackElement.track.activeCues) {
        const activeCues = trackElement.track.activeCues
        this.currentCues = Array.from(activeCues)
        // console.log("this.currentCues: ", this.currentCues);
        // this.sendCuesToBackend();
      } else {
        this.currentCues = []
      }
    },

    async getTranslation(clickedWord, clickedSentence) {
      const clickedItem = this.clicked.find(
        (item) => item.word === clickedWord && item.sentence === clickedSentence
      )
      if (!clickedItem) {
        // If not, push the item with empty translation and start translating
        this.clicked.push({
          word: clickedWord,
          sentence: clickedSentence,
          isTranslating: true,
          translation: ''
        })
        console.log('item', clickedItem, this.clicked, this.currentCues)

        try {
          const response = await api.getTranslation({
            word: clickedWord,
            sentence: clickedSentence
          })
          if (response.status === 201) {
            const translation = response.data.translation
            const clickedItem = this.clicked.find(
              (item) => item.word === clickedWord && item.sentence === clickedSentence
            )

            if (clickedItem) {
              clickedItem.translation = translation
              clickedItem.isTranslating = false
            }
          } else {
            console.error('Failed to get the translation: ', response.statusText)
          }
        } catch (error) {
          console.error('Error: ', error)
          this.isTranslating = false
        }
      }
    },
    getSubtitleLine() {
      const videoPlayer = this.$refs['video-player']
      const track = this.$refs['bilingual-caption']

      if (videoPlayer && track) {
        const textTrack = track.track
        if (textTrack) {
          const activeCues = textTrack.activeCues
          if (activeCues && activeCues.length > 0) {
            Array.from(activeCues).forEach((cue) => {
              const formattedStartTime = this.formatTimestamp(cue.startTime)
              const formattedEndTime = this.formatTimestamp(cue.endTime)
              console.log(`Start Time: ${formattedStartTime}, End Time: ${formattedEndTime}`)
              api
                .updateChosenWords({
                  video_id: this.video_id,
                  start_time: formattedStartTime,
                  end_time: formattedEndTime
                })
                .then((response) => {
                  console.log(response.data)
                  this.snackbar = true;
                })
            })
          }
        }
      }
    },
    formatTimestamp(seconds) {
      const date = new Date(0)
      date.setSeconds(seconds)
      const milliseconds = seconds % 1
      const hours = String(date.getUTCHours()).padStart(2, '0')
      const minutes = String(date.getUTCMinutes()).padStart(2, '0')
      const secs = String(date.getUTCSeconds()).padStart(2, '0')
      const millis = String(Math.floor(milliseconds * 1000)).padStart(3, '0')
      return `${hours}:${minutes}:${secs}.${millis}`
    },
    handleSpacebar(event) {
      const track = this.$refs['bilingual-caption']
      if (track) {
        // stop default spacebar scrolling behavior
        event.preventDefault();
        this.getSubtitleLine();
      }
    }
  }
})
</script>

<style scoped>
div {
  margin-bottom: 20px;
}

.click:hover {
  background-color: #73731f;
  cursor: pointer;
}

.center-container {
  display: flex;
  justify-content: center;
  width: 100%; /* Ensure the video spans the full width */
}

.custom-progress-bar {
  width: 100%;
  cursor: pointer;
  height: 10px;
  appearance: none;
  background: #ccc;
  border: none;
}

.custom-progress-bar::-webkit-progress-bar {
  background: #ccc;
}

.custom-progress-bar::-webkit-progress-value {
  background: #007bff;
}
</style>
