<script lang="ts">
  import { onMount, afterUpdate } from 'svelte'
  import Button from './Button.svelte'

  const SCHEME = '(prefers-color-scheme: dark)'
  enum Theme {
    Dark = 'dark',
    Light = 'light',
  }

  export let key = '_theme_'
  export let theme: Theme = Theme.Light

  const validTheme = (t: Theme) => Object.values(Theme).includes(t as Theme)

  const handleThemeChange = (e: MediaQueryListEvent) => {
    theme = e.matches ? Theme.Dark : Theme.Light
  }

  onMount(() => {
    const darkMode = window.matchMedia(SCHEME)
    const persistedTheme = localStorage[key]
    if (validTheme(persistedTheme)) {
      theme = persistedTheme
    } else {
      theme = darkMode.matches ? Theme.Dark : Theme.Light
    }

    darkMode.addEventListener('change', handleThemeChange)
    return () => {
      darkMode.removeEventListener('change', handleThemeChange)
    }
  })

  afterUpdate(() => {
    if (validTheme(theme)) {
      localStorage[key] = theme
    }
  })
  $: switchTheme = theme === Theme.Dark ? Theme.Light : Theme.Dark
  $: document.body.className = theme
</script>

<Button on:click={() => (theme = switchTheme)}>
  Switch to {switchTheme} mode
</Button>
