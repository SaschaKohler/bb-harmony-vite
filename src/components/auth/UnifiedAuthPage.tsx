import React, { useState } from "react";
import { LoginForm } from "./LoginForm";
import { RegistrationForm } from "./RegistrationForm";

export const UnifiedAuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div>
      {isLogin ? (
        <LoginForm setIsLogin={setIsLogin} />
      ) : (
        <RegistrationForm setIsLogin={setIsLogin} />
      )}
    </div>
  );
};
