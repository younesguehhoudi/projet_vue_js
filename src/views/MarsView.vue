<template>
  <div class="mars-view">
    <section class="mars-hero">
      <p class="hero-kicker">Mission Mars</p>
      <h1>Exploration Mars - {{ route.params.roverName }}</h1>
      <p class="hero-subtitle">
        Decouvrez les images recentes des rovers martiens. Selectionnez vos favoris en un clic.
      </p>
    </section>
    <p v-if="loading" class="loading">Chargement des photos...</p>
    <p v-else-if="error" class="error">{{ error }}</p>
    <div v-else-if="photos.length > 0" class="photos-grid">
      <ImageCard
        v-for="photo in photos"
        :key="photo.id"
        :title="photo.title"
        :date="photo.date"
        :imageUrl="photo.imageUrl"
        :description="photo.description"
        mediaType="image"
        :favoritePayload="photo"
        @add-favorite="handleAddFavorite"
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
import { useFavoritesStore } from '../stores/favorites'

const route = useRoute()
const photos = ref([])
const loading = ref(false)
const error = ref('')
const favoritesStore = useFavoritesStore()

const API_KEY = import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY'
const BASE_URL = 'https://api.nasa.gov/mars-photos/api/v1/rovers'
const IMAGE_API_URL = 'https://images-api.nasa.gov/search'

const buildPhotoCardsFromMarsApi = (items, roverName) =>
  items.map((photo) => ({
    id: photo.id,
    title: `Photo du rover ${photo.rover?.name ?? roverName}`,
    date: photo.earth_date ?? '',
    imageUrl: photo.img_src,
    description: `Camera: ${photo.camera?.full_name ?? 'N/A'} | Sol: ${photo.sol ?? 'N/A'}`,
  }))

const buildPhotoCardsFromImagesApi = (items, roverName) =>
  items
    .filter((item) => Array.isArray(item.links) && item.links[0]?.href)
    .map((item, index) => {
      const data = item.data?.[0] ?? {}
      const date = typeof data.date_created === 'string' ? data.date_created.slice(0, 10) : ''

      return {
        id: data.nasa_id ?? `${roverName}-${index}`,
        title: data.title ?? `Photo du rover ${roverName}`,
        date,
        imageUrl: item.links[0].href,
        description: data.description ?? 'Photo issue de la NASA Image API',
      }
    })

// Fonction pour récupérer les photos du rover
const fetchRoverPhotos = async () => {
  loading.value = true
  error.value = ''
  photos.value = []

  const roverName = route.params.roverName.toLowerCase()

  try {
    const response = await axios.get(`${BASE_URL}/${roverName}/photos`, {
      params: {
        sol: 100,
        api_key: API_KEY,
      },
    })

    const nasaPhotos = response.data?.photos ?? []
    if (nasaPhotos.length > 0) {
      photos.value = buildPhotoCardsFromMarsApi(nasaPhotos, roverName)
      return
    }
  } catch (err) {
    console.warn('Mars Photos API indisponible, bascule vers la NASA Image API.', err)
  }

  try {
    const response = await axios.get(IMAGE_API_URL, {
      params: {
        q: `${roverName} rover mars`,
        media_type: 'image',
      },
    })

    const items = response.data?.collection?.items ?? []
    photos.value = buildPhotoCardsFromImagesApi(items, roverName)

    if (photos.value.length === 0) {
      error.value = 'Aucune photo disponible pour ce rover.'
    }
  } catch (err) {
    error.value = 'Impossible de recuperer les photos de Mars pour le moment.'
    console.error('Erreur API NASA:', err.response?.status, err.response?.data)
  } finally {
    loading.value = false
  }
}

const handleAddFavorite = (image) => {
  favoritesStore.addFavorite(image)
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
  display: grid;
  gap: 2rem;
}

h1 {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 1.8rem;
}

.mars-hero {
  display: grid;
  gap: 0.75rem;
  padding: 1.5rem;
  border-radius: 24px;
  background: var(--color-surface-strong);
  border: 1px solid var(--color-border);
  box-shadow: 0 18px 40px var(--color-shadow);
}

.hero-kicker {
  text-transform: uppercase;
  letter-spacing: 0.45em;
  font-size: 0.7rem;
  color: var(--color-muted);
}

.hero-subtitle {
  color: var(--color-muted);
}

.loading,
.error {
  text-align: center;
  padding: 2rem;
  font-weight: bold;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--color-border);
}

.error {
  color: var(--color-accent-strong);
}

.photos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
}

.no-photos {
  text-align: center;
  padding: 2rem;
  color: var(--color-muted);
  font-style: italic;
}

@media (min-width: 768px) {
  h1 {
    font-size: 2.2rem;
  }

  .photos-grid {
    gap: 2rem;
  }
}
</style>
