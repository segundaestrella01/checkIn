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
}

/**
 * Custom fetch function that uses the CORS proxy for Notion API requests
 */
const proxyFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  // Only proxy requests to Notion API
  if (url.startsWith(NOTION_API_BASE)) {
    const proxiedUrl = `${PROXY_URL}${encodeURIComponent(url)}`;
    return fetch(proxiedUrl, {
      ...options,
      headers: {
        ...options.headers,
        'Content-Type': 'application/json',
      }
    });
  }
  return fetch(url, options);
};

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
  
  return getNotionClient();
};

/**
 * Get a configured Notion client instance
 */
export const getNotionClient = () => {
  // Try to load from localStorage if not provided
  if (!NOTION_API_KEY && typeof window !== 'undefined') {
    NOTION_API_KEY = localStorage.getItem('notion_api_key') || '';
  }
  
  if (!NOTION_DATABASE_ID && typeof window !== 'undefined') {
    NOTION_DATABASE_ID = localStorage.getItem('notion_database_id') || '';
  }

  if (!NOTION_API_KEY) {
    return null;
  }

  return new Client({ 
    auth: NOTION_API_KEY,
    fetch: proxyFetch
  });
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
 * Get the configured database ID
 */
export const getNotionDatabaseId = (): string => {
  if (typeof window === 'undefined') return '';
  return NOTION_DATABASE_ID || localStorage.getItem('notion_database_id') || '';
};

/**
 * Save a mood entry to the Notion database
 */
export const saveMoodToNotion = async (moodData: MoodData) => {
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
  if (typeof window !== 'undefined') {
    localStorage.removeItem('notion_api_key');
    localStorage.removeItem('notion_database_id');
  }
};