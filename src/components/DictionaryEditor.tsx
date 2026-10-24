import { useState } from 'react';
import { DictionaryEntry } from '../types';

interface DictionaryEditorProps {
  entries: DictionaryEntry[];
  setEntries: (entries: DictionaryEntry[]) => void;
}

export function DictionaryEditor({ entries, setEntries }: DictionaryEditorProps) {
  const [filter, setFilter] = useState('');
  const [newEntry, setNewEntry] = useState({ original: '', correction: '', category: 'General' });
  const [importText, setImportText] = useState('');
  const [showImport, setShowImport] = useState(false);

  const filteredEntries = entries.filter(e =>
    e.original.toLowerCase().includes(filter.toLowerCase()) ||
    e.correction.toLowerCase().includes(filter.toLowerCase()) ||
    e.category.toLowerCase().includes(filter.toLowerCase())
  );

  const addEntry = () => {
    if (!newEntry.original || !newEntry.correction) return;
    const entry: DictionaryEntry = {
      id: Date.now().toString(),
      ...newEntry,
      enabled: true,
    };
    setEntries([...entries, entry]);
    setNewEntry({ original: '', correction: '', category: 'General' });
  };

  const updateEntry = (id: string, updates: Partial<DictionaryEntry>) => {
    setEntries(entries.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const deleteEntry = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  const importEntries = () => {
    const lines = importText.split('\n').filter(l => l.trim());
    const newEntries: DictionaryEntry[] = [];

    for (const line of lines) {
      const parts = line.split(/[=→\t,;]/).map(p => p.trim());
      if (parts.length >= 2) {
        newEntries.push({
          id: Date.now().toString() + Math.random(),
          original: parts[0],
          correction: parts[1],
          enabled: true,
          category: 'Importado',
        });
      }
    }

    setEntries([...entries, ...newEntries]);
    setImportText('');
    setShowImport(false);
  };

  const categories = [...new Set(entries.map(e => e.category))];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">📖 Diccionario de Corrección</h2>
        <p className="text-gray-400">
          Define correcciones automáticas para errores comunes del OCR.
          El diccionario se aplica después de las reglas regex.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <p className="text-2xl font-bold text-emerald-400">{entries.length}</p>
          <p className="text-sm text-gray-400">Entradas totales</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <p className="text-2xl font-bold text-blue-400">{entries.filter(e => e.enabled).length}</p>
          <p className="text-sm text-gray-400">Activas</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <p className="text-2xl font-bold text-purple-400">{categories.length}</p>
          <p className="text-sm text-gray-400">Categorías</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Buscar en diccionario..."
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
        />
        <button
          onClick={() => setShowImport(!showImport)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
        >
          📥 Importar
        </button>
      </div>

      {/* Import Panel */}
      {showImport && (
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 mb-6">
          <h4 className="text-white font-medium mb-2">Importar diccionario</h4>
          <p className="text-sm text-gray-400 mb-2">
            Formato: una entrada por línea. Separadores: = → tab , ;
          </p>
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder={"lñ=la\ne|=el\nc0n=con"}
            className="w-full h-32 bg-gray-900 border border-gray-600 rounded-lg p-3 text-sm font-mono text-gray-300 focus:outline-none focus:border-emerald-500 resize-none"
          />
          <button
            onClick={importEntries}
            className="mt-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm"
          >
            Importar entradas
          </button>
        </div>
      )}

      {/* Add New Entry */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 mb-6">
        <h4 className="text-white font-medium mb-3">Agregar entrada</h4>
        <div className="flex gap-3">
          <input
            type="text"
            value={newEntry.original}
            onChange={(e) => setNewEntry({ ...newEntry, original: e.target.value })}
            placeholder="Texto original (error)"
            className="flex-1 bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm text-red-300 font-mono focus:outline-none focus:border-emerald-500"
          />
          <span className="text-gray-500 self-center">→</span>
          <input
            type="text"
            value={newEntry.correction}
            onChange={(e) => setNewEntry({ ...newEntry, correction: e.target.value })}
            placeholder="Corrección"
            className="flex-1 bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm text-emerald-300 font-mono focus:outline-none focus:border-emerald-500"
          />
          <input
            type="text"
            value={newEntry.category}
            onChange={(e) => setNewEntry({ ...newEntry, category: e.target.value })}
            placeholder="Categoría"
            className="w-32 bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-emerald-500"
          />
          <button
            onClick={addEntry}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors"
          >
            +
          </button>
        </div>
      </div>

      {/* Entries Table */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-3 bg-gray-750 border-b border-gray-700 text-xs text-gray-400 font-medium uppercase">
          <div className="col-span-1">Act.</div>
          <div className="col-span-3">Original</div>
          <div className="col-span-3">Corrección</div>
          <div className="col-span-3">Categoría</div>
          <div className="col-span-2">Acciones</div>
        </div>
        <div className="max-h-96 overflow-auto">
          {filteredEntries.map((entry) => (
            <div key={entry.id} className="grid grid-cols-12 gap-4 p-3 border-b border-gray-700/50 items-center hover:bg-gray-700/30">
              <div className="col-span-1">
                <input
                  type="checkbox"
                  checked={entry.enabled}
                  onChange={(e) => updateEntry(entry.id, { enabled: e.target.checked })}
                  className="w-4 h-4 accent-emerald-500"
                />
              </div>
              <div className="col-span-3 font-mono text-sm text-red-300">{entry.original}</div>
              <div className="col-span-3 font-mono text-sm text-emerald-300">{entry.correction}</div>
              <div className="col-span-3">
                <span className="px-2 py-0.5 bg-gray-700 rounded text-xs text-gray-300">{entry.category}</span>
              </div>
              <div className="col-span-2">
                <button
                  onClick={() => deleteEntry(entry.id)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
