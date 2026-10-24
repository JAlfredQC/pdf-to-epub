/**
 * Plantillas EPUB basadas en ePub-base 3.0 ePubLibre
 * Fuente: https://github.com/Erlodafer/Epub
 *
 * Estos archivos se incluyen en el EPUB final generado.
 */

export interface EpubTemplate {
  id: string;
  filename: string;
  name: string;
  type: 'cover' | 'titlepage' | 'copyright' | 'dedication' | 'epigraph' | 'synopsis' | 'author' | 'chapter' | 'notes' | 'nav' | 'toc' | 'css';
  content: string;
  description: string;
  order: number;
  required: boolean;
}

export const COVER_TEMPLATE = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="es" xml:lang="es">
<head>
  <title>Cubierta</title>
  <meta charset="utf-8"/>
  <link href="../Styles/epl.css" type="text/css" rel="stylesheet"/>
</head>

<body class="cubierta">
  <section epub:type="cover" id="cubierta">
    <figure>
      <img alt="Cubierta" src="../Images/cubierta.jpg"/>
    </figure>
  </section>
</body>
</html>`;

export const TITLEPAGE_TEMPLATE = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="es" xml:lang="es">
<head>
  <title>Título</title>
  <meta charset="utf-8"/>
  <link href="../Styles/epl.css" type="text/css" rel="stylesheet"/>
</head>

<body epub:type="frontmatter">
  <section epub:type="titlepage" id="titulo">
    <figure class="tlogo">
      <img alt="" src="../Images/EPL_logo.png" role="presentation"/>
    </figure>

    <p class="tautor">{{author}}</p>

    <h1 class="ttitulo" epub:type="title">{{title}}</h1>

    <p class="tsubtitulo" epub:type="subtitle" role="doc-subtitle">{{subtitle}}</p>

    <p class="tserie">{{series}}</p>

    <p class="trevision">ePub r1.0</p>

    <p class="tfirma">Titivillus <span class="tfecha">{{date}}</span></p>
  </section>
</body>
</html>`;

export const INFO_TEMPLATE = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="es" xml:lang="es">
<head>
  <title>Créditos</title>
  <meta charset="utf-8"/>
  <link href="../Styles/epl.css" type="text/css" rel="stylesheet"/>
</head>

<body epub:type="frontmatter">
  <section epub:type="copyright-page" id="info">
    <p>Título original: <cite>{{originalTitle}}</cite></p>

    <p>{{author}}, {{year}} de 1.ª publicación en idioma original</p>

    <p>Traducción: {{translator}}</p>

    <p>&#160;</p>

    <p>Editor digital: {{editor}}</p>

    <p>ePub base r3.0 (ePub 3)</p>

    <p>&#160;</p>

    <div class="aviso">
      <p><img alt="" src="../Images/fuente.png" role="presentation"/><small>Para una óptima experiencia de lectura, use la opción <i>Fuente Original / Fuente del editor / Predeterminada</i>.</small></p>
    </div>

    <figure class="exlibris">
      <img alt="" src="../Images/ex_libris.png" role="presentation"/>
    </figure>
  </section>
</body>
</html>`;

export const DEDICATION_TEMPLATE = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="es" xml:lang="es">
<head>
  <title>Dedicatoria</title>
  <meta charset="utf-8"/>
  <link href="../Styles/epl.css" type="text/css" rel="stylesheet"/>
  <link href="../Styles/style.css" type="text/css" rel="stylesheet"/>
</head>

<body epub:type="frontmatter">
  <section class="dedicatoria" epub:type="dedication" role="doc-dedication">
    <p>{{dedicationText}}</p>
  </section>
</body>
</html>`;

export const EPIGRAPH_TEMPLATE = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="es" xml:lang="es">
<head>
  <title>Epígrafe</title>
  <meta charset="utf-8"/>
  <link href="../Styles/epl.css" rel="stylesheet" type="text/css"/>
  <link href="../Styles/style.css" rel="stylesheet" type="text/css"/>
</head>

