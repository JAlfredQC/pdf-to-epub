export interface RegexRule {
  id: string;
  name: string;
  pattern: string;
  replacement: string;
  enabled: boolean;
  description: string;
}

export interface DictionaryEntry {
  id: string;
  original: string;
  correction: string;
  enabled: boolean;
  category: string;
}

export interface TemplateSection {
  id: string;
  name: string;
  type: 'cover' | 'toc' | 'chapter' | 'appendix' | 'copyright' | 'dedication';
  htmlTemplate: string;
  cssClass: string;
  order: number;
}

export interface OCRSettings {
  language: string;
  confidence: number;
  autoRotate: boolean;
  deskew: boolean;
  removeNoise: boolean;
}

export interface ConversionState {
  status: 'idle' | 'loading' | 'processing' | 'ocr' | 'comparing' | 'generating' | 'done' | 'error';
  progress: number;
  message: string;
  currentPage: number;
  totalPages: number;
}

export interface PageData {
  pageNumber: number;
  originalText: string;
  processedText: string;
  imageUrl: string;
  ocrConfidence: number;
}

export interface EpubMetadata {
  title: string;
  author: string;
  language: string;
  description: string;
  publisher: string;
  isbn: string;
}
