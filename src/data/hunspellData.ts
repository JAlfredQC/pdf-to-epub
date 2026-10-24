/**
 * Reglas de reemplazo OCR extraídas del archivo es_c2c_1_epublibre.aff
 * Estas reglas se usan para corregir errores comunes de reconocimiento óptico
 */

export const OCR_REPLACEMENTS_FROM_AFF = [
  { from: 'ás', to: 'az', description: 'Error OCR: ás → az' },
  { from: 'az', to: 'ás', description: 'Error OCR: az → ás' },
  { from: 'cc', to: 'x', description: 'Error OCR: cc → x' },
  { from: 'ás', to: 'ez', description: 'Error OCR: ás → ez' },
  { from: 'ez', to: 'ás', description: 'Error OCR: ez → ás' },
  { from: 'güe', to: 'hue', description: 'Error OCR: güe → hue' },
  { from: 'güi', to: 'hui', description: 'Error OCR: güi → hui' },
  { from: 'hue', to: 'güe', description: 'Error OCR: hue → güe' },
  { from: 'hui', to: 'güi', description: 'Error OCR: hui → güi' },
  { from: 'ás', to: 'iz', description: 'Error OCR: ás → iz' },
  { from: 'ó', to: 'ido', description: 'Error OCR: ó → ido' },
  { from: 'ke', to: 'que', description: 'Error OCR: ke → que' },
  { from: 'ki', to: 'qui', description: 'Error OCR: ki → qui' },
  { from: 'll', to: 'y', description: 'Error OCR: ll → y' },
  { from: 'mb', to: 'nv', description: 'Error OCR: mb → nv' },
  { from: 'nv', to: 'mb', description: 'Error OCR: nv → mb' },
  { from: 'seci', to: 'cesi', description: 'Error OCR: seci → cesi' },
  { from: 'x', to: 'cc', description: 'Error OCR: x → cc' },
  { from: 'y', to: 'll', description: 'Error OCR: y → ll' },
  { from: 'vámonos', to: 'vayámonos', description: 'Corrección: vámonos → vayámonos' },
];

/**
 * Grupos de mapeo de caracteres similares (confusos para OCR)
 * Extraídos del archivo .aff
 */
export const OCR_CHAR_MAPS = [
  { chars: ['a', 'á', 'A', 'Á'], description: 'Vocales A' },
  { chars: ['e', 'é', 'E', 'É'], description: 'Vocales E' },
  { chars: ['i', 'í', 'I', 'Í'], description: 'Vocales I' },
  { chars: ['o', 'ó', 'O', 'Ó'], description: 'Vocales O' },
  { chars: ['u', 'ú', 'ü', 'U', 'Ú', 'Ü'], description: 'Vocales U' },
];

/**
 * Caracteres de prueba para detección de idioma
 */
export const TRY_CHARS = 'aeroinsctldumpbgfvhzñjüqéxykÁÉÍÓÚÑÜmwAEROINSCTLDUMPBGFVHZÑJÜQÉXYKÁMW';

/**
 * Información sobre el diccionario
 */
export const DICTIONARY_INFO = {
  name: 'es_c2c_1_epublibre',
  language: 'Español',
  encoding: 'ISO8859-1',
  source: 'https://github.com/Erlodafer/Epub',
  description: 'Diccionario Hunspell para español optimizado para corrección de textos en ePubLibre',
  affFile: 'es_c2c_1_epublibre.aff',
  dicFile: 'es_c2c_1_epublibre.dic',
};

/**
 * Prefijos comunes en español (del archivo .aff)
 * Estos se usan para generar palabras derivadas
 */