<body epub:type="frontmatter">
  <section epub:type="epigraph" role="doc-epigraph">
    <blockquote class="epigrafe1">
      <p class="asangre">{{epigraphText}}</p>

      <p class="derecha salto05"><span class="smallcaps">{{epigraphAuthor}}</span>, <cite>{{epigraphSource}}</cite></p>
    </blockquote>
  </section>
</body>
</html>`;

export const SYNOPSIS_TEMPLATE = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="es" xml:lang="es">
<head>
  <title>Sinopsis</title>
  <meta charset="utf-8"/>
  <link href="../Styles/epl.css" type="text/css" rel="stylesheet"/>
</head>

<body epub:type="frontmatter">
  <section class="sinopsis">
    {{synopsisContent}}
  </section>
</body>
</html>`;

export const AUTHOR_TEMPLATE = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="es" xml:lang="es">
<head>
  <title>Sobre el autor</title>
  <meta charset="utf-8"/>
  <link href="../Styles/epl.css" type="text/css" rel="stylesheet"/>
  <link href="../Styles/style.css" type="text/css" rel="stylesheet"/>
</head>

<body epub:type="backmatter">
  <section class="autor">
    <h1 class="oculto">Sobre el autor</h1>

    <figure>
      <img class="autor_foto" alt="Imagen del autor(a)" src="../Images/autor.jpg"/>
    </figure>

    {{authorBio}}
  </section>
</body>
</html>`;

export const CHAPTER_TEMPLATE = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="es" xml:lang="es">
<head>
  <title>{{chapterTitle}}</title>
  <meta charset="utf-8"/>
  <link href="../Styles/epl.css" type="text/css" rel="stylesheet"/>
  <link href="../Styles/style.css" type="text/css" rel="stylesheet"/>
</head>

<body>
  <h1 title="{{chapterTitle}}">{{chapterTitle}}</h1>

  {{chapterContent}}
</body>
</html>`;

export const NOTES_TEMPLATE = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="es" xml:lang="es">
<head>
  <title>Notas</title>
  <meta charset="utf-8"/>
  <link href="../Styles/epl.css" type="text/css" rel="stylesheet"/>
  <link href="../Styles/style.css" type="text/css" rel="stylesheet"/>
</head>

<body epub:type="backmatter footnotes">
  <h1>Notas</h1>

  {{notesContent}}
</body>
</html>`;

export const NAV_TEMPLATE = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="es" xml:lang="es">
<head>
  <title>ePub NAV</title>
  <meta charset="utf-8"/>
  <style type="text/css">
    ol { list-style-type: none; }
    </style>
  <link href="../Styles/sgc-nav.css" type="text/css" rel="stylesheet"/>
</head>

<body epub:type="frontmatter">
  <nav epub:type="toc" id="toc" role="doc-toc"><h1>Índice de contenido</h1>

  <ol>
    {{navItems}}
  </ol></nav>

  <nav epub:type="landmarks" id="landmarks" hidden=""><h1>Hitos</h1>

  <ol>
    <li><a epub:type="cover" href="cubierta.xhtml">Portada</a></li>
    <li><a epub:type="titlepage" href="titulo.xhtml">Página de título</a></li>
    <li><a epub:type="copyright-page" href="info.xhtml">Créditos</a></li>
    <li><a epub:type="toc" href="TOC.xhtml">Índice de contenido</a></li>
    {{landmarkItems}}
  </ol></nav>
</body>
</html>`;

export const TOC_TEMPLATE = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="es" xml:lang="es">
<head>
  <title>Índice de contenido</title>
  <meta charset="utf-8"/>
  <link href="../Styles/sgc-toc.css" type="text/css" rel="stylesheet"/>
</head>

<body>
  <div class="sgc-toc-title">
    Índice de contenido
  </div>

  {{tocItems}}
