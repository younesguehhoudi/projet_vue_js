<template>
  <div class="home">
    <section class="hero">
      <p class="hero-kicker">Image du jour</p>
      <h1 class="hero-title">L'Image Astronomique du Jour</h1>
      <p class="hero-subtitle">
        Une fenetre sur le cosmos, choisie chaque jour par la NASA.
      </p>
    </section>

    <div v-if="loading" class="status">Chargement des données spatiales...</div>

    <div v-else-if="error" class="status error">{{ error }}</div>

    <div v-else-if="apodData" class="apod-container">
      <ImageCard
        :title="apodData.title"
        :date="apodData.date"
        :imageUrl="apodData.url"
        :description="apodData.explanation"
        :mediaType="apodData.media_type"
        :favoritePayload="favoritePayload"
        detailRoute="image-detail"
        :detailParams="{ id: apodData.date }"
        :detailState="favoritePayload"
        @add-favorite="handleAddFavorite"
      />
    </div>

    <NotificationToast :message="toastMessage" :visible="toastVisible" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import ImageCard from '../components/ImageCard.vue'
import NotificationToast from '../components/NotificationToast.vue'
import { useFavoritesStore } from '../stores/favorites'

const apodData = ref(null)
const loading = ref(true)
const error = ref(null)
const toastMessage = ref('')
const toastVisible = ref(false)
let toastTimeout = null
const favoritesStore = useFavoritesStore()

const favoritePayload = computed(() => {
  if (!apodData.value) return null

  return {
    id: apodData.value.date ?? apodData.value.url,
    title: apodData.value.title,
    date: apodData.value.date,
    imageUrl: apodData.value.url,
    description: apodData.value.explanation,
    mediaType: apodData.value.media_type,
  }
})

const showToast = (message) => {
  toastMessage.value = message
  toastVisible.value = true
  clearTimeout(toastTimeout)
  toastTimeout = setTimeout(() => {
    toastVisible.value = false
  }, 2600)
}

const handleAddFavorite = (image) => {
  const added = favoritesStore.addFavorite(image)
  showToast(added ? 'Favori ajouté !' : 'Déjà dans les favoris')
}

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
  display: grid;
  gap: 2rem;
}

.hero {
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

.hero-title {
  font-size: 2rem;
  font-weight: 700;
}

.hero-subtitle {
  color: var(--color-muted);
}
.status {
  text-align: center;
  padding: 2rem;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--color-border);
}
.error {
  color: var(--color-accent-strong);
}

.apod-container {
  max-width: 860px;
}

@media (min-width: 768px) {
  .home {
    justify-items: center;
  }

  .hero {
    padding: 2rem;
  }

  .hero-title {
    font-size: 2.6rem;
  }
}
</style>
