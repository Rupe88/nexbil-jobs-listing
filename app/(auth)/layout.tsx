import React, { ReactNode } from 'react';

type AuthenticationLayoutProps = {
  children: ReactNode;
};

const AuthenticationLayout = ({ children }: AuthenticationLayoutProps) => {
  return (
    <div className="h-screen flex items-center justify-center">{children}</div>
  );
};

export default AuthenticationLayout;
