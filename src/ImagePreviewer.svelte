<script type="ts">
  import Button from './lib/Button.svelte'
  import Spinner from './lib/Spinner.svelte'
  import Image from './lib/Image.svelte'
  import { state, commandSubject$, buttonEvent$ } from './state/imagePreviewer'

  $: currentLetter = $state.letters[$state.currentIndex]
</script>

<div>
  <nav>
    {#each $state.letters as letter, i}
      <Button
        selected={i === $state.currentIndex}
        on:click={() => commandSubject$.next({ currentIndex: i })}>{letter}</Button
      >
    {/each}
  </nav>
  <nav>
    <Button kind="arrow" on:click={() => buttonEvent$.next(-1)}>&#8592;</Button>
    <Button kind="arrow" on:click={() => buttonEvent$.next(1)}>&#8594;</Button>
  </nav>
  {#if $state.previews.has(currentLetter)}
    <div class="img-grid">
      {#each $state.previews.get(currentLetter) as [breed, src]}
        {#if typeof src === 'string'}
          <Image {src} title={breed} />
        {/if}
      {/each}
    </div>
  {:else}
    <Spinner />
  {/if}
</div>

<style>
  nav + nav {
    padding-top: 1em;
  }

  .img-grid {
    --gutter: 0.2em;
    padding-top: 1em;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    max-width: 80vw;
    margin: auto;
    gap: var(--gutter);
  }

  @media (min-width: 600px) {
    .img-grid {
      --gutter: 0.5em;
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @media (min-width: 800px) {
    .img-grid {
      --gutter: 0.5em;
      grid-template-columns: repeat(4, 1fr);
    }
  }
</style>
