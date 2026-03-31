import { defineStore } from 'pinia'

const getImageKey = (image) => {
  if (!image) return null
  return image.id ?? image.url ?? image.img_src ?? image.imageUrl ?? null
}

export const useFavoritesStore = defineStore('favorites', {
  state: () => ({
    favorites: [],
  }),
  getters: {
    allFavorites: (state) => state.favorites,
    favoritesCount: (state) => state.favorites.length,
    totalFavorites: (state) => state.favorites.length,
  },
  actions: {
    addFavorite(image) {
      if (!image) return

      const imageKey = getImageKey(image)
      if (imageKey === null) return

      const exists = this.favorites.some((item) => getImageKey(item) === imageKey)
      if (!exists) {
        this.favorites.push(image)
      }
    },
    removeFavorite(imageId) {
      if (!imageId) return

      this.favorites = this.favorites.filter((item) => getImageKey(item) !== imageId)
    },
  },
})
