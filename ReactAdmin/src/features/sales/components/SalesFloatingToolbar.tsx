
import { useSales } from '../context/sales-context';
import { Button } from '@/components/ui/button';

export function SalesFloatingToolbar() {
  const { currentSale, saveDraft, holdSale } = useSales();

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border rounded-lg shadow-lg flex gap-3">
      <Button
        variant="secondary"
        onClick={saveDraft}
        className="px-6 py-3 shadow-sm hover:shadow-md transition-shadow"
      >
        💾 Save Draft
      </Button>
      
      <Button
        variant="secondary"
        onClick={holdSale}
        className="px-6 py-3 shadow-sm hover:shadow-md transition-shadow bg-amber-100 hover:bg-amber-200 text-amber-900"
      >
        ⏸️ Hold Sale
      </Button>
    </div>
  );
}