import React, { useEffect } from 'react';
import AuthenticationForm from '../AuthenticationForm';

export default function SimpleAuthentication(props) {
  const { setGlobalLoader } = props;

  useEffect(() => {
    setGlobalLoader(false);
  }, []);

  return <AuthenticationForm />;
}
