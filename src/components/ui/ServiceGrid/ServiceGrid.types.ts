export interface Service {
  id: string;
  title: string;
  description: string;
}

export interface ServiceGridProps {
  services: Service[];
}
