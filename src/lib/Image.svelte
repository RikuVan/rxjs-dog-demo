<script lang="ts">
  import { fade } from 'svelte/transition'
  import { router } from '../state/router'
  export let src: string
  export let title: string
  export let carousel = false

  function handleClick() {
    router.route(title)
  }
</script>

{#if src && carousel}
  <img {src} alt={title} class="carousel" transition:fade />
{:else if src}
  <figure on:click={handleClick}>
    <img {src} alt={title} />
    <figcaption class="overlay">{title}</figcaption>
  </figure>
{/if}

<style>
  :root {
    --scale: 0.95;
    --rotate: 0deg;
  }

  img {
    width: var(--image-size);
    height: var(--image-size);
    object-fit: cover;
    border-radius: rotate(var(--rotate));
  }

  img.carousel {
    height: auto;
    width: 100%;
    transition: 0.6s ease;
    object-fit: cover;
    display: relative;
  }

  figure {
    margin: 0;
    display: grid;
    grid-template-rows: 1fr auto;
    transform: scale(var(--scale));
    transition: 0.2s cubic-bezier(0.2, 1.2, 0.5, 2);
    cursor: pointer;
  }

  figure:hover {
    --scale: 1;
  }

  figure > img {
    grid-row: 1 / -1;
    grid-column: 1;
  }

  figcaption {
    --overlay: 0.5;
    grid-row: 2;
    grid-column: 1;
    background-color: rgba(255, 255, 255, var(--overlay));
    padding: 0.2em 0.5em;
    justify-self: start;
    transition: 0.3s all;
    color: var(--text-dark);
  }

  figcaption:hover {
    --overlay: 0.8;
  }
</style>
