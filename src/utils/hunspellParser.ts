/**
 * Parser para archivos de diccionario Hunspell (.aff y .dic)
 * Utilizado para corrección ortográfica y validación de texto
 */

export interface AffixRule {
  type: 'PFX' | 'SFX';
  flag: string;
  combining: boolean;
  strip: string;
  add: string;
  condition: string;
}

export interface ReplacementRule {
  from: string;
  to: string;
}

export interface AffData {
  encoding: string;
  tryChars: string;
  replacements: ReplacementRule[];
  prefixes: AffixRule[];
  suffixes: AffixRule[];
  mapRules: string[][];
}

export interface DicData {
  wordCount: number;
  words: Set<string>;
  wordFlags: Map<string, string>;
}

/**
 * Parsea un archivo .aff de Hunspell
 */
export function parseAffFile(content: string): AffData {
  const lines = content.split('\n');
  const result: AffData = {
    encoding: 'UTF-8',
    tryChars: '',
    replacements: [],
    prefixes: [],
    suffixes: [],
    mapRules: [],
  };

  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();

    if (line.startsWith('SET ')) {
      result.encoding = line.substring(4).trim();
    }
    else if (line.startsWith('TRY ')) {
      result.tryChars = line.substring(4).trim();
    }
    else if (line.startsWith('REP ')) {
      const parts = line.substring(4).trim().split(/\s+/);
      if (parts.length === 1) {
        // REP count - skip, read individual entries
        const count = parseInt(parts[0]);
        for (let j = 0; j < count && i + 1 < lines.length; j++) {
          i++;
          const repLine = lines[i].trim();
          if (repLine.startsWith('REP ')) {
            const repParts = repLine.substring(4).trim().split(/\s+/);
            if (repParts.length >= 2) {
              result.replacements.push({
                from: repParts[0],
                to: repParts[1],
              });
            }
          }
        }
      } else if (parts.length >= 2) {
        result.replacements.push({
          from: parts[0],
          to: parts[1],
        });
      }
    }
    else if (line.startsWith('MAP ')) {
      const parts = line.substring(4).trim();
      if (/^\d+$/.test(parts)) {
        const count = parseInt(parts);
        for (let j = 0; j < count && i + 1 < lines.length; j++) {
          i++;
          const mapLine = lines[i].trim();
          if (mapLine.startsWith('MAP ')) {
            const mapContent = mapLine.substring(4).trim();
            result.mapRules.push(mapContent.split(''));
          }
        }
      }
    }
    else if (line.startsWith('PFX ') || line.startsWith('SFX ')) {
      const parts = line.split(/\s+/);
      if (parts.length >= 4) {
        const type = parts[0] as 'PFX' | 'SFX';
        const flag = parts[1];
        const combining = parts[2] === 'Y';

        if (parts.length === 4 && /^\d+$/.test(parts[3])) {
          // Header line with count
          const count = parseInt(parts[3]);
          for (let j = 0; j < count && i + 1 < lines.length; j++) {
            i++;
            const ruleLine = lines[i].trim();
            const ruleParts = ruleLine.split(/\s+/);
            if (ruleParts.length >= 5 && (ruleParts[0] === 'PFX' || ruleParts[0] === 'SFX')) {
              const rule: AffixRule = {
                type: ruleParts[0] as 'PFX' | 'SFX',
                flag: ruleParts[1],
                combining: combining,
                strip: ruleParts[2] === '0' ? '' : ruleParts[2],
                add: ruleParts[3] === '0' ? '' : ruleParts[3],
                condition: ruleParts[4] || '.',
              };
              if (type === 'PFX') {
                result.prefixes.push(rule);
              } else {
                result.suffixes.push(rule);
              }
            }
          }
        }
      }
    }

    i++;
  }

  return result;
}

/**
 * Parsea un archivo .dic de Hunspell
 */
export function parseDicFile(content: string): DicData {
  const lines = content.split('\n');
  const words = new Set<string>();
  const wordFlags = new Map<string, string>();

  let wordCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // First line is usually the count
    if (i === 0 && /^\d+$/.test(line)) {
      wordCount = parseInt(line);
      continue;
    }

    // Format: word/flags or just word
    const slashIdx = line.indexOf('/');
    if (slashIdx > 0) {
      const word = line.substring(0, slashIdx);
      const flags = line.substring(slashIdx + 1);
      words.add(word);
      wordFlags.set(word, flags);
    } else {
      words.add(line);
    }
  }

  return {
    wordCount: wordCount || words.size,
    words,
    wordFlags,
  };
}

/**
 * Verifica si una palabra existe en el diccionario
 */
export function isWordInDictionary(word: string, dic: DicData): boolean {
  return dic.words.has(word.toLowerCase());
}

/**
 * Sugiere correcciones para una palabra usando las reglas de reemplazo del .aff
 */
export function suggestCorrections(word: string, aff: AffData, dic: DicData, maxSuggestions: number = 5): string[] {
  const suggestions: string[] = [];
  const lowerWord = word.toLowerCase();

  // Try direct replacements from REP rules
  for (const rep of aff.replacements) {
    const idx = lowerWord.indexOf(rep.from);
    if (idx >= 0) {
      const corrected = lowerWord.substring(0, idx) + rep.to + lowerWord.substring(idx + rep.from.length);
      if (dic.words.has(corrected) && !suggestions.includes(corrected)) {
        suggestions.push(corrected);
        if (suggestions.length >= maxSuggestions) break;
      }
    }
  }

  // Try MAP rules (character substitutions)
  for (const mapGroup of aff.mapRules) {
    for (let i = 0; i < lowerWord.length; i++) {
      const charIdx = mapGroup.indexOf(lowerWord[i]);
      if (charIdx >= 0) {
        for (const alt of mapGroup) {
          if (alt !== lowerWord[i]) {
            const corrected = lowerWord.substring(0, i) + alt + lowerWord.substring(i + 1);
            if (dic.words.has(corrected) && !suggestions.includes(corrected)) {
              suggestions.push(corrected);
              if (suggestions.length >= maxSuggestions) break;
            }
          }
        }
      }
    }
    if (suggestions.length >= maxSuggestions) break;
  }

  // Try removing extra characters
  for (let i = 0; i < lowerWord.length; i++) {
    const corrected = lowerWord.substring(0, i) + lowerWord.substring(i + 1);
    if (dic.words.has(corrected) && !suggestions.includes(corrected)) {
      suggestions.push(corrected);
      if (suggestions.length >= maxSuggestions) break;
    }
  }

  return suggestions;
}

/**
 * Extrae las reglas de reemplazo comunes para OCR del archivo .aff
 */
export function getOCRReplacements(aff: AffData): { from: string; to: string }[] {
  return aff.replacements.map(r => ({
    from: r.from,
    to: r.to,
  }));
}

/**
 * Obtiene estadísticas del diccionario
 */
export function getDictionaryStats(dic: DicData, aff: AffData) {
  return {
    totalWords: dic.words.size,
    totalPrefixes: aff.prefixes.length,
    totalSuffixes: aff.suffixes.length,
    totalReplacements: aff.replacements.length,
    totalMapRules: aff.mapRules.length,
    encoding: aff.encoding,
  };
}
