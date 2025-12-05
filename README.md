<div align="center">
🌐 Router Manager Frontend
Plataforma Web de Gestión Logística Inteligente
React Vite TypeScript Firebase Tailwind CSS

<p align="center"> <img src="https://img.shields.io/badge/Status-Production-success?style=flat-square" alt="Status"> <img src="https://img.shields.io/badge/Version-1.0.0-blue?style=flat-square" alt="Version"> <img src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square" alt="License"> <img src="https://img.shields.io/badge/Deployment-Vercel-black?style=flat-square&logo=vercel" alt="Vercel"> </p>
Router Manager es una plataforma web moderna que optimiza la gestión logística mediante seguimiento GPS en tiempo real, gestión inteligente de rutas y monitoreo centralizado de paquetes.

🚀 Demo en Vivo • 📖 Documentación • 🐛 Reportar Bug

</div>
📑 Tabla de Contenidos
Sobre el Proyecto
Características Principales
Comenzando
Pre-requisitos
Instalación
Arquitectura
Scripts Disponibles
Despliegue
Tecnologías
Versionado
Autores
Licencia
🎯 Sobre el Proyecto
Router Manager es una solución integral diseñada para revolucionar la gestión logística en empresas de mensajería y transporte. La plataforma permite:

<table> <tr> <td width="50%">
🎯 Objetivos Principales
⚡ Optimizar tiempos de entrega
💰 Reducir costos operativos
📊 Mejorar el flujo de trabajo
🚚 Facilitar la gestión de flotas
📱 Proporcionar acceso móvil
</td> <td width="50%">
💡 Desarrollado Para
👨‍💼 Administradores logísticos
🚗 Conductores en campo
📦 Gestores de paquetería
📈 Analistas operativos
👥 Equipos de distribución
</td> </tr> </table>
💡 Diseño centrado en el usuario: Cada funcionalidad se desarrolló basándose en problemáticas reales identificadas por conductores y administradores logísticos.

✨ Características Principales
<div align="center">
Funcionalidad	Descripción	Estado
🗺️ Gestión de Rutas	Creación y optimización de rutas de entrega	✅ Activo
📦 Control de Paquetes	Seguimiento completo del ciclo de vida	✅ Activo
📍 GPS en Tiempo Real	Ubicación precisa de conductores y envíos	✅ Activo
📊 Dashboard Analítico	Métricas y KPIs en tiempo real	✅ Activo
🔔 Notificaciones	Alertas automáticas de eventos	✅ Activo
📱 Diseño Responsivo	Optimizado para todos los dispositivos	✅ Activo
🔐 Autenticación	Sistema seguro de inicio de sesión	✅ Activo
📄 Reportes	Generación de informes personalizados	✅ Activo
</div>
🚀 Comenzando
📥 Clonar el Repositorio
Puedes clonar el proyecto usando cualquiera de estos métodos:

<details open> <summary><b>HTTPS (Recomendado)</b></summary>
git clone https://github.com/juancapera26/route-manager.git
cd route-manager
</details> <details> <summary><b>SSH</b></summary>
git clone git@github.com:juancapera26/route-manager.git
cd route-manager
</details> <details> <summary><b>GitHub CLI</b></summary>
gh repo clone juancapera26/route-manager
cd route-manager
</details>
📦 Pre-requisitos
Antes de comenzar, asegúrate de tener instalado:

<table> <tr> <td align="center" width="33%"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original.svg" width="60" height="60" alt="Node.js"/> <br><strong>Node.js</strong> <br><sub>v18.0 o superior</sub> <br><a href="https://nodejs.org/">Descargar</a> </td> <td align="center" width="33%"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/npm/npm-original-wordmark.svg" width="60" height="60" alt="npm"/> <br><strong>npm o Yarn</strong> <br><sub>Gestor de paquetes</sub> <br><a href="https://yarnpkg.com/">Descargar Yarn</a> </td> <td align="center" width="33%"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/git/git-original.svg" width="60" height="60" alt="Git"/> <br><strong>Git</strong> <br><sub>Control de versiones</sub> <br><a href="https://git-scm.com/">Descargar</a> </td> </tr> </table>
🔑 Configuración Requerida
El proyecto necesita los siguientes archivos de configuración:

route-manager/
├── secrets/
│   └── firebase-credentials.json    # Credenciales de Firebase
└── .env                              # Variables de entorno
Ejemplo de archivo .env:
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# API Configuration
VITE_API_BASE_URL=https://api.router-manager.com
VITE_API_TIMEOUT=30000

# Environment
VITE_ENV=development
⚠️ Importante: Nunca subas archivos de configuración sensibles al repositorio. Usa .gitignore apropiadamente.

🛠️ Instalación
Opción 1: Usando Yarn (Recomendado)
# Instalar dependencias
yarn install

