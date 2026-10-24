import { useState, useRef } from 'react';
import { RegexRule } from '../types';
import { parseSigilRegexFile } from '../utils/regexParser';
import { DEFAULT_REGEX_RULES, SIGIL_CATEGORIES } from '../data/sigilPresets';

interface RegexEditorProps {
  rules: RegexRule[];
  setRules: (rules: RegexRule[]) => void;
}

export function RegexEditor({ rules, setRules }: RegexEditorProps) {
  const [testInput, setTestInput] = useState('');
  const [testOutput, setTestOutput] = useState('');
  const [editingRule, setEditingRule] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchText, setSearchText] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [importResult, setImportResult] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addRule = () => {
    const newRule: RegexRule = {
      id: Date.now().toString(),
      name: 'Nueva regla',
      pattern: '',
      replacement: '',
      enabled: true,
      description: '',
    };
    setRules([...rules, newRule]);
    setEditingRule(newRule.id);
  };

  const updateRule = (id: string, updates: Partial<RegexRule>) => {
    setRules(rules.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const deleteRule = (id: string) => {
    setRules(rules.filter(r => r.id !== id));
  };

  const toggleAll = (enabled: boolean) => {
    setRules(rules.map(r => ({ ...r, enabled })));
  };

  const loadDefaults = () => {
    setRules(DEFAULT_REGEX_RULES);
  };

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const content = await file.text();
    const parsed = parseSigilRegexFile(content);

    if (parsed.length > 0) {
      setRules([...rules, ...parsed]);
      setImportResult(`✅ Se importaron ${parsed.length} reglas desde "${file.name}"`);
    } else {
      setImportResult('❌ No se encontraron reglas válidas en el archivo');
    }

    setShowImportModal(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const runTest = () => {
    let result = testInput;
    const enabledRules = rules.filter(r => r.enabled && r.pattern);

    for (const rule of enabledRules) {
      try {
        const regex = new RegExp(rule.pattern, 'gm');
        result = result.replace(regex, rule.replacement);
      } catch (e) {
        // Skip invalid regex
      }
    }
    setTestOutput(result);
  };

  // Filter rules
  const filteredRules = rules.filter(r => {
    const matchesCategory = filterCategory === 'all' || r.description.includes(filterCategory);
    const matchesSearch = !searchText ||
      r.name.toLowerCase().includes(searchText.toLowerCase()) ||
      r.pattern.toLowerCase().includes(searchText.toLowerCase()) ||
      r.description.toLowerCase().includes(searchText.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">⚙️ Reglas de Expresiones Regulares</h2>
        <p className="text-gray-400">
          Define patrones regex para procesar y limpiar el texto extraído.
          Incluye reglas predefinidas basadas en <span className="text-emerald-400">RegEx 2.0 para Sigil</span>.
        </p>
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <button
          onClick={loadDefaults}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors text-sm"
        >
          📋 Cargar reglas predefinidas ({DEFAULT_REGEX_RULES.length})
        </button>
        <button
          onClick={() => setShowImportModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors text-sm"
        >
          📥 Importar archivo Sigil (.txt)
        </button>
        <button
          onClick={() => toggleAll(true)}
          className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm"
        >
          ✓ Activar todas
        </button>
        <button
          onClick={() => toggleAll(false)}
          className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm"
        >
          ✗ Desactivar todas
        </button>
        <div className="ml-auto text-sm text-gray-500">
          {rules.filter(r => r.enabled).length} / {rules.length} activas
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Buscar reglas..."
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
        >
          <option value="all">Todas las categorías</option>
          {SIGIL_CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rules List */}
        <div className="lg:col-span-2 space-y-3 max-h-[60vh] overflow-auto pr-2">
          {filteredRules.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-4xl mb-4">📝</p>
              <p>No hay reglas. Carga las predefinidas o importa un archivo.</p>
            </div>
          ) : (
            filteredRules.map((rule) => (
              <div
                key={rule.id}
                className={`bg-gray-800 rounded-lg border transition-all ${
                  editingRule === rule.id
                    ? 'border-emerald-500 ring-1 ring-emerald-500/20'
                    : 'border-gray-700'
                } ${!rule.enabled ? 'opacity-50' : ''}`}
              >
                <div className="p-3">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <input
                        type="checkbox"
                        checked={rule.enabled}
                        onChange={(e) => updateRule(rule.id, { enabled: e.target.checked })}
                        className="w-4 h-4 accent-emerald-500 flex-shrink-0"
                      />
                      <input
                        type="text"
                        value={rule.name}
                        onChange={(e) => updateRule(rule.id, { name: e.target.value })}
                        className="bg-transparent text-white font-medium text-sm focus:outline-none border-b border-transparent focus:border-emerald-500 min-w-0 flex-1"
                        onClick={() => setEditingRule(rule.id)}
                      />
                    </div>
                    <button
                      onClick={() => deleteRule(rule.id)}
                      className="text-red-400 hover:text-red-300 text-sm px-2 py-1 rounded hover:bg-red-900/20 flex-shrink-0"
                    >
                      ✕
                    </button>
                  </div>

                  {editingRule === rule.id && (
                    <div className="space-y-2 mt-2 pl-6">
                      <div>
                        <label className="text-xs text-gray-500 mb-0.5 block">Patrón (Regex)</label>
                        <input
                          type="text"
                          value={rule.pattern}
                          onChange={(e) => updateRule(rule.id, { pattern: e.target.value })}
                          placeholder="Ej: \\s{2,}"
                          className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-1.5 text-xs font-mono text-emerald-300 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-0.5 block">Reemplazo</label>
                        <input
                          type="text"
                          value={rule.replacement}
                          onChange={(e) => updateRule(rule.id, { replacement: e.target.value })}
                          placeholder="Ej: (vacío)"
                          className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-1.5 text-xs font-mono text-yellow-300 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-0.5 block">Descripción</label>
                        <input
                          type="text"
                          value={rule.description}
                          onChange={(e) => updateRule(rule.id, { description: e.target.value })}
                          className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-1.5 text-xs text-gray-400 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>
                  )}

                  {editingRule !== rule.id && (
                    <p className="text-xs text-gray-500 pl-6 truncate">{rule.description}</p>
                  )}
                </div>
              </div>
            ))
          )}

          <button
            onClick={addRule}
            className="w-full py-3 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:border-emerald-500 hover:text-emerald-400 transition-all text-sm"
          >
            + Agregar nueva regla
          </button>
        </div>

        {/* Test Panel */}
        <div className="space-y-4">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
            <h3 className="text-sm font-semibold text-white mb-3">🧪 Probar reglas</h3>
            <textarea
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              placeholder="Pega aquí texto de prueba..."
              className="w-full h-28 bg-gray-900 border border-gray-600 rounded-lg p-3 text-xs text-gray-300 focus:outline-none focus:border-emerald-500 resize-none"
            />
            <button
              onClick={runTest}
              className="w-full mt-2 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium text-sm transition-colors"
            >
              Ejecutar reglas
            </button>
            {testOutput && (
              <div className="mt-3">
                <label className="text-xs text-gray-500 mb-1 block">Resultado:</label>
                <div className="bg-gray-900 border border-gray-600 rounded-lg p-3 text-xs text-emerald-300 font-mono whitespace-pre-wrap max-h-40 overflow-auto">
                  {testOutput || '(sin cambios)'}
                </div>
              </div>
            )}
          </div>

          <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
            <h4 className="text-xs font-semibold text-gray-400 mb-2">💡 Sintaxis rápida</h4>
            <div className="text-xs text-gray-500 space-y-1 font-mono">
              <p><span className="text-emerald-400">\\n</span> → salto de línea</p>
              <p><span className="text-emerald-400">\\s+</span> → espacios</p>
              <p><span className="text-emerald-400">$1, $2</span> → grupos capturados</p>
              <p><span className="text-emerald-400">^</span> → inicio de línea</p>
              <p><span className="text-emerald-400">$</span> → fin de línea</p>
              <p><span className="text-emerald-400">(?i)</span> → case insensitive</p>
              <p><span className="text-emerald-400">\\pL</span> → cualquier letra</p>
              <p><span className="text-emerald-400">\\pN</span> → cualquier número</p>
            </div>
          </div>

          <div className="bg-blue-900/20 border border-blue-700/30 rounded-xl p-3">
            <p className="text-xs text-blue-300">
              <strong>💡 Tip:</strong> Importa el archivo original de Sigil (.txt) para cargar las 215+ reglas completas con todos los patrones avanzados.
            </p>
          </div>
        </div>
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-white mb-4">📥 Importar archivo de Sigil</h3>
            <p className="text-sm text-gray-400 mb-4">
              Selecciona un archivo .txt exportado de Sigil con formato de RegEx 2.0.
              El archivo debe contener entradas con el formato:
            </p>
            <div className="bg-gray-900 rounded-lg p-3 text-xs font-mono text-gray-400 mb-4">
              <p>[search_entries]</p>
              <p>1\Name="Categoría/Nombre"</p>
              <p>1\Find="patrón"</p>
              <p>1\Replace="reemplazo"</p>
              <p>1\Controls=</p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.regex"
              onChange={handleFileImport}
              className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-emerald-600 file:text-white hover:file:bg-emerald-500 file:cursor-pointer"
            />

            {importResult && (
              <p className="mt-3 text-sm text-emerald-400">{importResult}</p>
            )}

            <div className="flex justify-end mt-4">
              <button
                onClick={() => { setShowImportModal(false); setImportResult(''); }}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
