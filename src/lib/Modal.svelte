<script lang="ts">
  import Modal from 'micromodal'
  import { tap } from 'rxjs'
  import { onDestroy } from 'svelte'
  import { router, routeParams } from '../state/router'

  Modal.init()

  let isOpen = false
  // keep ref to to element so we do not try to open it if not in dom
  let modal = undefined

  const currentBreed = routeParams
    .pipe(
      tap((breed) => {
        if (breed && !isOpen) {
          if (modal) {
            open()
          } else {
            // this is a hack, should use a loop to check when dom and data is ready
            setTimeout(() => open(), 1000)
          }
        } else if (!breed && isOpen) {
          close()
        }
      })
    )
    .subscribe()

  onDestroy(() => {
    currentBreed.unsubscribe()
  })

  function open() {
    Modal.show('carousel-modal', {
      disableScroll: true,
      onShow: function (modal) {
        document.querySelector('body').classList.add(modal.id)
        isOpen = true
      },
      onClose: function (modal) {
        isOpen = false
        document.querySelector('body').classList.remove(modal.id)
      },
      awaitCloseAnimation: true,
      closeTrigger: 'data-modal-close',
    })
  }

  function close() {
    Modal.close('carousel-modal')
    isOpen = false
  }
</script>

<!-- [1] -->
<div bind:this={modal} class="modal slide" id="carousel-modal" aria-hidden="true">
  <!-- [2] -->
  <div class="modal-overlay" tabindex="-1" data-modal-close>
    <!-- [3] -->
    <div class="modal-container" role="dialog" aria-modal="true" aria-labelledby="carousel-modal">
      <header class="modal-header">
        <h2 class="modal-title">{$routeParams}</h2>
        <!-- [4] -->
        <button
          type="button"
          class="modal-close"
          aria-label="Close modal"
          data-modal-close
          on:click={() => router.route('/')}
        />
      </header>
      <main class="modal-content">
        <slot />
      </main>
      <footer class="modal-footer">
        <slot name="footer" />
      </footer>
    </div>
  </div>
</div>

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal-container {
    display: block;
    background-color: var(--background);
    padding: 30px;
    width: 90%;
    max-height: 75%;
    border-radius: 4px;
    overflow: hidden;
    box-sizing: border-box;
  }

  @media only screen and (min-width: 800px) {
    .modal-container {
      height: 90%;
    }
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .modal-title {
    margin-top: 0;
    margin-bottom: 0;
    font-weight: 600;
    font-size: 1.25rem;
    line-height: 1.25;
    color: var(--text-main);
    box-sizing: border-box;
    text-transform: capitalize;
  }

  .modal-close {
    background: transparent;
    border: 0;
    padding: 1rem 1rem;
    margin: -1rem -1rem -1rem auto;
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 1;
    color: var(--text-muted);
    text-shadow: 0 1px 0 #fff;
    opacity: 0.5;
  }

  .modal-close:hover {
    color: var(--text-bright);
  }

  .modal-header .modal-close:before {
    content: '\2715';
  }

  .modal-content {
    display: grid;
    height: 95%;
    margin-top: 2rem;
    margin-bottom: 2rem;
    line-height: 1.5;
    color: var(--text-muted);
  }

  @keyframes mmfadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes mmfadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

  @keyframes mmslideIn {
    from {
      transform: translateY(15%);
    }
    to {
      transform: translateY(0);
    }
  }

  @keyframes mmslideOut {
    from {
      transform: translateY(0);
    }
    to {
      transform: translateY(-10%);
    }
  }

  /**
    hide/show styles set by micromodal in js, so need to be global
  */

  :global(.slide) {
    display: none;
  }

  :global(.slide.is-open) {
    display: block;
  }

  :global(.slide[aria-hidden='false'] .modal-overlay) {
    animation: mmfadeIn 0.3s cubic-bezier(0, 0, 0.2, 1);
  }

  :global(.slide[aria-hidden='false'] .modal-container) {
    animation: mmslideIn 0.3s cubic-bezier(0, 0, 0.2, 1);
  }

  :global(.slide[aria-hidden='true'] .modal-overlay) {
    animation: mmfadeOut 0.3s cubic-bezier(0, 0, 0.2, 1);
  }

  :global(.slide[aria-hidden='true'] .modal-container) {
    animation: mmslideOut 0.3s cubic-bezier(0, 0, 0.2, 1);
  }

  :global(.slide .modal-container),
  :global(.slide .modal-overlay) {
    will-change: transform;
  }
</style>
