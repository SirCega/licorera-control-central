
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate("/dashboard");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-4">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Licorera Control Central</CardTitle>
            <CardDescription className="text-center">
              Ingrese sus credenciales para acceder al sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  placeholder="correo@ejemplo.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Ingresando..." : "Ingresar"}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-center w-full text-muted-foreground">
              Nota: Para esta demo, use cualquier email de la lista y contraseña "password123"
            </p>
          </CardFooter>
        </Card>
        
        <div className="mt-4 p-4 bg-white rounded shadow-sm">
          <h3 className="font-medium mb-2">Usuarios de prueba:</h3>
          <ul className="text-sm space-y-1">
            <li><strong>Admin:</strong> admin@licorera.com</li>
            <li><strong>Cliente:</strong> juan@example.com</li>
            <li><strong>Oficinista:</strong> maria@licorera.com</li>
            <li><strong>Bodeguero:</strong> carlos@licorera.com</li>
            <li><strong>Domiciliario:</strong> luis@licorera.com</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Login;
