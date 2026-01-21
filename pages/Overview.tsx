
import React, { useState, useEffect } from 'react';
import { loadContent } from '../storage';
import { Topic, Lesson, Part } from '../types';
import { trackVisit, trackClick, loadStats } from '../stats';
import Breadcrumb from '../components/Breadcrumb';
import Tile from '../components/Tile';
import IconView from '../components/IconView';
import Modal from '../components/Modal';
import { ArrowRight, HelpCircle, PlayCircle, Info, CalendarClock } from 'lucide-react';

const Overview: React.FC = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [currentTopic, setCurrentTopic] = useState<Topic | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [modalContent, setModalContent] = useState<{ title: string; body: React.ReactNode } | null>(null);
  const [visitCount, setVisitCount] = useState<number>(0);

  useEffect(() => {
    const initializeData = async () => {
      const content = await loadContent();
      setTopics(content);

      await trackVisit();

      const stats = await loadStats();
      setVisitCount(stats.totalVisits);
    };

    initializeData();
  }, []);

  useEffect(() => {
    const refreshData = async () => {
      const content = await loadContent();
      setTopics(content);

      const stats = await loadStats();
      setVisitCount(stats.totalVisits);
    };

    const handleFocus = () => {
      refreshData();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const [year, month, day] = parts;
    return `${day}-${month}-${year}`;
  };

  const handleTopicClick = (topic: Topic) => {
    if (!topic.isEnabled) return;
    trackClick('topics', topic.id);
    setCurrentTopic(topic);
  };

  const handleLessonClick = (lesson: Lesson) => {
    if (!lesson.isEnabled) return;
    trackClick('lessons', lesson.id);
    setCurrentLesson(lesson);
  };

  const goBack = () => {
    if (currentLesson) setCurrentLesson(null);
    else if (currentTopic) setCurrentTopic(null);
  };

  const showInfoModal = (p: Part) => {
    setModalContent({
      title: 'Docentenhandleiding',
      body: (
        <div className="space-y-4">
          <p className="font-semibold text-indigo-900">
            Jij wilt de docentenhandleiding bekijken. Hiervoor heb je een wachtwoord nodig.
          </p>
          <button 
            onClick={() => {
              if (p.infoUrl) window.open(p.infoUrl, '_blank');
              setModalContent(null);
            }}
            className="w-full bg-[#20126E] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-800 transition-colors"
          >
            <Info size={20} />
            Ga naar de docentenhandleiding
          </button>
        </div>
      )
    });
  };

  const breadcrumbPath = [];
  if (currentTopic) breadcrumbPath.push(currentTopic.title);
  if (currentLesson) breadcrumbPath.push(currentLesson.title);

  const renderTopics = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {topics.sort((a,b) => a.order - b.order).map((t, idx) => (
        <Tile 
          key={t.id} 
          isDisabled={!t.isEnabled} 
          gradientIndex={idx}
          onClick={() => handleTopicClick(t)}
        >
          <div className="mb-4 bg-white/20 w-12 h-12 flex items-center justify-center rounded-xl p-2">
            <IconView icon={t.icon} color="white" className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold mb-auto">{t.title}</h3>
          
          <div className="mt-4">
            {!t.isEnabled && t.dateAvailable ? (
              <div className="flex items-center gap-2 text-xs font-semibold bg-black/20 p-2 rounded-lg">
                <CalendarClock size={14} />
                <span>Beschikbaar vanaf: {formatDate(t.dateAvailable)}</span>
              </div>
            ) : (
              <div className="bg-white text-indigo-900 font-bold py-2 px-4 rounded-lg flex items-center justify-between group-hover:bg-gray-50 transition-colors">
                <span className="text-sm">Ga naar de lessen</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </div>
            )}
          </div>
        </Tile>
      ))}
    </div>
  );

  const renderLessons = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {currentTopic?.lessons.sort((a,b) => a.order - b.order).map((l, idx) => (
        <Tile key={l.id} isDisabled={!l.isEnabled} gradientIndex={idx + 2}>
          <div className="mb-4 bg-white/20 w-12 h-12 flex items-center justify-center rounded-xl p-2">
            <IconView icon={l.icon} color="white" className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold mb-4">{l.title}</h3>
          
          <div className="flex flex-col gap-2 mt-auto">
            <button 
              disabled={!l.isEnabled}
              onClick={() => setModalContent({ title: 'Wat ga je leren?', body: <div className="whitespace-pre-wrap">{l.learningGoals}</div> })}
              className="flex items-center justify-center gap-2 bg-white text-indigo-900 font-bold py-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
            >
              <HelpCircle size={18} />
              Wat ga je leren?
            </button>
            <button 
              disabled={!l.isEnabled}
              onClick={() => handleLessonClick(l)}
              className="flex items-center justify-center gap-2 bg-white text-indigo-900 font-bold py-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
            >
              <PlayCircle size={18} />
              Start de les
            </button>
          </div>

          {!l.isEnabled && l.dateAvailable && (
            <div className="flex items-center gap-2 text-xs font-semibold bg-black/20 p-2 rounded-lg mt-4">
              <CalendarClock size={14} />
              <span>Verwacht op: {formatDate(l.dateAvailable)}</span>
            </div>
          )}
        </Tile>
      ))}
    </div>
  );

  const renderParts = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {currentLesson?.parts.sort((a,b) => a.order - b.order).map((p, idx) => (
        <Tile 
          key={p.id} 
          isDisabled={!p.isEnabled} 
          gradientIndex={idx + 4}
        >
          <div className="mb-4 bg-white/20 w-12 h-12 flex items-center justify-center rounded-xl p-2">
            <IconView icon={p.icon || { kind: 'lucide', name: 'ListChecks' }} color="white" className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold mb-2">{p.title}</h3>
          {p.description && <p className="text-sm opacity-90 mb-4">{p.description}</p>}
          
          <div className="flex flex-col gap-2 mt-auto">
            <button 
              disabled={!p.isEnabled}
              onClick={() => {
                trackClick('parts', p.id);
                setModalContent({ title: p.title, body: <div className="whitespace-pre-wrap">{p.learningGoals}</div> });
              }}
              className="flex items-center justify-center gap-2 bg-white text-indigo-900 font-bold py-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors text-xs"
            >
              <HelpCircle size={14} />
              Wat ga je leren?
            </button>
            <button 
              disabled={!p.isEnabled}
              onClick={() => {
                trackClick('parts', p.id);
                window.open(p.startUrl, '_blank', 'noreferrer');
              }}
              className="flex items-center justify-center gap-2 bg-white text-indigo-900 font-bold py-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors text-xs"
            >
              <PlayCircle size={14} />
              Start het onderdeel
            </button>

            {p.infoUrl && (
              <button 
                disabled={!p.isEnabled}
                onClick={() => showInfoModal(p)}
                className="flex items-center justify-center gap-2 bg-white text-indigo-900 font-bold py-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors text-xs"
              >
                <Info size={14} />
                Docentenhandleiding
              </button>
            )}
          </div>

          {!p.isEnabled && p.dateAvailable && (
            <div className="flex items-center gap-2 text-xs font-semibold bg-black/20 p-2 rounded-lg mt-4">
              <CalendarClock size={14} />
              <span>Beschikbaar: {formatDate(p.dateAvailable)}</span>
            </div>
          )}
        </Tile>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col h-screen max-h-screen">
      <header className="bg-[#20126E] text-white p-4 shadow-md shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Lessen digitale vaardigheden</h1>
          <div className="text-[10px] text-white/40 font-mono">v1.1.1</div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar p-6 bg-[#F4F4F4]">
        <div className="max-w-7xl mx-auto">
          <Breadcrumb 
            path={breadcrumbPath} 
            onBack={goBack} 
            onNavigate={(idx) => {
              if (idx === 0) setCurrentLesson(null);
            }} 
          />
          
          {!currentTopic && renderTopics()}
          {currentTopic && !currentLesson && renderLessons()}
          {currentLesson && renderParts()}

          {(!currentTopic && topics.length === 0) && (
            <div className="text-center py-20 opacity-40">
              <HelpCircle size={48} className="mx-auto mb-4" />
              <p>Geen onderwerpen gevonden.</p>
            </div>
          )}
        </div>
      </main>

      {!currentTopic && (
        <footer className="bg-white/50 border-t border-gray-200 py-2 px-4 text-center text-[10px] text-gray-500 shrink-0">
          Totaal aantal bezoekers: {visitCount}
        </footer>
      )}

      <Modal 
        isOpen={!!modalContent} 
        onClose={() => setModalContent(null)} 
        title={modalContent?.title || ""}
      >
        {modalContent?.body}
      </Modal>
    </div>
  );
};

export default Overview;
