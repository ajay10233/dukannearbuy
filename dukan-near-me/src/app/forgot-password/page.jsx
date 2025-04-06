import { Suspense } from 'react';
import ForgotPasswordComponent from '../components/userProfile/ForgotPasswordComponent';

export default function ForgotPassword() {
  return (
   <Suspense fallback={<p>Loading...</p>}>
      <ForgotPasswordComponent/>
    </Suspense>
  );
}
