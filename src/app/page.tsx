'use client';

import { useState, useEffect } from 'react';
import Mood from '@/components/Mood';
import NotionConfig from '@/components/NotionConfig';
import { isNotionConfigured, saveMoodToNotion } from '@/lib/notion';

interface MoodOption {
  id: string;
  emoji: string;
  name: string;
}

const moods: MoodOption[] = [
  { id: 'angry', emoji: '😡', name: 'Angry' },
  { id: 'tired', emoji: '😴', name: 'Tired' },
  { id: 'stressed', emoji: '😰', name: 'Stressed' },
  { id: 'anxious', emoji: '😬', name: 'Anxious' },
  { id: 'calm', emoji: '😌', name: 'Calm' },
  { id: 'energetic', emoji: '⚡', name: 'Energetic' },
  { id: 'happy', emoji: '😄', name: 'Happy' }
];

export default function Home() {
  const [selectedMood, setSelectedMood] = useState<MoodOption | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [todayDate, setTodayDate] = useState('');
  const [notionConfigured, setNotionConfigured] = useState(false);
  const [savingToNotion, setSavingToNotion] = useState(false);
  const [notionError, setNotionError] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // Format today's date
    const today = new Date();
    setTodayDate(today.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }));

    // Check if Notion is configured
    setNotionConfigured(isNotionConfigured());
  }, []);

  const selectMood = (mood: MoodOption) => {
    setSelectedMood(mood);
  };

  const submitMood = async () => {
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
        setSavingToNotion(true);
        setNotionError('');
        
        await saveMoodToNotion({
          mood: selectedMood.name,
          emoji: selectedMood.emoji,
          date: today
        });
        
        setSavingToNotion(false);
      } catch (error) {
        setSavingToNotion(false);
        setNotionError(`Failed to save to Notion: ${error instanceof Error ? error.message : 'Unknown error'}`);
        console.error('Error saving to Notion:', error);
      }
    }
    
    setSubmitted(true);
  };
  
  const resetForm = () => {
    setSelectedMood(null);
    setSubmitted(false);
    setNotionError('');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white">
          <div className="mb-8 flex flex-col items-center">
            <div className="w-full flex flex-row">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 text-2xl bg-transparent border-none cursor-pointer align"
                title="Settings"
              >
                ⚙️
              </button>
            </div>
            <h1 className="text-2xl font-bold text-center text-gray-800 mt-1">
              Daily Mood Check-In
            </h1>
            <p className="text-gray-600 text-center italic mt-2">{todayDate}</p>
          </div>

          {showSettings ? (
            <div className="settings-panel">
              <h2 className="text-xl font-semibold mb-4">Settings</h2>
              <NotionConfig />
              <button
                className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                onClick={() => setShowSettings(false)}
              >
                Close Settings
              </button>
            </div>
          ) : !submitted ? (
            <>
              <div className="text-center mb-8">
                <p className="text-lg mb-2">How are you feeling today?</p>
                <p className="text-sm text-gray-600">
                  Select the mood that best represents how you felt today.
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-4 mb-8">
                {moods.map((mood) => (
                  <Mood
                    key={mood.id}
                    emoji={mood.emoji}
                    name={mood.name}
                    selected={selectedMood?.id === mood.id}
                    onSelect={() => selectMood(mood)}
                  />
                ))}
              </div>

              <div className="text-center">
                <button
                  className={`
                    px-8 py-3 rounded-full font-medium transition-all
                    ${selectedMood ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}
                    ${savingToNotion ? 'opacity-75 cursor-wait' : ''}
                  `}
                  onClick={submitMood}
                  disabled={!selectedMood || savingToNotion}
                >
                  {savingToNotion ? 'Saving...' : 'Submit'}
                </button>

                {notionConfigured && (
                  <div className="mt-4">
                    <span className="inline-block px-3 py-1 bg-green-50 text-green-700 text-sm rounded-full">
                      Notion Sync Enabled
                    </span>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center">
              <div className="text-5xl mb-6">✅</div>
              <h2 className="text-2xl font-bold mb-4">Thanks for checking in!</h2>
              <p className="mb-4">You marked your mood today as:</p>
              <div className="mb-8">
                <div className="text-6xl mb-3">{selectedMood?.emoji}</div>
                <div className="text-xl font-medium">{selectedMood?.name}</div>
              </div>

              {notionError ? (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
                  {notionError}
                </div>
              ) : notionConfigured ? (
                <div className="mb-6 text-green-700 font-medium">
                  ✅ Saved to Notion
                </div>
              ) : null}

              <button
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition-colors"
                onClick={resetForm}
              >
                Check in again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
