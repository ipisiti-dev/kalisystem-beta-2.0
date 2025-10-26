import { Item, Category, Supplier, Store, AppSettings, STORE_TAGS } from '@/types';
import { nanoid } from 'nanoid';

interface ParsedData {
  items: Item[];
  categories: Category[];
  suppliers: Supplier[];
  stores: Store[];
  settings?: AppSettings;
}

export function parseDefaultData(data: any): ParsedData {
  // Check if this is the new format
  if (!Array.isArray(data) && data.exportInfo?.version) {
    return {
      items: data.items || [],
      categories: Object.values(data.categories || {}),
      suppliers: Object.values(data.suppliers || {}),
      stores: Object.values(data.stores || {}),
      settings: data.settings || { posMode: true, autosave: true }
    };
  }

  // Handle legacy format
  if (Array.isArray(data) && data.length === 2) {
    const [categoryMap, supplierMap] = data;
    const uniqueCategories = new Set<string>();
    const uniqueSuppliers = new Set<string>();
    const items: Item[] = [];

    // Process items
    Object.entries(categoryMap)
      .filter(([key]) => key !== 'item')
      .forEach(([itemName, categoryInfo]) => {
        const supplier = supplierMap[itemName];
        if (typeof categoryInfo === 'string') {
          const [emoji, category] = categoryInfo.split(/(?=[A-Z])/);
          uniqueCategories.add(category);
          uniqueSuppliers.add(supplier);

          items.push({
            id: nanoid(),
            name: itemName,
            category,
            supplier,
            tags: []
          });
        }
      });

    // Create categories
    const categories: Category[] = Array.from(uniqueCategories).map(name => ({
      id: nanoid(),
      name,
      emoji: '📦' // Default emoji
    }));

    // Create suppliers with default values
    const suppliers: Supplier[] = Array.from(uniqueSuppliers).map(name => ({
      id: nanoid(),
      name,
      paymentMethod: 'COD',
      orderType: 'Delivery',
      defaultPaymentMethod: 'COD',
      defaultOrderType: 'Delivery'
    }));

    // Create default stores from STORE_TAGS
    const stores: Store[] = STORE_TAGS.map(tag => ({
      id: tag,
      name: tag.toUpperCase(),
      tag,
      isActive: true
    }));

    return {
      items,
      categories,
      suppliers,
      stores,
      settings: { posMode: true, autosave: true }
    };
  }

  throw new Error('Invalid data format');
}

export function serializeData(data: ParsedData): string {
  return JSON.stringify({
    items: data.items,
    categories: data.categories.reduce((acc, cat) => ({
      ...acc,
      [cat.id]: cat
    }), {}),
    suppliers: data.suppliers.reduce((acc, sup) => ({
      ...acc,
      [sup.id]: sup
    }), {}),
    settings: data.settings || { posMode: true, autosave: true },
    exportInfo: {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    }
  }, null, 2);
}

// --- Order parsing and matching utilities ---
export const UNITS = [
  'kg', 'g', 'l', 'ml', 'pc', 'pcs', 'can', 'cans', 'bt', 'bottle', 'bottles',
  'pk', 'pack', 'packs', 'jar', 'jars', 'bag', 'bags', 'small', 'big', 'lb', 'lbs', 'oz',
];

export const STOPWORDS = ['for', 'of', 'the', 'a', 'an', 'and', 'to'];

export function normalizeName(name: string): string {
  let normalized = name.toLowerCase().trim();
  UNITS.forEach(unit => {
    normalized = normalized.replace(new RegExp(`\\b${unit}\\b`, 'gi'), '');
  });
  STOPWORDS.forEach(word => {
    normalized = normalized.replace(new RegExp(`\\b${word}\\b`, 'gi'), '');
  });
  normalized = normalized.replace(/[^\w\s-]/g, '');
  normalized = normalized.replace(/s\b/g, '');
  normalized = normalized.replace(/\s+|-/g, ' ').trim();
  return normalized;
}

