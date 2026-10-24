import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { EpubMetadata, PageData } from '../types';
import { ALL_TEMPLATES } from '../data/epubTemplates';

function generateContainerXML(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`;
}

function generateOPF(metadata: EpubMetadata, templates: typeof ALL_TEMPLATES, chapters: PageData[]): string {
  const xhtmlItems = templates
    .filter(t => t.type !== 'css')
    .map((t, i) => `    <item id="${t.id}" href="Text/${t.filename}" media-type="application/xhtml+xml"/>`)
    .join('\n');

  const chapterItems = chapters.map((_, i) => 
    `    <item id="chapter-${i}" href="Text/capitulo${i + 1}.xhtml" media-type="application/xhtml+xml"/>`
  ).join('\n');

  const cssItems = templates
    .filter(t => t.type === 'css')
    .map(t => `    <item id="${t.id}" href="Styles/${t.filename}" media-type="text/css"/>`)
    .join('\n');

  const spineItems = templates
    .filter(t => t.type !== 'css')
    .map(t => `    <itemref idref="${t.id}"/>`)
    .join('\n');

  const chapterSpineItems = chapters.map((_, i) => 
    `    <itemref idref="chapter-${i}"/>`
  ).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="BookId">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf">
    <dc:title>${metadata.title}</dc:title>
    <dc:creator>${metadata.author}</dc:creator>
    <dc:language>${metadata.language}</dc:language>
    <dc:description>${metadata.description}</dc:description>
    <dc:publisher>${metadata.publisher}</dc:publisher>
    <dc:identifier id="BookId">${metadata.isbn || 'urn:uuid:' + crypto.randomUUID()}</dc:identifier>
    <meta property="dcterms:modified">${new Date().toISOString().split('.')[0]}Z</meta>
  </metadata>
  <manifest>
${xhtmlItems}
${chapterItems}
${cssItems}
  </manifest>
  <spine>
${spineItems}
${chapterSpineItems}
  </spine>
</package>`;
}

function processTemplate(template: string, metadata: EpubMetadata, chapters: PageData[]): string {
  let result = template;
  
  result = result.replace(/\{\{title\}\}/g, metadata.title);
  result = result.replace(/\{\{author\}\}/g, metadata.author);
  result = result.replace(/\{\{language\}\}/g, metadata.language);
  result = result.replace(/\{\{description\}\}/g, metadata.description);
  result = result.replace(/\{\{publisher\}\}/g, metadata.publisher);
  result = result.replace(/\{\{isbn\}\}/g, metadata.isbn);
  result = result.replace(/\{\{date\}\}/g, new Date().toLocaleDateString('es-ES'));
  result = result.replace(/\{\{year\}\}/g, new Date().getFullYear().toString());
  
  result = result.replace(/\{\{subtitle\}\}/g, '');
  result = result.replace(/\{\{series\}\}/g, '');
  result = result.replace(/\{\{originalTitle\}\}/g, metadata.title);
  result = result.replace(/\{\{translator\}\}/g, '');
  result = result.replace(/\{\{editor\}\}/g, 'Titivillus');
  result = result.replace(/\{\{dedicationText\}\}/g, '');
  result = result.replace(/\{\{epigraphText\}\}/g, '');
  result = result.replace(/\{\{epigraphAuthor\}\}/g, '');
  result = result.replace(/\{\{epigraphSource\}\}/g, '');
  result = result.replace(/\{\{synopsisContent\}\}/g, `<p>${metadata.description || ''}</p>`);
  result = result.replace(/\{\{authorBio\}\}/g, `<p>${metadata.author}</p>`);
  result = result.replace(/\{\{notesContent\}\}/g, '');
  
  const navItems = chapters.map((ch, i) => 
    `    <li><a href="capitulo${i + 1}.xhtml">${ch.processedText.split('\n')[0] || `Capítulo ${i + 1}`}</a></li>`
  ).join('\n');
  result = result.replace(/\{\{navItems\}\}/g, navItems);
  
  const landmarkItems = chapters.length > 0 
    ? `    <li><a epub:type="chapter" href="capitulo1.xhtml">Capítulo</a></li>`
    : '';
  result = result.replace(/\{\{landmarkItems\}\}/g, landmarkItems);
  
  const tocItems = chapters.map((ch, i) => 
    `  <div class="sgc-toc-level-1">\n    <a href="capitulo${i + 1}.xhtml">${ch.processedText.split('\n')[0] || `Capítulo ${i + 1}`}</a>\n  </div>`
  ).join('\n');
  result = result.replace(/\{\{tocItems\}\}/g, tocItems);
  
  return result;
}

function generateChapterXHTML(chapter: PageData, chapterNum: number): string {
  const title = chapter.processedText.split('\n')[0] || `Capítulo ${chapterNum}`;
  const content = chapter.processedText
    .split('\n')
    .filter(line => line.trim())
    .map(line => `<p>${line}</p>`)
    .join('\n\n  ');

  return `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="es" xml:lang="es">
<head>
  <title>${title}</title>
  <meta charset="utf-8"/>
  <link href="../Styles/epl.css" type="text/css" rel="stylesheet"/>
  <link href="../Styles/style.css" type="text/css" rel="stylesheet"/>
</head>

<body>
  <h1 title="${title}">${title}</h1>

  ${content}
</body>
</html>`;
}

export async function generateEpub(
  metadata: EpubMetadata,
  pages: PageData[],
  customTemplates?: typeof ALL_TEMPLATES
): Promise<void> {
  const zip = new JSZip();

  zip.file('mimetype', 'application/epub+zip', { compression: 'STORE' });

  zip.folder('META-INF')!.file('container.xml', generateContainerXML());

  const oebps = zip.folder('OEBPS')!;
  const textFolder = oebps.folder('Text')!;
  const stylesFolder = oebps.folder('Styles')!;
  oebps.folder('Images')!;

  const templates = customTemplates || ALL_TEMPLATES;

  oebps.file('content.opf', generateOPF(metadata, templates, pages));

  for (const template of templates) {
    if (template.type === 'css') {
      stylesFolder.file(template.filename, template.content);
    } else {
      const processed = processTemplate(template.content, metadata, pages);
      textFolder.file(template.filename, processed);
    }
  }

  for (let i = 0; i < pages.length; i++) {
    const chapterXHTML = generateChapterXHTML(pages[i], i + 1);
    textFolder.file(`capitulo${i + 1}.xhtml`, chapterXHTML);
  }

  const blob = await zip.generateAsync({ type: 'blob', mimeType: 'application/epub+zip' });
  saveAs(blob, `${metadata.title || 'documento'}.epub`);
}
