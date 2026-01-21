
import React, { useState, useEffect } from 'react';
import { Topic, Lesson, Part, AppStats } from '../types';
import { loadContent, saveContent } from '../storage';
import { loadStats } from '../stats';
import IconView from '../components/IconView';
import IconEditor from '../admin/IconEditor';
import { 
  BarChart3, Plus, Trash2, ArrowUp, ArrowDown, LogOut, 
  Settings, Layout, Book, List, Save, X, Power
} from 'lucide-react';

const AdminDashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [stats, setStats] = useState<AppStats | null>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'stats'>('content');
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [editingLesson, setEditingLesson] = useState<{ topicId: string, lesson: Lesson } | null>(null);
  const [editingPart, setEditingPart] = useState<{ topicId: string, lessonId: string, part: Part } | null>(null);

  useEffect(() => {
    setTopics(loadContent());
    setStats(loadStats());
  }, []);

  const saveAll = (newTopics: Topic[]) => {
    setTopics(newTopics);
    saveContent(newTopics);
  };

  // --- CRUD TOPICS ---
  const addTopic = () => {
    const newTopic: Topic = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'Nieuw Onderwerp',
      isEnabled: true,
      order: topics.length + 1,
      lessons: [],
      icon: { kind: 'lucide', name: 'BookOpen' }
    };
    saveAll([...topics, newTopic]);
    setEditingTopic(newTopic);
  };

  const deleteTopic = (id: string) => {
    if (confirm('Onderwerp verwijderen?')) {
      saveAll(topics.filter(t => t.id !== id));
    }
  };

  const moveTopic = (idx: number, dir: number) => {
    const newTopics = [...topics];
    const target = idx + dir;
    if (target < 0 || target >= newTopics.length) return;
    [newTopics[idx], newTopics[target]] = [newTopics[target], newTopics[idx]];
    newTopics.forEach((t, i) => t.order = i + 1);
    saveAll(newTopics);
  };

  // --- CRUD LESSONS ---
  const addLesson = (topicId: string) => {
    const newLesson: Lesson = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'Nieuwe Les',
      isEnabled: true,
      order: 1,
      learningGoals: '',
      startUrl: '',
      parts: [],
      icon: { kind: 'lucide', name: 'NotebookText' }
    };
    const newTopics = topics.map(t => {
      if (t.id === topicId) {
        return { ...t, lessons: [...t.lessons, { ...newLesson, order: t.lessons.length + 1 }] };
      }
      return t;
    });
    saveAll(newTopics);
    setEditingLesson({ topicId, lesson: newLesson });
  };

  // --- CRUD PARTS ---
  const addPart = (topicId: string, lessonId: string) => {
    const newPart: Part = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'Nieuw Onderdeel',
      description: '',
      learningGoals: '',
      startUrl: '',
      infoUrl: '',
      isEnabled: true,
      order: 1,
      icon: { kind: 'lucide', name: 'ListChecks' }
    };
    const newTopics = topics.map(t => {
      if (t.id === topicId) {
        return {
          ...t,
          lessons: t.lessons.map(l => {
            if (l.id === lessonId) {
              return { ...l, parts: [...l.parts, { ...newPart, order: l.parts.length + 1 }] };
            }
            return l;
          })
        };
      }
      return t;
    });
    saveAll(newTopics);
    setEditingPart({ topicId, lessonId, part: newPart });
  };

  const renderStats = () => {
    if (!stats) return null;
    const topicClickValues = Object.values(stats.clicks.topics) as number[];
    const maxTopicClicks = Math.max(...topicClickValues, 1);
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-gray-500 font-bold uppercase text-xs tracking-wider mb-1">Totaal Bezoekers</p>
            <h4 className="text-4xl font-bold text-indigo-900">{stats.totalVisits}</h4>
          </div>
          <BarChart3 size={48} className="text-indigo-200" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h5 className="font-bold mb-4 flex items-center gap-2">
              <Layout size={18} className="text-indigo-600" />
              Clicks per Onderwerp
            </h5>
            <div className="space-y-3">
              {topics.map(t => {
                const count = stats.clicks.topics[t.id] || 0;
                return (
                  <div key={t.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{t.title}</span>
                      <span className="font-bold">{count}</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 h-full transition-all" style={{ width: `${(count/maxTopicClicks)*100}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h5 className="font-bold mb-4 flex items-center gap-2">
              <Book size={18} className="text-indigo-600" />
              Populairste Lessen
            </h5>
            <div className="space-y-3">
              {topics.flatMap(t => t.lessons).sort((a,b) => (stats.clicks.lessons[b.id] || 0) - (stats.clicks.lessons[a.id] || 0)).slice(0, 5).map(l => {
                const count = stats.clicks.lessons[l.id] || 0;
                return (
                  <div key={l.id} className="flex justify-between text-sm border-b border-gray-50 pb-2">
                    <span className="truncate">{l.title}</span>
                    <span className="font-bold">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContentManager = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-indigo-900">Structuur Beheer</h3>
        <button 
          onClick={addTopic}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-colors"
        >
          <Plus size={18} /> Nieuw Onderwerp
        </button>
      </div>
      <div className="space-y-4">
        {topics.sort((a,b) => a.order - b.order).map((t, idx) => (
          <div key={t.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 flex items-center gap-4 bg-gray-50/50">
              <div className="flex flex-col gap-1">
                <button onClick={() => moveTopic(idx, -1)} disabled={idx === 0} className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"><ArrowUp size={14}/></button>
                <button onClick={() => moveTopic(idx, 1)} disabled={idx === topics.length - 1} className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"><ArrowDown size={14}/></button>
              </div>
              <div className="w-10 h-10 bg-white border rounded-lg flex items-center justify-center overflow-hidden">
                <IconView icon={t.icon} className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-indigo-900">{t.title} {!t.isEnabled && <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded ml-2 uppercase">Uit</span>}</h4>
                <p className="text-xs text-gray-500">{t.lessons.length} Lessen</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditingTopic(t)} className="p-2 text-gray-400 hover:text-indigo-600"><Settings size={20}/></button>
                <button onClick={() => deleteTopic(t.id)} className="p-2 text-gray-400 hover:text-red-600"><Trash2 size={20}/></button>
              </div>
            </div>
            <div className="p-4 pl-12 space-y-2 border-t border-gray-100">
              {t.lessons.sort((a,b) => a.order - b.order).map(l => (
                <div key={l.id} className="flex items-center justify-between p-2 rounded-lg bg-white border border-gray-100 text-sm">
                  <div className="flex items-center gap-3">
                    <IconView icon={l.icon} className="w-4 h-4 text-gray-400" />
                    <span className="font-semibold">{l.title} {!l.isEnabled && <span className="text-[9px] text-red-500 uppercase ml-1">(uit)</span>}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingLesson({ topicId: t.id, lesson: l })} className="p-1.5 hover:bg-gray-100 rounded text-gray-400"><Settings size={16} /></button>
                  </div>
                </div>
              ))}
              <button onClick={() => addLesson(t.id)} className="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-xs font-bold text-gray-400 hover:border-indigo-300 hover:text-indigo-600 transition-all flex items-center justify-center gap-1">
                <Plus size={14} /> Les toevoegen
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col overflow-hidden">
      <header className="bg-white border-b border-gray-200 p-4 shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#20126E] p-2 rounded-xl text-white">
              <Settings size={24} />
            </div>
            <h1 className="text-xl font-bold text-indigo-900 hidden sm:block">Admin Paneel</h1>
          </div>
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button onClick={() => setActiveTab('content')} className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'content' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500'}`}>Inhoud</button>
            <button onClick={() => setActiveTab('stats')} className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'stats' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500'}`}>Stats</button>
          </div>
          <button onClick={onLogout} className="flex items-center gap-2 text-gray-500 hover:text-red-600 font-bold transition-colors">
            <span className="hidden sm:inline">Uitloggen</span>
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 no-scrollbar">
        <div className="max-w-4xl mx-auto">
          {activeTab === 'content' ? renderContentManager() : renderStats()}
        </div>
      </main>

      {/* TOPIC EDITOR MODAL */}
      {editingTopic && (
        <div className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-indigo-900 text-white">
              <h3 className="text-xl font-bold">Onderwerp bewerken</h3>
              <button onClick={() => setEditingTopic(null)}><X /></button>
            </div>
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto no-scrollbar">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Status</label>
                  <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
                    <Power size={14} className={editingTopic.isEnabled ? 'text-green-500' : 'text-red-500'} />
                    <span className="text-xs font-bold flex-1">{editingTopic.isEnabled ? 'Actief' : 'Uitgeschakeld'}</span>
                    <input type="checkbox" checked={editingTopic.isEnabled} onChange={e => setEditingTopic({...editingTopic, isEnabled: e.target.checked})} className="w-4 h-4" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Beschikbaar op</label>
                  <input type="date" value={editingTopic.dateAvailable || ''} onChange={e => setEditingTopic({...editingTopic, dateAvailable: e.target.value})} className="w-full p-2 text-xs border border-gray-200 rounded-lg outline-none" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase">Titel</label>
                <input type="text" value={editingTopic.title} onChange={e => setEditingTopic({...editingTopic, title: e.target.value})} className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-indigo-600" />
              </div>
              <IconEditor value={editingTopic.icon} onChange={icon => setEditingTopic({...editingTopic, icon})} />
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-3">
               <button onClick={() => {
                  saveAll(topics.map(t => t.id === editingTopic.id ? editingTopic : t));
                  setEditingTopic(null);
                }} className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"><Save size={18} /> Opslaan</button>
            </div>
          </div>
        </div>
      )}

      {/* LESSON EDITOR MODAL */}
      {editingLesson && (
        <div className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
             <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-indigo-900 text-white">
              <h3 className="text-xl font-bold">Les bewerken</h3>
              <button onClick={() => setEditingLesson(null)}><X /></button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto no-scrollbar">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Status</label>
                  <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
                    <Power size={14} className={editingLesson.lesson.isEnabled ? 'text-green-500' : 'text-red-500'} />
                    <span className="text-xs font-bold flex-1">{editingLesson.lesson.isEnabled ? 'Actief' : 'Uit'}</span>
                    <input type="checkbox" checked={editingLesson.lesson.isEnabled} onChange={e => setEditingLesson({...editingLesson, lesson: {...editingLesson.lesson, isEnabled: e.target.checked}})} className="w-4 h-4" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Datum</label>
                  <input type="date" value={editingLesson.lesson.dateAvailable || ''} onChange={e => setEditingLesson({...editingLesson, lesson: {...editingLesson.lesson, dateAvailable: e.target.value}})} className="w-full p-2 text-xs border border-gray-200 rounded-lg" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase">Titel</label>
                <input type="text" value={editingLesson.lesson.title} onChange={e => setEditingLesson({...editingLesson, lesson: {...editingLesson.lesson, title: e.target.value}})} className="w-full p-3 rounded-xl border border-gray-200" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase">Leerdoelen (Wat ga je leren?)</label>
                <textarea value={editingLesson.lesson.learningGoals} onChange={e => setEditingLesson({...editingLesson, lesson: {...editingLesson.lesson, learningGoals: e.target.value}})} className="w-full p-3 rounded-xl border border-gray-200 min-h-[100px]" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase">Start URL</label>
                <input type="text" value={editingLesson.lesson.startUrl} onChange={e => setEditingLesson({...editingLesson, lesson: {...editingLesson.lesson, startUrl: e.target.value}})} className="w-full p-3 rounded-xl border border-gray-200" />
              </div>
              <div className="bg-indigo-50 p-4 rounded-xl space-y-3">
                 <div className="flex justify-between items-center">
                    <h5 className="font-bold text-indigo-900 flex items-center gap-2"><List size={16}/> Onderdelen</h5>
                    <button onClick={() => addPart(editingLesson.topicId, editingLesson.lesson.id)} className="bg-indigo-600 text-white p-1 rounded hover:bg-indigo-700"><Plus size={14}/></button>
                 </div>
                 <div className="space-y-2">
                    {editingLesson.lesson.parts.sort((a,b)=>a.order-b.order).map(p => (
                       <div key={p.id} className="flex items-center justify-between p-2 bg-white rounded border border-indigo-100">
                          <span className="text-xs font-semibold truncate flex-1">{p.title} {!p.isEnabled && '(uit)'}</span>
                          <div className="flex gap-1">
                             <button onClick={() => setEditingPart({ topicId: editingLesson.topicId, lessonId: editingLesson.lesson.id, part: p })} className="p-1 text-gray-400 hover:text-indigo-600"><Settings size={14}/></button>
                             <button onClick={() => {
                                if(!confirm('Verwijderen?')) return;
                                const newLesson = {...editingLesson.lesson, parts: editingLesson.lesson.parts.filter(x => x.id !== p.id)};
                                setEditingLesson({...editingLesson, lesson: newLesson});
                             }} className="p-1 text-gray-400 hover:text-red-500"><Trash2 size={14}/></button>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
              <IconEditor value={editingLesson.lesson.icon} onChange={icon => setEditingLesson({...editingLesson, lesson: {...editingLesson.lesson, icon}})} />
            </div>
            <div className="p-4 bg-gray-50 flex gap-2">
               <button onClick={() => {
                  const newTopics = topics.map(t => {
                    if (t.id === editingLesson.topicId) {
                      return { ...t, lessons: t.lessons.map(l => l.id === editingLesson.lesson.id ? editingLesson.lesson : l) };
                    }
                    return t;
                  });
                  saveAll(newTopics);
                  setEditingLesson(null);
                }} className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"><Save size={18} /> Opslaan</button>
            </div>
          </div>
        </div>
      )}

      {/* PART EDITOR MODAL */}
      {editingPart && (
        <div className="fixed inset-0 z-[400] bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95">
             <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-indigo-900 text-white">
              <h3 className="font-bold">Onderdeel bewerken</h3>
              <button onClick={() => setEditingPart(null)}><X size={20}/></button>
            </div>
            <div className="p-5 space-y-4 max-h-[65vh] overflow-y-auto no-scrollbar">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Status</label>
                  <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
                    <Power size={14} className={editingPart.part.isEnabled ? 'text-green-500' : 'text-red-500'} />
                    <span className="text-xs font-bold flex-1">{editingPart.part.isEnabled ? 'Aan' : 'Uit'}</span>
                    <input type="checkbox" checked={editingPart.part.isEnabled} onChange={e => setEditingPart({...editingPart, part: {...editingPart.part, isEnabled: e.target.checked}})} className="w-4 h-4" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Datum</label>
                  <input type="date" value={editingPart.part.dateAvailable || ''} onChange={e => setEditingPart({...editingPart, part: {...editingPart.part, dateAvailable: e.target.value}})} className="w-full p-2 text-xs border border-gray-200 rounded-lg" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Titel</label>
                <input type="text" value={editingPart.part.title} onChange={e => setEditingPart({...editingPart, part: {...editingPart.part, title: e.target.value}})} className="w-full p-2 border border-gray-200 rounded-lg"/>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Leerdoelen (Wat ga je leren?)</label>
                <textarea value={editingPart.part.learningGoals} onChange={e => setEditingPart({...editingPart, part: {...editingPart.part, learningGoals: e.target.value}})} className="w-full p-2 border border-gray-200 rounded-lg min-h-[60px]"/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Start URL</label>
                  <input type="text" value={editingPart.part.startUrl} onChange={e => setEditingPart({...editingPart, part: {...editingPart.part, startUrl: e.target.value}})} className="w-full p-2 border border-gray-200 rounded-lg"/>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Info URL</label>
                  <input type="text" value={editingPart.part.infoUrl || ''} onChange={e => setEditingPart({...editingPart, part: {...editingPart.part, infoUrl: e.target.value}})} className="w-full p-2 border border-gray-200 rounded-lg"/>
                </div>
              </div>
              <IconEditor value={editingPart.part.icon} onChange={icon => setEditingPart({...editingPart, part: {...editingPart.part, icon}})} />
            </div>
            <div className="p-4 bg-gray-50">
               <button onClick={() => {
                  const updatedPart = editingPart.part;
                  const newTopics = topics.map(t => {
                    if (t.id === editingPart.topicId) {
                      return {
                        ...t,
                        lessons: t.lessons.map(l => {
                          if (l.id === editingPart.lessonId) {
                            return { ...l, parts: l.parts.map(p => p.id === updatedPart.id ? updatedPart : p) };
                          }
                          return l;
                        })
                      };
                    }
                    return t;
                  });
                  if (editingLesson) {
                    const updatedLesson = newTopics.find(t=>t.id===editingPart.topicId)?.lessons.find(l=>l.id===editingPart.lessonId);
                    if (updatedLesson) setEditingLesson({...editingLesson, lesson: updatedLesson});
                  }
                  saveAll(newTopics);
                  setEditingPart(null);
                }} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"><Save size={16} /> Wijzigingen opslaan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
