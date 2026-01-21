import { AppStats } from './types';
import { supabase } from './supabase-client';

export const loadStats = async (): Promise<AppStats> => {
  try {
    const { data: statsData, error: statsError } = await supabase
      .from('stats')
      .select('*')
      .eq('id', 1)
      .maybeSingle();

    if (statsError) throw statsError;

    const { data: clicksData, error: clicksError } = await supabase
      .from('clicks')
      .select('*');

    if (clicksError) throw clicksError;

    const clicks = {
      topics: {} as Record<string, number>,
      lessons: {} as Record<string, number>,
      parts: {} as Record<string, number>
    };

    if (clicksData) {
      for (const click of clicksData) {
        if (click.item_type === 'topics' || click.item_type === 'lessons' || click.item_type === 'parts') {
          clicks[click.item_type][click.item_id] = click.click_count;
        }
      }
    }

    return {
      totalVisits: statsData?.total_visits || 0,
      uniqueVisitors: statsData?.unique_visitors || 0,
      clicks
    };
  } catch (error) {
    console.error('Error loading stats:', error);
    return {
      totalVisits: 0,
      uniqueVisitors: 0,
      clicks: { topics: {}, lessons: {}, parts: {} }
    };
  }
};

export const trackVisit = async () => {
  try {
    const visited = sessionStorage.getItem('visited_session');
    const isUnique = !visited;

    const { data: currentStats } = await supabase
      .from('stats')
      .select('total_visits, unique_visitors')
      .eq('id', 1)
      .maybeSingle();

    const newTotalVisits = (currentStats?.total_visits || 0) + 1;
    const newUniqueVisitors = (currentStats?.unique_visitors || 0) + (isUnique ? 1 : 0);

    const { error } = await supabase
      .from('stats')
      .update({
        total_visits: newTotalVisits,
        unique_visitors: newUniqueVisitors,
        updated_at: new Date().toISOString()
      })
      .eq('id', 1);

    if (error) throw error;

    if (isUnique) {
      sessionStorage.setItem('visited_session', 'true');
    }

    console.log('Pageview geregistreerd. Totaal pageviews:', newTotalVisits, '| Unieke bezoekers:', newUniqueVisitors);
  } catch (error) {
    console.error('Error tracking visit:', error);
  }
};

export const trackClick = async (type: 'topics' | 'lessons' | 'parts', id: string) => {
  try {
    const { data, error } = await supabase
      .from('clicks')
      .select('click_count')
      .eq('item_type', type)
      .eq('item_id', id)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') throw error;

    const currentCount = data?.click_count || 0;

    const { error: upsertError } = await supabase
      .from('clicks')
      .upsert({
        item_type: type,
        item_id: id,
        click_count: currentCount + 1,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'item_type,item_id'
      });

    if (upsertError) throw upsertError;
  } catch (error) {
    console.error('Error tracking click:', error);
  }
};
