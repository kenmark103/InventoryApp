// components/sales/SalesFloatingToolbar.tsx

import { useSales } from '../context/sales-context';
import { Button } from '@/components/ui/button';
import { HTMLAttributes } from 'react';

interface SalesFloatingToolbarProps extends HTMLAttributes<HTMLDivElement> {}

export function SalesFloatingToolbar({ className = '', ...props }: SalesFloatingToolbarProps) {
  const { currentSale, saveDraft, holdSale } = useSales();
  const hasSale = Boolean(currentSale);

  return (
    <div
      {...props}
      className={`flex items-center space-x-3 ${className}`}
    >
      <Button
        variant="secondary"
        onClick={saveDraft}
        disabled={!hasSale}
        className="px-4 py-2 text-sm shadow-sm hover:shadow-md transition-shadow"
      >
        💾 Save Draft
      </Button>
      <Button
        variant="secondary"
        onClick={holdSale}
        disabled={!hasSale}
        className="px-4 py-2 text-sm shadow-sm hover:shadow-md transition-shadow bg-amber-100 hover:bg-amber-200 text-amber-900"
      >
        ⏸️ Hold Sale
      </Button>
    </div>
  );
}
