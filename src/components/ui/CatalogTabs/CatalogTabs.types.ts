export interface Tab {
  id: string;
  name: string;
}

export interface CatalogTabsProps {
  categories: Tab[];
  activeId?: string;
  onSelect?: (id: string) => void;
  topOffset?: number;
}
