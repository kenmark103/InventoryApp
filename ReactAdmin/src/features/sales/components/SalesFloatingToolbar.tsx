
import { useSales } from '../context/sales-context';

export function SalesFloatingToolbar() {
  const {
    currentSale,
    saveDraft,
    completeSale,
    setOpen,
  } = useSales();

  return (
    <div className="flex gap-2">
      <button
        onClick={saveDraft}
        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
      >
        Save Draft
      </button>
      <button
        onClick={() => setOpen('hold')}
        className="px-4 py-2 bg-yellow-100 hover:bg-yellow-200 rounded-lg"
      >
        Hold
      </button>
      <button
        onClick={() => currentSale && completeSale(currentSale)}
        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
      >
        Complete Sale
      </button>
    </div>
  );
}