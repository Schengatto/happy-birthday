<template>
  <Transition name="pwa-slide">
    <div v-if="showPrompt" class="pwa-install-banner">
      <div class="pwa-install-content">
        <div class="pwa-install-icon">🎂</div>
        <div class="pwa-install-text">
          <strong>Installa Happy Birthday</strong>
          <span>Accedi rapidamente dall'icona sulla home</span>
        </div>
      </div>
      <div class="pwa-install-actions">
        <button class="pwa-install-dismiss" @click="dismiss">Non ora</button>
        <button class="pwa-install-btn" @click="install">Installa</button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const showPrompt = ref(false)
let deferredPrompt: any = null

onMounted(() => {
  if (localStorage.getItem('pwa-install-dismissed')) return

  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault()
    deferredPrompt = e
    showPrompt.value = true
  })

  window.addEventListener('appinstalled', () => {
    showPrompt.value = false
    deferredPrompt = null
  })
})

async function install() {
  if (!deferredPrompt) return
  deferredPrompt.prompt()
  const { outcome } = await deferredPrompt.userChoice
  if (outcome === 'accepted') {
    showPrompt.value = false
  }
  deferredPrompt = null
}

function dismiss() {
  showPrompt.value = false
  localStorage.setItem('pwa-install-dismissed', '1')
}
</script>
