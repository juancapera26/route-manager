import SignUpForm from "../../components/auth/SignUpForm";
import CustomMeta from "../../components/customMeta/CustomMeta";
import AuthLayout from "./AuthPageLayout";

export default function SignUp() {
  return (
    <>
      <CustomMeta />
      <AuthLayout>
        <SignUpForm />
      </AuthLayout>
    </>
  );
}
