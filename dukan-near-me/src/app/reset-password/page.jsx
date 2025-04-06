
import { Suspense } from 'react';
import ResetPasswordComponent from '../components/userProfile/ResetPasswordComponent';

export default function ResetPassword() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ResetPasswordComponent/>
    </Suspense>
  );
}