# Verificar instalación
yarn --version
Opción 2: Usando npm
# Instalar dependencias
npm install

# Verificar instalación
npm --version
Verificación de instalación exitosa
# Listar dependencias instaladas
yarn list --depth=0

# O con npm
npm list --depth=0
<details> <summary>💡 <b>¿Problemas con la instalación?</b></summary>
Prueba los siguientes comandos:

# Limpiar caché de yarn
yarn cache clean

# Limpiar caché de npm
npm cache clean --force

# Eliminar node_modules y reinstalar
rm -rf node_modules
yarn install
</details>
🏗️ Arquitectura
Router Manager utiliza una arquitectura en capas que garantiza escalabilidad, mantenibilidad y separación de responsabilidades.

src/
│
├── 🎨 components/              # Componentes reutilizables
│   ├── common/                 # Componentes compartidos
│   ├── layout/                 # Estructura de páginas
│   ├── forms/                  # Formularios
│   └── ui/                     # Elementos de interfaz
│
├── 📄 pages/                   # Páginas principales
│   ├── Dashboard/              # Panel de control
│   ├── Routes/                 # Gestión de rutas
│   ├── Packages/               # Gestión de paquetes
│   ├── Drivers/                # Gestión de conductores
│   └── Auth/                   # Autenticación
│
├── 🔧 services/                # Lógica de negocio
│   ├── api/                    # Consumo de APIs
│   ├── firebase/               # Servicios Firebase
│   └── gps/                    # Servicios GPS
│
├── 🪝 hooks/                   # Custom React Hooks
│   ├── useAuth.js              # Hook de autenticación
│   ├── useRoutes.js            # Hook de rutas
│   └── usePackages.js          # Hook de paquetes
│
├── 🎨 assets/                  # Recursos estáticos
│   ├── images/                 # Imágenes
│   ├── icons/                  # Iconos SVG
│   └── styles/                 # Estilos globales
│
├── 🛠️ utils/                   # Utilidades generales
│   ├── validators.js           # Validaciones
│   ├── formatters.js           # Formateadores
│   └── constants.js            # Constantes
│
└── 🔐 secrets/                 # Credenciales (no versionado)
    └── firebase-credentials.json

.env                             # Variables de entorno
vite.config.ts                   # Configuración Vite
📐 Patrones de Diseño Implementados
<div align="center">
Patrón	Uso	Beneficio
Component-Based	Estructura de React	Reutilización de código
Custom Hooks	Lógica compartida	Separación de concerns
Service Layer	APIs y lógica de negocio	Testabilidad
Atomic Design	Organización de componentes	Escalabilidad
</div>
⚙️ Scripts Disponibles
🚀 Desarrollo
# Iniciar servidor de desarrollo
yarn dev

# O con npm
npm run dev
Abre http://localhost:5173 en tu navegador.

<details> <summary>📋 <b>Características del modo desarrollo</b></summary>
⚡ Hot Module Replacement (HMR)
🔍 Source maps para debugging
🔥 Fast Refresh automático
🐛 Error overlay en el navegador
📊 Logs detallados en consola
</details>
🏗️ Producción
# Construir para producción
yarn build

# O con npm
npm run build
<details> <summary>📋 <b>Optimizaciones incluidas</b></summary>
📦 Minificación de código
🗜️ Compresión de assets
🎯 Tree shaking
📱 Code splitting
🖼️ Optimización de imágenes
</details>
👁️ Preview
# Previsualizar build de producción
yarn preview

# O con npm
npm run preview
Abre http://localhost:4173 para ver la versión de producción localmente.

🧪 Testing (Si aplica)
# Ejecutar pruebas
yarn test

# Ejecutar pruebas en modo watch
yarn test:watch

# Generar reporte de cobertura
yarn test:coverage
🧹 Linting y Formato
# Verificar estilo de código
yarn lint

# Corregir problemas automáticamente
yarn lint:fix

# Formatear código con Prettier
yarn format
🚀 Despliegue
Desplegar en Vercel
Router Manager está optimizado para desplegarse en Vercel con integración continua.

<div align="center">
graph LR
    A[Git Push] -->|Trigger| B[Vercel CI/CD]
    B -->|Build| C[yarn build]
    C -->|Deploy| D[Production]
    B -->|Preview| E[Preview URL]
</div>
📝 Paso a paso:
1️⃣ Crear cuenta en Vercel

Visita vercel.com
Regístrate con GitHub
2️⃣ Importar proyecto

# Opción A: Desde dashboard de Vercel
New Project → Import Git Repository

# Opción B: Usando Vercel CLI
npm i -g vercel
vercel
3️⃣ Configurar Build Settings

Framework Preset: Vite
Build Command: yarn build
Output Directory: dist
Install Command: yarn install
4️⃣ Agregar Variables de Entorno

