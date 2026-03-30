<template>
  <div class="home">
    <h1>L'Image Astronomique du Jour</h1>

    <div v-if="loading" class="status">Chargement des données spatiales...</div>

    <div v-else-if="error" class="status error">{{ error }}</div>

    <div v-else-if="apodData" class="apod-container">
      <ImageCard
        :title="apodData.title"
        :date="apodData.date"
        :imageUrl="apodData.url"
        :description="apodData.explanation"
        :mediaType="apodData.media_type"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import ImageCard from '../components/ImageCard.vue'

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
</style>
