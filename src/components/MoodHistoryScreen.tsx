import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { ArrowLeft, Smile, Frown, Angry, AlertCircle, Heart, Zap, Wind, Meh, Clock } from 'lucide-react';
import type { Mood } from '../App';

interface MoodHistoryScreenProps {
  history: Mood[];
  onBack: () => void;
}

const moodIcons = {
  happy: Smile,
  sad: Frown,
  angry: Angry,
  anxious: AlertCircle,
  love: Heart,
  excited: Zap,
  calm: Wind,
  neutral: Meh,
};

export function MoodHistoryScreen({ history, onBack }: MoodHistoryScreenProps) {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    }
  };

  const getMoodStats = () => {
    const stats: Record<Mood['type'], number> = {
      happy: 0,
      sad: 0,
      angry: 0,
      anxious: 0,
      love: 0,
      excited: 0,
      calm: 0,
      neutral: 0,
    };

    history.forEach((mood) => {
      stats[mood.type]++;
    });

    return Object.entries(stats)
      .filter(([_, count]) => count > 0)
      .sort((a, b) => b[1] - a[1]);
  };

  const stats = getMoodStats();

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="p-6 flex justify-between items-center">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-white hover:bg-white/20"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-8">
        <motion.h1
          className="text-4xl text-white mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          Your Mood Journey
        </motion.h1>

        {history.length === 0 ? (
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-12 text-center">
              <Clock className="w-16 h-16 text-white/50 mx-auto mb-4" />
              <p className="text-white text-xl mb-2">No mood history yet</p>
              <p className="text-white/70">Start tracking your emotions to see your journey</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Stats Overview */}
            {stats.length > 0 && (
              <motion.div
                className="mb-8"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-2xl text-white mb-4">Mood Overview</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {stats.map(([moodType, count]) => {
                    const Icon = moodIcons[moodType as Mood['type']];
                    return (
                      <Card key={moodType} className="bg-white/10 backdrop-blur-sm border-white/20">
                        <CardContent className="p-4 text-center">
                          <Icon className="w-8 h-8 text-white mx-auto mb-2" />
                          <p className="text-white capitalize mb-1">{moodType}</p>
                          <p className="text-2xl text-white">{count}</p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* History List */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl text-white mb-4">Recent Moods</h2>
              <div className="space-y-4">
                {history.map((mood, index) => {
                  const Icon = moodIcons[mood.type];
                  return (
                    <motion.div
                      key={mood.timestamp}
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div
                              className="p-3 rounded-full"
                              style={{
                                background: `linear-gradient(135deg, ${mood.gradient[0]}, ${mood.gradient[1]})`,
                              }}
                            >
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="text-xl text-white capitalize">{mood.type}</h3>
                                <p className="text-white/60 text-sm">{formatDate(mood.timestamp)}</p>
                              </div>
                              <p className="text-white/80">{mood.text}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  );
}
