export interface WorkItem {
  id: string;
  title: string;
  description: string;
  color?: string;
}

export interface RotatingCardProps {
  items: WorkItem[];
  className?: string;
}
