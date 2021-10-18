<script lang="ts">
  import Button from './Button.svelte'
  import { createModeState, Theme } from '../state/mode'

  const { modeState$, buttonClicks$ } = createModeState()
  $: switchTheme = $modeState$ === Theme.Dark ? Theme.Light : Theme.Dark
</script>

<Button on:click={() => buttonClicks$.next(switchTheme)}>
  Switch to {switchTheme} mode
</Button>
