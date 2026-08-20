export interface DevBadgeProps {
    /** Nombre a mostrar en el tooltip */
    name: string;
    /** Rol / tagline debajo del nombre en el tooltip */
    role?: string;
    /** Iniciales del avatar (ej: "LC") */
    initials: string;
    /** URL de LinkedIn — el badge entero navega acá al hacer click */
    linkedinUrl: string;
    /** Número de WhatsApp en formato internacional sin signos (ej: "5491156137150") */
    whatsappNumber?: string;
    /** Mensaje pre-cargado para el link de WhatsApp */
    whatsappMessage?: string;
    className?: string;
  }