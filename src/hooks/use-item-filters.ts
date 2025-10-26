import { useMemo } from 'react';
import type { Item } from '@/types';

export interface ItemFilters {
  search?: string;
  categories?: string[];
  suppliers?: string[];
  tags?: string[];
  enabledGroups?: string[];
}

export function useItemFilters(items: Item[], filters: ItemFilters) {
  const filteredItems = useMemo(() => {
    let result = [...items];
    
    // Search filter
    if (filters.search?.trim()) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(item =>
        item.name.toLowerCase().includes(searchLower) ||
        item.category.toLowerCase().includes(searchLower) ||
        item.supplier.toLowerCase().includes(searchLower) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Category filter
    if (filters.categories?.length) {
      result = result.filter(item => filters.categories?.includes(item.category));
    }

    // Supplier filter
    if (filters.suppliers?.length) {
      result = result.filter(item => filters.suppliers?.includes(item.supplier));
    }

    // Tags filter
    if (filters.tags?.length) {
      result = result.filter(item =>
        filters.tags?.some(tag => item.tags.includes(tag))
      );
    }

    return result;
  }, [items, filters.search, filters.categories, filters.suppliers, filters.tags]);

  const visibleCategories = useMemo(() => {
    const categories = new Set(filteredItems.map(item => item.category));
    return Array.from(categories);
  }, [filteredItems]);

  return {
    filteredItems,
    visibleCategories
  };
}

export function useItemGroups<T extends keyof Item>(
  items: Item[],
  groupBy: T
) {
  const groupedItems = useMemo(() => {
    const groups: Record<string, Item[]> = {};
    items.forEach(item => {
      const key = String(item[groupBy]);
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    });
    return groups;
  }, [items, groupBy]);

  return groupedItems;
}