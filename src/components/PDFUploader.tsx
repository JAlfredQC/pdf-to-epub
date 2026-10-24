import { useState, useRef } from 'react';
import { PageData } from '../types';

interface PDFUploaderProps {
  onFileLoaded: (file: File) => void;
  pages: PageData[];
  setPages: (pages: PageData[]) => void;
}

export function PDFUploader({ onFileLoaded, pages, setPages }: PDFUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const [previewPages, setPreviewPages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (file.type !== 'application/pdf') {
      alert('Por favor selecciona un archivo PDF válido');
      return;
    }

    setFileName(file.name);
    onFileLoaded(file);

    // Generate preview thumbnails
    const arrayBuffer = await file.arrayBuffer();
    const pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

    const pdf = await pdfjsLib.getDocument({  arrayBuffer }).promise;
    const numPages = pdf.numPages;
    const previews: string[] = [];
    const pageDataList: PageData[] = [];

    for (let i = 1; i <= Math.min(numPages, 20); i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 0.5 });
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d')!;

      await page.render({ canvasContext: ctx, viewport }).promise;
      previews.push(canvas.toDataURL());

      // Try to extract text
      const textContent = await page.getTextContent();
      const text = textContent.items.map((item: any) => item.str).join(' ');

      pageDataList.push({
        pageNumber: i,
        originalText: text,
        processedText: text,
        imageUrl: canvas.toDataURL(),
        ocrConfidence: text.length > 50 ? 95 : 0,
      });
    }

    setPreviewPages(previews);
    setPages(pageDataList);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Cargar Archivo PDF</h2>
        <p className="text-gray-400">
          Selecciona un archivo PDF para comenzar la conversión. La aplicación detectará automáticamente
          si contiene texto o requiere OCR.
        </p>
      </div>

      <div
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer
          ${dragActive
            ? 'border-emerald-400 bg-emerald-400/5'
            : 'border-gray-600 hover:border-gray-500 bg-gray-800/50'
          }`}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />

        <div className="text-6xl mb-4">📄</div>
        <p className="text-lg text-gray-300 mb-2">
          Arrastra tu archivo PDF aquí o haz clic para seleccionar
        </p>
        <p className="text-sm text-gray-500">
          Formatos soportados: PDF (incluidos escaneados)
        </p>
      </div>

      {fileName && (
        <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
          <div className="flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <p className="text-white font-medium">{fileName}</p>
              <p className="text-sm text-gray-400">
                {pages.length} páginas cargadas • Listo para procesar
              </p>
            </div>
          </div>
        </div>
      )}

      {previewPages.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-white mb-4">Vista previa de páginas</h3>
          <div className="grid grid-cols-4 gap-4">
            {previewPages.map((page, idx) => (
              <div key={idx} className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-emerald-500/50 transition-all">
                <img src={page} alt={`Página ${idx + 1}`} className="w-full h-auto" />
                <div className="p-2 text-center text-xs text-gray-400">
                  Página {idx + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
