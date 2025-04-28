export function TaxChip({ rate }: { rate: number }) {
  return (
    <span className="inline-flex items-center px-2 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-medium dark:bg-purple-900/20 dark:text-purple-400">
      {`${(rate).toFixed(1)}% TAX`}
    </span>
  );
}