
import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { users } from "@/services/mockData";
import { UserRole } from "@/types";

const Users = () => {
  // Map role to Spanish display
  const getRoleName = (role: UserRole) => {
    const roleMap: Record<UserRole, string> = {
      admin: "Administrador",
      cliente: "Cliente",
      oficinista: "Oficinista",
      bodeguero: "Bodeguero",
      domiciliario: "Domiciliario"
    };
    return roleMap[role] || role;
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
        <div className="rounded-md border">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="py-3 px-4 text-left">Nombre</th>
                  <th className="py-3 px-4 text-left">Correo</th>
                  <th className="py-3 px-4 text-left">Rol</th>
                  <th className="py-3 px-4 text-left">Teléfono</th>
                  <th className="py-3 px-4 text-left">Estado</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="py-3 px-4">{user.name}</td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">
                      <span className="badge bg-primary/10 text-primary">
                        {getRoleName(user.role)}
                      </span>
                    </td>
                    <td className="py-3 px-4">{user.phone || "N/A"}</td>
                    <td className="py-3 px-4">
                      <span className={`badge ${
                        user.active ? 'badge-success' : 'badge-danger'
                      }`}>
                        {user.active ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-amber-50 p-4 rounded-md border border-amber-200">
          <h3 className="font-medium text-amber-800">Nota</h3>
          <p className="text-sm text-amber-700">
            Este es un demo con usuarios pre-cargados. En un sistema real, aquí se implementaría la funcionalidad 
            completa de gestión de usuarios (crear, modificar, eliminar, cambiar estado, etc.)
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Users;
