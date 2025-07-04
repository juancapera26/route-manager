import ResetPasswordFormContent from "../../components/auth/ResetPasswordFormContent";
import CustomMeta from "../../components/customMeta/CustomMeta";
import AuthLayout from "./AuthPageLayout";

const ResetPasswordForm = () => {
  return (
    <>
      <CustomMeta />
      <AuthLayout>
        <ResetPasswordFormContent />
      </AuthLayout>
    </>
  );
}

export default ResetPasswordForm;
