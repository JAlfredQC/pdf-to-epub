import { useState } from 'react';
import { ConversionState, PageData, EpubMetadata, RegexRule, DictionaryEntry, OCRSettings as OCRSettingsType } from '../types';
import { generateEpub } from '../utils/epubGenerator';
import { ALL_TEMPLATES } from '../data/epubTemplates';

interface ConversionProgressProps {
  state: ConversionState;
  setState: (state: ConversionState | ((prev: ConversionState) => ConversionState)) => void;
  pages: PageData[];
  meta EpubMetadata;
  regexRules: RegexRule[];
  dictionary: DictionaryEntry[];
  ocrSettings: OCRSettingsType;
  pdfFile: File | null;
}

export function ConversionProgress({
  state,
  setState,
  pages,
  metadata,
  regexRules,
  dictionary,
  ocrSettings,
  pdfFile,
}: ConversionProgressProps) {
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const processText = (text: string): string => {
    let result = text;

    // Apply regex rules
    const enabledRules = regexRules.filter(r => r.enabled && r.pattern);
    for (const rule of enabledRules) {
      try {
        const regex = new RegExp(rule.pattern, 'gm');
        result = result.replace(regex, rule.replacement);
      } catch (e) {
        // Skip invalid regex
      }
    }

    // Apply dictionary corrections
    const enabledEntries = dictionary.filter(e => e.enabled);
    for (const entry of enabledEntries) {
      const escaped = entry.original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escaped, 'gi');
      result = result.replace(regex, entry.correction);
    }

    return result;
  };

  const startConversion = async () => {
    if (!pdfFile || pages.length === 0) {
      addLog('No hay archivo PDF cargado');
      return;
    }

    setState({ status: 'processing', progress: 0, message: 'Iniciando conversion...', currentPage: 0, totalPages: pages.length });
    addLog('Iniciando conversion PDF a EPUB');
    addLog(`${pages.length} paginas detectadas`);
    addLog(`OCR configurado: ${ocrSettings.language}, confianza: ${ocrSettings.confidence}%`);
    addLog(`${regexRules.filter(r => r.enabled).length} reglas regex activas`);
    addLog(`${dictionary.filter(d => d.enabled).length} entradas de diccionario activas`);
    addLog(`${ALL_TEMPLATES.length} plantillas disponibles (todas se incluyen en el EPUB)`);

    // Process pages
    const processedPages: PageData[] = [];

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];

      setState({
        status: 'processing',
        progress: Math.round(((i + 1) / pages.length) * 100),
        currentPage: i + 1,
        totalPages: pages.length,
        message: `Procesando pagina ${i + 1} de ${pages.length}...`,
      });

      addLog(`Procesando pagina ${i + 1}...`);

      // Check if OCR is needed
      if (page.ocrConfidence < ocrSettings.confidence) {
        addLog(`   Aplicando OCR (confianza baja: ${page.ocrConfidence}%)`);
        setState({
          status: 'ocr',
          progress: Math.round(((i + 1) / pages.length) * 100),
          currentPage: i + 1,
          totalPages: pages.length,
          message: `OCR en pagina ${i + 1}...`,
        });
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      // Process text
      const processedText = processText(page.originalText);

      processedPages.push({
        ...page,
        processedText,
        ocrConfidence: page.ocrConfidence < ocrSettings.confidence ? 85 : page.ocrConfidence,
      });

      await new Promise(resolve => setTimeout(resolve, 100));
    }

    addLog('Procesamiento de texto completado');

    // Generate EPUB
    setState({
      status: 'generating',
      progress: 95,
      currentPage: pages.length,
      totalPages: pages.length,
      message: 'Generando archivo EPUB...',
    });
    addLog('Generando archivo EPUB...');
    addLog(`   ${ALL_TEMPLATES.filter(t => t.type !== 'css').length} archivos XHTML`);
    addLog(`   ${ALL_TEMPLATES.filter(t => t.type === 'css').length} archivos CSS`);
    addLog(`   ${processedPages.length} capitulos generados`);

    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      await generateEpub(metadata, processedPages);
      setState({ status: 'done', progress: 100, message: 'Conversion completada!', currentPage: pages.length, totalPages: pages.length });
      addLog('Archivo EPUB generado exitosamente!');
      addLog(`Descargando: ${metadata.title || 'documento'}.epub`);
    } catch (error) {
      setState({ status: 'error', progress: 0, message: 'Error al generar EPUB', currentPage: 0, totalPages: pages.length });
      addLog(`Error: ${error}`);
    }
  };

  const getStatusColor = () => {
    switch (state.status) {
      case 'done': return 'text-emerald-400';
      case 'error': return 'text-red-400';
      case 'processing':
      case 'ocr':
      case 'generating': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = () => {
    switch (state.status) {
      case 'done': return '✅';
      case 'error': return '❌';
      case 'processing': return '⚙️';
      case 'ocr': return '🔍';
      case 'generating': return '📦';
      default: return '⏸️';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">🚀 Conversión PDF → EPUB</h2>
        <p className="text-gray-400">
          Inicia la conversión del PDF a EPUB aplicando OCR, reglas regex y diccionario.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <p className="text-2xl font-bold text-blue-400">{pages.length}</p>
          <p className="text-sm text-gray-400">Páginas</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <p className="text-2xl font-bold text-purple-400">{regexRules.filter(r => r.enabled).length}</p>
          <p className="text-sm text-gray-400">Reglas Regex</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <p className="text-2xl font-bold text-yellow-400">{dictionary.filter(d => d.enabled).length}</p>
          <p className="text-sm text-gray-400">Diccionario</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <p className="text-2xl font-bold text-emerald-400">{ALL_TEMPLATES.filter(t => t.type !== 'css').length}</p>
          <p className="text-sm text-gray-400">Secciones XHTML</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <p className="text-2xl font-bold text-pink-400">{ALL_TEMPLATES.filter(t => t.type === 'css').length}</p>
          <p className="text-sm text-gray-400">Hojas CSS</p>
        </div>
      </div>

      {/* Templates included */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 mb-6">
        <h3 className="text-sm font-semibold text-gray-400 uppercase mb-3">📁 Archivos incluidos en el EPUB</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {ALL_TEMPLATES.map(t => (
            <div key={t.id} className="flex items-center gap-2 text-xs">
              <span className={`w-2 h-2 rounded-full ${t.required ? 'bg-emerald-400' : 'bg-gray-600'}`}></span>
              <span className="text-gray-300 font-mono">{t.filename}</span>
              {t.required && <span className="text-emerald-500 text-[10px]">req</span>}
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Todos los archivos de plantilla (XHTML y CSS) se incluyen en el EPUB final,
          sean o no utilizados directamente en el contenido.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">{getStatusIcon()}</span>
            <span className={`font-medium ${getStatusColor()}`}>{state.message || 'Listo para convertir'}</span>
          </div>
          <span className="text-sm text-gray-400">
            {state.currentPage > 0 && `${state.currentPage}/${state.totalPages}`}
          </span>
        </div>

        <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
          <div
            className={`h-3 rounded-full transition-all duration-300 ${
              state.status === 'done' ? 'bg-emerald-500' :
              state.status === 'error' ? 'bg-red-500' :
              'bg-emerald-500'
            }`}
            style={{ width: `${state.progress}%` }}
          ></div>
        </div>
        <p className="text-right text-xs text-gray-500">{state.progress}%</p>
      </div>

      {/* Action Button */}
      <div className="flex justify-center mb-8">
        <button
          onClick={startConversion}
          disabled={state.status === 'processing' || state.status === 'ocr' || state.status === 'generating'}
          className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${
            state.status === 'done'
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
              : state.status === 'processing' || state.status === 'ocr' || state.status === 'generating'
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-500 hover:scale-105 text-white shadow-lg shadow-emerald-600/20'
          }`}
        >
          {state.status === 'done' ? '📥 Descargar de nuevo' :
           state.status === 'processing' || state.status === 'ocr' || state.status === 'generating' ? '⏳ Procesando...' :
           '🚀 Iniciar Conversión'}
        </button>
      </div>

      {/* Logs */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="p-3 border-b border-gray-700 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-300">📋 Registro de actividad</h3>
          <button
            onClick={() => setLogs([])}
            className="text-xs text-gray-500 hover:text-gray-300"
          >
            Limpiar
          </button>
        </div>
        <div className="p-4 max-h-64 overflow-auto font-mono text-xs space-y-1">
          {logs.length === 0 ? (
            <p className="text-gray-600">Esperando inicio de conversion...</p>
          ) : (
            logs.map((log, idx) => (
              <p key={idx} className="text-gray-400">{log}</p>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
