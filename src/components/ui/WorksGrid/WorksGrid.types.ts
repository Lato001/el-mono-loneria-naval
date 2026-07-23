export interface Work {
  id: string;
  title: string;
  description: string;
}

export interface WorksGridProps {
  works: Work[];
}
