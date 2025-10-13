import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

export default function Home() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Check for the token to verify login status
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');

    if (token && storedUsername) {
      setUsername(storedUsername);
    } else {
      // If no token exists, the user is not logged in, so redirect them
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    // Clear all authentication data from storage
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-3xl" >Welcome! ✨</CardTitle>
        <CardDescription>You have successfully logged in.</CardDescription>
      </CardHeader>
      <CardContent>
          <div className="space-y-4">
             <p className="text-xl" data-testid="welcome-message">
    Hello, <strong>{username}</strong>!
</p>
          </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleLogout} className="w-full">
            Logout
        </Button>
      </CardFooter>
    </Card>
  );
}