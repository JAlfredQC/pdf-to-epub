import { RegexRule } from '../types';

/**
 * Parser para archivos de configuración de RegEx de Sigil
 * Formato: [search_entries] con N\Name=, N\Find=, N\Replace=, N\Controls=
 */
export function parseSigilRegexFile(content: string): RegexRule[] {
  const rules: RegexRule[] = [];
  const lines = content.split('\n');

  const entries = new Map<number, { name?: string; find?: string; replace?: string }>();

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed === '[search_entries]') continue;

    // Match pattern: N\Key="value" or N\Key=value
    const match = trimmed.match(/^(\d+)\\(Name|Find|Replace|Controls)=(.*)$/);
    if (match) {
      const num = parseInt(match[1]);
      const key = match[2];
      let value = match[3];

      // Remove surrounding quotes if present
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }

      if (!entries.has(num)) {
        entries.set(num, {});
      }

      const entry = entries.get(num)!;

      switch (key) {
        case 'Name':
          entry.name = value;
          break;
        case 'Find':
          entry.find = value;
          break;
        case 'Replace':
          entry.replace = value;
          break;
      }
    }
  }

  // Convert entries to RegexRule objects
  for (const [num, entry] of entries) {
    if (entry.find !== undefined) {
      // Extract category from name path
      const nameParts = (entry.name || '').split('/');
      const category = nameParts.length > 2 ? nameParts.slice(0, -1).join(' / ') : 'General';
      const shortName = nameParts[nameParts.length - 1] || `Regla ${num}`;

      rules.push({
        id: `sigil-${num}`,
        name: shortName,
        pattern: entry.find,
        replacement: entry.replace || '',
        enabled: true,
        description: `[${category}]`,
      });
    }
  }

  return rules;
}

/**
 * Get categories from parsed rules
 */
export function getCategories(rules: RegexRule[]): string[] {
  const categories = new Set<string>();
  for (const rule of rules) {
    if (rule.description.startsWith('[')) {
      const cat = rule.description.slice(1, -1);
      categories.add(cat);
    }
  }
  return [...categories].sort();
}

/**
 * Group rules by category
 */
export function groupByCategory(rules: RegexRule[]): Map<string, RegexRule[]> {
  const groups = new Map<string, RegexRule[]>();

  for (const rule of rules) {
    const category = rule.description.startsWith('[')
      ? rule.description.slice(1, -1)
      : 'General';

    if (!groups.has(category)) {
      groups.set(category, []);
    }
    groups.get(category)!.push(rule);
  }

  return groups;
}
