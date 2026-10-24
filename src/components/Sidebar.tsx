interface SidebarProps {
  currentView: string;
  setCurrentView: (view: any) => void;
  pdfLoaded: boolean;
}

const menuItems = [
  { id: 'upload', label: 'Cargar PDF', icon: '📄', requiresPdf: false },
  { id: 'metadata', label: 'Metadatos', icon: '📝', requiresPdf: false },
  { id: 'ocr', label: 'Configuración OCR', icon: '🔍', requiresPdf: false },
  { id: 'regex', label: 'Reglas Regex', icon: '⚙️', requiresPdf: false },
  { id: 'dictionary', label: 'Diccionario', icon: '📖', requiresPdf: false },
  { id: 'spellcheck', label: 'Ortografía', icon: '🔤', requiresPdf: false },
  { id: 'templates', label: 'Plantillas', icon: '📐', requiresPdf: false },
  { id: 'comparison', label: 'Comparación', icon: '🔀', requiresPdf: true },
  { id: 'progress', label: 'Convertir', icon: '🚀', requiresPdf: true },
];

export function Sidebar({ currentView, setCurrentView, pdfLoaded }: SidebarProps) {
  return (
    <aside className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold text-emerald-400 flex items-center gap-2">
          <span className="text-2xl">📚</span>
          PDF → EPUB
        </h1>
        <p className="text-xs text-gray-400 mt-1">Conversor con OCR</p>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {menuItems.map((item) => {
          const isDisabled = item.requiresPdf && !pdfLoaded;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => !isDisabled && setCurrentView(item.id)}
              disabled={isDisabled}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all
                ${isActive
                  ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-600/30'
                  : isDisabled
                    ? 'text-gray-600 cursor-not-allowed'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
              {isDisabled && <span className="ml-auto text-xs">🔒</span>}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className={`w-2 h-2 rounded-full ${pdfLoaded ? 'bg-emerald-400' : 'bg-gray-600'}`}></span>
          {pdfLoaded ? 'PDF cargado' : 'Sin PDF cargado'}
        </div>
      </div>
    </aside>
  );
}
