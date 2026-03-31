<template>
  <div class="image-card" :class="{ clickable: hasDetail }" @click="goToDetail">
    <div class="image-card-media-wrapper">
      <img
        v-if="mediaType === 'image'"
        :src="imageUrl"
        :alt="title"
        class="image-card-media"
        :style="mediaStyle"
      />

      <iframe
        v-else-if="mediaType === 'video'"
        :src="imageUrl"
        class="image-card-media video"
        frameborder="0"
        allowfullscreen
      />
    </div>

    <div class="image-card-body">
      <div class="image-card-header">
        <h2 class="image-card-title">{{ title }}</h2>
        <p v-if="date" class="image-card-date">{{ date }}</p>
      </div>

      <p class="image-card-description">{{ description }}</p>

      <button
        v-if="favoritePayload"
        class="favorite-button"
        type="button"
        @click="emitAddFavorite"
      >
        Ajouter aux favoris
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const emit = defineEmits(['add-favorite'])

const props = defineProps({
  title: { type: String, default: '' },
  date: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  description: { type: String, default: '' },
  mediaType: { type: String, default: 'image' },
  mediaFit: {
    type: String,
    default: 'cover',
    validator: (value) => ['cover', 'contain'].includes(value),
  },
  favoritePayload: { type: Object, default: null },
  detailRoute: { type: String, default: '' },
  detailParams: { type: Object, default: () => ({}) },
  detailState: { type: Object, default: null },
})

const router = useRouter()
const hasDetail = computed(() => Boolean(props.detailRoute))
const mediaStyle = computed(() => ({ objectFit: props.mediaFit }))

const goToDetail = () => {
  if (!props.detailRoute) return

  if (props.detailState && props.detailParams?.id) {
    sessionStorage.setItem(
      `detail-image-${props.detailParams.id}`,
      JSON.stringify(props.detailState),
    )
  }

  router.push({
    name: props.detailRoute,
    params: props.detailParams,
    state: props.detailState,
  })
}

const emitAddFavorite = (event) => {
  event.stopPropagation()
  if (!props.favoritePayload) return
  emit('add-favorite', props.favoritePayload)
}
</script>

<style scoped>
.image-card {
  display: grid;
  gap: 1.2rem;
  padding: 1.2rem;
  border-radius: 24px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  box-shadow: 0 24px 48px var(--color-shadow);
  backdrop-filter: blur(12px);
  width: 100%;
  max-width: 100%;
  min-height: 100%;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.image-card.clickable {
  cursor: pointer;
}

.image-card.clickable:hover {
  transform: translateY(-2px);
}

.image-card-media-wrapper {
  border-radius: 18px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.04);
  aspect-ratio: 4 / 3;
  max-height: 280px;
  width: 100%;
}

.image-card-media {
  width: 100%;
  height: 100%;
  display: block;
  max-width: 100%;
}

.video {
  width: 100%;
  aspect-ratio: 16 / 9;
  border: none;
}

.image-card-body {
  display: grid;
  gap: 0.9rem;
}

.image-card-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  overflow-wrap: break-word;
  word-break: break-word;
}

.image-card-date {
  color: var(--color-muted);
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
}

.image-card-description {
  line-height: 1.7;
  color: var(--color-muted);
  overflow-wrap: break-word;
  word-break: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.favorite-button {
  justify-self: start;
  padding: 0.65rem 1.2rem;
  border: none;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--color-accent), var(--color-accent-strong));
  color: #1b0b0b;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 12px 30px rgba(255, 111, 97, 0.35);
}

.favorite-button:hover {
  transform: translateY(-1px) scale(1.01);
}
</style>
