import AsyncStorage from '@react-native-async-storage/async-storage';

const HEARTS_KEY = 'player_hearts';
const HEARTS_TIME_KEY = 'player_hearts_timestamp';
const GEMS_KEY = 'player_gems';

const MAX_HEARTS = 5;
const REFILL_INTERVAL_MS = 30 * 60 * 1000; // 30 minutes

export const getHearts = async (): Promise<number> => {
  try {
    const [heartsStr, timeStr] = await Promise.all([
      AsyncStorage.getItem(HEARTS_KEY),
      AsyncStorage.getItem(HEARTS_TIME_KEY),
    ]);

    if (heartsStr === null) {
      return MAX_HEARTS;
    }

    let hearts = parseInt(heartsStr, 10);
    if (hearts >= MAX_HEARTS) {
      return MAX_HEARTS;
    }

    // Calculate refill
    const lastTime = timeStr ? parseInt(timeStr, 10) : Date.now();
    if (!timeStr) {
      await AsyncStorage.setItem(HEARTS_TIME_KEY, lastTime.toString());
    }
    const now = Date.now();
    const elapsed = now - lastTime;

    if (elapsed >= REFILL_INTERVAL_MS) {
      const heartsToAdd = Math.floor(elapsed / REFILL_INTERVAL_MS);
      const newHearts = Math.min(MAX_HEARTS, hearts + heartsToAdd);
      
      if (newHearts > hearts) {
        hearts = newHearts;
        // Update storage
        await AsyncStorage.setItem(HEARTS_KEY, hearts.toString());
        
        // Update timestamp: advance it by the amount of time consumed for the hearts added
        // giving credit for the partial time towards the next heart
        if (hearts < MAX_HEARTS) {
          const newTime = lastTime + (heartsToAdd * REFILL_INTERVAL_MS);
          await AsyncStorage.setItem(HEARTS_TIME_KEY, newTime.toString());
        } else {
          // If full, remove timestamp or set to null (effectively handled by not reading it when full)
          await AsyncStorage.removeItem(HEARTS_TIME_KEY);
        }
      }
    }
    
    return hearts;
  } catch (error) {
    console.error('Error getting hearts from AsyncStorage', error);
    return MAX_HEARTS;
  }
};

export const setHearts = async (hearts: number): Promise<void> => {
  try {
    const currentHearts = await getHearts();
    await AsyncStorage.setItem(HEARTS_KEY, hearts.toString());
    
    // Start or reset the refill timer when hearts decrease.
    if (hearts < MAX_HEARTS && (currentHearts === MAX_HEARTS || hearts < currentHearts)) {
      await AsyncStorage.setItem(HEARTS_TIME_KEY, Date.now().toString());
    }
    // If we filled up, clear the time
    if (hearts >= MAX_HEARTS) {
       await AsyncStorage.removeItem(HEARTS_TIME_KEY);
    }
  } catch (error) {
    console.error('Error setting hearts in AsyncStorage', error);
  }
};

export const getGems = async (): Promise<number> => {
  try {
    const gems = await AsyncStorage.getItem(GEMS_KEY);
    if (gems === null) {
      return 0;
    }
    return parseInt(gems, 10);
  } catch (error) {
    console.error('Error getting gems from AsyncStorage', error);
    return 0;
  }
};

export const setGems = async (gems: number): Promise<void> => {
  try {
    await AsyncStorage.setItem(GEMS_KEY, gems.toString());
  } catch (error) {
    console.error('Error setting gems in AsyncStorage', error);
  }
};

export type HeartRefillInfo = {
  hearts: number;
  maxHearts: number;
  nextRefillMs: number | null;
  fullRefillMs: number | null;
};

export const getHeartRefillInfo = async (): Promise<HeartRefillInfo> => {
  const hearts = await getHearts();
  if (hearts >= MAX_HEARTS) {
    return {
      hearts,
      maxHearts: MAX_HEARTS,
      nextRefillMs: null,
      fullRefillMs: null,
    };
  }

  const timeStr = await AsyncStorage.getItem(HEARTS_TIME_KEY);
  const lastTime = timeStr ? parseInt(timeStr, 10) : Date.now();
  const now = Date.now();
  const elapsed = Math.max(0, now - lastTime);
  const remainder = elapsed % REFILL_INTERVAL_MS;
  const nextRefillMs = Math.max(0, REFILL_INTERVAL_MS - remainder);
  const missing = Math.max(0, MAX_HEARTS - hearts);
  const fullRefillMs = nextRefillMs + Math.max(0, missing - 1) * REFILL_INTERVAL_MS;

  return {
    hearts,
    maxHearts: MAX_HEARTS,
    nextRefillMs,
    fullRefillMs,
  };
};
