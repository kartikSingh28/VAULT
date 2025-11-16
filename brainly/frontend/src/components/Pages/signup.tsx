import { useRef } from "react";
import { Button } from "../Button";
import { Input } from "../Input";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_MONGO_URL ?? "http://localhost:3000";

export function Signup() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  async function signup() {
    const username = usernameRef.current?.value;
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    if (!username || !email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      await axios.post(`${BACKEND_URL}/api/v1/signup`, {
        username,
        email,
        password,
      });

      alert("Signup successful! Redirecting to signin...");
      navigate("/signin");
    } catch (err: any) {
      console.error("Signup failed", err);
      alert(err.response?.data?.message || "Signup failed, please try again.");
    }
  }

  return (
    <div className="h-screen w-screen bg-gray-200 flex justify-center items-center">
      <div className="bg-white rounded-xl border min-w-48 p-8">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
        <Input reference={usernameRef} placeholder="Username" />
        <Input reference={emailRef} placeholder="Email" type="email" />
        <Input reference={passwordRef} placeholder="Password" type="password" />
        <div className="flex justify-center pt-4">
          <Button
            onClick={signup}
            loading={false}
            variant="primary"
            text="Signup"
            fullWidth={true}
          />
        </div>
      </div>
    </div>
  );
}
