import { useState } from 'react';
import useAuth from '../../../hooks/useAuth';

const useLoginHook = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const { handleLogin } = useAuth();

  return {
    email,
    password,
    error,
    showPassword,
    isChecked,
    setPassword,
    setEmail,
    setError,
    handleLogin,
    setShowPassword,
    setIsChecked};
}

export default useLoginHook
