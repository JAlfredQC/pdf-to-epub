import { useState } from 'react';
import { ALL_TEMPLATES, EpubTemplate } from '../data/epubTemplates';

export function TemplateEditor() {
  const [templates, setTemplates] = useState<EpubTemplate[]>(ALL_TEMPLATES);
  const [selectedTemplate, setSelectedTemplate] = useState<EpubTemplate | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  const filteredTemplates = templates.filter(t => 
    filterType === 'all' || t.type === filterType
  );

  const updateTemplateContent = (id: string, content: string) => {
    setTemplates(templates.map(t => t.id === id ? { ...t, content } : t));
    if (selectedTemplate?.id === id) {
      setSelectedTemplate({ ...selectedTemplate, content });
    }
  };

  const toggleRequired = (id: string) => {
    setTemplates(templates.map(t => t.id === id ? { ...t, required: !t.required } : t));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'cover': return '📕';
      case 'titlepage': return '📄';
      case 'copyright': return '©️';
      case 'dedication': return '💝';
      case 'epigraph': return '📜';
      case 'synopsis': return '📝';
      case 'author': return '👤';
      case 'chapter': return '📖';
      case 'notes': return '📌';
      case 'nav': return '🧭';
      case 'toc': return '📋';
      case 'css': return '🎨';
      default: return '📁';
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">📐 Plantillas EPUB (ePubLibre 3.0)</h2>
        <p className="text-gray-400">
          Plantillas base para el EPUB final. <span className="text-emerald-400">Todos los archivos se incluyen en el EPUB generado</span>, 
          sean o no utilizados directamente. Basadas en ePub-base 3.0 de ePubLibre.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <p className="text-2xl font-bold text-emerald-400">{templates.length}</p>
          <p className="text-sm text-gray-400">Total archivos</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <p className="text-2xl font-bold text-blue-400">{templates.filter(t => t.type !== 'css').length}</p>
          <p className="text-sm text-gray-400">XHTML</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <p className="text-2xl font-bold text-pink-400">{templates.filter(t => t.type === 'css').length}</p>
          <p className="text-sm text-gray-400">CSS</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <p className="text-2xl font-bold text-yellow-400">{templates.filter(t => t.required).length}</p>
          <p className="text-sm text-gray-400">Obligatorios</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {['all', 'cover', 'titlepage', 'copyright', 'dedication', 'epigraph', 'synopsis', 'chapter', 'notes', 'author', 'nav', 'toc', 'css'].map(type => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterType === type 
                ? 'bg-emerald-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {type === 'all' ? '📁 Todos' : `${getTypeIcon(type)} ${type}`}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-2 max-h-[70vh] overflow-auto">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              onClick={() => setSelectedTemplate(template)}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                selectedTemplate?.id === template.id
                  ? 'border-emerald-500 bg-emerald-600/10'
                  : 'border-gray-700 bg-gray-800 hover:border-gray-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>{getTypeIcon(template.type)}</span>
                  <div>
                    <p className="text-sm font-medium text-white">{template.name}</p>
                    <p className="text-xs text-gray-500 font-mono">{template.filename}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {template.required && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-emerald-600/20 text-emerald-400 rounded">REQ</span>
                  )}
                  <span className="text-[10px] px-1.5 py-0.5 bg-gray-700 text-gray-400 rounded">{template.type}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-2">
          {selectedTemplate ? (
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
              <div className="p-4 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      {getTypeIcon(selectedTemplate.type)} {selectedTemplate.name}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">{selectedTemplate.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 text-sm text-gray-400">
                      <input
                        type="checkbox"
                        checked={selectedTemplate.required}
                        onChange={() => toggleRequired(selectedTemplate.id)}
                        className="w-4 h-4 accent-emerald-500"
                      />
                      Obligatorio
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-gray-400 font-mono">{selectedTemplate.filename}</label>
                  <span className="text-xs text-gray-500">
                    {selectedTemplate.content.length} caracteres
                  </span>
                </div>
                <textarea
                  value={selectedTemplate.content}
                  onChange={(e) => updateTemplateContent(selectedTemplate.id, e.target.value)}
                  className="w-full h-96 bg-gray-900 border border-gray-600 rounded-lg p-4 text-xs font-mono text-emerald-300 focus:outline-none focus:border-emerald-500 resize-none"
                  spellCheck={false}
                />
                <div className="mt-2 text-xs text-gray-500">
                  <p>Variables disponibles: <code className="text-emerald-400">{`{{title}}`}</code> <code className="text-emerald-400">{`{{author}}`}</code> <code className="text-emerald-400">{`{{date}}`}</code> <code className="text-emerald-400">{`{{year}}`}</code> <code className="text-emerald-400">{`{{navItems}}`}</code> <code className="text-emerald-400">{`{{tocItems}}`}</code></p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-12 text-center">
              <p className="text-4xl mb-4">📐</p>
              <p className="text-gray-400">Selecciona una plantilla para editarla</p>
              <p className="text-sm text-gray-500 mt-2">
                Todas las plantillas se incluyen en el EPUB final
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 bg-gray-800 rounded-xl border border-gray-700 p-4">
        <h3 className="text-sm font-semibold text-gray-400 uppercase mb-3">📚 Estructura del EPUB generado</h3>
        <div className="font-mono text-xs text-gray-400 bg-gray-900 rounded-lg p-4">
          <p className="text-gray-500">📦 libro.epub</p>
          <p className="ml-4">├── mimetype</p>
          <p className="ml-4">├── META-INF/</p>
          <p className="ml-8">│   └── container.xml</p>
          <p className="ml-4">└── OEBPS/</p>
          <p className="ml-8">│   ├── content.opf</p>
          <p className="ml-8">│   ├── Text/</p>
          {templates.filter(t => t.type !== 'css').map(t => (
            <p key={t.id} className="ml-12 text-gray-400">
              │   │   ├── {t.filename}
              {t.required && <span className="text-emerald-500 ml-2">(obligatorio)</span>}
            </p>
          ))}
          <p className="ml-12 text-gray-400">│   │   └── capitulo1...N.xhtml (generados)</p>
          <p className="ml-8">│   ├── Styles/</p>
          {templates.filter(t => t.type === 'css').map(t => (
            <p key={t.id} className="ml-12 text-gray-400">
              │   │   ├── {t.filename}
              {t.required && <span className="text-emerald-500 ml-2">(obligatorio)</span>}
            </p>
          ))}
          <p className="ml-8">│   └── Images/</p>
          <p className="ml-12 text-gray-500">│       └── (imagenes del libro)</p>
        </div>
      </div>
    </div>
  );
}
