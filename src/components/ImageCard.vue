<template>
  <div class="image-card">
    <h2 class="image-card-title">{{ title }}</h2>
    <p v-if="date" class="image-card-date">{{ date }}</p>

    <img
      v-if="mediaType === 'image'"
      :src="imageUrl"
      :alt="title"
      class="image-card-media"
    />

    <iframe
      v-else-if="mediaType === 'video'"
      :src="imageUrl"
      class="image-card-media video"
      frameborder="0"
      allowfullscreen
    />

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
</template>

<script setup>
const emit = defineEmits(['add-favorite'])

const props = defineProps({
  title: { type: String, default: '' },
  date: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  description: { type: String, default: '' },
  mediaType: { type: String, default: 'image' },
  favoritePayload: { type: Object, default: null },
})

const emitAddFavorite = () => {
  if (!props.favoritePayload) return
  emit('add-favorite', props.favoritePayload)
}
</script>

<style scoped>
.image-card {
  text-align: center;
}

.image-card-title {
  margin: 0;
}

.image-card-date {
  color: #888;
  font-style: italic;
  margin: 8px 0 16px;
}

.image-card-media {
  max-width: 100%;
  border-radius: 8px;
  margin: 1rem 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
}

.video {
  width: 100%;
  height: 450px;
}

.image-card-description {
  text-align: justify;
  line-height: 1.6;
  padding: 1rem;
  background: #2a2a2a;
  border-radius: 8px;
  color: #fff;
}

.favorite-button {
  margin-top: 1rem;
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 999px;
  background: #ff6b6b;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
}

.favorite-button:hover {
  background: #ff4a4a;
}
</style>
