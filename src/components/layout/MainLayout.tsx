
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart2, 
  LogOut, 
  Menu, 
  X,
  Home,
  Truck,
  ClipboardList
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Define navigation items based on user role
  const getNavItems = () => {
    const items = [
      {
        name: "Dashboard",
        icon: Home,
        path: "/dashboard",
        roles: ["admin", "oficinista", "bodeguero", "domiciliario"]
      },
      {
        name: "Productos",
        icon: Package,
        path: "/productos",
        roles: ["admin", "oficinista", "bodeguero"]
      },
      {
        name: "Pedidos",
        icon: ShoppingCart,
        path: "/pedidos",
        roles: ["admin", "oficinista", "bodeguero", "domiciliario", "cliente"]
      },
      {
        name: "Inventario",
        icon: ClipboardList,
        path: "/inventario",
        roles: ["admin", "oficinista", "bodeguero"]
      },
      {
        name: "Usuarios",
        icon: Users,
        path: "/usuarios",
        roles: ["admin"]
      },
      {
        name: "Envíos",
        icon: Truck,
        path: "/envios",
        roles: ["admin", "oficinista", "domiciliario"]
      },
      {
        name: "Reportes",
        icon: BarChart2,
        path: "/reportes",
        roles: ["admin", "oficinista"]
      }
    ];

    // Filter items based on user role
    return items.filter(item => user && item.roles.includes(user.role));
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-md z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar}
              className="text-primary-foreground hover:bg-primary/90"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
            <h1 className="text-xl font-bold">Licorera Control Central</h1>
          </div>
          
          {user && (
            <div className="flex items-center space-x-2">
              <span className="hidden md:inline">
                {user.name} ({user.role})
              </span>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={logout}
                className="text-primary-foreground hover:bg-primary/90"
              >
                <LogOut size={20} />
              </Button>
            </div>
          )}
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside 
          className={cn(
            "bg-sidebar text-sidebar-foreground w-64 shadow-lg z-20 transition-all duration-300 ease-in-out transform",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
            "fixed md:relative h-[calc(100vh-57px)] overflow-y-auto"
          )}
        >
          <nav className="py-4">
            <ul className="space-y-1 px-2">
              {getNavItems().map((item) => (
                <li key={item.path}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      location.pathname === item.path && "bg-sidebar-accent text-sidebar-accent-foreground"
                    )}
                    onClick={() => {
                      navigate(item.path);
                      if (isMobile) setSidebarOpen(false);
                    }}
                  >
                    <item.icon className="mr-2 h-5 w-5" />
                    {item.name}
                  </Button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main content */}
        <main className={cn(
          "flex-1 p-4 transition-all duration-300 ease-in-out",
          sidebarOpen && "md:ml-0" // Add margin when sidebar is open on desktop
        )}>
          <div className="container mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
