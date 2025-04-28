
import { NumericFormat } from 'react-number-format';
import { getCurrencySymbol } from '../utils/formatting';

interface DiscountInputProps {
  value: number;
  onChange: (value: number) => void;
}

export function DiscountInput({ value, onChange }: DiscountInputProps) {
  return (
    <NumericFormat
      value={value}
      onValueChange={(values) => onChange(values.floatValue || 0)}
      allowNegative={false}
      prefix={getCurrencySymbol('KES')}
      decimalScale={2}
      className="w-24 px-2 py-1 border rounded text-right"
      isAllowed={(values) => {
        const { floatValue } = values;
        return (floatValue || 0) >= 0 && (floatValue || 0) <= 100000;
      }}
    />
  );
}