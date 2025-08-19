import React, { useState } from "react";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";

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
