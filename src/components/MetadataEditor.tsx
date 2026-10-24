import { EpubMetadata } from '../types';

interface MetadataEditorProps {
  meta EpubMetadata;
  setMeta (meta EpubMetadata) => void;
}

export function MetadataEditor({ metadata, setMetadata }: MetadataEditorProps) {
  const updateField = (field: keyof EpubMetadata, value: string) => {
    setMetadata({ ...metadata, [field]: value });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">📝 Metadatos del EPUB</h2>
        <p className="text-gray-400">
          Define la información del libro que se incluirá en el archivo EPUB generado.
        </p>
      </div>

      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Título <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={metadata.title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Título del libro"
            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Author */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Autor <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={metadata.author}
            onChange={(e) => updateField('author', e.target.value)}
            placeholder="Nombre del autor"
            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Language */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Idioma</label>
          <select
            value={metadata.language}
            onChange={(e) => updateField('language', e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="es">Español</option>
            <option value="en">Inglés</option>
            <option value="fr">Francés</option>
            <option value="pt">Portugués</option>
            <option value="it">Italiano</option>
            <option value="de">Alemán</option>
            <option value="ca">Catalán</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Descripción</label>
          <textarea
            value={metadata.description}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="Breve descripción del libro..."
            rows={3}
            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-none"
          />
        </div>

        {/* Publisher & ISBN */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Editorial</label>
            <input
              type="text"
              value={metadata.publisher}
              onChange={(e) => updateField('publisher', e.target.value)}
              placeholder="Nombre de la editorial"
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">ISBN</label>
            <input
              type="text"
              value={metadata.isbn}
              onChange={(e) => updateField('isbn', e.target.value)}
              placeholder="978-3-16-148410-0"
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="mt-6 bg-gray-800 rounded-xl border border-gray-700 p-6">
        <h3 className="text-sm font-semibold text-gray-400 uppercase mb-4">Vista previa de metadatos</h3>
        <div className="bg-gray-900 rounded-lg p-4 font-mono text-xs text-gray-400 space-y-1">
          <p><span className="text-emerald-400">dc:title:</span> {metadata.title || '(sin título)'}</p>
          <p><span className="text-emerald-400">dc:creator:</span> {metadata.author || '(sin autor)'}</p>
          <p><span className="text-emerald-400">dc:language:</span> {metadata.language}</p>
          <p><span className="text-emerald-400">dc:description:</span> {metadata.description || '(sin descripción)'}</p>
          <p><span className="text-emerald-400">dc:publisher:</span> {metadata.publisher || '(sin editorial)'}</p>
          <p><span className="text-emerald-400">dc:identifier:</span> {metadata.isbn || 'auto-generado'}</p>
        </div>
      </div>
    </div>
  );
}
