import axios from 'axios'

export const API_BASE_URL = 'http://localhost:8000/api';

// const axiosApi = axios.create({
//   baseURL: 'http://localhost:8000/api'
// })

const axiosApi = axios.create({
  baseURL: API_BASE_URL
})

axiosApi.interceptors.request.use(
  (config) => {
    const userUUID = localStorage.getItem('user_uuid')
    if (userUUID) {
      config.headers['uuid'] = "8f925804-da14-4ae5-a365-37a635955bc9"
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

const api = {
  getTest() {
    return axiosApi.get(`/videos/test`);
  },
  getVideo(request) {
    return axiosApi.post(`/videos`, request, {
      headers: { uuid: '123e4567-e89b-12d3-a456-426614174012' }
    });
  },
  updateChosenWords(request) {
    return axiosApi.post(`/videos/chosen`, request);
  },
  createUuid() {
    return axiosApi.post('/users', { uuid: "" });
  },
  getWordList() {
    return axiosApi.get(`/chosen_words`);
  },
  acquireWord(wordId) {
    return axiosApi.post(`/chosen_words/acquired`, { word_id: wordId });
  },
  getGapFilling() {
    return axiosApi.get(`/gap_filling`);
  },
  submitGapFilling(request) {
    return axiosApi.post(`/gap_filling/result`, request);
  },
  getGraph() {
    return axiosApi.get(`/visualization/`);
  },
};

export default api;