import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { getHearts, getGems } from '../player';

export const usePlayerStats = () => {
  const [hearts, setHearts] = useState(5);
  const [gems, setGems] = useState(0);

  const loadStats = useCallback(async () => {
    const [h, g] = await Promise.all([getHearts(), getGems()]);
    setHearts(h);
    setGems(g);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadStats();
      const timer = setInterval(loadStats, 60000);
      return () => clearInterval(timer);
    }, [loadStats])
  );

  return { hearts, gems, refresh: loadStats };
};
