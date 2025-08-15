import React, {useState, useEffect} from "react";
import { supabase } from "../supabase";

export default function Auth(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSignup, setIsSignup] = useState(true);
    const [session, setSession] = useState(null)


  const switchForm = ()=>{
    if(isSignup){
      setIsSignup(false);
    }
    else{
      setIsSignup(true);
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    setLoading(false);

    if (error) {
      setMessage(error.message);
    } else {
      setMessage(
        "Signup successful! Please check your email to confirm your account."
      );
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Login successful!");
    }
  };

    // Logout
    async function logout() {
      await supabase.auth.signOut();
      setProfile({});
    }

  if(!session) {
  if(isSignup){

  return (
    <form onSubmit={handleSignup}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button disabled={loading}>
        {loading ? "Signing up..." : "Sign Up"}
      </button>
      <p>already have an account <b onClick={switchForm} className='text-pine-brown'>Sign In</b></p>
      {message && <p>{message}</p>}
    </form>
  );
}

return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button>Login</button>
      <p>Don't have an account? <b onClick={switchForm}>Sign Up</b></p>
      {message && <p>{message}</p>}
    </form>
  )
}

return (
    <>
    <div className="flex flex-col">
        <h2>Welcome {session.user.email}</h2>

         <button onClick={logout}>Logout</button>
    </div>
    </>
  )
}
