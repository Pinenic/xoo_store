import React from "react";
import FlowBiteHeader from "../components/FlowBiteHeader";
import Hero from "../components/Hero";

export default function Landing({ user, profile }) {
  return (
    <>{user ? <FlowBiteHeader profile={profile} /> : <FlowBiteHeader />}
    <Hero />
    </>

  );
}
