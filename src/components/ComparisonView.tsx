import { useState } from 'react';
import { PageData } from '../types';

interface ComparisonViewProps {
  pages: PageData[];
}

export function ComparisonView({ pages }: ComparisonViewProps) {
  const [selectedPage, setSelectedPage] = useState(0);
  const [viewMode, setViewMode] = useState<'side-by-side' | 'overlay' | 'diff'>('side-by-side');
  const [editedText, setEditedText] = useState('');

  const currentPage = pages[selectedPage];

  const handlePageSelect = (idx: number) => {
    setSelectedPage(idx);
    if (pages[idx]) {
      setEditedText(pages[idx].processedText);
    }
  };

  // Simple diff visualization
  const getDiff = (original: string, processed: string) => {
    const origWords = original.split(/\s+/);
    const procWords = processed.split(/\s+/);

    return procWords.map((word, i) => {
      if (origWords[i] !== word) {
        return `<mark class="bg-emerald-500/30 text-emerald-200 px-0.5 rounded">${word}</mark>`;
      }
      return word;
    }).join(' ');
  };

  return (
    <div className="max-w-7xl mx-auto h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">🔀 Vista de Comparación</h2>
        <p className="text-gray-400">
          Compara el documento original con el texto procesado. Puedes editar directamente el texto procesado.
        </p>
      </div>

      {pages.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <p className="text-4xl mb-4">📄</p>
            <p>No hay páginas cargadas. Ve a "Cargar PDF" para comenzar.</p>
          </div>
        </div>
      ) : (
        <>
          {/* Controls */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => selectedPage > 0 && handlePageSelect(selectedPage - 1)}
                disabled={selectedPage === 0}
                className="px-3 py-1.5 bg-gray-700 rounded-lg text-sm text-gray-300 hover:bg-gray-600 disabled:opacity-30"
              >
                ← Anterior
              </button>
              <span className="text-sm text-gray-400 px-3">
                Página {selectedPage + 1} de {pages.length}
              </span>
              <button
                onClick={() => selectedPage < pages.length - 1 && handlePageSelect(selectedPage + 1)}
                disabled={selectedPage === pages.length - 1}
                className="px-3 py-1.5 bg-gray-700 rounded-lg text-sm text-gray-300 hover:bg-gray-600 disabled:opacity-30"
              >
                Siguiente →
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('side-by-side')}
                className={`px-3 py-1.5 rounded-lg text-sm ${viewMode === 'side-by-side' ? 'bg-emerald-600 text-white' : 'bg-gray-700 text-gray-300'}`}
              >
                Lado a lado
              </button>
              <button
                onClick={() => setViewMode('overlay')}
                className={`px-3 py-1.5 rounded-lg text-sm ${viewMode === 'overlay' ? 'bg-emerald-600 text-white' : 'bg-gray-700 text-gray-300'}`}
              >
                Superpuesto
              </button>
              <button
                onClick={() => setViewMode('diff')}
                className={`px-3 py-1.5 rounded-lg text-sm ${viewMode === 'diff' ? 'bg-emerald-600 text-white' : 'bg-gray-700 text-gray-300'}`}
              >
                Diff
              </button>
            </div>
          </div>

          {/* Confidence indicator */}
          <div className="mb-4 flex items-center gap-3">
            <span className="text-sm text-gray-400">Confianza OCR:</span>
            <div className="flex-1 max-w-xs bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  currentPage?.ocrConfidence >= 90 ? 'bg-emerald-500' :
                  currentPage?.ocrConfidence >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${currentPage?.ocrConfidence || 0}%` }}
              ></div>
            </div>
            <span className={`text-sm font-medium ${
              (currentPage?.ocrConfidence || 0) >= 90 ? 'text-emerald-400' :
              (currentPage?.ocrConfidence || 0) >= 70 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {currentPage?.ocrConfidence || 0}%
            </span>
            {(currentPage?.ocrConfidence || 0) < 75 && (
              <span className="text-xs text-yellow-400 bg-yellow-900/30 px-2 py-0.5 rounded">
                ⚠️ Requiere revisión
              </span>
            )}
          </div>

          {/* Comparison Area */}
          <div className="flex-1 grid grid-cols-2 gap-4 min-h-0">
            {/* Original */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden flex flex-col">
              <div className="p-3 border-b border-gray-700 bg-gray-750">
                <h3 className="text-sm font-semibold text-gray-300">📄 Original (PDF)</h3>
              </div>
              <div className="flex-1 overflow-auto p-4">
                {currentPage?.imageUrl ? (
                  <img src={currentPage.imageUrl} alt="Página original" className="w-full h-auto rounded" />
                ) : (
                  <p className="text-gray-500 text-center">Sin imagen disponible</p>
                )}
              </div>
            </div>

            {/* Processed */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden flex flex-col">
              <div className="p-3 border-b border-gray-700 bg-gray-750 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-300">✨ Texto Procesado</h3>
                <button
                  onClick={() => {
                    if (currentPage) {
                      const updated = [...pages];
                      updated[selectedPage] = { ...currentPage, processedText: editedText };
                      // Update parent through a simple approach
                    }
                  }}
                  className="text-xs px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded"
                >
                  Guardar edición
                </button>
              </div>
              <div className="flex-1 overflow-auto p-4">
                {viewMode === 'diff' ? (
                  <div
                    className="text-sm text-gray-300 leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: getDiff(currentPage?.originalText || '', currentPage?.processedText || '')
                    }}
                  />
                ) : (
                  <textarea
                    value={viewMode === 'overlay' ? currentPage?.originalText || '' : editedText || currentPage?.processedText || ''}
                    onChange={(e) => setEditedText(e.target.value)}
                    className="w-full h-full bg-transparent text-sm text-gray-300 focus:outline-none resize-none leading-relaxed"
                    placeholder="No hay texto extraído para esta página..."
                  />
                )}
              </div>
            </div>
          </div>

          {/* Page Navigator */}
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
            {pages.map((page, idx) => (
              <button
                key={idx}
                onClick={() => handlePageSelect(idx)}
                className={`flex-shrink-0 w-12 h-12 rounded-lg border text-xs font-medium transition-all ${
                  idx === selectedPage
                    ? 'border-emerald-500 bg-emerald-600/20 text-emerald-300'
                    : page.ocrConfidence < 75
                      ? 'border-yellow-600/50 bg-yellow-900/10 text-yellow-400'
                      : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-500'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