</body>
</html>`;

export const EPL_CSS = `/************************************
ePub-base 3.0 ePubLibre - epl.css
*************************************
NO MODIFIQUE ESTA HOJA DE ESTILOS
*************************************/
/*** RESET ***/
article, address, aside, blockquote, canvas, dd, details, div, dl, dt, figure, figcaption, footer, h1, h2, h3, h4, h5, h6, header, hr, li, main, nav, ol, p, pre, section, summary, ul {
  font-size: 1em;
  font-weight: inherit;
  font-style: inherit;
  line-height: inherit;
  margin: 0;
  padding: 0;
  text-indent: 0;
}

article, aside, figure, figcaption, footer, header, main, nav, section {
  display: block;
}

a, abbr, b, bdi, bdo, cite, code, data, del, dfn, em, i, ins, kbd, mark, s, samp, small, span, strong, sub, sup, time, u, var {
  font-size: inherit;
  vertical-align: baseline;
  font-style: inherit;
  font-weight: inherit;
  text-decoration: none;
  color: inherit;
}

[hidden] {
  display: none;
}

/******************* ELEMENTOS GLOBALES *******************/
body {
  font-size: 100%;
  font-weight: normal;
  font-style: normal;
  font-kerning: normal;
  font-variant-ligatures: common-ligatures contextual;
  line-height: 1.3;
  padding: 0;
  orphans: 2;
  widows: 2;
  -webkit-hyphens: auto;
  -epub-hyphens: auto;
  adobe-hyphenate: auto;
  hyphens: auto;
  -webkit-hyphenate-limit-before: 2;
  -webkit-hyphenate-limit-after: 2;
  hyphenate-limit-chars: 5 2 2;
  -webkit-hyphenate-limit-lines: 2;
  hyphenate-limit-lines: 2;
  -webkit-hyphenate-limit-last: page;
  hyphenate-limit-last: page;
}

canvas, iframe, img, video {
  height: auto;
  max-height: 100%;
  width: auto;
  max-width: 100%;
}

img, svg {
  object-fit: contain;
  vertical-align: bottom;
}

figure, .ilustra {
  margin: 1em 0;
  text-align: center;
  text-indent: 0;
}

figcaption {
  margin: 0.5em 0 0;
  font-size: 85%;
  text-indent: 0;
}

a {
  color: blue;
  text-decoration: underline;
}

a:visited {
  color: purple;
}

a[role="doc-noteref"] {
  font-weight: normal;
  font-style: normal;
  color: inherit;
}

sub, sup {
  font-size: 0.75em;
  line-height: 0;
  position: static;
}

sub {
  vertical-align: sub;
}

sup {
  vertical-align: super;
}

.serif {
  font-family: serif;
}

.sans {
  font-family: sans-serif;
}

code, kbd, samp, pre, .mono {
  font-family: monospace;
}

i, em, cite, dfn, var, .cursiva {
  font-style: italic;
}

i i, i cite, i dfn, i em, cite i, cite cite, cite dfn, cite em, dfn i, dfn cite, dfn dfn, dfn em, em i, em cite, em dfn, em em, .cursiva i, .cursiva cite, .cursiva dfn, .cursiva em {
  font-style: normal;
}

b, strong, .negrita {
  font-weight: bold;
}

pre {
  margin: 1em 0 1em 5%;
  white-space: pre-wrap;
  word-wrap: break-word;
  -webkit-tab-size: 2;
  tab-size: 2;
}

ins, u, .subrayado {
  text-decoration: underline;
}

del, s, .tachado {
  text-decoration: line-through;
}

mark {
  background-color: yellow;
  color: inherit;
}

.grande {
  font-size: larger;
}

.normal {
  font-style: normal;
  font-weight: normal;
  text-decoration: none;
}

.oculto {
  display: none;
}

.izquierda, .izquierda p {
  text-align: left;
  text-indent: 0;
}

.derecha, .derecha p {
  text-align: right;
  text-indent: 0;
}

.centrado, .centrado p {
  text-align: center;
  text-indent: 0;
}

p, li, dd, blockquote, figcaption, .justificado, .justificado p {
  text-align: justify;
}

.asangre, .asangre p {
  text-indent: 0;
}

.sangria, .sangria p {
  text-indent: 1.5em;
}

