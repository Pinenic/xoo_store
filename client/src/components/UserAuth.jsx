import React, { useEffect, useState } from 'react'
import {useNavigate, useLocation} from 'react-router-dom'
import { supabase } from '../supabase';

export default function UserAuth(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [isSignup, setIsSignup] = useState(true);
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState({})
  const [loading, setLoading] = useState(false)

  //for routing
  //const navigate = useNavigate();
  //const location = useLocation();
  //const from = location.state?.from?.pathname || "/home";

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

  // Fetch profile
  async function fetchProfile(userId) {
    setLoading(true);
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) console.error(error);
    else setProfile(data);
    setLoading(false);
  }

  // Sign up
  async function signUp() {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return console.error(error);

    // Create profile
    const name = firstname + " " + lastname
    const { error: profileError } = await supabase.from('users').insert([
      { supabase_uid: data.user.id,
        name: name,
        email: email,
    }
    ]);
    if (profileError) console.error(profileError);
  }

  // Login
  async function login() {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) console.error(error);
  }

  // Logout
  async function logout() {
    await supabase.auth.signOut();
    setProfile({});
  }

  // Update profile
  async function updateProfile(updates) {
    const { error } = await supabase.from('users').update(updates).eq('id', session.user.id);
    if (error) console.error(error);
    else setProfile({ ...profile, ...updates });
  }

  if(!session) {



  return (
    <div className="flex flex-col text-center w-screen m-auto p-4 mt-10">
      {isSignup ? (
      <div className="flex flex-col w-full md:w-1/2 lg:w-1/4 m-auto gap-6 border-2 p-4 rounded-lg">
      <h1 className='text-2xl text-pine-accent'>Welcome to Xoo Store</h1>
      <h2>Sign In</h2>

      <input type="text" placeholder="First name" value={firstname} onChange={(e)=> setFirstname(e.target.value)} />

      <input type="text" placeholder="Last Name" value={lastname} onChange={(e)=> setLastname(e.target.value)} />

      <input type="text" placeholder="Email" value={email} onChange={(e)=> setEmail(e.target.value)} />

      <input type="text" placeholder="Password" value={password} onChange={(e)=> setPassword(e.target.value)} />

      <button onClick={signUp} className='border-2 border-pine-accent p-1 rounded-lg bg-pine-accent text-white'>Sign Up</button>
      <p>already have an account <b onClick={switchForm} className='text-pine-brown'>Sign In</b></p>
      </div>):(
      <div className="signIn">
      <h1>Welcome back</h1>
      <h2>Sign In</h2>
      <input type="text" placeholder="Email" value={email} onChange={(e)=> setEmail(e.target.value)} />
      <input type="text" placeholder="Password" value={password} onChange={(e)=> setPassword(e.target.value)} />
      <button onClick={login}>Sign In</button>
      <p>Don't have an account? <b onClick={switchForm}>Sign Up</b></p>
      </div>)}

    </div>
  
  );}

  return (
    <>
    <div className="flex flex-col">
        <h2>Welcome {profile.name || session.user.email}</h2>
        {
            loading? (
                <p>Loading profile</p>
            ) : (
                <button onClick={logout}>Logout</button>
            )
        }
    </div>
    </>
  )
}
