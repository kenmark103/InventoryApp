
import { NumericFormat } from 'react-number-format';

export function DiscountInput({
 value, onChange }:
  { value: number; onChange: (value: number) => void }) {
  return (
    <NumericFormat
      value={value}
      onValueChange={(values) => onChange(values.floatValue || 0)}
      allowNegative={false}
      prefix="$"
      decimalScale={2}
      className="w-24 px-2 py-1 border rounded text-right"
    />
  );
}