.sinmargen {
  margin: 0;
}

blockquote {
  display: block;
  margin: 1em 9%;
}

blockquote, q {
  quotes: none;
}

hr {
  display: block;
  width: 100%;
  height: 2.5em;
  margin: 0;
  border: none;
  background: none;
  color: inherit;
}

figure, hr, .bloque, .aviso, .ilustra {
  page-break-inside: avoid;
  break-inside: avoid;
}

abbr, .nosep {
  white-space: nowrap;
}

dl, ol, ul {
  margin: 1em 0;
}

ol, ul {
  padding-left: 8%;
}

ol ol, ul ul {
  margin-top: 0.25em;
  margin-bottom: 0.25em;
}

dt, pre {
  text-align: left;
}

dd {
  margin-left: 10%;
}

table {
  border-collapse: collapse;
  border-spacing: 0;
}

table, th, td {
  border-color: currentColor;
}

th {
  background: none;
  background-color: transparent;
}

h1, h2, h3, h4, h5, h6 {
  font-size: 1.2em;
  font-weight: bold;
  margin: 1em 0;
  text-align: center;
  text-indent: 0;
}

h1, h2, h3, h4, h5, h6, caption, dt, hr, th {
  page-break-inside: avoid;
  break-inside: avoid;
  page-break-after: avoid;
  break-after: avoid;
}

h1, h2, h3, h4, h5, h6, abbr, dt, pre, address, caption, code, var, kbd, samp, sub, sup, .izquierda, .derecha, .centrado, .nosep, .nosilabeo, #titulo p, #info p {
  -webkit-hyphens: none;
  -ms-hyphens: none;
  -moz-hyphens: none;
  -epub-hyphens: none;
  adobe-hyphenate: none;
  hyphens: none;
}

@supports (margin-bottom: 0) {
  body > :last-child, body > section > :last-child {
    margin-bottom: 0;
  }
}

.smallcaps {
  font-variant: small-caps;
}

@supports (font-variant-caps: small-caps) {
  .smallcaps {
    font-variant: normal;
    font-variant-caps: small-caps;
  }
}

small, .versalita {
  font-size: smaller;
}

@supports (font-variant-caps: all-small-caps) {
  .versalita {
    font-size: inherit;
    font-variant-caps: all-small-caps;
  }
}

.osfnum, .smallcaps, .versalita {
  font-variant-numeric: oldstyle-nums proportional-nums;
}

h1, h2, h3, h4, h5, h6, dt, sup, sub, a[role="doc-noteref"], a[role="doc-backlink"], #titulo, #info, .linum {
  font-variant-numeric: lining-nums proportional-nums;
}

table, .tabnum {
  font-variant-numeric: lining-nums tabular-nums;
}

code, kbd, samp, var, .mono {
  font-kerning: none;
  font-variant-ligatures: none;
  font-variant-numeric: lining-nums slashed-zero;
}

.cubierta {
  margin: 0;
  padding: 0;
  text-indent: 0;
  font-size: 0;
  clear: both;
  max-width: 100%;
  max-height: 100%;
  text-align: center;
  height: 95vh;
}

.cubierta img {
  height: 100%;
  width: auto;
}

.tlogo {
  margin: 15% 0 8%;
  text-align: center;
}

.exlibris {
  margin: 5% 0 8%;
  text-align: center;
}

.tlogo img, .exlibris img {
  width: 25%;
}

.tautor, .ttitulo, .tsubtitulo, .tserie, .trevision, .tfirma {
  font-family: sans-serif;
  font-weight: bold;
  font-style: normal;
  margin: 0 2%;
  text-align: center;
  text-indent: 0;
}

.tautor {
  font-size: 1.2em;
  font-weight: normal;
  margin-bottom: 0.5em;
  color: #525252;
}

.ttitulo {
  font-size: 1.8em;
}

.tsubtitulo, .tserie, .tfirma {
  font-size: 1em;
  margin-top: 0.3em;
}

.trevision {
  font-size: 0.8em;
  margin-top: 2.5em;
  color: #525252;
}

