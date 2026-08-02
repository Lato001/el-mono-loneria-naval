export interface Tab {
  id: string;
  name: string;
}

export interface SectionTabsProps {
  categories: Tab[];
  activeId?: string;
  onSelect?: (id: string) => void;
  ariaLabel?: string;
  selectedCounts?: Record<string, number>;
}
