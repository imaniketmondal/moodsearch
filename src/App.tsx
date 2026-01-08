import { useState } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { MoodInputScreen } from './components/MoodInputScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { MoodHistoryScreen } from './components/MoodHistoryScreen';
import { Toaster } from './components/ui/sonner';

export type Mood = {
  type: 'happy' | 'sad' | 'angry' | 'anxious' | 'love' | 'excited' | 'calm' | 'neutral';
  text: string;
  timestamp: number;
  gradient: string[];
};

export type Screen = 'splash' | 'input' | 'results' | 'history';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [currentMood, setCurrentMood] = useState<Mood | null>(null);
  const [moodHistory, setMoodHistory] = useState<Mood[]>([]);

  const handleMoodDetected = (mood: Mood) => {
    setCurrentMood(mood);
    setMoodHistory(prev => [mood, ...prev]);
    setCurrentScreen('results');
  };

  const handleBackToInput = () => {
    setCurrentScreen('input');
  };

  const handleViewHistory = () => {
    setCurrentScreen('history');
  };

  return (
    <div className="min-h-screen">
      {currentScreen === 'splash' && (
        <SplashScreen onStart={() => setCurrentScreen('input')} />
      )}
      
      {currentScreen === 'input' && (
        <MoodInputScreen 
          onMoodDetected={handleMoodDetected}
          onViewHistory={handleViewHistory}
        />
      )}
      
      {currentScreen === 'results' && currentMood && (
        <ResultsScreen 
          mood={currentMood}
          onBack={handleBackToInput}
          onViewHistory={handleViewHistory}
        />
      )}
      
      {currentScreen === 'history' && (
        <MoodHistoryScreen 
          history={moodHistory}
          onBack={handleBackToInput}
        />
      )}
      
      <Toaster />
    </div>
  );
}
