
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
