import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { ArrowLeft, Search, History, Loader2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';
import type { Mood } from '../App';

interface ResultsScreenProps {
  mood: Mood;
  onBack: () => void;
  onViewHistory: () => void;
}

interface SearchResult {
  id: string;
  imageUrl: string;
  description: string;
  title: string;
}

// Mood modifiers to adjust search queries based on emotional state
const moodModifiers: Record<Mood['type'], string[]> = {
  happy: ['bright', 'cheerful', 'sunny', 'vibrant', 'joyful'],
  sad: ['melancholic', 'moody', 'dark', 'somber', 'gray'],
  angry: ['intense', 'dramatic', 'stormy', 'powerful', 'fiery'],
  anxious: ['calm', 'peaceful', 'soft', 'gentle', 'serene'],
  love: ['romantic', 'warm', 'soft', 'beautiful', 'dreamy'],
  excited: ['dynamic', 'energetic', 'bold', 'colorful', 'vibrant'],
  calm: ['peaceful', 'tranquil', 'zen', 'minimalist', 'serene'],
  neutral: ['aesthetic', 'clean', 'modern', 'simple', 'natural'],
};

const moodMessages: Record<Mood['type'], string> = {
  happy: "Let's find content that matches your positive energy!",
  sad: "We'll find content that resonates with your current feelings.",
  angry: "Searching for content that matches your intensity.",
  anxious: "Finding content that might bring you peace.",
  love: "Let's discover beautiful content for your loving mood.",
  excited: "Searching for dynamic content to match your excitement!",
  calm: "Finding peaceful content to maintain your serenity.",
  neutral: "Let's explore content that interests you.",
};

export function ResultsScreen({ mood, onBack, onViewHistory }: ResultsScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const getMoodBasedQuery = (query: string): string => {
    const modifiers = moodModifiers[mood.type];
    const randomModifier = modifiers[Math.floor(Math.random() * modifiers.length)];
    return `${randomModifier} ${query}`;
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a search term');
      return;
    }

    setIsSearching(true);
    setHasSearched(true);

    try {
      // Create multiple mood-based variations of the search
      const moodQuery = getMoodBasedQuery(searchQuery);
      
      // Simulate fetching multiple results (in real app, would fetch from multiple sources)
      const results: SearchResult[] = [];
      
      // Get 6 different variations with mood modifiers
      const modifiers = moodModifiers[mood.type];
      const searchVariations = [
        moodQuery,
        `${modifiers[0]} ${searchQuery}`,
        `${modifiers[1]} ${searchQuery}`,
        `${modifiers[2]} ${searchQuery}`,
        `${searchQuery} ${modifiers[3]}`,
        `${searchQuery} ${modifiers[4]}`,
      ];

      // Note: In a production app, you would fetch all images here
      // For now, we'll create placeholder data structure
      for (let i = 0; i < 6; i++) {
        results.push({
          id: `result-${i}`,
          imageUrl: '', // Will be populated by Unsplash
          description: `${searchVariations[i]} - A ${mood.type} interpretation`,
          title: searchVariations[i],
        });
      }

      setSearchResults(results);
      toast.success(`Found ${results.length} results matching your ${mood.type} mood`);
    } catch (error) {
      toast.error('Failed to fetch results. Please try again.');
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <motion.div
      className="min-h-screen relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 -z-10"
        animate={{
          background: [
            `linear-gradient(135deg, ${mood.gradient[0]}, ${mood.gradient[1]}, ${mood.gradient[2]})`,
            `linear-gradient(225deg, ${mood.gradient[1]}, ${mood.gradient[2]}, ${mood.gradient[0]})`,
            `linear-gradient(135deg, ${mood.gradient[0]}, ${mood.gradient[1]}, ${mood.gradient[2]})`,
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
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-white hover:bg-white/20"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
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
      <div className="max-w-6xl mx-auto p-8 pb-20">
        {/* Mood Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <motion.h2
            className="text-5xl text-white mb-4 capitalize"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring' }}
          >
            You're feeling {mood.type}
          </motion.h2>
          <p className="text-xl text-white/90 mb-4">{moodMessages[mood.type]}</p>
          {mood.text && (
            <p className="text-white/70 italic">"{mood.text}"</p>
          )}
        </motion.div>

        {/* Search Box */}
        <motion.div
          className="max-w-3xl mx-auto mb-12"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <h3 className="text-2xl text-white mb-4 text-center">
                Search with your mood
              </h3>
              <p className="text-white/80 text-center mb-6">
                Your {mood.type} mood will influence the results you see
              </p>
              <div className="flex gap-3">
                <Input
                  placeholder={`Try searching for "rain", "sunset", "coffee"...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 h-14 text-lg"
                  disabled={isSearching}
                />
                <Button
                  onClick={handleSearch}
                  disabled={isSearching}
                  size="lg"
                  className="bg-white text-purple-600 hover:bg-white/90 px-8 h-14"
                >
                  {isSearching ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Search className="w-5 h-5 mr-2" />
                      Search
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search Results */}
        <AnimatePresence mode="wait">
          {isSearching && (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
              <p className="text-white text-xl">
                Finding {mood.type} content for "{searchQuery}"...
              </p>
            </motion.div>
          )}

          {!isSearching && hasSearched && searchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
            >
              <h3 className="text-3xl text-white mb-6">
                Results for "{searchQuery}" ({mood.type} mood)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((result, index) => (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all overflow-hidden group cursor-pointer">
                      <div className="aspect-square relative overflow-hidden bg-white/5">
                        <ImageWithFallback
                          src={`https://source.unsplash.com/400x400/?${encodeURIComponent(result.title)}`}
                          alt={result.description}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <CardContent className="p-4">
                        <p className="text-white/90 text-sm line-clamp-2">
                          {result.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Search Again Prompt */}
              <motion.div
                className="text-center mt-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <p className="text-white/70 mb-4">
                  Want to explore something else?
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery('');
                    setHasSearched(false);
                    setSearchResults([]);
                  }}
                  variant="outline"
                  className="bg-white/10 text-white border-white/30 hover:bg-white/20"
                >
                  New Search
                </Button>
              </motion.div>
            </motion.div>
          )}

          {!isSearching && hasSearched && searchResults.length === 0 && (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-white text-xl mb-4">
                No results found for "{searchQuery}"
              </p>
              <p className="text-white/70">
                Try a different search term
              </p>
            </motion.div>
          )}

          {!hasSearched && (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-white/70 text-lg mb-8">
                Start by searching for anything that interests you
              </p>
              
              {/* Suggested Searches */}
              <div className="max-w-2xl mx-auto">
                <p className="text-white/50 mb-4">Popular searches:</p>
                <div className="flex flex-wrap justify-center gap-3">
                  {['rain', 'sunset', 'coffee', 'ocean', 'mountains', 'forest', 'city', 'flowers'].map((suggestion) => (
                    <Button
                      key={suggestion}
                      onClick={() => {
                        setSearchQuery(suggestion);
                        setTimeout(() => handleSearch(), 100);
                      }}
                      variant="outline"
                      size="sm"
                      className="bg-white/5 text-white border-white/20 hover:bg-white/15"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
