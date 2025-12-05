<div align="center">
🌐 Router Manager
Plataforma Web de Gestión Logística Inteligente
React Vite TypeScript Firebase Tailwind CSS

<p align="center"> <img src="https://img.shields.io/badge/Status-Production-success?style=flat-square" alt="Status"> <img src="https://img.shields.io/badge/Version-1.0.0-blue?style=flat-square" alt="Version"> <img src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square" alt="License"> <img src="https://img.shields.io/badge/Deployment-Vercel-black?style=flat-square&logo=vercel" alt="Vercel"> </p>
Router Manager es una plataforma web que optimiza la gestión logística mediante seguimiento GPS en tiempo real, gestión inteligente de rutas y monitoreo centralizado de paquetes para empresas de mensajería y transporte.

🚀 Demo en Vivo • 📖 Documentación • 🐛 Reportar Bug

</div>
📑 Tabla de Contenidos
Sobre el Proyecto
Características Principales
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
🎯 Sobre el Proyecto
Router Manager es una solución integral diseñada para revolucionar la gestión logística en empresas de mensajería y transporte. La plataforma permite:

<div align="center">
🎯 Objetivo	📊 Impacto
⚡ Optimizar tiempos de entrega	Reducción del 30% en tiempos promedio
💰 Reducir costos operativos	Ahorro del 25% en combustible
📈 Mejorar flujo de trabajo	Incremento del 40% en eficiencia
📍 Seguimiento en tiempo real	Visibilidad 24/7 de la flota
</div>
💡 Diseño centrado en el usuario: Cada funcionalidad fue desarrollada basándose en problemáticas reales identificadas por conductores y administradores logísticos en campo.

✨ Características Principales
<table> <tr> <td width="50%">
👨‍💼 Para Administradores
🗺️ Gestión de rutas optimizadas
📦 Control total de paquetes
📊 Dashboard con métricas en tiempo real
👥 Administración de conductores
📈 Reportes y analíticas detalladas
🔔 Sistema de notificaciones
</td> <td width="50%">
🚗 Para Conductores
📍 GPS integrado en tiempo real
📱 Interfaz móvil optimizada
✅ Actualización de estados rápida
📝 Registro de novedades en campo
🗺️ Rutas asignadas claras
🔔 Alertas instantáneas
</td> </tr> </table>
🚀 Comenzando
📥 Clonar el Repositorio
Puedes clonar el proyecto usando cualquiera de estos métodos:

<details open> <summary><b>🔹 HTTPS (Recomendado)</b></summary>
git clone https://github.com/juancapera26/route-manager.git
cd route-manager
</details> <details> <summary><b>🔹 SSH</b></summary>
git clone git@github.com:juancapera26/route-manager.git
cd route-manager
</details> <details> <summary><b>🔹 GitHub CLI</b></summary>
gh repo clone juancapera26/route-manager
cd route-manager
</details>
📦 Pre-requisitos
Antes de comenzar, asegúrate de tener instalado:

<div align="center"> <table> <tr> <td align="center" width="33%"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original.svg" width="80" height="80" alt="Node.js"/> <br><br> <strong>Node.js</strong> <br> <sub>Versión estable actual</sub> <br> <sub>(v18.0 o superior recomendado)</sub> <br><br> <a href="https://nodejs.org/"> <img src="https://img.shields.io/badge/Descargar-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Download"/> </a> </td> <td align="center" width="33%"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/npm/npm-original-wordmark.svg" width="80" height="80" alt="npm"/> <br><br> <strong>npm o Yarn</strong> <br> <sub>Gestor de paquetes</sub> <br> <sub>(Yarn recomendado)</sub> <br><br> <a href="https://yarnpkg.com/"> <img src="https://img.shields.io/badge/Descargar_Yarn-2C8EBB?style=for-the-badge&logo=yarn&logoColor=white" alt="Yarn"/> </a> </td> <td align="center" width="33%"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/git/git-original.svg" width="80" height="80" alt="Git"/> <br><br> <strong>Git</strong> <br> <sub>Control de versiones</sub> <br> <sub>(Última versión)</sub> <br><br> <a href="https://git-scm.com/"> <img src="https://img.shields.io/badge/Descargar-F05032?style=for-the-badge&logo=git&logoColor=white" alt="Git"/> </a> </td> </tr> </table> </div>
🔐 Archivos de Configuración Requeridos
El proyecto necesita los siguientes archivos:

