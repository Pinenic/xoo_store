import React, { useState } from "react";
import LoginForm from "../components/Auth/LoginForm";
import SignupForm from "../components/Auth/SignupForm";

export default function AuthPage(props) {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <>
      {isLogin ? (
        <LoginForm switchPage={setIsLogin} page={isLogin} />
      ) : (
        <SignupForm switchPage={setIsLogin} page={isLogin} />
      )}
    </>
  );
}
