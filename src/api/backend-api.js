import axios from 'axios';

export const API_BASE_URL = 'http://localhost:8000/api';

const axiosApi = axios.create({
  baseURL: API_BASE_URL
})

axiosApi.interceptors.request.use(
    (config) => {
      const userUUID = localStorage.getItem('uuid');
      if (userUUID) {
        config.headers['uuid'] = userUUID;
      }
      return config;
    },
    (error) => Promise.reject(error)
);

const api = {
  getTest() {
    return axiosApi.get(`/videos/test`);
  },
  getVideo(request) {
    return axiosApi.post(`/videos`, request);
  },
  updateChosenWords(request) {
    return axiosApi.post(`/videos/chosen`, request);
  },
  createUuid(request) {
    return axiosApi.post('/users', request);
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