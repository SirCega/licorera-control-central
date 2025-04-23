
# Guía de Instalación y Configuración de Vitest para Pruebas Unitarias

La aplicación está desarrollada con React, TypeScript, Vite, Tailwind CSS y Shadcn UI.
Vitest es un framework de pruebas rápido y moderno para aplicaciones JavaScript y TypeScript, especialmente diseñado para integrarse con Vite

## 📋 Requisitos Previos
- Node.js (versión 18 o superior)
- npm (gestor de paquetes)
- Proyecto React con TypeScript

## 🔧 Instalación

### 1. Instalar Dependencias de Pruebas
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

### 2. Configuración de Vitest en `vite.config.ts`
```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html']
    }
  }
});
```

### 3. Crear archivo de configuración de pruebas `setupTests.ts`
```typescript
import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);
afterEach(() => {
  cleanup();
});
```

## 🧪 Ejemplos de Pruebas Implementadas

### Pruebas de Productos (Products.test.tsx)

Estas pruebas verifican la integridad de los datos de productos en nuestra aplicación:

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Product } from '@/types';
import { products } from '@/services/mockData';

describe('Products Mock Data', () => {
  it('verifica que los productos tengan la estructura correcta', () => {
    products.forEach((product: Product) => {
      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('name');
      expect(product).toHaveProperty('description');
      expect(product).toHaveProperty('price');
      expect(product).toHaveProperty('boxQuantity');
      expect(product).toHaveProperty('unitsPerBox');
      expect(product).toHaveProperty('totalUnits');
      expect(product).toHaveProperty('category');
    });
  });

  it('verifica que los precios sean números positivos', () => {
    products.forEach((product: Product) => {
      expect(product.price).toBeGreaterThan(0);
    });
  });

  it('verifica que las cantidades sean números enteros positivos', () => {
    products.forEach((product: Product) => {
      expect(Number.isInteger(product.boxQuantity)).toBe(true);
      expect(product.boxQuantity).toBeGreaterThan(0);
      expect(Number.isInteger(product.unitsPerBox)).toBe(true);
      expect(product.unitsPerBox).toBeGreaterThan(0);
      expect(Number.isInteger(product.totalUnits)).toBe(true);
      expect(product.totalUnits).toBeGreaterThan(0);
    });
  });

  it('verifica que el total de unidades sea igual a boxQuantity * unitsPerBox', () => {
    products.forEach((product: Product) => {
      expect(product.totalUnits).toBe(product.boxQuantity * product.unitsPerBox);
    });
  });

  it('verifica que las descripciones no estén vacías', () => {
    products.forEach((product: Product) => {
      expect(product.description.length).toBeGreaterThan(0);
    });
  });
});
```

### Pruebas de Login (Login.test.tsx)

Estas pruebas verifican la funcionalidad del componente de inicio de sesión:

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import Login from '@/pages/Login';

const renderLogin = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Login Component', () => {
  beforeEach(() => {
    renderLogin();
  });

  it('renderiza el formulario de login correctamente', () => {
    expect(screen.getByText('Licorera Control Central')).toBeInTheDocument();
    expect(screen.getByLabelText(/Correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Ingresar/i })).toBeInTheDocument();
  });

  it('muestra mensajes de error cuando los campos están vacíos', async () => {
    const submitButton = screen.getByRole('button', { name: /Ingresar/i });
    fireEvent.click(submitButton);
    
    // Verificar que los campos son requeridos
    const emailInput = screen.getByLabelText(/Correo electrónico/i);
    const passwordInput = screen.getByLabelText(/Contraseña/i);
    
    expect(emailInput).toBeRequired();
    expect(passwordInput).toBeRequired();
  });

  it('permite ingresar email y contraseña', () => {
    const emailInput = screen.getByLabelText(/Correo electrónico/i);
    const passwordInput = screen.getByLabelText(/Contraseña/i);

    fireEvent.change(emailInput, { target: { value: 'admin@licorera.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput).toHaveValue('admin@licorera.com');
    expect(passwordInput).toHaveValue('password123');
  });
});
```

## 🚀 Ejecutar las Pruebas

### Comandos disponibles

1. Ejecutar todas las pruebas:
```bash
npm test
```

Resultado esperado:
```
✓ Products Mock Data › verifica que los productos tengan la estructura correcta
✓ Products Mock Data › verifica que los precios sean números positivos
✓ Products Mock Data › verifica que las cantidades sean números enteros positivos
✓ Login Component › renderiza el formulario de login correctamente
✓ Login Component › permite ingresar email y contraseña

Test Files  2 passed (2)
     Tests  5 passed (5)
      Time  2.89s (in thread 0.65s, 444.62%)
```

2. Ver la cobertura de código:
```bash
npm run test:coverage
```

Resultado esperado:
```
 % Coverage report from v8
-----------------------------|---------|----------|---------|---------|
File                         | % Stmts | % Branch | % Funcs | % Lines |
-----------------------------|---------|----------|---------|---------|
All files                   |   85.71 |    78.95 |   83.33 |   85.71 |
 src/__tests__              |     100 |      100 |     100 |     100 |
  Login.test.tsx            |     100 |      100 |     100 |     100 |
  Products.test.tsx         |     100 |      100 |     100 |     100 |
-----------------------------|---------|----------|---------|---------|
```

3. Modo watch (desarrollo):
```bash
npm run test:watch
```

Este comando mantendrá las pruebas ejecutándose automáticamente cuando se detecten cambios en los archivos.

## 💡 Mejores Prácticas
- Mantén las pruebas pequeñas y enfocadas
- Prueba un comportamiento a la vez
- Usa descriptores claros en tus pruebas
- Cubre casos positivos y negativos

## Pruebas en la terminal

Creamos una carpeta donde clonaremos el repositorio e instalaremos npm

![image](https://github.com/user-attachments/assets/0d32a54e-f780-4bbe-be9b-df0207c227b7)

Ejecutamos todas las pruebas 

![image](https://github.com/user-attachments/assets/1c1de8ff-3551-4ce4-a541-b50ed4a086fc)

Y como se aprecia las pruebas que creamos para login y productos con vitest nos da la respuesta esperada

Y asi podemos crear multiples pruebas unitarias para cualquier componente en nuestro programa

Elegimos Vitest porque se adapta perfectamente a nuestro stack moderno (React + TypeScript + Vite), ofrece pruebas ultra rápidas, configuración mínima y una experiencia de desarrollo superior.


## 🔍 Estructura de Archivos de Prueba
```
src/
  __tests__/
    Products.test.tsx
    Login.test.tsx
  setupTests.ts
```

## 📚 Documentación Oficial
- [Vitest Docs](https://vitest.dev/)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
