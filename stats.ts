
import { AppStats } from './types';

const STATS_KEY = 'lesmateriaal_stats_v1';

const getInitialStats = (): AppStats => ({
  totalVisits: 0,
  clicks: {
    topics: {},
    lessons: {},
    parts: {}
  }
});

export const loadStats = (): AppStats => {
  const stored = localStorage.getItem(STATS_KEY);
  return stored ? JSON.parse(stored) : getInitialStats();
};

export const saveStats = (stats: AppStats) => {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
};

export const trackVisit = () => {
  const visited = sessionStorage.getItem('visited');
  if (!visited) {
    const stats = loadStats();
    stats.totalVisits += 1;
    saveStats(stats);
    sessionStorage.setItem('visited', 'true');
  }
};

export const trackClick = (type: 'topics' | 'lessons' | 'parts', id: string) => {
  const stats = loadStats();
  stats.clicks[type][id] = (stats.clicks[type][id] || 0) + 1;
  saveStats(stats);
};
