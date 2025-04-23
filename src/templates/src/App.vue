<template>
  <div>
    <a href="https://electron-vite.github.io" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />
</template>

<script setup>
import HelloWorld from '@/components/HelloWorld.vue'

window.ipcRenderer.on('main-process-loaded', (evt, ...args) => {
  const [title] = args
  document.title = title
})

window.ipcRenderer.send('render-process-message', (new Date).toLocaleString())
</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>