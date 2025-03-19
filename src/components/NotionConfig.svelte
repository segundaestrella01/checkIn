<script>
  import { onMount } from 'svelte';
  import { initNotionClient, isNotionConfigured, clearNotionCredentials } from '../services/notion';

  let apiKey = '';
  let databaseId = '';
  let configured = false;
  let showConfig = false;
  let configError = '';
  let configSuccess = '';

  onMount(() => {
    // Check if already configured
    configured = isNotionConfigured();
    
    // Try to load from localStorage
    apiKey = localStorage.getItem('notion_api_key') || '';
    databaseId = localStorage.getItem('notion_database_id') || '';
  });

  function saveConfig() {
    if (!apiKey || !databaseId) {
      configError = 'Both API Key and Database ID are required';
      return;
    }

    try {
      // Initialize the Notion client with the provided credentials
      initNotionClient(apiKey, databaseId);
      configured = true;
      showConfig = false;
      configError = '';
      configSuccess = 'Notion API configured successfully!';
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        configSuccess = '';
      }, 3000);
    } catch (error) {
      configError = `Error configuring Notion API: ${error.message}`;
    }
  }

  function resetConfig() {
    clearNotionCredentials();
    apiKey = '';
    databaseId = '';
    configured = false;
    configError = '';
  }

  function toggleConfig() {
    showConfig = !showConfig;
  }
</script>

<div class="notion-config">
  {#if configSuccess}
    <div class="success-message">{configSuccess}</div>
  {/if}
  
  {#if !configured || showConfig}
    <div class="config-form">
      <h3>Configure Notion API</h3>
      <p class="instructions">
        To save your moods to Notion, please provide your Notion API key and database ID.
        <a href="https://developers.notion.com/docs/getting-started" target="_blank" rel="noopener noreferrer">
          Learn how to get these credentials
        </a>
      </p>
      
      {#if configError}
        <div class="error-message">{configError}</div>
      {/if}
      
      <div class="form-group">
        <label for="apiKey">Notion API Key</label>
        <input type="password" id="apiKey" bind:value={apiKey} placeholder="secret_..." />
      </div>
      
      <div class="form-group">
        <label for="databaseId">Notion Database ID</label>
        <input type="text" id="databaseId" bind:value={databaseId} placeholder="a1b2c3d4-..." />
      </div>
      
      <div class="button-group">
        <button class="save-button" on:click={saveConfig}>Save Configuration</button>
        <button class="cancel-button" on:click={toggleConfig}>Cancel</button>
      </div>
    </div>
  {:else}
    <div class="config-status">
      <p>✅ Notion API configured</p>
      <div class="button-group">
        <button class="edit-button" on:click={toggleConfig}>Edit Configuration</button>
        <button class="reset-button" on:click={resetConfig}>Reset</button>
      </div>
    </div>
  {/if}
</div>

<style>
  .notion-config {
    margin: 20px 0;
    padding: 15px;
    border-radius: 8px;
    background-color: #f8f9fa;
  }

  .config-form {
    text-align: left;
  }

  h3 {
    margin-top: 0;
  }

  .instructions {
    margin-bottom: 20px;
    font-size: 0.9rem;
    color: #555;
  }
  
  .instructions a {
    color: #4a90e2;
    text-decoration: underline;
  }

  .form-group {
    margin-bottom: 15px;
  }

  label {
    display: block;
    margin-bottom: 5px;
    font-weight: 500;
  }

  input {
    width: 100%;
    padding: 8px 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 0.9rem;
  }

  .button-group {
    display: flex;
    gap: 10px;
    margin-top: 15px;
  }

  .save-button, .edit-button {
    background-color: #4a90e2;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 8px 16px;
    cursor: pointer;
  }

  .cancel-button, .reset-button {
    background-color: #f1f1f1;
    color: #333;
    border: none;
    border-radius: 4px;
    padding: 8px 16px;
    cursor: pointer;
  }

  .error-message {
    background-color: #ffebee;
    color: #d32f2f;
    padding: 10px;
    margin-bottom: 15px;
    border-radius: 4px;
    font-size: 0.9rem;
  }

  .success-message {
    background-color: #e8f5e9;
    color: #2e7d32;
    padding: 10px;
    margin-bottom: 15px;
    border-radius: 4px;
    font-size: 0.9rem;
  }

  .config-status {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .config-status p {
    margin: 0;
    font-weight: 500;
  }

  @media (max-width: 600px) {
    .config-status {
      flex-direction: column;
      gap: 10px;
      align-items: flex-start;
    }
    
    .button-group {
      width: 100%;
      justify-content: center;
    }
  }
</style>