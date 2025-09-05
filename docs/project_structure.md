# Documentación detallada del Proyecto

## Archivos de Configuración - Raíz
- `.env` → credenciales Firebase.
- `eslint.config.js` → Configura ESLint, una herramienta que detecta errores y mantiene un estilo de código consistente.
- `index.html` → El HTML base que carga el proyecto:
```
-<div id="root"></div> → aquí React “inyecta” toda la aplicación.
<script type="module" src="/src/main.tsx"></script> → arranca la app con Vite.
```
- `package.json` → lista dependencias, scripts y metadatos del proyecto.
- `package-lock.json o yarn lock` → bloquea versiones exactas de dependencias para que todos los desarrolladores usen lo mismo.
- `yarn.lock` → Se está usando Yarn en lugar de NPM.
- `postcss.config.js` → conecta Tailwind y Autoprefixer al proceso de compilación del CSS.
- `tailwind.config.js` → es el archivo grande donde se define el tema, colores, tipografías, breakpoints, etc.

### Archivos de configuración de TypeScript
- `tsconfig.json` → config principal (output, módulos, paths).
- `tsconfig.app.json` → config específica para el frontend.
- `tsconfig.node.json` → config para scripts de Node (ej. vite.config.ts).

### Vite.config.js + ts + d.ts
**Configura Vite, el bundler que empaqueta el proyecto:**
- Usa el plugin de React.
- Usa **vite-plugin-svgr** para importar SVG como componentes de React (`import { ReactComponent as Logo } from './logo.svg'`).
- Se definen optimizaciones como separar dependencias grandes (`manualChunks`) o habilitar sourcemaps para depuración.

**controla cómo se construye y sirve la app.**

### Despliegue
- `vercel.json` → Define reglas de despliegue en Vercel, la plataforma donde se hostea el frontend.

#

## Carpetas Principales
- `.github/` → Define un flujo de trabajo de GitHub Action.
- `.docs/` → Documenta detalladamente las configuraciones y/o practicas del proyecto
- `node_modules/` - Dependencias instaladas
- `public/` - Assets estáticos
- `src/` - Código fuente

#

