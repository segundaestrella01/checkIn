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
    <div className="my-6 p-6 rounded-[24px] bg-white/20 backdrop-blur-sm shadow-lg">
      {configSuccess && (
        <div className="mb-4 p-4 rounded-2xl bg-[var(--secondary-color)] text-[var(--primary-color)] text-sm font-medium">
          {configSuccess}
        </div>
      )}
      
      {(!configured || showConfig) ? (
        <div className="text-left">
          <h3 className="text-2xl font-semibold mb-3 text-gradient">Configure Notion API</h3>
          <p className="mb-6 text-[var(--secondary-text-color)] text-lg">
            To save your moods to Notion, please provide your Notion API key and database ID.{' '}
            <a 
              href="https://developers.notion.com/docs/getting-started" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[var(--primary-color)] underline hover:opacity-80"
            >
              Learn how to get these credentials
            </a>
          </p>
          
          {configError && (
            <div className="mb-4 p-4 rounded-2xl bg-red-50 text-red-700 text-sm">
              {configError}
            </div>
          )}
          
          <div className="mb-5">
            <label htmlFor="apiKey" className="block mb-2 font-medium text-[var(--text-color)]">
              Notion API Key
            </label>
            <input
              type="password"
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="secret_..."
              className="w-full p-3 border-2 border-gray-200 rounded-xl text-base focus:outline-none focus:border-[var(--primary-color)] transition-colors"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="databaseId" className="block mb-2 font-medium text-[var(--text-color)]">
              Notion Database ID
            </label>
            <input
              type="text"
              id="databaseId"
              value={databaseId}
              onChange={(e) => setDatabaseId(e.target.value)}
              placeholder="a1b2c3d4-..."
              className="w-full p-3 border-2 border-gray-200 rounded-xl text-base focus:outline-none focus:border-[var(--primary-color)] transition-colors"
            />
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={saveConfig}
              className="px-6 py-3 bg-gradient text-white rounded-full hover:opacity-90 transition-opacity shadow-md font-medium"
            >
              Save Configuration
            </button>
            <button
              onClick={toggleConfig}
              className="px-6 py-3 bg-white text-[var(--accent-color)] rounded-full hover:bg-gray-50 transition-colors shadow-md font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between flex-wrap gap-4">
          <p className="font-medium text-lg flex items-center gap-2">
            <span className="text-[var(--primary-color)]">✓</span> 
            Notion API configured
          </p>
          <div className="flex gap-3">
            <button
              onClick={toggleConfig}
              className="px-6 py-3 bg-gradient text-white rounded-full hover:opacity-90 transition-opacity shadow-md font-medium"
            >
              Edit Configuration
            </button>
            <button
              onClick={resetConfig}
              className="px-6 py-3 bg-white text-[var(--accent-color)] rounded-full hover:bg-gray-50 transition-colors shadow-md font-medium"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}