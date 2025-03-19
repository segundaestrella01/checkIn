<script>
  import { onMount } from 'svelte';
  import Mood from './components/Mood.svelte';
  import NotionConfig from './components/NotionConfig.svelte';
  import { isNotionConfigured, saveMoodToNotion } from './services/notion';

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
  let notionConfigured = false;
  let savingToNotion = false;
  let notionError = '';
  let showSettings = false;

  onMount(() => {
    // Format today's date
    const today = new Date();
    todayDate = today.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    // Check if Notion is configured
    notionConfigured = isNotionConfigured();
  });

  function selectMood(mood) {
    selectedMood = mood;
  }

  async function submitMood() {
    if (!selectedMood) return;
    
    const today = new Date();
    
    // Save the mood selection
    const checkInData = {
      date: today.toISOString(),
      mood: selectedMood.id
    };
    
    // Store in localStorage
    const storedData = JSON.parse(localStorage.getItem('moodHistory') || '[]');
    storedData.push(checkInData);
    localStorage.setItem('moodHistory', JSON.stringify(storedData));
    
    // Try to save to Notion if configured
    if (notionConfigured) {
      try {
        savingToNotion = true;
        notionError = '';
        
        await saveMoodToNotion({
          mood: selectedMood.name,
          emoji: selectedMood.emoji,
          date: today
        });
        
        savingToNotion = false;
      } catch (error) {
        savingToNotion = false;
        notionError = `Failed to save to Notion: ${error.message}`;
        console.error('Error saving to Notion:', error);
      }
    }
    
    submitted = true;
  }
  
  function resetForm() {
    selectedMood = null;
    submitted = false;
    notionError = '';
  }

  function toggleSettings() {
    showSettings = !showSettings;
  }
</script>

<main class="main-container">
  <div class="container">
    <div class="header-container">
      <button class="settings-button" on:click={toggleSettings} title="Settings">
        ⚙️
      </button>
      <h1>Daily Mood Check-In</h1>
      <p class="date">{todayDate}</p>
    </div>

    {#if showSettings}
      <div class="settings-panel">
        <h2>Settings</h2>
        <NotionConfig />
        <button class="close-settings" on:click={toggleSettings}>Close Settings</button>
      </div>
    {:else}
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
          disabled={!selectedMood || savingToNotion}
          on:click={submitMood}
        >
          {#if savingToNotion}
            Saving...
          {:else}
            Submit
          {/if}
        </button>

        {#if notionConfigured}
          <div class="notion-status">
            <span class="notion-badge">Notion Sync Enabled</span>
          </div>
        {/if}
      {:else}
        <div class="success-message">
          <div class="success-emoji">✅</div>
          <h2>Thanks for checking in!</h2>
          <p>You marked your mood today as:</p>
          <div class="selected-mood">
            <div class="large-emoji">{selectedMood.emoji}</div>
            <div class="mood-name">{selectedMood.name}</div>
          </div>

          {#if notionError}
            <div class="error-message">
              {notionError}
            </div>
          {:else if notionConfigured}
            <div class="notion-saved">
              ✅ Saved to Notion
            </div>
          {/if}

          <button class="reset-button" on:click={resetForm}>
            Check in again
          </button>
        </div>
      {/if}
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
    position: relative; /* For absolute positioning of settings button */
  }

  .header-container {
    position: relative;
    margin-bottom: 20px;
    padding-top: 40px;
  }

  .settings-button {
    position: absolute;
    top: 0;
    right: 0;
    background: transparent;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 5px;
  }

  .settings-panel {
    margin: 20px 0;
    text-align: left;
  }

  .close-settings {
    margin-top: 15px;
    padding: 10px 20px;
    background-color: #f1f1f1;
    color: #333;
    border: none;
    border-radius: 20px;
    cursor: pointer;
  }

  h1 {
    color: #333;
    margin-bottom: 5px;
  }

  .date {
    color: #666;
    margin-bottom: 10px;
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
    min-width: 150px;
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

  .notion-status {
    margin-top: 15px;
    font-size: 0.8rem;
  }

  .notion-badge {
    background-color: #e8f5e9;
    color: #2e7d32;
    padding: 5px 10px;
    border-radius: 20px;
    font-size: 0.8rem;
  }

  .notion-saved {
    margin: 15px 0;
    color: #2e7d32;
    font-weight: 500;
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

  .error-message {
    margin: 15px auto;
    background-color: #ffebee;
    color: #d32f2f;
    padding: 10px 15px;
    border-radius: 8px;
    max-width: 80%;
    font-size: 0.9rem;
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
      display: block;
      overflow-y: auto;
      height: 100vh;
    }
    
    .container {
      max-width: 100%;
      width: 100%;
      min-height: 100vh;
      height: auto;
      padding: 20px;
      border-radius: 0;
      box-shadow: none;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      overflow-y: visible;
      padding-top: 10px;
      padding-bottom: 40px;
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
      margin-bottom: 10px;
    }
    
    /* Ensure settings panel is scrollable on mobile */
    .settings-panel {
      max-height: 70vh;
      overflow-y: auto;
    }
  }
</style>