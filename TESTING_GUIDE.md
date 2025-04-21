
# Guía de Instalación y Configuración de Vitest para Pruebas Unitarias

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

## 🧪 Escribiendo Pruebas Unitarias

### Estructura Básica de una Prueba
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('Nombre del Componente o Funcionalidad', () => {
  it('descripción del comportamiento esperado', () => {
    // Configuración de la prueba
    // Ejecución de la acción
    // Verificación de resultados
    expect(resultado).toBe(esperado);
  });
});
```

## 🚀 Ejecutar Pruebas

### Comandos npm
- Ejecutar pruebas: `npm test`
- Ver cobertura de código: `npm run test:coverage`
- Modo watch (recarga automática): `npm run test:watch`

## 💡 Mejores Prácticas
- Mantén las pruebas pequeñas y enfocadas
- Prueba un comportamiento a la vez
- Usa descriptores claros en tus pruebas
- Cubre casos positivos y negativos

## 🔍 Ejemplos de Pruebas
Consulta los archivos de prueba en `src/__tests__/` para ejemplos prácticos.

## 📚 Documentación Oficial
- [Vitest Docs](https://vitest.dev/)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
