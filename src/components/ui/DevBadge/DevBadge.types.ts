export interface DevBadgeProps {
    /** Nombre a mostrar en el tooltip */
    name: string;
    /** Rol / tagline debajo del nombre en el tooltip */
    role?: string;
    /** Iniciales del avatar cuando no hay foto (ej: "LC"). Opcional si se pasa photoSrc. */
    initials?: string;
    /** URL de LinkedIn — el badge entero navega acá al hacer click */
    linkedinUrl: string;
    /** Imagen del avatar (típicamente un webp pequeño). Si está, reemplaza las iniciales. */
    photoSrc?: string;
    /** Número de WhatsApp en formato internacional sin signos (ej: "5491156137150") */
    whatsappNumber?: string;
    /** Mensaje pre-cargado para el link de WhatsApp */
    whatsappMessage?: string;
    className?: string;
  }