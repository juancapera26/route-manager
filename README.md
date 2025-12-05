Router Manager – Plataforma de Gestión Logística

Router Manager es una plataforma web para gestión de rutas, paquetes, seguimiento GPS en tiempo real y monitoreo logístico.
Su objetivo es optimizar tiempos de entrega, reducir costos operativos y mejorar el flujo de trabajo de empresas de mensajería y transporte.
Todas las funcionalidades fueron diseñadas según las problemáticas reales de los conductores y administradores logísticos.

 Tabla de Contenidos

Comenzando

Pre-requisitos

Instalación

Arquitectura del Proyecto

Scripts Disponibles

Despliegue

Tecnologías Usadas

Versionado

Autores

Licencia

Comenzando

Para clonar el repositorio, usa alguna de las opciones disponibles en GitHub (HTTPS, SSH o GitHub CLI):

Repositorio:

https://github.com/juancapera26/route-manager.git


Clona el proyecto ejecutando:

git clone https://github.com/juancapera26/route-manager.git


Una vez clonado, tendrás el proyecto en tu entorno local.

 Pre-requisitos

Antes de instalar las dependencias, asegúrate de tener:

Node.js (versión estable actual)

npm o yarn

Acceso a las variables de entorno

El proyecto requiere:

/secrets
    └── credenciales Firebase
.env          # Variables privadas backend/frontend

Instalación

Instala las dependencias con:

yarn install


o:

npm install

 Arquitectura del Proyecto

Router Manager utiliza una arquitectura en capas, permitiendo mantener una estructura limpia y escalable.

src/
│── components/     # Componentes reutilizables
│── pages/          # Páginas del sistema
│── services/       # Lógica de negocio y consumo de APIs
│── hooks/          # Hooks personalizados
│── assets/         # Imágenes, íconos, estilos
│── utils/          # Utilidades generales
secrets/            # Credenciales privadas
.env                # Variables de entorno
vite.config.ts

▶️ Scripts Disponibles

Ejecutar en modo desarrollo:

npm run dev


Construir para producción:

npm run build


Visualizar el build:

npm run preview

🌐 Despliegue (Deployment)

Para desplegar el proyecto en Vercel:

Crear una cuenta en Vercel

Subir el proyecto a GitHub

Configurar los comandos de build

Agregar las variables de entorno necesarias

Conectar el repositorio

Vercel generará automáticamente la versión en producción

🛠️ Construido con

Estas son las tecnologías principales utilizadas:

React + Vite – Interfaz de usuario

JavaScript / TypeScript – Lógica del sistema

Firebase Storage – Gestión de archivos

Firebase Auth (si aplica)

CSS / Tailwind (si aplica)

 Versionado

El versionado del proyecto se realiza mediante:

Tags en Git

Releases en GitHub

 Autores

Participantes del proyecto:

Juan Capera – Desarrollo principal / Líder del proyecto

Jair Duarte – Desarrollo

José Becerra – Desarrollo

Licencia

Este proyecto está bajo una licencia abierta (recomendado: MIT).
Consulta el archivo LICENSE para más detalles.