.tfirma {
  font-size: 0.65em;
}

.tfecha {
  font-size: 1em;
  font-weight: normal;
  color: #525252;
}

.sinopsis {
  margin-top: 10%;
}

.nota {
  padding-top: 1em;
  page-break-after: always;
}

@supports (margin-top: 1em) {
  .nota {
    padding-top: 0;
    margin-top: 1em;
    page-break-after: auto;
  }
}

.sinopsis p, .autor, .autor p, .nota p {
  font-size: 1em;
  margin: 0.5em 0 0;
  text-indent: 0;
}

#info {
  font-size: 0.8em;
  width: 90%;
  margin: 10% 5% 0;
}

#info p {
  text-align: left;
  text-indent: 0;
}

.aviso {
  display: block;
  clear: both;
  line-height: 1.2;
}

.aviso p {
  font-family: sans-serif;
}

.aviso img {
  width: 3em;
  padding: 0 10px 5px 0;
  float: left;
}

.autor_foto {
  width: 50%;
}

@media amzn-kf8 {
  body {
    font-family: Bookerly, Palatino, Caecilia, serif;
  }

  sup {
    vertical-align: 20%;
  }

  .versalita {
    font-size: inherit;
    text-transform: lowercase;
    font-variant: small-caps;
  }

  .nota {
    padding-top: 0;
    margin-top: 1em;
    page-break-after: auto;
  }
}`;

export const STYLE_CSS = `/* ePub-base 3.0 ePubLibre - style.css */

@namespace epub "http://www.idpf.org/2007/ops";
@namespace svg "http://www.w3.org/2000/svg";
@namespace m "http://www.w3.org/1998/Math/MathML/";

p {
  text-indent: 1.5em;
}

h1 {
  font-size: 1.5em;
  margin: 15% 0 2em;
}

h2, h3, h4, h5, h6 {
  margin: 2rem 0 1rem;
}

h2 {
  font-size: 1.4em;
}

h3 {
  font-size: 1.2em;
}

h4 {
  font-size: 1.2em;
}

h5 {
  font-size: 1.1em;
}

h6 {
  font-size: 1em;
}

.dedicatoria, .epigrafe1 {
  margin: 25% 1% 0 25%;
}

.dedicatoria p {
  text-align: right;
  text-indent: 0;
}

@supports (max-width: 20em) {
  .dedicatoria, .epigrafe1 {
    max-width: 20em;
    margin-left: auto;
    padding-left: 10%;
  }
}

figure, .ilustra {
  margin: 1em 0;
}

figcaption, .piefoto {
  font-size: 85%;
  margin: 0.5em 0;
}

.sintop {
  margin-top: 0;
}

.saltoinicio {
  margin-top: 25%;
}

.salto05 {
  padding-top: 0.5em;
}

.salto10 {
  padding-top: 1em;
}

.salto25 {
  padding-top: 2.5em;
}

hr {
  height: 2.5em;
}

hr.linea {
  width: 10%;
  height: 0;
  margin: 1em 45%;
  border: none;
  border-top: 0.125em solid gray;
}

hr.asterisco {
  overflow: hidden;
  width: auto;
  height: 1em;
  margin: 1em 0;
  background: transparent url("../Images/asterisco.svg") no-repeat center;
  background-size: 2.5em 1.25em;
}

@media amzn-kf8 {
  hr.asterisco {
    background: transparent url("../Images/asterisco.png") no-repeat center;
    background-size: 3em 1em;
  }
}

hr.imagen {
  overflow: hidden;
  width: auto;
  height: 1em;
  margin: 1em 0;
  background: transparent url("../Images/separador.png") no-repeat center;
  background-size: 5em 1em;
}

div.salto {
  font-size: 1em;
  margin: 1em 0;
  page-break-after: avoid;
  text-align: center;
  text-indent: 0;
}

h1 > sup > a, h2> sup > a, h3 > sup >a {
  font-size: 0.6em;
}

