import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { PDFUploader } from './components/PDFUploader';
import { OCRSettings } from './components/OCRSettings';
import { RegexEditor } from './components/RegexEditor';
import { DictionaryEditor } from './components/DictionaryEditor';
import { TemplateEditor } from './components/TemplateEditor';
import { ComparisonView } from './components/ComparisonView';
import { ConversionProgress } from './components/ConversionProgress';
import { MetadataEditor } from './components/MetadataEditor';
import { RegexRule, DictionaryEntry, OCRSettings as OCRSettingsType, ConversionState, PageData, EpubMetadata } from './types';
import { DEFAULT_REGEX_RULES } from './data/sigilPresets';

import { SpellChecker } from './components/SpellChecker';

type View = 'upload' | 'ocr' | 'regex' | 'dictionary' | 'spellcheck' | 'templates' | 'comparison' | 'progress' | 'metadata';

function App() {
  const [currentView, setCurrentView] = useState<View>('upload');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageData[]>([]);
  const [conversionState, setConversionStateRaw] = useState<ConversionState>({
    status: 'idle',
    progress: 0,
    message: '',
    currentPage: 0,
    totalPages: 0,
  });

  const setConversionState = (value: ConversionState | ((prev: ConversionState) => ConversionState)) => {
    if (typeof value === 'function') {
      setConversionStateRaw(prev => value(prev));
    } else {
      setConversionStateRaw(value);
    }
  };

  const [ocrSettings, setOcrSettings] = useState<OCRSettingsType>({
    language: 'spa',
    confidence: 75,
    autoRotate: true,
    deskew: true,
    removeNoise: true,
  });

  const [regexRules, setRegexRules] = useState<RegexRule[]>(DEFAULT_REGEX_RULES);

  const [dictionary, setDictionary] = useState<DictionaryEntry[]>([
    { id: '1', original: 'lñ', correction: 'la', enabled: true, category: 'OCR común' },
    { id: '2', original: 'e|', correction: 'el', enabled: true, category: 'OCR común' },
    { id: '3', original: 'c0n', correction: 'con', enabled: true, category: 'OCR común' },
    { id: '4', original: 'rn', correction: 'm', enabled: true, category: 'OCR común' },
    { id: '5', original: 'vv', correction: 'w', enabled: true, category: 'OCR común' },
  ]);



  const [metadata, setMetadata] = useState<EpubMetadata>({
    title: '',
    author: '',
    language: 'es',
    description: '',
    publisher: '',
    isbn: '',
  });

  const renderView = () => {
    switch (currentView) {
      case 'upload':
        return <PDFUploader onFileLoaded={setPdfFile} pages={pages} setPages={setPages} />;
      case 'ocr':
        return <OCRSettings settings={ocrSettings} setSettings={setOcrSettings} />;
      case 'regex':
        return <RegexEditor rules={regexRules} setRules={setRegexRules} />;
      case 'dictionary':
        return <DictionaryEditor entries={dictionary} setEntries={setDictionary} />;
      case 'spellcheck':
        return <SpellChecker />;
      case 'templates':
        return <TemplateEditor />;
      case 'comparison':
        return <ComparisonView pages={pages} />;
      case 'progress':
        return (
          <ConversionProgress
            state={conversionState}
            setState={setConversionState}
            pages={pages}
            metadata={metadata}
            regexRules={regexRules}
            dictionary={dictionary}
            ocrSettings={ocrSettings}
            pdfFile={pdfFile}
          />
        );
      case 'metadata':
        return <MetadataEditor metadata={metadata} setMetadata={setMetadata} />;
      default:
        return <PDFUploader onFileLoaded={setPdfFile} pages={pages} setPages={setPages} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} pdfLoaded={!!pdfFile} />
      <main className="flex-1 overflow-auto">
        <div className="p-6 h-full">
          {renderView()}
        </div>
      </main>
    </div>
  );
}

export default App;
