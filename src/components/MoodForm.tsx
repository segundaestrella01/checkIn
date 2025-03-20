import { useState, useEffect } from 'react';
import Mood from './Mood';

interface MoodOption {
  id: string;
  emoji: string;
  name: string;
}

interface MoodFormProps {
  onMoodSubmit: (mood: MoodOption) => void;
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

export default function MoodForm({ onMoodSubmit }: MoodFormProps) {
  const [selectedMood, setSelectedMood] = useState<MoodOption | null>(null);
  const [todayDate, setTodayDate] = useState<string>('');

  useEffect(() => {
    // Format today's date
    const today = new Date();
    setTodayDate(today.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }));
  }, []); // Empty dependency array means this runs once on mount

  const selectMood = (mood: MoodOption) => {
    setSelectedMood(mood);
  };

  const handleSubmit = () => {
    if (!selectedMood) return;
    onMoodSubmit(selectedMood);
  };

  return (
    <div className="w-full flex flex-col items-center p-6">
      <div>
        <h1 className="text-4xl md:text-5xl font-bold text-center text-gradient mb-3">
            How are you feeling?
        </h1>
        <p className="text-[var(--secondary-dark-text-color)] text-center text-lg">{todayDate}</p>
    </div>
    <div className="text-center mb-10">
      <p className="text-xl md:text-2xl mb-3 text-[var(--text-color)]">Take a moment to reflect</p>
      <p className="text-[var(--secondary-text-color)] text-lg">
        Select the mood that best describes your current state
      </p>
    </div>
      <div className="flex flex-wrap justify-center gap-4 mb-12">
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
      <div className="text-center w-full">
        <button
          className={`
            px-12 py-4 rounded-full text-lg font-medium 
            ${selectedMood 
              ? 'bg-gradient text-white hover:opacity-90 shadow-lg' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }
          `}
          onClick={handleSubmit}
          disabled={!selectedMood}
        >
          Record Mood
        </button>
      </div>
    </div>
  );
}
