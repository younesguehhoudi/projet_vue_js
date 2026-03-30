<template>
  <header>
    <nav>
      <router-link to="/">Accueil</router-link> |
      <router-link to="/mars/curiosity">Mars (Curiosity)</router-link> |
      <router-link to="/mars/perseverance">Mars (Perseverance)</router-link> |
      <router-link to="/favoris">Favoris</router-link>
    </nav>
  </header>

  <main>
    <router-view />
  </main>
</template>

<style>
body {
  font-family: Arial, sans-serif;
  background-color: #1a1a1a;
  color: #fff;
  margin: 0;
}

nav {
  padding: 1rem;
  background: #333;
  text-align: center;
}

nav a {
  color: #42b883;
  text-decoration: none;
  margin: 0 10px;
  font-weight: bold;
}

nav a.router-link-exact-active {
  color: white;
}

main {
  padding: 2rem;
}
</style>
