import { Client } from "@notionhq/client";
import 'cross-fetch/polyfill'; // Required for the Notion client in some environments

// Environment variables for Notion API
let NOTION_API_KEY = '';
let NOTION_DATABASE_ID = '';

/**
 * Initialize the Notion client with the API key
 * @param {string} apiKey - Notion API key
 * @param {string} databaseId - Notion database ID
 */
export const initNotionClient = (apiKey, databaseId) => {
  NOTION_API_KEY = apiKey;
  NOTION_DATABASE_ID = databaseId;
  
  // Save credentials to localStorage for persistence
  localStorage.setItem('notion_api_key', apiKey);
  localStorage.setItem('notion_database_id', databaseId);
  
  return getNotionClient();
};

/**
 * Get a configured Notion client instance
 */
export const getNotionClient = () => {
  // Try to load from localStorage if not provided
  if (!NOTION_API_KEY) {
    NOTION_API_KEY = localStorage.getItem('notion_api_key') || '';
  }
  
  if (!NOTION_DATABASE_ID) {
    NOTION_DATABASE_ID = localStorage.getItem('notion_database_id') || '';
  }

  if (!NOTION_API_KEY) {
    return null;
  }

  return new Client({ auth: NOTION_API_KEY });
};

/**
 * Check if the Notion client is configured
 */
export const isNotionConfigured = () => {
  return !!(
    (NOTION_API_KEY || localStorage.getItem('notion_api_key')) && 
    (NOTION_DATABASE_ID || localStorage.getItem('notion_database_id'))
  );
};

/**
 * Get the configured database ID
 */
export const getNotionDatabaseId = () => {
  return NOTION_DATABASE_ID || localStorage.getItem('notion_database_id') || '';
};

/**
 * Save a mood entry to the Notion database
 * @param {Object} moodData - The mood data to save
 * @param {string} moodData.mood - The selected mood
 * @param {string} moodData.emoji - The emoji for the selected mood
 * @param {Date} moodData.date - The date of the mood check-in
 */
export const saveMoodToNotion = async (moodData) => {
  const notion = getNotionClient();
  
  if (!notion) {
    throw new Error('Notion client not initialized. Please provide API key and database ID.');
  }
  
  const databaseId = getNotionDatabaseId();
  
  if (!databaseId) {
    throw new Error('Notion database ID not provided.');
  }

  try {
    // Create a new page in the database with the mood data
    const response = await notion.pages.create({
      parent: {
        database_id: databaseId,
      },
      properties: {
        // These property names must match your Notion database's property names
        Name: {
          title: [
            {
              text: {
                content: `Mood: ${moodData.mood}`
              }
            }
          ]
        },
        Mood: {
          rich_text: [
            {
              text: {
                content: moodData.mood
              }
            }
          ]
        },
        Emoji: {
          rich_text: [
            {
              text: {
                content: moodData.emoji
              }
            }
          ]
        },
        Date: {
          date: {
            start: moodData.date.toISOString().split('T')[0],
          }
        }
      }
    });

    return response;
  } catch (error) {
    console.error('Error saving to Notion:', error);
    throw error;
  }
};

/**
 * Clear saved Notion credentials
 */
export const clearNotionCredentials = () => {
  NOTION_API_KEY = '';
  NOTION_DATABASE_ID = '';
  localStorage.removeItem('notion_api_key');
  localStorage.removeItem('notion_database_id');
};