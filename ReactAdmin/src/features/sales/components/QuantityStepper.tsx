// components/sales/QuantityStepper.tsx
import { useState, useEffect } from 'react';

export function QuantityStepper({
  value,
  onChange,
}: {
  value: number;
  onChange: (newValue: number) => void;
}) {
  const [quantity, setQuantity] = useState(value);

  useEffect(() => {
    setQuantity(value);
  }, [value]);

  const handleChange = (newValue: number) => {
    const validated = Math.max(1, newValue);
    setQuantity(validated);
    onChange(validated);
  };

  return (
    <div className="flex items-center gap-2 border rounded-lg p-1 w-fit">
      <button
        onClick={() => handleChange(quantity - 1)}
        className="px-2 hover:bg-gray-100 rounded"
      >
        -
      </button>
      <span className="w-8 text-center">{quantity}</span>
      <button
        onClick={() => handleChange(quantity + 1)}
        className="px-2 hover:bg-gray-100 rounded"
      >
        +
      </button>
    </div>
  );
}