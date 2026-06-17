import { addDays, format } from 'date-fns';
import { Product } from '@/types';

function isoDate(daysFromNow: number): string {
  return format(addDays(new Date(), daysFromNow), 'yyyy-MM-dd');
}

const now = new Date().toISOString();

export const SEED_PRODUCTS: Product[] = [
  {
    id: 'seed-1',
    name: 'Leite Integral',
    category: 'Laticínios',
    purchaseDate: isoDate(-5),
    expiryDate: isoDate(60),
    quantity: 2,
    unit: 'L',
    source: 'manual',
    consumed: false,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'seed-2',
    name: 'Iogurte',
    category: 'Laticínios',
    purchaseDate: isoDate(-10),
    expiryDate: isoDate(20),
    quantity: 4,
    unit: 'un',
    source: 'manual',
    consumed: false,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'seed-3',
    name: 'Frango',
    category: 'Carnes',
    purchaseDate: isoDate(-2),
    expiryDate: isoDate(3),
    quantity: 1,
    unit: 'kg',
    source: 'manual',
    consumed: false,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'seed-4',
    name: 'Tomate',
    category: 'Hortifruti',
    purchaseDate: isoDate(-7),
    expiryDate: isoDate(-2),
    quantity: 500,
    unit: 'g',
    source: 'manual',
    consumed: false,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'seed-5',
    name: 'Arroz',
    category: 'Mercearia',
    purchaseDate: isoDate(-30),
    expiryDate: isoDate(180),
    quantity: 5,
    unit: 'kg',
    source: 'manual',
    consumed: false,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'seed-6',
    name: 'Pão de Forma',
    category: 'Padaria',
    purchaseDate: isoDate(-3),
    expiryDate: isoDate(15),
    quantity: 1,
    unit: 'un',
    source: 'manual',
    consumed: false,
    createdAt: now,
    updatedAt: now,
  },
];
