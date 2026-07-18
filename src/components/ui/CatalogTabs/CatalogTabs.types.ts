export interface Tab {
  id: string;
  name: string;
}

export interface CatalogTabsProps {
  categories: Tab[];
  activeId?: string;
  onSelect?: (id: string) => void;
  topOffset?: string | number;
  selectedCount: number;
  onPresupuestar: () => void;
  presupuestarDisabled: boolean;
  onClear: () => void;
}
