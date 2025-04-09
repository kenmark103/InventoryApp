'use client';

import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import categoryService from '@/services/categoryService';
import { Category } from '../data/categorySchema';
import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';

export default function CategoryDetail() {
  const { categoryId } = /* your hook here */ { categoryId: '1' };
  const navigate = useNavigate();
  const [category, setCategory] = useState<Category | null>(null);

  useEffect(() => {
    if (categoryId) {
      categoryService
        .getCategoryById(Number(categoryId))
        .then((data) => setCategory(data))
        .catch((err) => console.error('Failed to fetch category', err));
    }
  }, [categoryId]);

  if (!category) {
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
          <div className="p-4 text-center">Loading category details...</div>
        </Main>
      </>
    );
  }

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
        <div className="p-4 max-w-4xl">
          <Button variant="ghost" onClick={() => navigate({ to: `/categories` })}>
            Back
          </Button>
          <div className="mt-6 bg-white shadow rounded-lg p-6">
            <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
            <div className="space-y-1 text-gray-700">
              <p>
                <strong>Status:</strong> {category.status}
              </p>
              {category.parentId && (
                <p>
                  <strong>Parent Category ID:</strong> {category.parentId}
                </p>
              )}
              {/* Additional category details */}
            </div>
          </div>

          <div className="mt-8 bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Subcategories</h2>
            {category.children && category.children.length > 0 ? (
              category.children.map((child) => (
                <div key={child.id} className="border-b pb-2 mb-2">
                  <p>
                    <strong>Name:</strong> {child.name}
                  </p>
                  <p>
                    <strong>Status:</strong> {child.status}
                  </p>
                </div>
              ))
            ) : (
              <p>No subcategories available.</p>
            )}
          </div>
          {/* Optionally, list products associated with this category */}
        </div>
      </Main>
    </>
  );
}
