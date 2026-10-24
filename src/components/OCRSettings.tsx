import { OCRSettings as OCRSettingsType } from '../types';

interface OCRSettingsProps {
  settings: OCRSettingsType;
  setSettings: (settings: OCRSettingsType) => void;
}

export function OCRSettings({ settings, setSettings }: OCRSettingsProps) {
  const languages = [
    { code: 'spa', name: 'Español' },
    { code: 'eng', name: 'Inglés' },
    { code: 'fra', name: 'Francés' },
    { code: 'por', name: 'Portugués' },
    { code: 'ita', name: 'Italiano' },
    { code: 'deu', name: 'Alemán' },
    { code: 'spa+eng', name: 'Español + Inglés' },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">🔍 Configuración OCR</h2>
        <p className="text-gray-400">
          Configura el motor de reconocimiento óptico de caracteres para archivos escaneados.
          Tesseract.js se utilizará para procesar las imágenes.
        </p>
      </div>

      <div className="space-y-6">
        {/* Language Selection */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Idioma de reconocimiento</h3>
          <select
            value={settings.language}
            onChange={(e) => setSettings({ ...settings, language: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
          <p className="text-sm text-gray-500 mt-2">
            Selecciona el idioma del texto en el documento para mejorar la precisión del OCR.
          </p>
        </div>

        {/* Confidence Threshold */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Umbral de confianza</h3>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="50"
              max="99"
              value={settings.confidence}
              onChange={(e) => setSettings({ ...settings, confidence: parseInt(e.target.value) })}
              className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <span className="text-2xl font-bold text-emerald-400 w-16 text-center">
              {settings.confidence}%
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Páginas con confianza menor a este umbral se marcarán para revisión manual en la vista de comparación.
          </p>
        </div>

        {/* Processing Options */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Opciones de preprocesamiento</h3>
          <div className="space-y-4">
            <label className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-700">
              <div>
                <p className="text-white font-medium">Auto-rotación</p>
                <p className="text-sm text-gray-400">Detecta y corrige la orientación de las páginas</p>
              </div>
              <input
                type="checkbox"
                checked={settings.autoRotate}
                onChange={(e) => setSettings({ ...settings, autoRotate: e.target.checked })}
                className="w-5 h-5 accent-emerald-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-700">
              <div>
                <p className="text-white font-medium">Corrección de inclinación</p>
                <p className="text-sm text-gray-400">Endereza páginas escaneadas con ángulo incorrecto</p>
              </div>
              <input
                type="checkbox"
                checked={settings.deskew}
                onChange={(e) => setSettings({ ...settings, deskew: e.target.checked })}
                className="w-5 h-5 accent-emerald-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-700">
              <div>
                <p className="text-white font-medium">Eliminación de ruido</p>
                <p className="text-sm text-gray-400">Filtra artefactos y manchas del escaneo</p>
              </div>
              <input
                type="checkbox"
                checked={settings.removeNoise}
                onChange={(e) => setSettings({ ...settings, removeNoise: e.target.checked })}
                className="w-5 h-5 accent-emerald-500"
              />
            </label>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-900/20 border border-blue-700/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <span className="text-xl">ℹ️</span>
            <div>
              <p className="text-blue-300 font-medium">Sobre el motor OCR</p>
              <p className="text-sm text-blue-400/80 mt-1">
                Se utiliza Tesseract.js v5 que funciona completamente en el navegador.
                Para documentos de alta calidad, el texto se extrae directamente del PDF sin OCR.
                El OCR solo se aplica cuando se detecta que la página es una imagen escaneada.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