h1 + p, h2 + p, h3 + p, h4 + p, h5 + p, h6 + p, hr + p, blockquote + p, figure + p, ol + p, ul + p, table + p, header + p, dl + p {
  text-indent: 0;
}

span.capitular {
  font-size: 3em;
  float: left;
  margin: -0.2em 0.05em -0.55em 0;
}

@supports (-webkit-initial-letter: 3) or (initial-letter: 3) {
  span.capitular {
    font-size: inherit;
    float: none;
    margin: inherit;
  }

  .vprimera::first-letter {
    margin-right: 0.25em;
    -webkit-initial-letter: 3;
    initial-letter: 3;
  }
}

.vprimera::first-line, hr.asterisco + p::first-line {
  font-variant: small-caps;
  font-variant-numeric: oldstyle-nums proportional-nums;
}

.fraccion {
  font-variant-numeric: lining-nums diagonal-fractions;
}

.caja {
  font-size: 85%;
  margin: 1em 5% 1.5em;
  padding: 10px;
  border: 0.125em solid silver;
  border-radius: 10px;
  box-shadow: 0 4px 5px silver;
}

.caja img {
  border-radius: 5px;
}

.poema {
  margin: 1em 5%;
  font-size: 90%;
}

.poema p.estrofa {
  text-indent: 0;
  text-align: left;
  margin: 0 0 1em 1.5em;
}

.poema span.verso {
  margin-left: -1.5em;
}

.dedicatoria p, .poema p {
  adobe-hyphenate: none !important;
  -webkit-hyphens: none !important;
  -epub-hyphens: none !important;
  hyphens: none !important;
}`;

export const SGC_NAV_CSS = `/* ePub-base 3.0 ePubLibre - sgc-nav.css */
h1 {
  font-size: 1.1em;
  margin-top: 2em;
  margin-bottom: 2em;
  text-align: center;
  font-weight: normal;
}

ol {
  list-style-type: none !important;
}

nav ol {
  padding-left: 5%;
  font-variant-numeric: lining-nums;
}

nav#pagelist, nav#landmarks, a[href="cubierta.xhtml"], a[href="titulo.xhtml"], a[href="notas.xhtml"], .oculto {
  display: none;
}

nav ol li {
  font-size: 100%;
  margin-top: 0.25em;
  margin-left: 1.5em;
  text-align: left;
  text-indent: -1.5em;
}

nav ol ol li {
  font-size: 0.9rem;
  margin-top: 0.25em;
  margin-left: 1em;
  text-align: left;
  text-indent: -1.5em;
}

nav ol ol ol li {
  font-size: 0.8rem;
  margin-top: 0.25em;
  margin-left: 1em;
  text-align: left;
  text-indent: -1.5em;
}

nav ol ol ol ol li {
  font-size: 0.6rem;
  margin-top: 0.25em;
  margin-left: 1em;
  text-align: left;
  text-indent: -1.5em;
}

#toc a {
  color: inherit;
  text-decoration: none;
}`;

export const SGC_TOC_CSS = `/* ePub-base 3.0 ePubLibre - sgc-toc.css */
a[href="cubierta.xhtml"], a[href="titulo.xhtml"] {
  display: none;
}

div.sgc-toc-title {
  font-size: 1.1em;
  margin-top: 2em;
  margin-bottom: 2em;
  text-align: center;
}

div.sgc-toc-level-1 {
  font-variant-numeric: lining-nums;
  margin-bottom: 0.5em;
  margin-left: 1.5em;
  text-indent: -1.5em;
  text-align: left;
}

div.sgc-toc-level-2 {
  margin-left: 1em;
}

div.sgc-toc-level-3 {
  margin-left: 1em;
}

div.sgc-toc-level-4 {
  margin-left: 2em;
}

div.sgc-toc-level-5 {
  margin-left: 2em;
}

div.sgc-toc-level-6 {
  margin-left: 2em;
}

