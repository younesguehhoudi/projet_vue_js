<template>
  <div class="mars-view">
    <h1>Exploration Mars - {{ route.params.roverName }}</h1>
    <p v-if="loading" class="loading">Chargement des photos...</p>
    <p v-else-if="error" class="error">{{ error }}</p>
    <div v-else-if="photos.length > 0" class="photos-grid">
      <ImageCard
        v-for="photo in photos"
        :key="photo.id"
        :title="`Photo du rover ${photo.rover.name}`"
        :date="photo.earth_date"
        :imageUrl="photo.img_src"
        :description="`Camera: ${photo.camera.full_name} | Sol: ${photo.sol}`"
        mediaType="image"
      />
    </div>
    <div v-else class="no-photos">Aucune photo disponible pour ce rover</div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import ImageCard from '../components/ImageCard.vue'

const route = useRoute()
const photos = ref([])
const loading = ref(false)
const error = ref('')

const API_KEY = import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY'
const BASE_URL = 'https://api.nasa.gov/mars-photos/api/v1/rovers'

// Fonction pour récupérer les photos du rover
const fetchRoverPhotos = async () => {
  loading.value = true
  error.value = ''
  photos.value = []

  try {
    const roverName = route.params.roverName.toLowerCase()
    console.log(`📡 Appel API NASA pour le rover: ${roverName}`)

    const response = await axios.get(`${BASE_URL}/${roverName}/photos`, {
      params: {
        sol: 100,
        api_key: API_KEY,
      },
    })
    photos.value = response.data.photos
    console.log(`✅ ${photos.value.length} photos chargées pour ${roverName}`)
  } catch (err) {
    error.value = `Erreur : ${err.message}`
    console.error('Erreur API NASA:', err.response?.status, err.response?.data)
  } finally {
    loading.value = false
  }
}

// Appel initial au chargement du composant
fetchRoverPhotos()

// Watch sur le changement du paramètre de route
watch(
  () => route.params.roverName,
  () => {
    fetchRoverPhotos()
  },
)
</script>

<style scoped>
.mars-view {
  padding: 2rem;
}

h1 {
  text-transform: uppercase;
  margin-bottom: 2rem;
}

.loading,
.error {
  text-align: center;
  padding: 2rem;
  font-weight: bold;
}

.error {
  color: #ff6b6b;
}

.photos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.no-photos {
  text-align: center;
  padding: 2rem;
  color: #888;
  font-style: italic;
}
</style>
