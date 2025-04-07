/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import supplierService from '@/services/supplierService';
import { Supplier } from '../data/supplierSchema';
import { Route } from '@/routes/_authenticated/suppliers/$supplierId';

// Shared layout components (adjust the import paths to match your project)
import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';

interface Product {
  id: number;
  deliveredDate: Date;
  amount: number;
  description: string;
}

interface SupplierDetailsData extends Supplier {
  products: Product[];
  totalAmount: number;
  debtOwed: number;
}

export default function SupplierDetail() {
  // Extract dynamic parameter from route (supplierId)
  const { supplierId } = Route.useParams() as { supplierId: string };
  const navigate = useNavigate();
  const [supplier, setSupplier] = useState<SupplierDetailsData | null>(null);

  useEffect(() => {
    if (supplierId) {
      supplierService
        .getSupplierById(Number(supplierId))
        .then((data) => {
          // Create dummy products and additional financial data
          const dummyData: SupplierDetailsData = {
            ...data,
            products: [
              { id: 1, deliveredDate: new Date('2023-03-15'), amount: 200, description: 'Product X' },
              { id: 2, deliveredDate: new Date('2023-04-10'), amount: 150, description: 'Product Y' },
            ],
            totalAmount: 350, // Sum of product amounts
            debtOwed: 100,    // Dummy debt owed value
          };
          setSupplier(dummyData);
        })
        .catch((err) => {
          console.error('Failed to fetch supplier', err);
        });
    }
  }, [supplierId]);

  if (!supplier) {
    return (
      <>
        <Header fixed>
          <Search />
          <div className="ml-auto flex items-center space-x-4">
            <ThemeSwitch />
            <ProfileDropdown />
          </div>
        </Header>
        <Main>
          <div className="p-4 text-center">Loading supplier details...</div>
        </Main>
      </>
    );
  }

  return (
    <>
      {/* Top Navigation */}
      <Header fixed>
        <Search />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      {/* Main Content */}
      <Main>
        <div className="p-4 max-w-4xl">
          <Button variant="ghost" onClick={() => navigate({ to: `/suppliers` })}>
            Back
          </Button>
          <div className="mt-6 bg-white shadow rounded-lg p-6">
            <h1 className="text-3xl font-bold mb-2">{supplier.name}</h1>
          </div>

          <div className="mt-8 bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Delivered Products</h2>
            {supplier.products.map((product) => (
              <div key={product.id} className="border-b pb-2 mb-2 last:border-0 last:mb-0">
                <p>
                  <strong>Date:</strong> {new Date(product.deliveredDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>Amount:</strong> ${product.amount.toFixed(2)}
                </p>
                <p>
                  <strong>Description:</strong> {product.description}
                </p>
              </div>
            ))}
            <div className="mt-4">
              <p>
                <strong>Total Amount:</strong> ${supplier.totalAmount.toFixed(2)}
              </p>
              <p>
                <strong>Debt Owed:</strong> ${supplier.debtOwed.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </Main>
    </>
  );
}
