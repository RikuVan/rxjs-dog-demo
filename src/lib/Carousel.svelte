<script lang="ts">
  import Image from './Image.svelte'
  import { createCarouselState } from '../state/carousel'

  export let breed = ''

  const { commandSubject$, currentImage$: currentImage, buttonClicks$ } = createCarouselState()
</script>

<div class="carousel">
  <button class="control-arrow left" on:click={() => buttonClicks$.next(-1)}
    ><span class="chevron chevron-left" /></button
  >
  <div class="carousel-content">
    {#if $currentImage}
      <Image src={$currentImage} title={breed} carousel={true} />
    {/if}
  </div>
  <button class="control-arrow right" on:click={() => buttonClicks$.next(1)}
    ><span class="chevron chevron-right" /></button
  >
</div>

<style>
  .carousel {
    display: grid;
    grid-template-columns: 50px auto 50px;
    position: relative;
    max-height: 100%;
    overflow: hidden;
  }

  .carousel-content {
    display: block;
    width: 100%;
    overflow: hidden;
  }

  .control-arrow {
    opacity: 0.3;
    background: none;
    border: 0;
    font-size: 46px;
    cursor: pointer;
    margin: auto;
    color: var(--arrow-color);
    width: 80px;
    z-index: 2;
  }

  .control-arrow:hover {
    opacity: 0.5;
    color: var(--arrow-hover);
  }

  button {
    opacity: 1;
    z-index: 1;
  }

  .chevron::before {
    border-style: solid;
    border-width: 0.25em 0.25em 0 0;
    content: '';
    display: inline-block;
    height: 0.45em;
    left: 0.15em;
    position: relative;
    top: 0.15em;
    transform: rotate(-45deg);
    vertical-align: top;
    width: 0.45em;
  }

  .chevron-right:before {
    margin-left: -1em;
    transform: rotate(45deg);
  }

  .chevron-left:before {
    margin-left: -1em;
    transform: rotate(-135deg);
  }
</style>
