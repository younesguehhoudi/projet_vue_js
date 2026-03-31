<template>
  <div class="app-shell">
    <header class="site-header">
      <div class="brand">
        <span class="brand-kicker">NASA</span>
        <span class="brand-title">Cosmic Atlas</span>
      </div>
      <nav class="site-nav">
        <router-link to="/">Accueil</router-link>
        <router-link to="/mars/curiosity">Mars (Curiosity)</router-link>
        <router-link to="/mars/perseverance">Mars (Perseverance)</router-link>
        <router-link to="/favoris">Favoris</router-link>
      </nav>
    </header>

    <main class="site-main">
      <router-view />
    </main>
  </div>
</template>

<style>
.app-shell {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.site-header {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem 1.5rem 1.2rem;
  border-radius: 24px;
  background: var(--color-nav);
  border: 1px solid var(--color-border);
  box-shadow: 0 20px 45px var(--color-shadow);
  backdrop-filter: blur(10px);
}

.brand {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  text-transform: uppercase;
}

.brand-kicker {
  font-size: 0.75rem;
  letter-spacing: 0.3em;
  color: var(--color-muted);
}

.brand-title {
  font-family: 'Space Grotesk', 'Sora', system-ui, sans-serif;
  font-size: 1.6rem;
  font-weight: 700;
}

.site-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.site-nav a {
  padding: 0.5rem 0.9rem;
  border-radius: 999px;
  text-decoration: none;
  color: var(--color-ink);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid transparent;
  transition: all 0.2s ease;
}

.site-nav a:hover {
  border-color: rgba(255, 159, 28, 0.6);
  transform: translateY(-1px);
}

.site-nav a.router-link-exact-active {
  background: linear-gradient(135deg, rgba(255, 159, 28, 0.8), rgba(255, 107, 107, 0.7));
  color: #111;
  font-weight: 600;
}

.site-main {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

@media (min-width: 768px) {
  .site-header {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .brand-title {
    font-size: 1.9rem;
  }
}
</style>
