<template>
  <div class="mars-view">
    <section class="mars-hero">
      <p class="hero-kicker">Mission Mars</p>
      <h1>Exploration Mars - {{ route.params.roverName }}</h1>
      <p class="hero-subtitle">
        Decouvrez les images recentes des rovers martiens. Selectionnez vos favoris en un clic.
      </p>
    </section>

    <section class="search-panel">
      <label class="search-label" for="photo-search">Recherche et filtres</label>
      <div class="search-input-group">
        <input
          id="photo-search"
          v-model="searchTerm"
          type="search"
          placeholder="Titre, description, date..."
          class="search-input"
        />
        <button
          v-if="searchTerm"
          type="button"
          class="search-clear"
          @click="searchTerm = ''"
        >
          ✕
        </button>
      </div>

      <div class="filters-grid">
        <label class="filter-field" for="date-from">
          <span>Date min</span>
          <input id="date-from" v-model="dateFrom" type="date" class="filter-input" />
        </label>

        <label class="filter-field" for="date-to">
          <span>Date max</span>
          <input id="date-to" v-model="dateTo" type="date" class="filter-input" />
        </label>

        <label class="filter-field" for="year-filter">
          <span>Annee</span>
          <select id="year-filter" v-model="selectedYear" class="filter-input">
            <option value="">Toutes</option>
            <option v-for="year in yearOptions" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
        </label>

        <label class="filter-field" for="sort-order">
          <span>Trier par date</span>
          <select id="sort-order" v-model="sortOrder" class="filter-input">
            <option value="desc">Plus recentes</option>
            <option value="asc">Plus anciennes</option>
          </select>
        </label>
      </div>

      <div class="filters-actions">
        <button type="button" class="reset-filters" @click="resetFilters">
          Reinitialiser les filtres
        </button>
      </div>

      <p class="search-info" v-if="hasActiveFilters || filteredPhotos.length">
        {{ visiblePhotos.length }} resultat{{ visiblePhotos.length > 1 ? 's' : '' }} affiché{{ visiblePhotos.length > 1 ? 's' : '' }}
      </p>
    </section>

    <p v-if="loading" class="loading">Chargement des photos...</p>
    <p v-else-if="error" class="error">{{ error }}</p>

    <div v-else-if="visiblePhotos.length > 0" class="photos-grid">
      <ImageCard
        v-for="photo in visiblePhotos"
        :key="photo.id"
        :title="photo.title"
        :date="photo.date"
        :imageUrl="photo.imageUrl"
        :description="photo.description"
        mediaType="image"
        :favoritePayload="photo"
        detailRoute="image-detail"
        :detailParams="{ id: photo.id }"
        :detailState="photo"
        @add-favorite="handleAddFavorite"
      />
    </div>

    <button
      v-if="displayedCount < filteredPhotos.length"
      class="load-more"
      type="button"
      @click="displayedCount += 12"
    >
      Charger la suite
    </button>

    <div v-else class="no-photos">
      {{ hasActiveFilters ? 'Aucune photo ne correspond aux filtres selectionnes.' : 'Aucune photo disponible pour ce rover' }}
    </div>

    <NotificationToast :message="toastMessage" :visible="toastVisible" />
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import ImageCard from '../components/ImageCard.vue'
import NotificationToast from '../components/NotificationToast.vue'
import { useFavoritesStore } from '../stores/favorites'

const route = useRoute()
const allPhotos = ref([])
const displayedCount = ref(12)
const searchTerm = ref('')
const dateFrom = ref('')
const dateTo = ref('')
const selectedYear = ref('')
const sortOrder = ref('desc')

const yearOptions = computed(() => {
  return [...new Set(
    allPhotos.value
      .map((photo) => (typeof photo.date === 'string' ? photo.date.slice(0, 4) : ''))
      .filter((year) => /^\d{4}$/.test(year)),
  )].sort((a, b) => Number(b) - Number(a))
})

const hasActiveFilters = computed(() => {
  return Boolean(searchTerm.value || dateFrom.value || dateTo.value || selectedYear.value)
})

const buildSearchableDate = (value) => {
  if (typeof value !== 'string' || !value) return ''
  const [year, month, day] = value.split('-')
  if (!year || !month || !day) return value
  return `${value} ${day}/${month}/${year}`
}

const filteredPhotos = computed(() => {
  const query = searchTerm.value.trim().toLowerCase()
  const fromDate = dateFrom.value ? new Date(dateFrom.value) : null
  const toDate = dateTo.value ? new Date(dateTo.value) : null
  if (toDate) {
    // Include the entire selected day in upper-bound filtering.
    toDate.setHours(23, 59, 59, 999)
  }

  const baseFiltered = allPhotos.value.filter((photo) => {
    const title = String(photo.title ?? '').toLowerCase()
    const description = String(photo.description ?? '').toLowerCase()
    const date = String(photo.date ?? '').toLowerCase()
    const camera = String(photo.camera ?? '').toLowerCase()
    const searchableDate = buildSearchableDate(photo.date).toLowerCase()

    const matchesText =
      !query ||
      title.includes(query) ||
      description.includes(query) ||
      date.includes(query) ||
      searchableDate.includes(query) ||
      camera.includes(query)

    const photoDate = photo.date ? new Date(photo.date) : null
    const matchesFromDate = !fromDate || (photoDate && photoDate >= fromDate)
    const matchesToDate = !toDate || (photoDate && photoDate <= toDate)
    const photoYear = typeof photo.date === 'string' ? photo.date.slice(0, 4) : ''
    const matchesYear = !selectedYear.value || photoYear === selectedYear.value

    return matchesText && matchesFromDate && matchesToDate && matchesYear
  })

  return [...baseFiltered].sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : 0
    const dateB = b.date ? new Date(b.date).getTime() : 0
    if (sortOrder.value === 'asc') return dateA - dateB
    return dateB - dateA
  })
})
const visiblePhotos = computed(() => filteredPhotos.value.slice(0, displayedCount.value))
const loading = ref(true)
const error = ref(null)
const toastMessage = ref('')
const toastVisible = ref(false)
let toastTimeout = null
const favoritesStore = useFavoritesStore()

