import { useEffect, useState } from 'react'
import { useAuth } from '../context/useAuth'
import {Button, Checkbox, Label, TextInput} from "flowbite-react"
import { useNavigate } from 'react-router-dom'

export default function LoginForm({switchPage, page}) {
  const { signIn, error, clearError } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/"); // redirect if already logged in
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault()
    clearError()
    setMsg('')
    const { error } = await signIn(email, password)
    error ? setMsg( error.message ) : navigate("/");
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-6 m-auto border-2 p-6 py-10 rounded-xl mt-10">
        <h1 className=' text-2xl font-semibold dark:text-white'>Sign in to your account</h1>
        <div>
        <div className="mb-2 block">
          <Label htmlFor="email1">Your email</Label>
        </div>
        <TextInput id="email1" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email"  required />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="password1">Your password</Label>
        </div>
        <TextInput id="password1" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" required />
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="remember" />
        <Label htmlFor="remember">Remember me</Label>
      </div>
      <Button type="submit">Login</Button>

      {error && <p style={{color:'red'}}>{error}</p>}
      {msg && <p>{msg}</p>}

      <p>Don't have an account? <b className='text-cerulean-blue-800 cursor-pointer' onClick={() => switchPage(!page)}> Sign up</b></p>
    </form>
  )
}
