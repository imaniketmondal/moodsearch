import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Mic, History, Smile, Frown, Angry, AlertCircle, Heart, Zap, Wind, Meh } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import type { Mood } from '../App';

interface MoodInputScreenProps {
  onMoodDetected: (mood: Mood) => void;
  onViewHistory: () => void;
}

const moodEmojis = [
  { icon: Smile, label: 'Happy', type: 'happy' as const, gradient: ['#fbbf24', '#f59e0b', '#fb923c'] },
  { icon: Frown, label: 'Sad', type: 'sad' as const, gradient: ['#60a5fa', '#3b82f6', '#2563eb'] },
  { icon: Angry, label: 'Angry', type: 'angry' as const, gradient: ['#f87171', '#ef4444', '#dc2626'] },
  { icon: AlertCircle, label: 'Anxious', type: 'anxious' as const, gradient: ['#a78bfa', '#8b5cf6', '#7c3aed'] },
  { icon: Heart, label: 'Love', type: 'love' as const, gradient: ['#ec4899', '#db2777', '#be185d'] },
  { icon: Zap, label: 'Excited', type: 'excited' as const, gradient: ['#34d399', '#10b981', '#059669'] },
  { icon: Wind, label: 'Calm', type: 'calm' as const, gradient: ['#67e8f9', '#22d3ee', '#06b6d4'] },
  { icon: Meh, label: 'Neutral', type: 'neutral' as const, gradient: ['#9ca3af', '#6b7280', '#4b5563'] },
];

export function MoodInputScreen({ onMoodDetected, onViewHistory }: MoodInputScreenProps) {
  const [text, setText] = useState('');
  const [selectedMood, setSelectedMood] = useState<typeof moodEmojis[0] | null>(null);
  const [isListening, setIsListening] = useState(false);

  const detectMoodFromText = (input: string): Mood => {
    const lowerInput = input.toLowerCase();
    
    // Keyword-based mood detection
    if (lowerInput.match(/happy|joy|great|wonderful|amazing|excited|fantastic|love|awesome/)) {
      return {
        type: 'happy',
        text: input,
        timestamp: Date.now(),
        gradient: ['#fbbf24', '#f59e0b', '#fb923c'],
      };
    } else if (lowerInput.match(/sad|down|depressed|lonely|blue|unhappy|crying/)) {
      return {
        type: 'sad',
        text: input,
        timestamp: Date.now(),
        gradient: ['#60a5fa', '#3b82f6', '#2563eb'],
      };
    } else if (lowerInput.match(/angry|mad|furious|annoyed|irritated|rage/)) {
      return {
        type: 'angry',
        text: input,
        timestamp: Date.now(),
        gradient: ['#f87171', '#ef4444', '#dc2626'],
      };
    } else if (lowerInput.match(/anxious|nervous|worried|stressed|afraid|scared|panic/)) {
      return {
        type: 'anxious',
        text: input,
        timestamp: Date.now(),
        gradient: ['#a78bfa', '#8b5cf6', '#7c3aed'],
      };
    } else if (lowerInput.match(/love|adore|romantic|passion|affection/)) {
      return {
        type: 'love',
        text: input,
        timestamp: Date.now(),
        gradient: ['#ec4899', '#db2777', '#be185d'],
      };
    } else if (lowerInput.match(/excited|energetic|pumped|hyped|enthusiastic/)) {
      return {
        type: 'excited',
        text: input,
        timestamp: Date.now(),
        gradient: ['#34d399', '#10b981', '#059669'],
      };
    } else if (lowerInput.match(/calm|peaceful|relaxed|serene|tranquil|zen/)) {
      return {
        type: 'calm',
        text: input,
        timestamp: Date.now(),
        gradient: ['#67e8f9', '#22d3ee', '#06b6d4'],
      };
    }
    
    return {
      type: 'neutral',
      text: input,
      timestamp: Date.now(),
      gradient: ['#9ca3af', '#6b7280', '#4b5563'],
    };
  };

  const handleDetectMood = () => {
    if (!text.trim() && !selectedMood) {
      toast.error('Please describe your mood or select an emoji');
      return;
    }

    let mood: Mood;
    
    if (selectedMood) {
      mood = {
        type: selectedMood.type,
        text: text || `Feeling ${selectedMood.label.toLowerCase()}`,
        timestamp: Date.now(),
        gradient: selectedMood.gradient,
      };
    } else {
      mood = detectMoodFromText(text);
    }

    toast.success(`Mood detected: ${mood.type}`);
    onMoodDetected(mood);
  };

  const handleVoiceInput = () => {
    setIsListening(true);
    toast.info('Voice input is a demo feature. Please use text input instead.');
    setTimeout(() => setIsListening(false), 2000);
  };

  const currentGradient = selectedMood?.gradient || ['#6366f1', '#8b5cf6', '#ec4899'];

  return (
    <motion.div
      className="min-h-screen relative overflow-hidden flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 -z-10"
        animate={{
          background: [
            `linear-gradient(135deg, ${currentGradient[0]}, ${currentGradient[1]}, ${currentGradient[2]})`,
            `linear-gradient(225deg, ${currentGradient[1]}, ${currentGradient[2]}, ${currentGradient[0]})`,
            `linear-gradient(135deg, ${currentGradient[0]}, ${currentGradient[1]}, ${currentGradient[2]})`,
          ],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Header */}
      <div className="p-6 flex justify-between items-center">
        <motion.h1
          className="text-3xl text-white"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          MoodLens
        </motion.h1>
        <Button
          variant="ghost"
          onClick={onViewHistory}
          className="text-white hover:bg-white/20"
        >
          <History className="w-5 h-5 mr-2" />
          History
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-4xl mx-auto w-full">
        <motion.div
          className="w-full"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Prompt */}
          <h2 className="text-4xl text-white text-center mb-12">
            How are you feeling today?
          </h2>

          {/* Emoji Selector */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {moodEmojis.map((mood) => (
              <motion.button
                key={mood.type}
                onClick={() => setSelectedMood(mood)}
                className={`p-6 rounded-2xl bg-white/10 backdrop-blur-sm border-2 transition-all ${
                  selectedMood?.type === mood.type
                    ? 'border-white bg-white/20 scale-105'
                    : 'border-white/20 hover:bg-white/15'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <mood.icon className="w-8 h-8 text-white mx-auto mb-2" />
                <p className="text-white text-sm">{mood.label}</p>
              </motion.button>
            ))}
          </div>

          {/* Text Input */}
          <div className="relative mb-6">
            <Textarea
              placeholder="Or describe how you're feeling in your own words..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-32 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/60 resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleDetectMood();
                }
              }}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleVoiceInput}
              className={`absolute bottom-3 right-3 ${
                isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-white/10 hover:bg-white/20'
              } text-white`}
            >
              <Mic className="w-4 h-4" />
            </Button>
          </div>

          {/* Detect Button */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={handleDetectMood}
              size="lg"
              className="w-full bg-white text-purple-600 hover:bg-white/90 shadow-xl py-6 text-lg rounded-xl"
            >
              Detect My Mood
            </Button>
          </motion.div>

          {/* Selected Mood Preview */}
          <AnimatePresence>
            {selectedMood && (
              <motion.div
                className="mt-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <p className="text-white/80">
                  Selected mood: <span className="text-white">{selectedMood.label}</span>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}