const API_KEY = import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY'
const BASE_URL = 'https://api.nasa.gov/mars-photos/api/v1/rovers'
const IMAGE_API_URL = 'https://images-api.nasa.gov/search'

const buildPhotoCardsFromMarsApi = (items, roverName) =>
  items.map((photo) => ({
    id: photo.id,
    title: `${photo.camera?.full_name ?? photo.camera?.name ?? 'Photo'} - Sol ${photo.sol ?? 'N/A'}`,
    date: photo.earth_date ?? '',
    imageUrl: photo.img_src,
    camera: photo.camera?.name ?? '',
    description: `Camera: ${photo.camera?.full_name ?? 'N/A'} | Sol: ${photo.sol ?? 'N/A'}`,
    mediaType: 'image',
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
        camera: '',
        description: data.description ?? 'Photo issue de la NASA Image API',
        mediaType: 'image',
      }
    })

const resetFilters = () => {
  searchTerm.value = ''
  dateFrom.value = ''
  dateTo.value = ''
  selectedYear.value = ''
  sortOrder.value = 'desc'
}

// Fonction pour récupérer les photos du rover
const fetchRoverPhotos = async () => {
  loading.value = true
  error.value = null
  displayedCount.value = 12
  allPhotos.value = []

  const roverName = route.params.roverName.toLowerCase()

  try {
    try {
      const response = await axios.get(`${BASE_URL}/${roverName}/photos`, {
        params: {
          sol: 100,
          api_key: API_KEY,
        },
      })

      const nasaPhotos = response.data?.photos ?? []
      if (nasaPhotos.length > 0) {
        allPhotos.value = buildPhotoCardsFromMarsApi(nasaPhotos, roverName)
        return
      }
    } catch (err) {
      console.warn('Mars Photos API indisponible, bascule vers la NASA Image API.', err)
    }

    const response = await axios.get(IMAGE_API_URL, {
      params: {
        q: `${roverName} rover mars`,
        media_type: 'image',
      },
    })

    const items = response.data?.collection?.items ?? []
    allPhotos.value = buildPhotoCardsFromImagesApi(items, roverName)

    if (allPhotos.value.length === 0) {
      error.value = 'Aucune photo disponible pour ce rover.'
    }
  } catch (err) {
    console.error('Erreur API NASA:', err)
    error.value =
      error.value || 'Impossible de récupérer les photos de Mars pour le moment.'
  } finally {
    loading.value = false
  }
}

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

// Appel initial au chargement du composant
fetchRoverPhotos()

// Reset displayed count and keep search in sync
watch(searchTerm, () => {
  displayedCount.value = 12
})

watch([dateFrom, dateTo, selectedYear, sortOrder], () => {
  displayedCount.value = 12
})

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
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  align-items: start;
  justify-content: center;
  grid-auto-rows: 1fr;
}

.search-panel {
  display: grid;
  gap: 0.75rem;
  padding: 1.2rem 1.4rem;
  border-radius: 24px;
  background: var(--color-surface-strong);
  border: 1px solid var(--color-border);
}

.search-label {
  font-weight: 600;
  letter-spacing: 0.08em;
  color: var(--color-muted);
  text-transform: uppercase;
  font-size: 0.85rem;
}

.search-input-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.search-input {
  flex: 1;
  width: 100%;
  min-width: 0;
  padding: 0.95rem 1rem;
  border-radius: 18px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: inherit;
}

.search-input::placeholder {
  color: var(--color-muted);
}

.search-clear {
  border: none;
  background: rgba(255, 255, 255, 0.08);
  color: var(--color-muted);
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  cursor: pointer;
}

.search-info {
  color: var(--color-muted);
  font-size: 0.95rem;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 0.9rem;
}

.filter-field {
  display: grid;
  gap: 0.45rem;
  font-size: 0.85rem;
  color: var(--color-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.filter-input {
  width: 100%;
  min-width: 0;
  padding: 0.8rem 0.9rem;
  border-radius: 12px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: inherit;
}

.filters-actions {
  display: flex;
  justify-content: flex-end;
}

.reset-filters {
  border: 1px solid var(--color-border);
  background: rgba(255, 255, 255, 0.06);
  color: inherit;
  border-radius: 999px;
  padding: 0.55rem 1rem;
  cursor: pointer;
}

.load-more {
  justify-self: center;
  padding: 0.9rem 1.5rem;
  border: none;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--color-accent), var(--color-accent-strong));
  color: #111;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 18px 40px rgba(255, 119, 69, 0.2);
  transition: transform 0.2s ease;
}

.load-more:hover {
  transform: translateY(-1px);
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
