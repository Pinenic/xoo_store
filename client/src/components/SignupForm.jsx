import { useState } from "react";
import { useAuth } from "../context/useAuth";
import {Button, Label, TextInput} from "flowbite-react"
import { useNavigate } from "react-router-dom";

export default function SignupForm({switchPage, page}) {
  const { signUp, error, clearError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [msg, setMsg] = useState("");
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/"); // redirect if already logged in
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setMsg("");
    const encoded = encodeURIComponent(firstname);
  const url = `https://api.dicebear.com/9.x/initials/svg?seed=${encoded}&backgroundColor=c5c5c5&textColor=ffffff`;
    const { error } = await signUp(email, password, firstname, lastname, url);
    error ? setMsg(error ? error.message : "Check your email to confirm account!") : navigate("/");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex max-w-md flex-col gap-4 m-auto border-2 p-6 py-10 rounded-xl mt-10"
    >
      <h1 className=" text-2xl font-semibold dark:text-white">
        Register an account
      </h1>
      <div className="flex gap-2">
        <div>
        <div className="mb-2 block">
          <Label htmlFor="fistname">First name</Label>
        </div>
        <TextInput
          id="firstname"
          type="text"
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
          
          required
        />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="lastname">Last name</Label>
        </div>
        <TextInput
          id="lastname"
          type="text"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
          
          required
        />
      </div>
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="email1">Your email</Label>
        </div>
        <TextInput
          id="email1"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="password1">Your password</Label>
        </div>
        <TextInput
          id="password1"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
      </div>
      <Button type="submit">Sign up</Button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {msg && <p>{msg}</p>}

      <p>
        Already have an account?{" "}
        <b
          className="text-cerulean-blue-800 cursor-pointer"
          onClick={() => switchPage(!page)}
        >
          {" "}
          Login
        </b>
      </p>
    </form>
  );
}
