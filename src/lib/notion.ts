import { Client } from "@notionhq/client";

// Environment variables for Notion API
let NOTION_API_KEY = '';
let NOTION_DATABASE_ID = '';

// CORS proxy configuration
const PROXY_URL = 'https://corsproxy.io/?';
const NOTION_API_BASE = 'https://api.notion.com';

interface MoodData {
  mood: string;
  emoji: string;
  date: Date;
  reflectionNote?: string;
}

/**
 * Initialize the Notion client with the API key
 */
export const initNotionClient = (apiKey: string, databaseId: string) => {
  NOTION_API_KEY = apiKey;
  NOTION_DATABASE_ID = databaseId;
  
  // Save credentials to localStorage for persistence
  if (typeof window !== 'undefined') {
    localStorage.setItem('notion_api_key', apiKey);
    localStorage.setItem('notion_database_id', databaseId);
  }
};

/**
 * Check if the Notion client is configured
 */
export const isNotionConfigured = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return !!(
    (NOTION_API_KEY || localStorage.getItem('notion_api_key')) && 
    (NOTION_DATABASE_ID || localStorage.getItem('notion_database_id'))
  );
};

/**
 * Get the stored credentials
 */
const getCredentials = () => {
  if (typeof window === 'undefined') return { apiKey: '', databaseId: '' };
  
  const apiKey = NOTION_API_KEY || localStorage.getItem('notion_api_key') || '';
  const databaseId = NOTION_DATABASE_ID || localStorage.getItem('notion_database_id') || '';
  
  return { apiKey, databaseId };
};

/**
 * Save a mood entry to the Notion database through the API route
 */
export const saveMoodToNotion = async (moodData: MoodData) => {
  const { apiKey, databaseId } = getCredentials();
  
  if (!apiKey || !databaseId) {
    throw new Error('Notion client not initialized. Please provide API key and database ID.');
  }

  try {
    const response = await fetch('/api/notion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'saveMood',
        apiKey,
        databaseId,
        data: {
          ...moodData,
          date: moodData.date.toISOString()
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to save to Notion');
    }

    return await response.json();
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
  if (typeof window !== 'undefined') {
    localStorage.removeItem('notion_api_key');
    localStorage.removeItem('notion_database_id');
  }
};