## Estructura del proyecto
```
C:.
|   .env
|   .gitignore
|   eslint.config.js
|   estructura.txt
|   Git_Workflow.md
|   index.html
|   package-lock.json
|   package.json
|   postcss.config.js
|   README.md
|   tailwind.config.js
|   tsconfig.app.json
|   tsconfig.json
|   tsconfig.node.json
|   vercel.json
|   vite.config.d.ts
|   vite.config.js
|   vite.config.ts
|   yarn.lock
|  
+---.github
|   \---workflows
|           main.yml
+---docs
|      project_structure.md
+---node_modules
|      dependencias
+---public
|      \---images
|        vite.svg
└───src
    │   App.css
    │   App.d.ts
    │   App.tsx
    │   index.css
    │   main.d.ts
    │   main.tsx
    │   README.md
    │   vite-env.d.ts
    │
    ├───assets
    │       react.svg
    │
    ├───components
    │   │   READE.MD
    │   │
    │   ├───auth
    │   │   │   ResetPasswordFormContent.d.ts
    │   │   │   ResetPasswordFormContent.tsx
    │   │   │   ResetPasswordRequest.d.ts
    │   │   │   ResetPasswordRequest.tsx
    │   │   │   SignInForm.d.ts
    │   │   │   SignInForm.tsx
    │   │   │   SignUpForm.d.ts
    │   │   │   SignUpForm.tsx
    │   │   │
    │   │   └───hooks
    │   │           LoginHook.d.ts
    │   │           LoginHook.ts
    │   │           ResetPasswordRequestHook.d.ts
    │   │           ResetPasswordRequestHook.ts
    │   │
    │   ├───common
    │   │       ChartTab.d.ts
    │   │       ChartTab.tsx
    │   │       ComponentCard.d.ts
    │   │       ComponentCard.tsx
    │   │       GridShape.d.ts
    │   │       GridShape.tsx
    │   │       PageBreadCrumb.d.ts
    │   │       PageBreadCrumb.tsx
    │   │       PageMeta.d.ts
    │   │       PageMeta.tsx
    │   │       ScrollToTop.d.ts
    │   │       ScrollToTop.tsx
    │   │       ThemeToggleButton.d.ts
    │   │       ThemeToggleButton.tsx
    │   │       ThemeTogglerTwo.d.ts
    │   │       ThemeTogglerTwo.tsx
    │   │
    │   ├───customLoader
    │   │       CustomLoader.d.ts
    │   │       CustomLoader.tsx
    │   │
    │   ├───customMeta
    │   │       CustomMeta.d.ts
    │   │       CustomMeta.tsx
    │   │
    │   ├───form
    │   │   │   Form.d.ts
    │   │   │   Form.tsx
    │   │   │   Label.d.ts
    │   │   │   Label.tsx
    │   │   │   MultiSelect.d.ts
    │   │   │   MultiSelect.tsx
    │   │   │   Select.d.ts
    │   │   │   Select.tsx
    │   │   │
    │   │   ├───form-elements
    │   │   │       CheckboxComponents.d.ts
    │   │   │       CheckboxComponents.tsx
    │   │   │       DefaultInputs.d.ts
    │   │   │       DefaultInputs.tsx
    │   │   │       DropZone.d.ts
    │   │   │       DropZone.tsx
    │   │   │       FileInputExample.d.ts
    │   │   │       FileInputExample.tsx
    │   │   │       InputGroup.d.ts
    │   │   │       InputGroup.tsx
    │   │   │       InputStates.d.ts
    │   │   │       InputStates.tsx
    │   │   │       RadioButtons.d.ts
    │   │   │       RadioButtons.tsx
    │   │   │       SelectInputs.d.ts
    │   │   │       SelectInputs.tsx
    │   │   │       TextAreaInput.d.ts
    │   │   │       TextAreaInput.tsx
    │   │   │       ToggleSwitch.d.ts
    │   │   │       ToggleSwitch.tsx
    │   │   │
    │   │   ├───input
    │   │   │       Checkbox.d.ts
    │   │   │       Checkbox.tsx
    │   │   │       FileInput.d.ts
    │   │   │       FileInput.tsx
    │   │   │       InputField.d.ts
    │   │   │       InputField.tsx
    │   │   │       Radio.d.ts
    │   │   │       Radio.tsx
    │   │   │       RadioSm.d.ts
    │   │   │       RadioSm.tsx
    │   │   │       TextArea.d.ts
    │   │   │       TextArea.tsx
    │   │   │
    │   │   └───switch
    │   │           Switch.d.ts
    │   │           Switch.tsx
    │   │
    │   ├───header
    │   │       Header.d.ts
    │   │       Header.tsx
    │   │       NotificationDropdown.d.ts
    │   │       NotificationDropdown.tsx
    │   │       SearchBar.d.ts
    │   │       SearchBar.tsx
    │   │       UserDropdown.d.ts
    │   │       UserDropdown.tsx
    │   │
    │   └───ui
    │       ├───alert
    │       │       Alert.d.ts
    │       │       Alert.tsx
    │       │
    │       ├───avatar
    │       │       Avatar.d.ts
    │       │       Avatar.tsx
    │       │
    │       ├───badge
    │       │       Badge.d.ts
    │       │       Badge.tsx
    │       │
    │       ├───button
    │       │       Button.d.ts
    │       │       Button.tsx
    │       │
    │       ├───dropdown
    │       │       Dropdown.d.ts
    │       │       Dropdown.tsx
    │       │       DropdownItem.d.ts
    │       │       DropdownItem.tsx
    │       │
    │       ├───images
    │       │       ResponsiveImage.d.ts
    │       │       ResponsiveImage.tsx
    │       │       ThreeColumnImageGrid.d.ts
    │       │       ThreeColumnImageGrid.tsx
    │       │       TwoColumnImageGrid.d.ts
    │       │       TwoColumnImageGrid.tsx
    │       │
    │       ├───modal
    │       │       index.d.ts
    │       │       index.tsx
    │       │
    │       ├───table
    │       │       index.d.ts
    │       │       index.tsx
    │       │
    │       └───videos
    │               AspectRatioVideo.d.ts
    │               AspectRatioVideo.tsx
    │               FourIsToThree.d.ts
    │               FourIsToThree.tsx
    │               OneIsToOne.d.ts
    │               OneIsToOne.tsx
    │               SixteenIsToNine.d.ts
    │               SixteenIsToNine.tsx
    │               TwentyOneIsToNine.d.ts
    │               TwentyOneIsToNine.tsx
    │
    ├───context
    │       README.MD
    │       SidebarContext.d.ts
    │       SidebarContext.tsx
    │       ThemeContext.d.ts
    │       ThemeContext.tsx
    │
    ├───firebase
    │       firebaseConfig.d.ts
    │       firebaseConfig.ts
    │       REAMDE.Md
    │
    ├───global
    │       apis.d.ts
    │       apis.ts
    │       dataMock.d.ts
    │       dataMock.ts
    │       README.MD
    │
    ├───hooks
    │       protectedRoute.d.ts
    │       protectedRoute.tsx
    │       README.MD
    │       ResetPasswordFormHook.d.ts
    │       ResetPasswordFormHook.ts
    │       useAuth.d.ts
    │       useAuth.ts
    │
    ├───icons
    │        Muchos iconos
    │
    ├───layout
    │       AppHeader.d.ts
    │       AppHeader.tsx
    │       AppLayout.d.ts
    │       AppLayout.tsx
    │       AppSidebar.d.ts
    │       AppSidebar.tsx
    │       Backdrop.d.ts
    │       Backdrop.tsx
    │       README.MD
    │       SidebarWidget.d.ts
    │       SidebarWidget.tsx
    │
    └───pages
        │   README.md
        │
        ├───admin
        │       Admin.d.ts
        │       Admin.tsx
        │       DeliveryHistory.d.ts
        │       DeliveryHistory.tsx
        │       DriversManagement.d.ts
        │       DriversManagement.tsx
        │       OperationalMonitoring.d.ts
        │       OperationalMonitoring.tsx
        │       PackagesManagement.d.ts
        │       PackagesManagement.tsx
        │       RegisterPackages.d.ts
        │       RegisterPackages.tsx
        │       RouteManagement.d.ts
        │       RouteManagement.tsx
        │       Updates.d.ts
        │       Updates.tsx
        │       VehiclesManagement.d.ts
        │       VehiclesManagement.tsx
        │
        ├───AuthPages
        │       AuthPageLayout.d.ts
        │       AuthPageLayout.tsx
        │       ResetPasswordForm.d.ts
        │       ResetPasswordForm.tsx
        │       ResetRequest.d.ts
        │       ResetRequest.tsx
        │       SignIn.d.ts
        │       SignIn.tsx
        │       SignUp.d.ts
        │       SignUp.tsx
        │
        ├───driver
        │       Paginas admin
        │
        ├───otherPages
        │       NotFound.d.ts
        │       NotFound.tsx
        │
        └───profile
                AdminProfile.d.ts
                AdminProfile.tsx
                DriverProfile.d.ts
                DriverProfile.tsx
```