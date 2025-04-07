/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import customerService from '@/services/customerService';
import { Customer } from '../data/customerSchema';
import { Route } from '@/routes/_authenticated/customers/$customerId';

// Shared layout components (adjust the import paths to match your project)
import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';

interface Purchase {
  id: number;
  date: Date;
  amount: number;
  description: string;
}

interface CustomerDetailsData extends Customer {
  purchases: Purchase[];
  totalPurchases: number;
  debtOwed: number;
}

export default function CustomerDetail() {
  // Extract dynamic parameter using your route's useParams helper
  const { customerId } = Route.useParams() as { customerId: string };
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<CustomerDetailsData | null>(null);

  useEffect(() => {
    if (customerId) {
      customerService
        .getCustomerById(Number(customerId))
        .then((data) => {
          // Combine fetched data with dummy purchases/due values
          const dummyData: CustomerDetailsData = {
            ...data,
            purchases: [
              { id: 1, date: new Date('2023-01-15'), amount: 120, description: 'Item A' },
              { id: 2, date: new Date('2023-02-10'), amount: 75, description: 'Item B' },
            ],
            totalPurchases: 2,
            debtOwed: 50,
          };
          setCustomer(dummyData);
        })
        .catch((err) => {
          console.error('Failed to fetch customer', err);
        });
    }
  }, [customerId]);

  if (!customer) {
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
          <div className="p-4 text-center">Loading customer details...</div>
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
          <Button variant="ghost" onClick={() => navigate({ to: `/customers` })}>
            Back
           
          </Button>
          <div className="mt-6 bg-white shadow rounded-lg p-6">
            <h1 className="text-3xl font-bold mb-2">{customer.name}</h1>
            <div className="space-y-1 text-gray-700">
              <p>
                <strong>Email:</strong> {customer.email}
              </p>
              <p>
                <strong>Phone:</strong> {customer.phone}
              </p>
              <p>
                <strong>Address:</strong> {customer.address}
              </p>
              <p>
                <strong>Company:</strong> {customer.company}
              </p>
              <p>
                <strong>Created At:</strong> {new Date(customer.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="mt-8 bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Purchases</h2>
            {customer.purchases.map((purchase) => (
              <div key={purchase.id} className="border-b pb-2 mb-2 last:border-0 last:mb-0">
                <p>
                  <strong>Date:</strong> {new Date(purchase.date).toLocaleDateString()}
                </p>
                <p>
                  <strong>Amount:</strong> ${purchase.amount.toFixed(2)}
                </p>
                <p>
                  <strong>Description:</strong> {purchase.description}
                </p>
              </div>
            ))}
            <div className="mt-4">
              <p>
                <strong>Total Purchases:</strong> {customer.totalPurchases}
              </p>
              <p>
                <strong>Debt Owed:</strong> ${customer.debtOwed.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </Main>
    </>
  );
}
