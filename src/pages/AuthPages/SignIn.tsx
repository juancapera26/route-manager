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
