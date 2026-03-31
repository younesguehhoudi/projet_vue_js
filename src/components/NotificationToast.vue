<template>
  <transition name="toast-fade">
    <div v-if="visible" class="toast">
      <p>{{ message }}</p>
    </div>
  </transition>
</template>

<script setup>
defineProps({
  message: { type: String, default: '' },
  visible: { type: Boolean, default: false },
})
</script>

<style scoped>
.toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
  padding: 1rem 1.25rem;
  border-radius: 999px;
  background: linear-gradient(135deg, rgba(255, 168, 38, 0.96), rgba(255, 119, 69, 0.96));
  color: #111;
  font-weight: 700;
  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.22);
  max-width: 320px;
  text-align: center;
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>
