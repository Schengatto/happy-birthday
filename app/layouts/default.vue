<template>
  <div class="layout-default">
    <header class="layout-header">
      <NuxtLink to="/" class="layout-logo">
        🎂 Funny Cards
      </NuxtLink>
    </header>
    <main class="layout-main">
      <slot />
    </main>
    <footer class="layout-footer">
      <p>Crea biglietti e condividili con chi vuoi 🎉</p>
      <p>© 2026 <a href="https://enricoschintu.com">Enrico Schintu</a></p>
    </footer>
  </div>
</template>
