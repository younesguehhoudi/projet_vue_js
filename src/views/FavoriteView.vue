<template>
  <div class="favorites-view">
    <section class="favorites-hero">
      <p class="hero-kicker">Collection</p>
      <h1>Mes Favoris</h1>
      <p class="hero-subtitle">Retrouvez toutes les images que vous avez sauvegardees.</p>
    </section>

    <div v-if="favoritesCount === 0" class="empty-state">
      Vous n'avez pas encore d'images favorites. Allez explorer Mars !
    </div>

    <div v-else class="favorites-grid">
      <ImageCard
        v-for="favorite in favorites"
        :key="favorite.id ?? favorite.imageUrl"
        :title="favorite.title"
        :date="favorite.date"
        :imageUrl="favorite.imageUrl"
        :description="favorite.description"
        :mediaType="favorite.mediaType"
      />
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import ImageCard from '../components/ImageCard.vue'
import { useFavoritesStore } from '../stores/favorites'

const favoritesStore = useFavoritesStore()
const { allFavorites: favorites, favoritesCount } = storeToRefs(favoritesStore)
</script>

<style scoped>
.favorites-view {
  display: grid;
  gap: 2rem;
}

.favorites-hero {
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

.empty-state {
  text-align: center;
  padding: 2rem;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--color-border);
  color: var(--color-muted);
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
}

@media (min-width: 768px) {
  h1 {
    font-size: 2.2rem;
  }

  .favorites-grid {
    gap: 2rem;
  }
}
</style>
