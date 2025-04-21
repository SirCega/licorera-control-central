
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

const Unauthorized = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-4">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <AlertTriangle className="h-12 w-12 text-amber-500" />
            <h1 className="text-2xl font-bold text-center">Acceso Denegado</h1>
            <p className="text-muted-foreground">
              No tienes permisos para acceder a esta página. Tu rol actual es{" "}
              <strong>{user?.role || "desconocido"}</strong>.
            </p>
            <div className="space-y-2 w-full">
              <Button 
                className="w-full" 
                onClick={() => navigate("/dashboard")}
              >
                Ir al Dashboard
              </Button>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => navigate("/")}
              >
                Ir a la página principal
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
