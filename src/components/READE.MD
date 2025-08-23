# src/components: Aquí se encuentran los componentes reutilizables.

### Están divididos por funcionalidad:

#### **auth/** - omponentes específicos para la autenticación
> - Formularios: SignIn, SignUp, ResetPassword
> - Hooks personalizados para login y reset de contraseña

#### **Common/** - Componentes comunes utilizados en toda la app
> - Navigation: breadcrumbs, meta tags
> - UI: botones de tema, formas geométricas, tabs de gráficos

#### **form**/ -  Todo lo relacionado con formularios.
> - Elementos básicos: inputs, selects, checkboxes, radios
> - Componentes avanzados: multi-select, dropzone, phone input
> - Switches y toggles

> [!NOTE]
> src/auth/SignInForm.tsx es el formulario de inicio de sesión en sí, que luego es usado dentro de la página pages/AuthPages/SignIn.tsx.

#### **ui/** - Aquí están los componentes más básicos y genéricos, como:
> - Elementos básicos: botones, badges, avatars, alerts
> - Componentes complejos: modales, tablas, dropdowns
> - Multimedia: imágenes responsivas, videos con aspect ratios

> [!TIP]
> Piensa en ellos como tu propio kit de diseño. Si necesitas un botón, vienes aquí.

## Documentación sobre el flujo y logica del inicio de sesión

## Lógica del login

**La lógica de inicio de sesión está completamente separada de los componentes visuales. El componente SignInForm solo se encarga de mostrar la interfaz y pasar los datos al LoginHook, que a su vez utiliza un useAuth general.**

> El enfoque debe ser seguir el flujo del código: del componente **(SignInForm.tsx)** al hook **(LoginHook.ts)** y de ahí al hook principal de autenticación **(useAuth.ts)**.  