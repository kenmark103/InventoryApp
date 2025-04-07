import React from 'react';
import { useRouter } from 'next/router';
import { ArrowLeftIcon } from '@heroicons/react/solid'; // Using heroicons for the back arrow
// Assume these are prebuilt UI components
import { Card } from '@/components/ui/card';
import { Dropdown } from '@/components/ui/dropdown';

export default function ProductDetail() {
  const router = useRouter();

  return (
    <div className="container mx-auto p-4">
      {/* Back Button */}
      <button
        className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
        onClick={() => router.back()}
      >
        <ArrowLeftIcon className="w-6 h-6 mr-2" />
        Back
      </button>

      {/* Product Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Product Title</h1>
      </div>

      {/* Top Row: Description & Product Images */}
      <div className="grid grid-cols-2 gap-4">
        {/* Description & Item Type */}
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum.
          </p>
          {/* Item Type underneath Description */}
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-1">Item Type</h3>
            <p className="text-gray-600">Example Type</p>
          </div>
        </Card>

        {/* Product Images */}
        <Card className="p-4">
          <div className="grid grid-cols-2 gap-2">
            {/* Each image takes 50% of the width */}
            <div className="w-full">
              <img
                src="/path/to/image1.jpg"
                alt="Product Image 1"
                className="w-full h-auto object-cover rounded"
              />
            </div>
            <div className="w-full">
              <img
                src="/path/to/image2.jpg"
                alt="Product Image 2"
                className="w-full h-auto object-cover rounded"
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Second Row: Category & Shipping/Delivery */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        {/* Category Card */}
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-2">Category</h2>
          <Dropdown>
            {/* Replace with your actual dropdown options */}
            <Dropdown.Toggle>Select Category</Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item>Category 1</Dropdown.Item>
              <Dropdown.Item>Category 2</Dropdown.Item>
              <Dropdown.Item>Category 3</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Card>

        {/* Shipping and Delivery Card */}
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-2">Shipping and Delivery</h2>
          <p className="text-gray-600">Weight: 1.2kg</p>
          <p className="text-gray-600">Size: 20 x 15 x 10 cm</p>
        </Card>
      </div>

      {/* Third Row: Pricing & Inventory */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        {/* Pricing Card */}
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-2">Pricing</h2>
          <p className="text-gray-600">Price: $99.99</p>
        </Card>

        {/* Inventory Card */}
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-2">Inventory</h2>
          <p className="text-gray-600">Quantity: 50</p>
          <p className="text-gray-600">SKU: 123456</p>
        </Card>
      </div>

      {/* Fourth Row: Tax Card */}
      <div className="mt-6">
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-2">Tax</h2>
          <p className="text-gray-600">Tax Rate: 8%</p>
        </Card>
      </div>

      {/* Fifth Row: Added By & Suppliers */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        {/* Added By Card */}
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-2">Added By</h2>
          <p className="text-gray-600">John Doe</p>
        </Card>

        {/* Suppliers Card */}
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-2">Suppliers</h2>
          <p className="text-gray-600">Supplier Name</p>
        </Card>
      </div>
    </div>
  );
}
