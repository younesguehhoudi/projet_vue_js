import { defineStore } from 'pinia'

const getImageKey = (image) => {
  if (!image) return null
  return image.id ?? image.url ?? image.img_src ?? image.imageUrl ?? null
}

const isSameImage = (left, right) => {
  const leftKey = getImageKey(left)
  const rightKey = getImageKey(right)

  if (leftKey !== null && rightKey !== null) {
    return leftKey === rightKey
  }

  return left === right
}

export const useFavoritesStore = defineStore('favorites', {
  state: () => ({
    favorites: [],
  }),
  getters: {
    totalFavorites: (state) => state.favorites.length,
  },
  actions: {
    addFavorite(image) {
      if (!image) return

      const exists = this.favorites.some((item) => isSameImage(item, image))
      if (!exists) {
        this.favorites.push(image)
      }
    },
    removeFavorite(image) {
      if (!image) return

      this.favorites = this.favorites.filter((item) => !isSameImage(item, image))
    },
  },
})
