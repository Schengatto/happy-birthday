<script setup lang="ts">
import '~/assets/css/editor.css'

useHead({
  title: 'Crea un Biglietto di Compleanno 🎂',
  meta: [
    { name: 'description', content: 'Crea biglietti di compleanno animati con mini-giochi interattivi e condividili via URL!' },
  ],
})
</script>

<template>
  <EditorWizard />
</template>
