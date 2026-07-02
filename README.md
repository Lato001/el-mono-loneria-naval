# Landing Page — Template

Estructura base para una landing page construida con **React + TypeScript + Tailwind CSS v4**.

## Estructura del proyecto

```
src/
├── components/
│   ├── core/           # Componentes atómicos reutilizables
│   │   ├── Button.tsx       # Botón con variantes de estilo
│   │   ├── Card.tsx         # Tarjeta con imagen, título y descripción
│   │   └── index.ts         # Barrel export
│   │
│   ├── views/          # Secciones de la página
│   │   ├── Header.tsx       # Barra de navegación superior
│   │   ├── Hero.tsx         # Sección principal de portada
│   │   ├── About.tsx        # Información sobre el proyecto/empresa
│   │   ├── Services.tsx     # Grid de servicios o características
│   │   ├── Reviews.tsx      # Opiniones o testimonios
│   │   ├── Faq.tsx          # Preguntas frecuentes (acordeón)
│   │   ├── Contact.tsx      # Formulario de contacto
│   │   ├── Footer.tsx       # Pie de página
│   │   └── index.ts         # Barrel export
│   │
│   └── index.ts        # Barrel raíz (re-exporta core + views)
│
├── constants/          # Constantes, textos y datos de ejemplo
├── types/              # Interfaces y tipos TypeScript
├── hooks/              # Custom hooks
├── App.tsx             # Componente raíz que ensambla la landing
├── main.tsx            # Entry point de la aplicación
└── index.css           # Importación de Tailwind CSS
```

## Scripts disponibles

| Comando             | Descripción                                  |
| ------------------- | -------------------------------------------- |
| `pnpm dev`          | Inicia servidor de desarrollo                |
| `pnpm build`        | Compila el proyecto para producción          |
| `pnpm preview`      | Previsualiza la build de producción          |
| `pnpm lint`         | Ejecuta el linter                            |

## Importaciones

Todos los componentes se importan desde `./components`:

```ts
import { Header, Hero, Button, Card } from "./components";
```

También se puede importar por subcarpeta:

```ts
import { Button, Card } from "./components/core";
import { Hero, About, Footer } from "./components/views";
```
