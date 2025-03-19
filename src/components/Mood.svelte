<script>
  export let emoji;
  export let name;
  export let selected = false;
  export let onSelect = () => {};
</script>

<div 
  class="mood-option {selected ? 'selected' : ''}"
  on:click={onSelect}
>
  <div class="emoji">{emoji}</div>
  <div class="name">{name}</div>
</div>

<style>
  .mood-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 100px;
    margin: 10px;
    padding: 15px;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 2px solid transparent;
    background-color: #f5f5f5;
  }

  .mood-option:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }

  .mood-option.selected {
    border-color: #4a90e2;
    background-color: #e6f2ff;
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }

  .emoji {
    font-size: 2.5rem;
    margin-bottom: 8px;
  }

  .name {
    font-size: 0.9rem;
    font-weight: 500;
    text-align: center;
    color: #333;
  }
</style>