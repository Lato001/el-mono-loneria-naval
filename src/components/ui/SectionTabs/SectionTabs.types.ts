export interface Tab {
  id: string;
  name: string;
}

export interface SectionTabsProps {
  categories: Tab[];
  activeId?: string;
  onSelect?: (id: string) => void;
  topOffset?: string | number;
  /**
   * Accessible label for the tablist. Defaults to `data.ui.categoriesLabel`
   * ("Categorías de productos") for backward compatibility. Other pages
   * (e.g. Services) should pass their own label.
   */
  ariaLabel?: string;
}
