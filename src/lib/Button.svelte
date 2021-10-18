<script lang="ts">
  export let kind: 'primary' | 'arrow' = 'primary'
  export let selected = false
</script>

<button on:click class={kind} class:selected>
  <slot />
</button>

<style>
  button {
    background: var(--button-base);
    border-radius: 6px;
    padding-right: 30px;
    padding-left: 30px;
    margin-right: 6px;
    margin-bottom: 6px;
    padding: 10px;
    border: none;
    border-radius: 6px;
    outline: none;
    cursor: pointer;
    color: var(--text-muted);
    font-variant-numeric: tabular-nums;
    transition: background-color var(--animation-duration) linear,
      border-color var(--animation-duration) linear, color var(--animation-duration) linear,
      box-shadow var(--animation-duration) linear, transform var(--animation-duration) ease;
  }

  button:focus {
    box-shadow: 0 0 0 2px var(--focus);
  }

  button:hover {
    background: var(--button-hover);
  }

  .arrow {
    padding: 0 14px 4px;
    font-size: 1.5rem;
    background: var(--arrow-button-background);
    box-shadow: 0 0 0 2px var(--focus);
  }

  .arrow:hover {
    background: var(--focus);
  }

  .selected {
    background: var(--button-selected);
    color: var(--text-bright);
  }
</style>
