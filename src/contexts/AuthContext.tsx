
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { User, UserRole } from "@/types";
import { users } from "@/services/mockData";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("licorera-user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulating API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real app, this would be a call to your authentication API
    // For now, we'll use mock data
    const foundUser = users.find(u => u.email === email);
    
    if (foundUser && password === "password123") {
      setUser(foundUser);
      setIsAuthenticated(true);
      
      // Store user in localStorage
      localStorage.setItem("licorera-user", JSON.stringify(foundUser));
      
      toast({
        title: "Inicio de sesión exitoso",
        description: `Bienvenido, ${foundUser.name}`,
      });
      
      return true;
    } else {
      toast({
        title: "Error de inicio de sesión",
        description: "Correo electrónico o contraseña incorrectos",
        variant: "destructive",
      });
      
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("licorera-user");
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente",
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
