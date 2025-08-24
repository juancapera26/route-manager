# Está carpeta que almacena todo el codigo fuente del frontend

Con esta estructura, el proyecto es modular y escalable. Si quieres añadir una nueva página, solo tienes que crear el componente en la carpeta ```pages/``` y añadir una nueva ```Route``` en ```App.tsx```. Todo lo demás, como el diseño del header y la barra lateral, se maneja de forma centralizada en el ```AppLayout.```

## Extensiones de ficheros
### .ts
Contienen código que no usa JSX, es decir, lógica, utilidades, funciones, servicios, hooks sin JSX.

#### Ejemplo:
```ts
export function suma(a: number, b: number): number {
  return a + b;
}
```

### .tsx
En React, todo componente que devuelva JSX debe estar en un .tsx, de lo contrario TypeScript no entiende la sintaxis.

#### Ejemplo:
```ts
import React from "react";

type Props = { label: string };

export function Button({ label }: Props) {
  return <button>{label}</button>;
}

```

### .d.ts
Son archivos que solo contienen declaraciones de tipos (no código ejecutable).
Se usan para extender tipos, declarar módulos externos o añadir tipados a librerías que no tienen.

#### Ejemplo:
```ts
declare module "*.svg" {
  const content: React.FC<React.SVGProps<SVGSVGElement>>;
  export default content;
}
```