export function fuzzyMatch(searchName: string, catalogItems: Item[]): Item | undefined {
  const normalizedSearch = normalizeName(searchName);
  const exactMatch = catalogItems.find(
    item => normalizeName(item.name) === normalizedSearch
  );
  if (exactMatch) return exactMatch;
  const searchWords = normalizedSearch.split(' ').filter(Boolean);
  const overlapMatch = catalogItems.find(item => {
    const itemWords = normalizeName(item.name).split(' ').filter(Boolean);
    return (
      searchWords.every(w => itemWords.includes(w)) ||
      itemWords.every(w => searchWords.includes(w))
    );
  });
  if (overlapMatch) return overlapMatch;
  const substringMatch = catalogItems.find(item => {
    const normalizedItem = normalizeName(item.name).replace(/\s+/g, '');
    return (
      normalizedItem.includes(normalizedSearch.replace(/\s+/g, '')) ||
      normalizedSearch.replace(/\s+/g, '').includes(normalizedItem)
    );
  });
  if (substringMatch) return substringMatch;
  // Levenshtein distance
  const levenshteinDistance = (a: string, b: string): number => {
    const matrix: number[][] = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    return matrix[b.length][a.length];
  };
  let bestMatch: Item | undefined;
  let bestScore = 0;
  catalogItems.forEach(item => {
    const normalizedItem = normalizeName(item.name).replace(/\s+/g, '');
    const maxLen = Math.max(normalizedSearch.replace(/\s+/g, '').length, normalizedItem.length);
    if (maxLen === 0) return;
    const distance = levenshteinDistance(normalizedSearch.replace(/\s+/g, ''), normalizedItem);
    const similarity = 1 - distance / maxLen;
    const threshold = maxLen >= 8 ? 0.4 : 0.5;
    if (similarity > bestScore && similarity >= threshold) {
      bestScore = similarity;
      bestMatch = item;
    }
  });
  if (!bestMatch && normalizedSearch.length > 3) {
    bestMatch = catalogItems.find(item => normalizeName(item.name).includes(normalizedSearch));
  }
  return bestMatch;
}

export function parseQuantityAndName(text: string): { name: string; quantity: number } {
  let quantity = 1;
  let name = text;
  let match = name.match(/^(.*?)(\d+)\s*([a-zA-Z]*)$/);
  if (match && match[2]) {
    name = match[1].replace(/\s+$/, '');
    quantity = parseInt(match[2], 10);
    UNITS.forEach(unit => {
      name = name.replace(new RegExp(`\\b${unit}\\b`, 'gi'), '');
    });
    name = name.replace(/\s+/g, ' ').trim();
  } else {
    match = name.match(/^(.*?)([a-zA-Z]+)\s*(\d+)$/);
    if (match && match[3]) {
      name = match[1].replace(/\s+$/, '');
      quantity = parseInt(match[3], 10);
      UNITS.forEach(unit => {
        name = name.replace(new RegExp(`\\b${unit}\\b`, 'gi'), '');
      });
      name = name.replace(/\s+/g, ' ').trim();
    } else {
      match = name.match(/^(\d+)\s*([a-zA-Z]+)\s+(.+)$/);
      if (match && match[1]) {
        quantity = parseInt(match[1], 10);
        name = match[3];
        UNITS.forEach(unit => {
          name = name.replace(new RegExp(`\\b${unit}\\b`, 'gi'), '');
        });
        name = name.replace(/\s+/g, ' ').trim();
      } else {
        match = name.match(/^(.+?)\s+(\d+)$/);
        if (match && match[2]) {
          name = match[1];
          quantity = parseInt(match[2], 10);
          UNITS.forEach(unit => {
            name = name.replace(new RegExp(`\\b${unit}\\b`, 'gi'), '');
          });
          name = name.replace(/\s+/g, ' ').trim();
        }
      }
    }
  }
  return { name, quantity };
}
// Accepts labels like 'Cucumber 4pcs', 'Egg 30', 'Box pasta 2pcs', 'Bell pepper red2 yellow 2', etc.
// Extracts item name and quantity, removes units like 'pcs', 'kg', 'L', etc.
export function parseQuickOrder(text: string, items: Item[]): { item: Item; quantity: number } | null {
  const units = ['pcs', 'kg', 'g', 'L', 'l', 'bt', 'pk', 'jar', 'bag', 'small', 'big', 'box', 'can', 'pack', 'piece', 'pieces'];
  // Regex: match trailing number (optionally with unit), e.g. 'Cucumber 4pcs', 'Egg 30', 'Box pasta 2pcs'
  const match = text.trim().match(/^(.*?)(?:\s+|\s*-\s*)(\d+)(?:\s*([a-zA-Z]+))?$/);
  if (!match) return null;

  let [, rawName, qty, unit] = match;
  let itemName = rawName.trim();
  if (unit && units.includes(unit.toLowerCase())) {
    // Remove unit from name if present
    itemName = itemName.replace(new RegExp(`\\b${unit}$`, 'i'), '').trim();
  }
  // Remove any trailing unit words from name
  for (const u of units) {
    const re = new RegExp(`\\b${u}$`, 'i');
    itemName = itemName.replace(re, '').trim();
  }

  const searchTerm = itemName.toLowerCase();
  // Try exact match first
  let foundItem = items.find(i => i.name.toLowerCase() === searchTerm);
  // If no exact match, try partial match
  if (!foundItem) {
    foundItem = items.find(i => i.name.toLowerCase().includes(searchTerm));
  }
  if (!foundItem) return null;

  return {
    item: foundItem,
    quantity: parseInt(qty, 10),
  };
}
