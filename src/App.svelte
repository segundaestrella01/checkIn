<script>
  import { onMount } from 'svelte';
  import Mood from './components/Mood.svelte';

  // Define all available moods with their emojis
  const moods = [
    { id: 'angry', emoji: '😡', name: 'Angry' },
    { id: 'tired', emoji: '😴', name: 'Tired' },
    { id: 'stressed', emoji: '😰', name: 'Stressed' },
    { id: 'anxious', emoji: '😬', name: 'Anxious' },
    { id: 'calm', emoji: '😌', name: 'Calm' },
    { id: 'energetic', emoji: '⚡', name: 'Energetic' },
    { id: 'happy', emoji: '😄', name: 'Happy' }
  ];

  // State for selected mood and submission status
  let selectedMood = null;
  let submitted = false;
  let todayDate = '';

  onMount(() => {
    // Format today's date
    const today = new Date();
    todayDate = today.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  });

  function selectMood(mood) {
    selectedMood = mood;
  }

  function submitMood() {
    if (!selectedMood) return;
    
    // Save the mood selection (you could store in localStorage, send to a server, etc.)
    const checkInData = {
      date: new Date().toISOString(),
      mood: selectedMood.id
    };
    
    // Store in localStorage as an example
    const storedData = JSON.parse(localStorage.getItem('moodHistory') || '[]');
    storedData.push(checkInData);
    localStorage.setItem('moodHistory', JSON.stringify(storedData));
    
    submitted = true;
  }
  
  function resetForm() {
    selectedMood = null;
    submitted = false;
  }
</script>

<main class="main-container">
  <div class="container">
    <h1>Daily Mood Check-In</h1>
    <p class="date">{todayDate}</p>
    {#if !submitted}
      <div class="instructions">
        <p>How are you feeling today?</p>
        <p class="sub-text">Select the mood that best represents how you felt today.</p>
      </div>

      <div class="mood-grid">
        {#each moods as mood (mood.id)}
          <Mood 
            emoji={mood.emoji} 
            name={mood.name} 
            selected={selectedMood && selectedMood.id === mood.id}
            onSelect={() => selectMood(mood)} 
          />
        {/each}
      </div>

      <button 
        class="submit-button" 
        class:disabled={!selectedMood}
        on:click={submitMood}
      >
        Submit
      </button>
    {:else}
      <div class="success-message">
        <div class="success-emoji">✅</div>
        <h2>Thanks for checking in!</h2>
        <p>You marked your mood today as:</p>
        <div class="selected-mood">
          <div class="large-emoji">{selectedMood.emoji}</div>
          <div class="mood-name">{selectedMood.name}</div>
        </div>
        <button class="reset-button" on:click={resetForm}>
          Check in again
        </button>
      </div>
    {/if}
  </div>
</main>

<style>
  .main-container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 20px;
  }

  .container {
    max-width: 600px;
    width: 100%;
    padding: 30px;
    background-color: white;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    text-align: center;
  }

  h1 {
    color: #333;
    margin-bottom: 5px;
  }

  .date {
    color: #666;
    margin-bottom: 30px;
    font-style: italic;
  }

  .instructions {
    margin-bottom: 20px;
  }

  .instructions p {
    margin: 5px 0;
  }

  .sub-text {
    color: #666;
    font-size: 0.9rem;
  }

  .mood-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin: 30px 0;
  }

  .submit-button {
    padding: 12px 30px;
    background-color: #4a90e2;
    color: white;
    border: none;
    border-radius: 30px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .submit-button:hover {
    background-color: #3a7bc8;
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(74, 144, 226, 0.3);
  }

  .submit-button.disabled {
    background-color: #ccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  .success-message {
    padding: 20px 0;
  }

  .success-emoji {
    font-size: 3rem;
    margin-bottom: 15px;
  }

  .selected-mood {
    margin: 20px 0;
  }

  .large-emoji {
    font-size: 5rem;
    margin-bottom: 10px;
  }

  .mood-name {
    font-size: 1.5rem;
    font-weight: 500;
  }

  .reset-button {
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #f1f1f1;
    color: #333;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .reset-button:hover {
    background-color: #e0e0e0;
  }

  /* Media queries for responsiveness */
  @media (max-width: 600px) {
    .main-container {
      padding: 0;
      display: block; /* Change to block to allow natural scrolling */
      overflow-y: auto; /* Enable vertical scrolling if needed */
      height: 100vh;
    }
    
    .container {
      max-width: 100%;
      width: 100%;
      min-height: 100vh; /* Change from fixed height to min-height */
      height: auto; /* Allow container to grow with content */
      padding: 20px;
      border-radius: 0;
      box-shadow: none;
      display: flex;
      flex-direction: column;
      justify-content: flex-start; /* Start from top instead of center */
      overflow-y: visible; /* Ensure content can overflow */
      padding-top: 40px; /* Add some padding at top */
      padding-bottom: 40px; /* Add some padding at bottom */
    }
    
    .mood-grid {
      margin: 15px 0;
      flex-grow: 1;
      align-items: center;
    }
    
    h1 {
      margin-top: 0;
    }
    
    .submit-button {
      margin-bottom: 20px;
    }
  }
</style>