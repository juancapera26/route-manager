
import ResetPasswordRequest from '../../components/auth/ResetPasswordRequest'
import CustomMeta from '../../components/customMeta/CustomMeta'
import AuthLayout from './AuthPageLayout'

const ResetRequest = () => {
  return (
    <>
      <CustomMeta />
      <AuthLayout>
        <ResetPasswordRequest />
      </AuthLayout>
    </>
  )
}

export default ResetRequest