Ve a Project Settings → Environment Variables
Agrega todas las variables de tu .env
Ejemplo:
VITE_FIREBASE_API_KEY=xxxxxVITE_API_BASE_URL=https://api.router-manager.com
5️⃣ Conectar Repositorio

Autoriza acceso a GitHub
Selecciona el repositorio route-manager
Vercel generará automáticamente:
🌐 URL de producción
🔍 Preview URLs por cada PR
🎯 URLs Generadas
Tipo	URL	Propósito
Production	router-manager.vercel.app	Versión estable
Preview	route-manager-git-branch.vercel.app	Testing de ramas
Development	localhost:5173	Desarrollo local
🔄 CI/CD Automático
Cada push activa automáticamente:

✅ Análisis de código
🏗️ Build del proyecto
🧪 Ejecución de tests
🚀 Deploy a preview
📧 Notificación de estado
🛠️ Tecnologías
<div align="center">
Frontend Stack
<table> <tr> <td align="center" width="20%"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg" width="80" height="80" alt="React"/> <br><strong>React</strong> <br><sub>Librería UI</sub> </td> <td align="center" width="20%"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/vitejs/vitejs-original.svg" width="80" height="80" alt="Vite"/> <br><strong>Vite</strong> <br><sub>Build Tool</sub> </td> <td align="center" width="20%"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" width="80" height="80" alt="TypeScript"/> <br><strong>TypeScript</strong> <br><sub>Type Safety</sub> </td> <td align="center" width="20%"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" width="80" height="80" alt="JavaScript"/> <br><strong>JavaScript</strong> <br><sub>Lenguaje Base</sub> </td> <td align="center" width="20%"> <img src="https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg" width="80" height="80" alt="Tailwind"/> <br><strong>Tailwind CSS</strong> <br><sub>Styling</sub> </td> </tr> </table>
Backend & Servicios
<table> <tr> <td align="center" width="25%"> <img src="https://www.vectorlogo.zone/logos/firebase/firebase-icon.svg" width="80" height="80" alt="Firebase"/> <br><strong>Firebase</strong> <br><sub>Backend as a Service</sub> </td> <td align="center" width="25%"> <img src="https://www.vectorlogo.zone/logos/firebase/firebase-icon.svg" width="80" height="80" alt="Firebase Storage"/> <br><strong>Firebase Storage</strong> <br><sub>Gestión de Archivos</sub> </td> <td align="center" width="25%"> <img src="https://www.vectorlogo.zone/logos/firebase/firebase-icon.svg" width="80" height="80" alt="Firebase Auth"/> <br><strong>Firebase Auth</strong> <br><sub>Autenticación</sub> </td> <td align="center" width="25%"> <img src="https://www.vectorlogo.zone/logos/google_maps/google_maps-icon.svg" width="80" height="80" alt="Maps"/> <br><strong>Maps API</strong> <br><sub>Geolocalización</sub> </td> </tr> </table>
Herramientas de Desarrollo
Categoría	Tecnología	Propósito
📦 Package Manager	Yarn / npm	Gestión de dependencias
🔧 Build Tool	Vite	Bundling ultra-rápido
🎨 Linting	ESLint	Análisis de código
💅 Formatting	Prettier	Formato consistente
🚀 Deployment	Vercel	Hosting y CI/CD
🔄 Version Control	Git + GitHub	Control de versiones
🧪 Testing	Vitest / Jest	Testing unitario
</div>
📌 Versionado
Este proyecto utiliza Git Tags y GitHub Releases para el control de versiones semántico.

Convención de Versiones
Seguimos Semantic Versioning 2.0.0:

v[MAJOR].[MINOR].[PATCH]

Ejemplo: v1.2.3
MAJOR: Cambios incompatibles con versiones anteriores
MINOR: Nueva funcionalidad compatible hacia atrás
PATCH: Correcciones de bugs
📋 Historial de Versiones
<details> <summary><b>Ver todas las versiones</b></summary>
Versión	Fecha	Cambios Principales
v1.0.0	2024-12	🎉 Lanzamiento inicial
v1.1.0	2025-01	✨ Sistema de notificaciones
v1.1.1	2025-01	🐛 Correcciones menores
v1.2.0	2025-02	🚀 Optimización de rendimiento
</details>
🏷️ Crear un nuevo Release
# Crear un nuevo tag
git tag -a v1.2.0 -m "Release version 1.2.0: Nueva funcionalidad X"

# Subir tag a GitHub
git push origin v1.2.0

