import { useState, useRef } from 'react';
import { AffData, DicData, parseAffFile, parseDicFile, getDictionaryStats, isWordInDictionary, suggestCorrections } from '../utils/hunspellParser';

export function SpellChecker() {
  const [affData, setAffData] = useState<AffData | null>(null);
  const [dicData, setDicData] = useState<DicData | null>(null);
  const [testWord, setTestWord] = useState('');
  const [testResult, setTestResult] = useState<{ valid: boolean; suggestions: string[] } | null>(null);
  const [affLoaded, setAffLoaded] = useState(false);
  const [dicLoaded, setDicLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const affInputRef = useRef<HTMLInputElement>(null);
  const dicInputRef = useRef<HTMLInputElement>(null);

  const handleAffLoad = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const content = await file.text();
    const parsed = parseAffFile(content);
    setAffData(parsed);
    setAffLoaded(true);
    setLoading(false);
  };

  const handleDicLoad = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const content = await file.text();
    const parsed = parseDicFile(content);
    setDicData(parsed);
    setDicLoaded(true);
    setLoading(false);
  };

  const checkWord = () => {
    if (!affData || !dicData || !testWord.trim()) return;

    const word = testWord.trim().toLowerCase();
    const valid = isWordInDictionary(word, dicData);
    const suggestions = valid ? [] : suggestCorrections(word, affData, dicData);

    setTestResult({ valid, suggestions });
  };

  const stats = affData && dicData ? getDictionaryStats(dicData, affData) : null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">🔤 Diccionario Ortográfico (Hunspell)</h2>
        <p className="text-gray-400">
          Carga los archivos de diccionario <code className="text-emerald-400">.aff</code> (afijos) y{' '}
          <code className="text-emerald-400">.dic</code> (palabras) para verificar la ortografía del texto extraído.
          Estos archivos definen las reglas morfológicas del español y la lista de palabras válidas.
        </p>
      </div>

      {/* File Upload Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* AFF File */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className={`w-3 h-3 rounded-full ${affLoaded ? 'bg-emerald-400' : 'bg-gray-600'}`}></span>
            <h3 className="text-lg font-semibold text-white">Archivo .aff (Afijos)</h3>
          </div>
          <p className="text-sm text-gray-400 mb-4">
            Contiene las reglas de formación de palabras: prefijos, sufijos, conjugaciones verbales,
            plurales y reemplazos ortográficos.
          </p>
          <input
            ref={affInputRef}
            type="file"
            accept=".aff"
            onChange={handleAffLoad}
            className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-500 file:cursor-pointer"
          />
          {affLoaded && affData && (
            <div className="mt-4 text-xs text-gray-500 space-y-1">
              <p>✅ Cargado • Codificación: {affData.encoding}</p>
              <p>• {affData.prefixes.length} reglas de prefijos</p>
              <p>• {affData.suffixes.length} reglas de sufijos</p>
              <p>• {affData.replacements.length} reglas de reemplazo</p>
              <p>• {affData.mapRules.length} grupos de mapeo</p>
            </div>
          )}
        </div>

        {/* DIC File */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className={`w-3 h-3 rounded-full ${dicLoaded ? 'bg-emerald-400' : 'bg-gray-600'}`}></span>
            <h3 className="text-lg font-semibold text-white">Archivo .dic (Palabras)</h3>
          </div>
          <p className="text-sm text-gray-400 mb-4">
            Contiene la lista completa de palabras válidas del idioma español con sus marcas de afijos.
          </p>
          <input
            ref={dicInputRef}
            type="file"
            accept=".dic"
            onChange={handleDicLoad}
            className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-600 file:text-white hover:file:bg-purple-500 file:cursor-pointer"
          />
          {dicLoaded && dicData && (
            <div className="mt-4 text-xs text-gray-500 space-y-1">
              <p>✅ Cargado • {dicData.words.size.toLocaleString()} palabras</p>
              <p>• {dicData.wordFlags.size.toLocaleString()} palabras con afijos</p>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <p className="text-xl font-bold text-emerald-400">{stats.totalWords.toLocaleString()}</p>
            <p className="text-xs text-gray-400">Palabras</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <p className="text-xl font-bold text-blue-400">{stats.totalPrefixes}</p>
            <p className="text-xs text-gray-400">Prefijos</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <p className="text-xl font-bold text-purple-400">{stats.totalSuffixes}</p>
            <p className="text-xs text-gray-400">Sufijos</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <p className="text-xl font-bold text-yellow-400">{stats.totalReplacements}</p>
            <p className="text-xs text-gray-400">Reemplazos</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <p className="text-xl font-bold text-pink-400">{stats.totalMapRules}</p>
            <p className="text-xs text-gray-400">Mapas</p>
          </div>
        </div>
      )}

      {/* Word Checker */}
      {affData && dicData && (
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">🔍 Verificar palabra</h3>
          <div className="flex gap-3">
            <input
              type="text"
              value={testWord}
              onChange={(e) => setTestWord(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && checkWord()}
              placeholder="Escribe una palabra para verificar..."
              className="flex-1 bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={checkWord}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors"
            >
              Verificar
            </button>
          </div>

          {testResult && (
            <div className={`mt-4 p-4 rounded-lg ${testResult.valid ? 'bg-emerald-900/20 border border-emerald-700/30' : 'bg-red-900/20 border border-red-700/30'}`}>
              {testResult.valid ? (
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 text-xl">✅</span>
                  <p className="text-emerald-300">
                    <strong>"{testWord}"</strong> es una palabra válida del diccionario.
                  </p>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-red-400 text-xl">❌</span>
                    <p className="text-red-300">
                      <strong>"{testWord}"</strong> no se encontró en el diccionario.
                    </p>
                  </div>
                  {testResult.suggestions.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-400 mb-2">Sugerencias:</p>
                      <div className="flex flex-wrap gap-2">
                        {testResult.suggestions.map((s, i) => (
                          <button
                            key={i}
                            onClick={() => { setTestWord(s); setTestResult(null); }}
                            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm text-emerald-300 transition-colors"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Replacement Rules Preview */}
      {affData && affData.replacements.length > 0 && (
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">🔄 Reglas de reemplazo (OCR)</h3>
          <p className="text-sm text-gray-400 mb-4">
            Estas reglas del archivo .aff se pueden usar para corregir errores comunes de OCR:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-64 overflow-auto">
            {affData.replacements.slice(0, 40).map((rep, i) => (
              <div key={i} className="flex items-center gap-2 text-xs bg-gray-900 rounded px-2 py-1">
                <span className="text-red-300 font-mono">{rep.from}</span>
                <span className="text-gray-500">→</span>
                <span className="text-emerald-300 font-mono">{rep.to}</span>
              </div>
            ))}
          </div>
          {affData.replacements.length > 40 && (
            <p className="text-xs text-gray-500 mt-2">
              Mostrando 40 de {affData.replacements.length} reglas
            </p>
          )}
        </div>
      )}

      {/* Info */}
      {!affLoaded && !dicLoaded && (
        <div className="bg-blue-900/20 border border-blue-700/30 rounded-xl p-6">
          <h3 className="text-blue-300 font-medium mb-2">ℹ️ Sobre los diccionarios Hunspell</h3>
          <p className="text-sm text-blue-400/80">
            Los archivos <code>.aff</code> y <code>.dic</code> son el formato estándar de diccionarios
            Hunspell, utilizado por LibreOffice, Firefox y otros programas. El archivo <code>.aff</code>
            define las reglas morfológicas (cómo se forman las palabras) y el <code>.dic</code> contiene
            la lista de palabras base. Juntos permiten verificar ortografía y sugerir correcciones.
          </p>
          <p className="text-sm text-blue-400/80 mt-2">
            Para esta aplicación, se recomienda usar los archivos del repositorio
            <code className="ml-1 text-emerald-400">Erlodafer/Epub</code> que están optimizados
            para textos en español.
          </p>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-8 text-center">
            <div className="text-4xl mb-4 animate-spin">⏳</div>
            <p className="text-white">Cargando diccionario...</p>
          </div>
        </div>
      )}
    </div>
  );
}