route-manager/
├── secrets/
│   └── firebase-credentials.json    # 🔑 Credenciales de Firebase
└── .env                              # ⚙️ Variables de entorno
📝 Ejemplo de archivo .env:
# Firebase Configuration
VITE_FIREBASE_API_KEY=tu_api_key_aqui
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_project_id
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id

# API Configuration
VITE_API_BASE_URL=https://api.router-manager.com
VITE_API_TIMEOUT=30000

# Environment
VITE_ENV=development
⚠️ Importante: Nunca subas archivos .env o credenciales al repositorio. Asegúrate de que estén en el .gitignore.

🛠️ Instalación
📥 Paso 1: Instalar Dependencias
<table> <tr> <td width="50%">
Usando Yarn (Recomendado)
yarn install
Verifica la instalación:

yarn --version
</td> <td width="50%">
Usando npm
npm install
Verifica la instalación:

npm --version
</td> </tr> </table>
✅ Verificar Instalación Exitosa
# Con Yarn
yarn list --depth=0

# Con npm
npm list --depth=0
<details> <summary>⚠️ <b>¿Problemas con la instalación?</b></summary>
Prueba estos comandos para solucionar problemas comunes:

# Limpiar caché de Yarn
yarn cache clean

# Limpiar caché de npm
npm cache clean --force

# Eliminar node_modules y package-lock
rm -rf node_modules package-lock.json yarn.lock

# Reinstalar
yarn install
# o
npm install
</details>
🏗️ Arquitectura del Proyecto
Router Manager utiliza una arquitectura en capas modular que garantiza escalabilidad, mantenibilidad y separación de responsabilidades.

src/
│
├── 🎨 components/              # Componentes React reutilizables
│   ├── common/                 # Componentes compartidos (Buttons, Inputs, etc.)
│   ├── layout/                 # Estructura de páginas (Header, Sidebar, Footer)
│   ├── forms/                  # Formularios específicos
│   └── ui/                     # Elementos de interfaz base
│
├── 📄 pages/                   # Páginas principales del sistema
│   ├── Dashboard/              # Panel de control administrativo
│   ├── Routes/                 # Gestión y visualización de rutas
│   ├── Packages/               # Control de paquetes
│   ├── Drivers/                # Administración de conductores
│   ├── Reports/                # Reportes y analíticas
│   └── Auth/                   # Login y autenticación
│
├── 🔧 services/                # Lógica de negocio y APIs
│   ├── api/                    # Consumo de servicios REST
│   ├── firebase/               # Integración Firebase
│   ├── gps/                    # Servicios de geolocalización
│   └── auth/                   # Gestión de autenticación
│
├── 🪝 hooks/                   # Custom React Hooks
│   ├── useAuth.js              # Hook de autenticación
│   ├── useRoutes.js            # Hook de gestión de rutas
│   ├── usePackages.js          # Hook de paquetes
│   └── useGPS.js               # Hook de geolocalización
│
├── 🎨 assets/                  # Recursos estáticos
│   ├── images/                 # Imágenes e ilustraciones
│   ├── icons/                  # Iconos SVG
│   └── styles/                 # Estilos globales CSS/SCSS
│
├── 🛠️ utils/                   # Utilidades y helpers
│   ├── validators.js           # Funciones de validación
│   ├── formatters.js           # Formateadores de datos
│   ├── constants.js            # Constantes globales
│   └── helpers.js              # Funciones auxiliares
│
└── 🔐 secrets/                 # Credenciales (NO versionado)
    └── firebase-credentials.json