a {
  color: inherit;
  text-decoration: none;
}`;

/**
 * Todas las plantillas disponibles
 */
export const ALL_TEMPLATES: EpubTemplate[] = [
  {
    id: 'cubierta',
    filename: 'cubierta.xhtml',
    name: 'Cubierta',
    type: 'cover',
    content: COVER_TEMPLATE,
    description: 'Portada del libro con imagen de cubierta',
    order: 1,
    required: true,
  },
  {
    id: 'titulo',
    filename: 'titulo.xhtml',
    name: 'Página de título',
    type: 'titlepage',
    content: TITLEPAGE_TEMPLATE,
    description: 'Página con título, autor, subtítulo y datos editoriales',
    order: 2,
    required: true,
  },
  {
    id: 'info',
    filename: 'info.xhtml',
    name: 'Créditos',
    type: 'copyright',
    content: INFO_TEMPLATE,
    description: 'Página de créditos, copyright y datos de la edición',
    order: 3,
    required: true,
  },
  {
    id: 'sinopsis',
    filename: 'sinopsis.xhtml',
    name: 'Sinopsis',
    type: 'synopsis',
    content: SYNOPSIS_TEMPLATE,
    description: 'Resumen o sinopsis del libro',
    order: 4,
    required: false,
  },
  {
    id: 'dedicatoria',
    filename: 'dedicatoria.xhtml',
    name: 'Dedicatoria',
    type: 'dedication',
    content: DEDICATION_TEMPLATE,
    description: 'Página de dedicatoria',
    order: 5,
    required: false,
  },
  {
    id: 'epigrafe',
    filename: 'epigrafe.xhtml',
    name: 'Epígrafe',
    type: 'epigraph',
    content: EPIGRAPH_TEMPLATE,
    description: 'Cita o epígrafe al inicio del libro',
    order: 6,
    required: false,
  },
  {
    id: 'nav',
    filename: 'nav.xhtml',
    name: 'NAV (Índice EPUB3)',
    type: 'nav',
    content: NAV_TEMPLATE,
    description: 'Navegación EPUB3 con TOC y landmarks',
    order: 7,
    required: true,
  },
  {
    id: 'toc',
    filename: 'TOC.xhtml',
    name: 'TOC (Índice visual)',
    type: 'toc',
    content: TOC_TEMPLATE,
    description: 'Índice de contenido visual (SGC)',
    order: 8,
    required: true,
  },
  {
    id: 'chapter',
    filename: 'capitulo.xhtml',
    name: 'Capítulo',
    type: 'chapter',
    content: CHAPTER_TEMPLATE,
    description: 'Plantilla base para capítulos',
    order: 9,
    required: true,
  },
  {
    id: 'notes',
    filename: 'notas.xhtml',
    name: 'Notas',
    type: 'notes',
    content: NOTES_TEMPLATE,
    description: 'Notas al pie o finales',
    order: 10,
    required: false,
  },
  {
    id: 'author',
    filename: 'autor.xhtml',
    name: 'Sobre el autor',
    type: 'author',
    content: AUTHOR_TEMPLATE,
    description: 'Biografía del autor',
    order: 11,
    required: false,
  },
  {
    id: 'epl-css',
    filename: 'epl.css',
    name: 'epl.css (base)',
    type: 'css',
    content: EPL_CSS,
    description: 'Hoja de estilos base ePubLibre - NO MODIFICAR',
    order: 100,
    required: true,
  },
  {
    id: 'style-css',
    filename: 'style.css',
    name: 'style.css (personal)',
    type: 'css',
    content: STYLE_CSS,
    description: 'Hoja de estilos personalizable del libro',
    order: 101,
    required: true,
  },
  {
    id: 'sgc-nav-css',
    filename: 'sgc-nav.css',
    name: 'sgc-nav.css',
    type: 'css',
    content: SGC_NAV_CSS,
    description: 'Estilos para navegación EPUB3',
    order: 102,
    required: true,
  },
  {
    id: 'sgc-toc-css',
    filename: 'sgc-toc.css',
    name: 'sgc-toc.css',
    type: 'css',
    content: SGC_TOC_CSS,
    description: 'Estilos para índice de contenido visual',
    order: 103,
    required: true,
  },
];
