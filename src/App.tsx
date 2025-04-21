
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Inventory from "./pages/Inventory";
import Users from "./pages/Users";
import Reports from "./pages/Reports";
import Deliveries from "./pages/Deliveries";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <DataProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/productos" element={
                <ProtectedRoute allowedRoles={["admin", "oficinista", "bodeguero"]}>
                  <Products />
                </ProtectedRoute>
              } />
              
              <Route path="/pedidos" element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              } />
              
              <Route path="/inventario" element={
                <ProtectedRoute allowedRoles={["admin", "oficinista", "bodeguero"]}>
                  <Inventory />
                </ProtectedRoute>
              } />
              
              <Route path="/usuarios" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Users />
                </ProtectedRoute>
              } />
              
              <Route path="/reportes" element={
                <ProtectedRoute allowedRoles={["admin", "oficinista"]}>
                  <Reports />
                </ProtectedRoute>
              } />
              
              <Route path="/envios" element={
                <ProtectedRoute allowedRoles={["admin", "oficinista", "domiciliario"]}>
                  <Deliveries />
                </ProtectedRoute>
              } />
              
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