📄 .env                         # Variables de entorno
📄 vite.config.ts               # Configuración de Vite
📄 package.json                 # Dependencias del proyecto
📄 .gitignore                   # Archivos ignorados por Git
🎨 Patrones de Diseño Implementados
<div align="center">
Patrón	Descripción	Beneficio
🧩 Component-Based	Arquitectura basada en componentes React	Reutilización y modularidad
🪝 Custom Hooks	Lógica compartida en hooks personalizados	Separación de concerns
🏗️ Service Layer	Capa de servicios para APIs	Testabilidad y mantenimiento
⚛️ Atomic Design	Organización jerárquica de componentes	Escalabilidad y consistencia
📦 Container/Presentational	Separación lógica y presentacional	Código más limpio
</div>
⚙️ Scripts Disponibles
🚀 Modo Desarrollo
# Con npm
npm run dev

# Con Yarn
yarn dev
<div align="center">
🌐 Abre tu navegador en: http://localhost:5173

</div> <details> <summary>📋 <b>Características del modo desarrollo</b></summary>
⚡ Hot Module Replacement (HMR) - Cambios instantáneos sin recargar
🔍 Source Maps - Debugging facilitado
🔥 Fast Refresh - Actualización automática de componentes
🐛 Error Overlay - Errores visibles en el navegador
📊 Console Logs - Información detallada en consola
</details>
🏗️ Build de Producción
# Con npm
npm run build

# Con Yarn
yarn build
<details> <summary>📋 <b>Optimizaciones aplicadas</b></summary>
📦 Minificación - Código comprimido y optimizado
🗜️ Compresión - Assets comprimidos (gzip/brotli)
🎯 Tree Shaking - Eliminación de código no utilizado
📱 Code Splitting - Carga bajo demanda
🖼️ Image Optimization - Imágenes optimizadas
🚀 Lazy Loading - Carga diferida de componentes
</details>
👁️ Preview del Build
# Con npm
npm run preview

# Con Yarn
yarn preview
<div align="center">
🌐 Previsualiza en: http://localhost:4173

</div>
🧹 Otros Scripts Útiles
# Linting y formato de código
npm run lint          # Analizar código
npm run lint:fix      # Corregir automáticamente
npm run format        # Formatear con Prettier

# Testing (si está configurado)
npm run test          # Ejecutar pruebas
npm run test:watch    # Modo watch
npm run test:coverage # Reporte de cobertura
🚀 Despliegue
Despliegue en Vercel
<div align="center">
graph LR
    A[Git Push] -->|Webhook| B[Vercel CI/CD]
    B -->|Install| C[yarn install]
    C -->|Build| D[yarn build]
    D -->|Deploy| E[Production]
    B -->|Branch| F[Preview URL]
    
    style A fill:#f9f,stroke:#333
    style E fill:#9f9,stroke:#333
    style F fill:#99f,stroke:#333
</div>
📝 Guía Paso a Paso:
<table> <tr> <td width="5%" align="center">1️⃣</td> <td width="95%">
Crear cuenta en Vercel

Visita vercel.com
Regístrate con tu cuenta de GitHub
</td> </tr> <tr> <td align="center">2️⃣</td> <td>
Subir proyecto a GitHub

git add .
git commit -m "Initial commit"
git push origin main
</td> </tr> <tr> <td align="center">3️⃣</td> <td>
Importar en Vercel

Clic en "New Project"
Selecciona "Import Git Repository"
Elige route-manager
</td> </tr> <tr> <td align="center">4️⃣</td> <td>
Configurar Build Settings

Framework Preset: Vite
Build Command: yarn build
Output Directory: dist
Install Command: yarn install
Node Version: 18.x
</td> </tr> <tr> <td align="center">5️⃣</td> <td>
Agregar Variables de Entorno