# O subir todos los tags
git push --tags
✒️ Autores
<div align="center">
👥 Equipo de Desarrollo
<table> <tr> <td align="center" width="33%"> <a href="https://github.com/juancapera26"> <img src="https://github.com/juancapera26.png" width="120px;" alt="Juan Capera" style="border-radius: 50%;"/><br> <sub><b>Juan Capera</b></sub> </a><br> <sub>🎯 Líder del Proyecto</sub><br> <sub>💻 Full Stack Developer</sub> <br><br> <a href="https://github.com/juancapera26" title="GitHub"> <img src="https://img.shields.io/badge/GitHub-100000?style=flat&logo=github&logoColor=white" alt="GitHub"/> </a> <a href="mailto:juan@example.com" title="Email"> <img src="https://img.shields.io/badge/Email-D14836?style=flat&logo=gmail&logoColor=white" alt="Email"/> </a> <a href="https://linkedin.com/in/juancapera" title="LinkedIn"> <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white" alt="LinkedIn"/> </a> </td> <td align="center" width="33%"> <a href="https://github.com/jairduarte"> <img src="https://github.com/jairduarte.png" width="120px;" alt="Jair Duarte" style="border-radius: 50%;"/><br> <sub><b>Jair Duarte</b></sub> </a><br> <sub>⚡ Frontend Developer</sub><br> <sub>🎨 UI/UX Specialist</sub> <br><br> <a href="https://github.com/jairduarte" title="GitHub"> <img src="https://img.shields.io/badge/GitHub-100000?style=flat&logo=github&logoColor=white" alt="GitHub"/> </a> <a href="mailto:jair@example.com" title="Email"> <img src="https://img.shields.io/badge/Email-D14836?style=flat&logo=gmail&logoColor=white" alt="Email"/> </a> <a href="https://linkedin.com/in/jairduarte" title="LinkedIn"> <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white" alt="LinkedIn"/> </a> </td> <td align="center" width="33%"> <a href="https://github.com/josebecerra"> <img src="https://github.com/josebecerra.png" width="120px;" alt="Jose Becerra" style="border-radius: 50%;"/><br> <sub><b>José Becerra</b></sub> </a><br> <sub>🔧 Backend Developer</sub><br> <sub>🔐 Security Expert</sub> <br><br> <a href="https://github.com/josebecerra" title="GitHub"> <img src="https://img.shields.io/badge/GitHub-100000?style=flat&logo=github&logoColor=white" alt="GitHub"/> </a> <a href="mailto:jose@example.com" title="Email"> <img src="https://img.shields.io/badge/Email-D14836?style=flat&logo=gmail&logoColor=white" alt="Email"/> </a> <a href="https://linkedin.com/in/josebecerra" title="LinkedIn"> <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white" alt="LinkedIn"/> </a> </td> </tr> </table>
🤝 Contribuciones
Área	Contribución
🎨 Frontend	Juan Capera, Jair Duarte
🔧 Backend	Juan Capera, José Becerra
📱 Mobile	Jair Duarte
🗺️ GPS Integration	José Becerra
📊 Analytics	Juan Capera
🔐 Security	José Becerra
📝 Documentation	Todos
</div>
📞 Contacto y Soporte
<div align="center">
¿Necesitas ayuda?
<table> <tr> <td align="center"> <a href="https://github.com/juancapera26/route-manager/issues"> <img src="https://img.shields.io/badge/🐛_Reportar_Bug-FF0000?style=for-the-badge" alt="Bug"/> </a> </td> <td align="center"> <a href="https://github.com/juancapera26/route-manager/discussions"> <img src="https://img.shields.io/badge/💬_Discusiones-0088CC?style=for-the-badge" alt="Discussions"/> </a> </td> <td align="center"> <a href="mailto:contact@router-manager.com"> <img src="https://img.shields.io/badge/📧_Email-D14836?style=for-the-badge" alt="Email"/> </a> </td> </tr> </table> </div>
📄 Licencia
<div align="center">
Este proyecto está licenciado bajo la Licencia MIT

License: MIT

</div>
MIT License

Copyright (c) 2024 Router Manager Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
🙏 Agradecimientos
<div align="center">
Un agradecimiento especial a todas las personas y organizaciones que hicieron posible este proyecto:

🌟 Contribuyentes
Conductores y personal logístico por su invaluable feedback
Empresas colaboradoras por confiar en nuestra solución
Comunidad open source por las herramientas y librerías utilizadas
🛠️ Tecnologías que Amamos
Gracias a los equipos detrás de:

React Team
Vite Team
Firebase Team
Vercel Team
Tailwind CSS Team
📚 Recursos Útiles
React Documentation
Vite Guide
Firebase Docs
Tailwind CSS
</div>
🗺️ Roadmap
<div align="center">
Próximas Funcionalidades
Función	Estado	Versión
📱 App Móvil Nativa	🔄 En Desarrollo	v2.0.0
🤖 IA para Optimización	📋 Planificado	v2.1.0
📊 Analytics Avanzado	📋 Planificado	v2.2.0
🌍 Soporte Multi-idioma	📋 Planificado	v2.3.0
🔔 Push Notifications	📋 Planificado	v2.4.0
</div>
<div align="center">
