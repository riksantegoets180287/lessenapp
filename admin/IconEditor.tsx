
import React from 'react';
import { IconData } from '../types';
import * as Icons from 'lucide-react';
import { Trash2, Upload } from 'lucide-react';

interface IconEditorProps {
  value?: IconData;
  onChange: (data: IconData) => void;
}

const LUCIDE_SELECTION = [
  'BookOpen', 'Layers', 'NotebookText', 'GraduationCap', 'ListChecks', 
  'Presentation', 'Shield', 'HelpCircle', 'Info', 'MessageCircle', 
  'Globe', 'Settings', 'FileText', 'Cpu', 'Zap', 'Monitor', 'MousePointer2', 
  'Keyboard', 'HardDrive', 'Wifi', 'Cloud', 'Lock', 'Unlock', 'Eye', 
  'Search', 'Mail', 'Bell', 'Calendar', 'Camera', 'Video', 'Music', 
  'Image', 'File', 'Folder', 'Share2', 'Link', 'CheckCircle2', 'AlertCircle'
];

const IconEditor: React.FC<IconEditorProps> = ({ value, onChange }) => {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 300 * 1024) {
      alert("Dit bestand is te groot. Kies een kleinere afbeelding (max 300KB).");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      onChange({
        kind: 'image',
        dataUrl: reader.result as string
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-xl">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-white rounded-xl border-2 border-gray-200 flex items-center justify-center overflow-hidden">
          {value?.kind === 'image' && value.dataUrl ? (
            <img src={value.dataUrl} className="w-full h-full object-cover" alt="Preview" />
          ) : value?.kind === 'lucide' && value.name ? (
            React.createElement((Icons as any)[value.name], { size: 32, className: 'text-indigo-900' })
          ) : (
            <span className="text-gray-300">Geen</span>
          )}
        </div>
        <div>
          <h4 className="font-bold text-sm">Pictogram</h4>
          <button 
            onClick={() => onChange({ kind: 'lucide', name: 'BookOpen' })}
            className="text-indigo-600 text-xs hover:underline flex items-center gap-1"
          >
            <Trash2 size={12} /> Herstel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-5 sm:grid-cols-8 gap-2 max-h-48 overflow-y-auto p-1 border rounded-lg bg-white no-scrollbar">
        {LUCIDE_SELECTION.map(name => (
          <button
            key={name}
            type="button"
            onClick={() => onChange({ kind: 'lucide', name })}
            className={`p-2 rounded-lg border-2 transition-all flex items-center justify-center ${value?.kind === 'lucide' && value.name === name ? 'border-indigo-600 bg-indigo-50' : 'border-transparent bg-white hover:border-gray-200'}`}
            title={name}
          >
            {React.createElement((Icons as any)[name], { size: 20 })}
          </button>
        ))}
      </div>

      <div className="relative">
        <input 
          type="file" 
          accept="image/png, image/jpeg, image/svg+xml, image/webp"
          onChange={handleFileUpload}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        <div className="w-full border-2 border-dashed border-gray-300 rounded-lg p-3 text-center text-sm text-gray-500 flex items-center justify-center gap-2 bg-white">
          <Upload size={16} />
          Upload eigen afbeelding
        </div>
      </div>
    </div>
  );
};

export default IconEditor;
