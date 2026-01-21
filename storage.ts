
import { Topic, IconData } from './types';
import { supabase } from './supabase-client';

interface DbTopic {
  id: string;
  title: string;
  icon_kind: string | null;
  icon_name: string | null;
  icon_data_url: string | null;
  is_enabled: boolean;
  date_available: string | null;
  order: number;
}

interface DbLesson {
  id: string;
  topic_id: string;
  title: string;
  icon_kind: string | null;
  icon_name: string | null;
  icon_data_url: string | null;
  learning_goals: string;
  start_url: string;
  info_url: string | null;
  is_enabled: boolean;
  date_available: string | null;
  order: number;
}

interface DbPart {
  id: string;
  lesson_id: string;
  title: string;
  description: string | null;
  icon_kind: string | null;
  icon_name: string | null;
  icon_data_url: string | null;
  learning_goals: string;
  start_url: string;
  info_url: string | null;
  is_enabled: boolean;
  date_available: string | null;
  order: number;
}

const mapIcon = (iconKind: string | null, iconName: string | null, iconDataUrl: string | null): IconData | undefined => {
  if (!iconKind) return undefined;
  return {
    kind: iconKind as 'lucide' | 'image',
    name: iconName || undefined,
    dataUrl: iconDataUrl || undefined
  };
};

export const loadContent = async (): Promise<Topic[]> => {
  try {
    const { data: topicsData, error: topicsError } = await supabase
      .from('topics')
      .select('*')
      .order('order');

    if (topicsError) throw topicsError;

    const { data: lessonsData, error: lessonsError } = await supabase
      .from('lessons')
      .select('*')
      .order('order');

    if (lessonsError) throw lessonsError;

    const { data: partsData, error: partsError } = await supabase
      .from('parts')
      .select('*')
      .order('order');

    if (partsError) throw partsError;

    const topics: Topic[] = (topicsData as DbTopic[]).map(t => ({
      id: t.id,
      title: t.title,
      icon: mapIcon(t.icon_kind, t.icon_name, t.icon_data_url),
      isEnabled: t.is_enabled,
      dateAvailable: t.date_available || undefined,
      order: t.order,
      lessons: (lessonsData as DbLesson[])
        .filter(l => l.topic_id === t.id)
        .map(l => ({
          id: l.id,
          title: l.title,
          icon: mapIcon(l.icon_kind, l.icon_name, l.icon_data_url),
          learningGoals: l.learning_goals,
          startUrl: l.start_url,
          infoUrl: l.info_url || undefined,
          isEnabled: l.is_enabled,
          dateAvailable: l.date_available || undefined,
          order: l.order,
          parts: (partsData as DbPart[])
            .filter(p => p.lesson_id === l.id)
            .map(p => ({
              id: p.id,
              title: p.title,
              description: p.description || undefined,
              icon: mapIcon(p.icon_kind, p.icon_name, p.icon_data_url),
              learningGoals: p.learning_goals,
              startUrl: p.start_url,
              infoUrl: p.info_url || undefined,
              isEnabled: p.is_enabled,
              dateAvailable: p.date_available || undefined,
              order: p.order
            }))
        }))
    }));

    return topics;
  } catch (error) {
    console.error('Error loading content:', error);
    return [];
  }
};

export const saveContent = async (content: Topic[]): Promise<void> => {
  try {
    const currentTopicIds = content.map(t => t.id);
    const currentLessonIds = content.flatMap(t => t.lessons.map(l => l.id));
    const currentPartIds = content.flatMap(t => t.lessons.flatMap(l => l.parts.map(p => p.id)));

    const { data: existingTopics } = await supabase.from('topics').select('id');
    const { data: existingLessons } = await supabase.from('lessons').select('id');
    const { data: existingParts } = await supabase.from('parts').select('id');

    const topicsToDelete = (existingTopics || []).filter((t: any) => !currentTopicIds.includes(t.id)).map((t: any) => t.id);
    const lessonsToDelete = (existingLessons || []).filter((l: any) => !currentLessonIds.includes(l.id)).map((l: any) => l.id);
    const partsToDelete = (existingParts || []).filter((p: any) => !currentPartIds.includes(p.id)).map((p: any) => p.id);

    if (partsToDelete.length > 0) {
      const { error } = await supabase.from('parts').delete().in('id', partsToDelete);
      if (error) throw error;
    }

    if (lessonsToDelete.length > 0) {
      const { error } = await supabase.from('lessons').delete().in('id', lessonsToDelete);
      if (error) throw error;
    }

    if (topicsToDelete.length > 0) {
      const { error } = await supabase.from('topics').delete().in('id', topicsToDelete);
      if (error) throw error;
    }

    for (const topic of content) {
      const { error: topicError } = await supabase
        .from('topics')
        .upsert({
          id: topic.id,
          title: topic.title,
          icon_kind: topic.icon?.kind || null,
          icon_name: topic.icon?.name || null,
          icon_data_url: topic.icon?.dataUrl || null,
          is_enabled: topic.isEnabled,
          date_available: topic.dateAvailable || null,
          order: topic.order,
          updated_at: new Date().toISOString()
        });

      if (topicError) throw topicError;

      for (const lesson of topic.lessons) {
        const { error: lessonError } = await supabase
          .from('lessons')
          .upsert({
            id: lesson.id,
            topic_id: topic.id,
            title: lesson.title,
            icon_kind: lesson.icon?.kind || null,
            icon_name: lesson.icon?.name || null,
            icon_data_url: lesson.icon?.dataUrl || null,
            learning_goals: lesson.learningGoals,
            start_url: lesson.startUrl,
            info_url: lesson.infoUrl || null,
            is_enabled: lesson.isEnabled,
            date_available: lesson.dateAvailable || null,
            order: lesson.order,
            updated_at: new Date().toISOString()
          });

        if (lessonError) throw lessonError;

        for (const part of lesson.parts) {
          const { error: partError } = await supabase
            .from('parts')
            .upsert({
              id: part.id,
              lesson_id: lesson.id,
              title: part.title,
              description: part.description || null,
              icon_kind: part.icon?.kind || null,
              icon_name: part.icon?.name || null,
              icon_data_url: part.icon?.dataUrl || null,
              learning_goals: part.learningGoals,
              start_url: part.startUrl,
              info_url: part.infoUrl || null,
              is_enabled: part.isEnabled,
              date_available: part.dateAvailable || null,
              order: part.order,
              updated_at: new Date().toISOString()
            });

          if (partError) throw partError;
        }
      }
    }
  } catch (error) {
    console.error('Error saving content:', error);
    throw error;
  }
};
