// Este archivo es la página principal de inicio de sesión. Su única responsabilidad es renderizar la estructura general de la página.

// <CustomMeta />: Este componente probablemente maneja las etiquetas meta para el SEO (por ejemplo, el título de la página).

// <AuthLayout>: Este es un componente de layout. Es la plantilla que envuelve todas las páginas de autenticación. Probablemente contiene la estructura visual común a esas páginas, como el fondo o un logo.

// <SignInForm />: Este es el componente que contiene el formulario de inicio de sesión real (los campos de email, contraseña y el botón).


import SignInForm from "../../components/auth/SignInForm";
import CustomMeta from "../../components/customMeta/CustomMeta";
import AuthLayout from "./AuthPageLayout";

export default function SignIn() {
  return (
    <>
      <CustomMeta />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
