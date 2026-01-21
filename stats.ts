
import { AppStats } from './types';

const STATS_KEY = 'lesmateriaal_stats_v1';

const getInitialStats = (): AppStats => ({
  totalVisits: 0,
  uniqueVisitors: 0,
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
  const stats = loadStats();
  stats.totalVisits += 1;

  const visited = sessionStorage.getItem('visited_session');
  if (!visited) {
    stats.uniqueVisitors += 1;
    sessionStorage.setItem('visited_session', 'true');
  }

  saveStats(stats);
  console.log('Pageview geregistreerd. Totaal pageviews:', stats.totalVisits, '| Unieke bezoekers:', stats.uniqueVisitors);
};

export const trackClick = (type: 'topics' | 'lessons' | 'parts', id: string) => {
  const stats = loadStats();
  stats.clicks[type][id] = (stats.clicks[type][id] || 0) + 1;
  saveStats(stats);
};
