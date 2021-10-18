<div class="spinner-container">
  <div class="spinner" />
</div>

<style>
  @keyframes loading {
    to {
      transform: rotate(360deg);
    }
  }
  .spinner {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border-top: 4px solid var(--selection);
    border-right: 4px solid var(--selection);
    border-bottom: 4px solid var(--border);
    border-left: 4px solid var(--border);
    animation: loading var(--spinner-animation-duration) infinite linear;
  }
  .spinner-container {
    position: absolute;
    top: 40%;
    left: 50%;
    margin: -20px 0 0 -20px;
  }
</style>