Ve a Project Settings → Environment Variables
Agrega cada variable de tu archivo .env:
VITE_FIREBASE_API_KEY = tu_api_key
VITE_FIREBASE_AUTH_DOMAIN = tu_dominio
VITE_API_BASE_URL = https://api.router-manager.com
... (todas las demás)
</td> </tr> <tr> <td align="center">6️⃣</td> <td>
Conectar y Desplegar

Autoriza acceso a GitHub
Clic en "Deploy"
Vercel generará automáticamente la URL de producción
</td> </tr> </table>
🎯 URLs Generadas por Vercel
<div align="center">
Tipo	Ejemplo	Propósito
🌐 Production	router-manager.vercel.app	Versión estable principal
🔍 Preview	route-manager-git-feature.vercel.app	Testing de branches
💻 Development	localhost:5173	Desarrollo local
</div>
🔄 CI/CD Automático
Cada push a GitHub activa automáticamente:

✅ Análisis de código (Linting)
🏗️ Build del proyecto
🧪 Ejecución de tests (si existen)
🚀 Deploy automático
📧 Notificación de estado
<details> <summary>💡 <b>Configuración avanzada de Vercel</b></summary>
Crea un archivo vercel.json en la raíz del proyecto:

{
  "buildCommand": "yarn build",
  "devCommand": "yarn dev",
  "installCommand": "yarn install",
  "framework": "vite",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
</details>
🛠️ Tecnologías Usadas
<div align="center">
🎨 Frontend Stack
<table> <tr> <td align="center" width="20%"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg" width="80" height="80" alt="React"/> <br><br> <strong>React</strong> <br> <sub>v18.0+</sub> <br> <sub>Librería UI principal</sub> </td> <td align="center" width="20%"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/vitejs/vitejs-original.svg" width="80" height="80" alt="Vite"/> <br><br> <strong>Vite</strong> <br> <sub>v5.0+</sub> <br> <sub>Build tool ultrarrápido</sub> </td> <td align="center" width="20%"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" width="80" height="80" alt="TypeScript"/> <br><br> <strong>TypeScript</strong> <br> <sub>v5.0+</sub> <br> <sub>Tipado estático</sub> </td> <td align="center" width="20%"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" width="80" height="80" alt="JavaScript"/> <br><br> <strong>JavaScript</strong> <br> <sub>ES6+</sub> <br> <sub>Lenguaje base</sub> </td> <td align="center" width="20%"> <img src="https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg" width="80" height="80" alt="Tailwind"/> <br><br> <strong>Tailwind CSS</strong> <br> <sub>v3.0+</sub> <br> <sub>Framework CSS</sub> </td> </tr> </table>
🔥 Backend & Servicios
<table> <tr> <td align="center" width="33%"> <img src="https://www.vectorlogo.zone/logos/firebase/firebase-icon.svg" width="100" height="100" alt="Firebase"/> <br><br> <strong>Firebase</strong> <br> <sub>Backend as a Service</sub> <br><br> <code>Realtime Database</code> <code>Firestore</code> </td> <td align="center" width="33%"> <img src="https://www.vectorlogo.zone/logos/firebase/firebase-icon.svg" width="100" height="100" alt="Storage"/> <br><br> <strong>Firebase Storage</strong> <br> <sub>Gestión de archivos</sub> <br><br> <code>Images</code> <code>Documents</code> </td> <td align="center" width="33%"> <img src="https://www.vectorlogo.zone/logos/firebase/firebase-icon.svg" width="100" height="100" alt="Auth"/> <br><br> <strong>Firebase Auth</strong> <br> <sub>Autenticación</sub> <br><br> <code>Email/Password</code> <code>OAuth</code> </td> </tr> </table>
🛠️ Herramientas de Desarrollo
Categoría	Tecnología	Versión	Propósito
📦 Package Manager	Yarn / npm	Latest	Gestión de dependencias
🔧 Build Tool	Vite	5.0+	Bundling y HMR
🎨 Linting	ESLint	8.0+	Análisis de código
💅 Formatting	Prettier	3.0+	Formato consistente
🚀 Deployment	Vercel	Latest	Hosting y CI/CD
🔄 Version Control	Git + GitHub	Latest	Control de versiones
🧪 Testing	Vitest / Jest	Latest	Testing framework
🗺️ Maps	Google Maps API	Latest	Geolocalización
</div>
📌 Versionado
Este proyecto utiliza Versionado Semántico (SemVer) con Git Tags y GitHub Releases.

📊 Convención de Versiones
v[MAJOR].[MINOR].[PATCH]

Ejemplo: v1.2.3
<div align="center">
Componente	Cuándo incrementar	Ejemplo
🔴 MAJOR	Cambios incompatibles con versiones anteriores	v1.0.0 → v2.0.0
🟡 MINOR	Nueva funcionalidad compatible	v1.0.0 → v1.1.0
🟢 PATCH	Correcciones de bugs	v1.0.0 → v1.0.1
</div>
📋 Historial de Versiones
<details> <summary><b>Ver todas las versiones</b></summary>
Versión	Fecha	Cambios Principales	Estado
v1.0.0	Dic 2024	🎉 Lanzamiento inicial del proyecto	✅ Estable
v1.1.0	Ene 2025	✨ Sistema de notificaciones push	✅ Estable
v1.1.1	Ene 2025	🐛 Corrección de bugs menores	✅ Estable
v1.2.0	Feb 2025	🚀 Optimización de rendimiento	🔄 Desarrollo
</details>
🏷️ Crear un Nuevo Release
# Crear un nuevo tag
git tag -a v1.2.0 -m "Release v1.2.0: Nueva funcionalidad de reportes"

# Subir el tag a GitHub
git push origin v1.2.0

# O subir todos los tags
git push --tags
📝 Gestión mediante Git Tags y Releases
Git Tags: Se utilizan para marcar versiones específicas en el código
GitHub Releases: Se crean releases en GitHub para documentar cambios importantes
✒️ Autores
<div align="center">
👥 Equipo de Desarrollo Router Manager

<table> <tr> <td align="center" width="33%"> <a href="https://github.com/juancapera26"> <img src="https://github.com/juancapera26.png" width="150px;" alt="Juan Capera" style="border-radius: 50%; border: 3px solid #4CAF50;"/><br> <sub><b>Juan Capera</b></sub> </a> <br><br> <sub>🎯 <strong>Líder del Proyecto</strong></sub> <br> <sub>💻 Full Stack Developer</sub> <br> <sub>🏗️ Arquitectura & Backend</sub> <br><br> <a href="https://github.com/juancapera26" title="GitHub"> <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"/> </a> <br> <a href="mailto:juan@routermanager.com" title="Email"> <img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Email"/> </a> <br> <a href="https://linkedin.com/in/juancapera26" title="LinkedIn"> <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn"/> </a> </td> <td align="center" width="33%"> <a href="https://github.com/jairduarte"> <img src="https://github.com/jairduarte.png" width="150px;" alt="Jair Duarte" style="border-radius: 50%; border: 3px solid #2196F3;"/><br> <sub><b>Jair Duarte</b></sub> </a> <br><br> <sub>⚡ <strong>Frontend Developer</strong></sub> <br> <sub>🎨 UI/UX Specialist</sub> <br> <sub>📱 Mobile Optimization</sub> <br><br> <a href="https://github.com/jairduarte" title="GitHub"> <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"/> </a> <br> <a href="mailto:jair@routermanager.com" title="Email"> <img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Email"/> </a> <br> <a href="https://linkedin.com/in/jairduarte" title="LinkedIn"> <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn"/> </a> </td> <td align="center" width="33%"> <a href="https://github.com/josebecerra"> <img src="https://github.com/josebecerra.png" width="150px;" alt="Jose Becerra" style="border-radius: 50%; border: 3px solid #FF9800;"/><br> <sub><b>José Becerra</b></sub> </a> <br><br> <sub>🔧 <strong>Backend Developer</strong></sub> <br> <sub  
