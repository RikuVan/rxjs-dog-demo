<script lang="ts">
  import { onMount, afterUpdate } from 'svelte'
  import Button from './lib/Button.svelte'
  import ImagePreviewer from './ImagePreviewer.svelte'
  import Modal from './lib/Modal.svelte'
  import Carousel from './lib/Carousel.svelte'

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

<header>
  <h3>https://dog.ceo/dog-api/</h3>
  <Button on:click={() => (theme = switchTheme)}>
    Switch to {switchTheme} mode
  </Button>
</header>
<main>
  <ImagePreviewer />
</main>
<Modal>
  <Carousel />
</Modal>

<style>
  :global(:root) {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
      'Open Sans', 'Helvetica Neue', sans-serif;
    color-scheme: light dark;
    --ON: initial;
    --OFF: ;
    --image-size: 200px;
    --animation-duration: 0.1s;
    --spinner-animation-duration: 1.2s;
    --image-size: 200px;
    --text-dark: hsla(0, 0%, 21.2%, 1);
  }

  :global(body.light) {
    --canvas: #efefef;
    --canvastext: hsl(0, 0%, 21.2%);
    --background-body: #fff;
    --background: #efefef;
    --background-alt: #f7f7f7;
    --selection: #9e9e9e;
    --text-main: var(--text-dark);
    --text-bright: #000;
    --text-muted: #70777f;
    --links: #0076d1;
    --focus: #0096bfab;
    --border: #dbdbdb;
    --code: #000;
    --button-base: #d0cfcf;
    --button-hover: #9b9b9b;
    --button-selected: #898686;
    --arrow-hover: var(--text-bright);
    --variable: hsla(121.7, 48.2%, 43.1%, 1);
    --highlight: hsla(60, 100%, 50%, 1);
    --arrow-button-background: var(--background-alt);
    --modal-overlay: rgba(52, 55, 65, 0.8);
  }

  :global(body.dark) {
    --canvas: #202b38;
    --canvastext: #dbdbdb;
    --background-body: #202b38;
    --background: #161f27;
    --background-alt: #1a242f;
    --selection: #1c76c5;
    --text-main: #dbdbdb;
    --text-bright: #fff;
    --text-muted: #a9b1ba;
    --links: #41adff;
    --focus: #0096bfab;
    --border: #526980;
    --code: #ffbe85;
    --button-base: #0c151c;
    --button-hover: #040a0f;
    --arrow-hover: var(--button-hover);
    --button-selected: var(--selection);
    --variable: #d941e2;
    --highlight: #efdb43;
    --arrow-button-background: var(--background-alt);
    --modal-overlay: rgba(0, 0, 0, 0.6);
  }

  :global(body) {
    color: var(--text-main);
  }

  main {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
  }

  header {
    display: flex;
    align-items: start;
    justify-content: space-between;
  }

  header > h3 {
    margin-top: 6px;
  }

  :global(body) {
    line-height: 1.4;
    max-width: 800px;
    margin: 20px auto;
    padding: 0 10px;
    word-wrap: break-word;
    color: var(--text-main);
    background: var(--background-body);
    text-rendering: optimizeLegibility;
  }
</style>
