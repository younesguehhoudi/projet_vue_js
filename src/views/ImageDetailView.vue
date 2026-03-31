<template>
  <section class="detail-page">
    <button type="button" class="back-button" @click="goBack">← Retour</button>

    <div v-if="imageData" class="detail-card">
      <div class="detail-media">
        <img
          v-if="imageData.mediaType === 'image'"
          :src="imageData.imageUrl"
          :alt="imageData.title"
        />
        <iframe
          v-else-if="imageData.mediaType === 'video'"
          :src="imageData.imageUrl"
          frameborder="0"
          allowfullscreen
        />
      </div>

      <div class="detail-content">
        <h1>{{ imageData.title }}</h1>
        <p class="detail-date" v-if="imageData.date">{{ imageData.date }}</p>
        <p class="detail-description">{{ imageData.description }}</p>
      </div>
    </div>

    <div v-else class="missing-state">
      <p>Données de l'image manquantes. Retournez à la galerie pour choisir une image.</p>
      <button type="button" class="back-button" @click="goBack">Retour à la galerie</button>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const imageData = ref(route.state ?? null)

if (!imageData.value && route.params.id) {
  const stored = sessionStorage.getItem(`detail-image-${route.params.id}`)
  if (stored) {
    try {
      imageData.value = JSON.parse(stored)
    } catch (err) {
      console.error('Impossible de parser les données de detail depuis sessionStorage', err)
    }
  }
}

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.detail-page {
  display: grid;
  gap: 2rem;
  max-width: 1080px;
  margin: 0 auto;
}

.back-button {
  padding: 0.85rem 1.2rem;
  border: none;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--color-accent), var(--color-accent-strong));
  color: #111;
  font-weight: 700;
  cursor: pointer;
  width: fit-content;
}

.detail-card {
  display: grid;
  gap: 2rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 28px;
  padding: 2rem;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.25);
}

.detail-media {
  overflow: hidden;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.05);
}

.detail-media img,
.detail-media iframe {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.detail-media {
  aspect-ratio: 16 / 9;
}

.detail-content {
  display: grid;
  gap: 1rem;
}

.detail-content h1 {
  margin: 0;
  font-size: clamp(1.8rem, 2.2vw, 2.8rem);
}

.detail-date {
  color: var(--color-muted);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  font-size: 0.85rem;
}

.detail-description {
  line-height: 1.8;
  color: var(--color-muted);
}

.missing-state {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 24px;
  padding: 2rem;
  text-align: center;
}
</style>
