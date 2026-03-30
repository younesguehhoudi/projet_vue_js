<template>
  <div class="home">
    <h1>L'Image Astronomique du Jour</h1>

    <div v-if="loading" class="status">Chargement des données spatiales...</div>

    <div v-else-if="error" class="status error">{{ error }}</div>

    <div v-else-if="apodData" class="apod-container">
      <h2>{{ apodData.title }}</h2>
      <p class="date">{{ apodData.date }}</p>

      <img
        v-if="apodData.media_type === 'image'"
        :src="apodData.url"
        :alt="apodData.title"
        class="apod-media"
      />
      <iframe
        v-else-if="apodData.media_type === 'video'"
        :src="apodData.url"
        class="apod-media video"
        frameborder="0"
        allowfullscreen
      >
      </iframe>

      <p class="description">{{ apodData.explanation }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const apodData = ref(null)
const loading = ref(true)
const error = ref(null)

const fetchApod = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await axios.get('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY')
    apodData.value = response.data
  } catch (err) {
    console.error('Erreur API:', err)
    error.value = 'Impossible de contacter la NASA. Réessayez plus tard.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchApod()
})
</script>

<style scoped>
.home {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}
.status {
  margin: 2rem 0;
  font-size: 1.2rem;
  color: #42b883;
}
.error {
  color: #ff4a4a;
}
.apod-media {
  max-width: 100%;
  border-radius: 8px;
  margin: 20px 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
}
.video {
  width: 100%;
  height: 450px;
}
.description {
  text-align: justify;
  line-height: 1.6;
  padding: 1rem;
  background: #2a2a2a;
  border-radius: 8px;
}
.date {
  color: #888;
  font-style: italic;
}
</style>
