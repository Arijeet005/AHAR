import { SignIn } from '@clerk/clerk-react';

const SignInPage = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <SignIn path="/sign-in" routing="path" />
    </div>
  );
};

export default SignInPage;