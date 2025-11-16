import { useRef } from "react";
import { Button } from "../Button";
import { Input } from "../Input";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_MONGO_URL ?? "http://localhost:3000";

export function Signin() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  async function handleSignin() {
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    if (!email || !password) {
      alert("Please fill in both fields.");
      return;
    }

    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
        email,
        password,
      });

      const jwt = response.data.token;
      localStorage.setItem("token", jwt);

      alert("Signin successful!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Signin failed:", error);
      alert(error.response?.data?.message || "Signin failed. Please check your credentials.");
    }
  }

  return (
    <div className="h-screen w-screen bg-gray-200 flex justify-center items-center">
      <div className="bg-white rounded-xl border min-w-48 p-8 space-y-4">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign In</h2>
        <Input reference={emailRef} placeholder="Email" type="email" />
        <Input reference={passwordRef} placeholder="Password" type="password" />

        <div className="flex justify-center pt-4">
          <Button
            onClick={handleSignin}
            loading={false}
            variant="primary"
            text="Signin"
            fullWidth={true}
          />
        </div>
      </div>
    </div>
  );
}
