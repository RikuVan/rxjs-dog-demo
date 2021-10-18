import App from './App.svelte'

const app = new App({
  target: document.getElementById('app'),
})

if ('serviceWorker' in navigator) {
  import.meta.env.PROD && initServiceWorker()
}

function initServiceWorker() {
  navigator.serviceWorker.register('/sw.js', {
    updateViaCache: 'none',
  })
}

export default app
