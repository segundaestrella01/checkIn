'use client';

import { useState, useEffect } from 'react';
import { initNotionClient, isNotionConfigured, clearNotionCredentials } from '../lib/notion';

export default function NotionConfig() {
  const [apiKey, setApiKey] = useState('');
  const [databaseId, setDatabaseId] = useState('');
  const [configured, setConfigured] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [configError, setConfigError] = useState('');
  const [configSuccess, setConfigSuccess] = useState('');

  useEffect(() => {
    // Check if already configured
    setConfigured(isNotionConfigured());
    
    // Try to load from localStorage
    setApiKey(localStorage.getItem('notion_api_key') || '');
    setDatabaseId(localStorage.getItem('notion_database_id') || '');
  }, []);

  const saveConfig = () => {
    if (!apiKey || !databaseId) {
      setConfigError('Both API Key and Database ID are required');
      return;
    }

    try {
      initNotionClient(apiKey, databaseId);
      setConfigured(true);
      setShowConfig(false);
      setConfigError('');
      setConfigSuccess('Notion API configured successfully!');
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setConfigSuccess('');
      }, 3000);
    } catch (error) {
      setConfigError(`Error configuring Notion API: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const resetConfig = () => {
    clearNotionCredentials();
    setApiKey('');
    setDatabaseId('');
    setConfigured(false);
    setConfigError('');
  };

  const toggleConfig = () => {
    setShowConfig(!showConfig);
  };

  return (
    <div className="my-5 p-4 rounded-lg bg-gray-50">
      {configSuccess && (
        <div className="mb-4 p-3 rounded bg-green-50 text-green-800 text-sm">
          {configSuccess}
        </div>
      )}
      
      {(!configured || showConfig) ? (
        <div className="text-left">
          <h3 className="text-lg font-semibold mb-2">Configure Notion API</h3>
          <p className="mb-5 text-sm text-gray-600">
            To save your moods to Notion, please provide your Notion API key and database ID.{' '}
            <a 
              href="https://developers.notion.com/docs/getting-started" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 underline hover:text-blue-600"
            >
              Learn how to get these credentials
            </a>
          </p>
          
          {configError && (
            <div className="mb-4 p-3 rounded bg-red-50 text-red-700 text-sm">
              {configError}
            </div>
          )}
          
          <div className="mb-4">
            <label htmlFor="apiKey" className="block mb-1 font-medium">
              Notion API Key
            </label>
            <input
              type="password"
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="secret_..."
              className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="databaseId" className="block mb-1 font-medium">
              Notion Database ID
            </label>
            <input
              type="text"
              id="databaseId"
              value={databaseId}
              onChange={(e) => setDatabaseId(e.target.value)}
              placeholder="a1b2c3d4-..."
              className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex gap-2 mt-4">
            <button
              onClick={saveConfig}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Save Configuration
            </button>
            <button
              onClick={toggleConfig}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between flex-wrap gap-4">
          <p className="font-medium">✅ Notion API configured</p>
          <div className="flex gap-2">
            <button
              onClick={toggleConfig}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Edit Configuration
            </button>
            <button
              onClick={resetConfig}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}