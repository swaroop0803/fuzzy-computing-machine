import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios'; // 1. Import axios
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// The URL of your backend's login endpoint
const API_URL = 'http://localhost:5001/api/auth/login';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // 2. Make the handler function asynchronous
  const handleLogin = async () => {
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }

    try {
      // 3. Make the API call to the backend
      const response = await axios.post(API_URL, {
        email,
        password,
      });

      // 4. On successful login, save the token and username
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', response.data.username);

      // 5. Navigate to the home page
      navigate('/home');

    } catch (err) {
      // 6. If there's an error, display the error message
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'Login failed. Please check your credentials.');
      } else {
        setError('An unexpected error occurred.');
      }
      console.error('Login error:', );
    }
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl" role="heading">Login</CardTitle>
        <CardDescription>Enter your email below to login to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {/* Input fields remain the same */}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <p className="text-sm font-medium text-destructive">{error}</p>}
          <Button type="button" className="w-full" onClick={handleLogin}>
            Login
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="underline">
            Register
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}