export const COMMON_PREFIXES = [
  { prefix: 'a', meaning: 'negación o privación', examples: ['ateo', 'amoral'] },
  { prefix: 'ante', meaning: 'anterioridad', examples: ['antebrazo', 'anteceder'] },
  { prefix: 'anti', meaning: 'oposición', examples: ['antiaéreo', 'antivirus'] },
  { prefix: 'auto', meaning: 'propio o por sí mismo', examples: ['automóvil', 'autobiografía'] },
  { prefix: 'bi', meaning: 'dos', examples: ['bicolor', 'bisabuelo'] },
  { prefix: 'con', meaning: 'compañía o unión', examples: ['conectar', 'convivir'] },
  { prefix: 'de', meaning: 'negación o inversión', examples: ['destruir', 'decodificar'] },
  { prefix: 'des', meaning: 'negación', examples: ['desorden', 'descubrir'] },
  { prefix: 'em/en', meaning: 'en o hacia dentro', examples: ['empujar', 'encerrar'] },
  { prefix: 'entre', meaning: 'intermedio', examples: ['entrecano', 'entrelazar'] },
  { prefix: 'im/in', meaning: 'negación o dentro', examples: ['imposible', 'informe'] },
  { prefix: 'inter', meaning: 'entre o en medio', examples: ['intercontinental', 'intervalo'] },
  { prefix: 'micro', meaning: 'pequeño', examples: ['microscopio', 'microonda'] },
  { prefix: 'pre', meaning: 'anterioridad', examples: ['precalentar', 'prehistoria'] },
  { prefix: 'pro', meaning: 'favor o adelante', examples: ['proponer', 'progreso'] },
  { prefix: 're', meaning: 'repetición o intensidad', examples: ['rehacer', 'rebuscar'] },
  { prefix: 'sem', meaning: 'medio o incompleto', examples: ['semicírculo', 'semidiós'] },
  { prefix: 'sobre', meaning: 'exceso o superioridad', examples: ['sobresalir', 'sobrecarga'] },
  { prefix: 'sub', meaning: 'debajo o inferior', examples: ['submarino', 'subterráneo'] },
  { prefix: 'super', meaning: 'superioridad o exceso', examples: ['supermercado', 'superhombre'] },
  { prefix: 'tran/trans', meaning: 'a través de', examples: ['transportar', 'transatlántico'] },
  { prefix: 'tra/tras', meaning: 'al otro lado', examples: ['traspasar', 'trasatlántico'] },
];

/**
 * Sufijos comunes en español (del archivo .aff)
 * Se usan para formar palabras derivadas
 */
export const COMMON_SUFFIXES = [
  { suffix: '-ción/-sión', meaning: 'acción y efecto', examples: ['educación', 'decisión'] },
  { suffix: '-dad/-idad', meaning: 'cualidad abstracta', examples: ['bondad', 'velocidad'] },
  { suffix: '-ero/-era', meaning: 'oficio o lugar', examples: ['panadero', 'librería'] },
  { suffix: '-ez/-eza', meaning: 'cualidad', examples: ['belleza', 'nobleza'] },
  { suffix: '-ismo', meaning: 'doctrina o sistema', examples: ['capitalismo', 'periodismo'] },
  { suffix: '-miento', meaning: 'acción y efecto', examples: ['conocimiento', 'sentimiento'] },
  { suffix: '-ción', meaning: 'acción verbal', examples: ['construcción', 'navegación'] },
  { suffix: '-dor/-dora', meaning: 'que realiza la acción', examples: ['trabajador', 'lavadora'] },
  { suffix: '-ble', meaning: 'posibilidad', examples: ['amable', 'posible'] },
  { suffix: '-illa/-illo', meaning: 'diminutivo', examples: ['mesilla', 'cuchillo'] },
  { suffix: '-azo/-aza', meaning: 'golpe o aumentativo', examples: ['portazo', 'casaza'] },
  { suffix: '-ito/-ita', meaning: 'diminutivo', examples: ['librito', 'casita'] },
  { suffix: '-ón/-ona', meaning: 'aumentativo', examples: ['portón', 'caserón'] },
  { suffix: '-al', meaning: 'conjunto o lugar', examples: ['pinar', 'rosaleda'] },
  { suffix: '-ar/-er/-ir', meaning: 'infinitivo verbal', examples: ['cantar', 'comer', 'vivir'] },
  { suffix: '-s', meaning: 'plural', examples: ['casas', 'libros'] },
];
