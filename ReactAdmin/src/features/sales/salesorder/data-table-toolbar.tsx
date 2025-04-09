
'use client';
import { Table } from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { DataTableFacetedFilter } from '@/components/shared/data-table-faceted-filter';
import { Button } from '@/components/ui/button';
import { Cross2Icon } from '@radix-ui/react-icons';
import { SaleResponseDto } from '@/data/saleSchema';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';

interface DataTableToolbarProps {
  table: Table<SaleResponseDto>;
}

const statusOptions = [
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

const paymentMethodOptions = [
  { value: 'CASH', label: 'Cash' },
  { value: 'CREDIT_CARD', label: 'Credit Card' },
  { value: 'MPESA', label: 'M-Pesa' },
  { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
];


export function DataTableToolbar({ table }: DataTableToolbarProps) {
  const isFiltered = table.getState().columnFilters.length > 0;
  
  const handleDateRangeChange = (range: DateRange | undefined) => {
    table.getColumn('saleDate')?.setFilterValue({
      from: range?.from,
      to: range?.to,
    });
  };

  const dateFilterValue = table.getColumn('saleDate')?.getFilterValue() as {
    from?: Date;
    to?: Date;
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {/* Date Range Picker */}
        <DateRangePicker
          date={{
            from: dateFilterValue?.from,
            to: dateFilterValue?.to,
          }}
          onDateChange={handleDateRangeChange}
        />

        {/* Global Search */}
        <Input
          placeholder="Search orders..."
          value={(table.getColumn('invoiceNumber')?.getFilterValue() as string) ?? ''}
          onChange={(event) => {
            table.getColumn('invoiceNumber')?.setFilterValue(event.target.value);
          }}
          className="h-8 w-[200px] lg:w-[300px]"
        />

        {/* Status Filter */}
        {table.getColumn('status') && (
          <DataTableFacetedFilter
            column={table.getColumn('status')}
            title="Status"
            options={statusOptions}
          />
        )}

        {/* Payment Method Filter */}
        {table.getColumn('paymentMethod') && (
          <DataTableFacetedFilter
            column={table.getColumn('paymentMethod')}
            title="Payment Method"
            options={paymentMethodOptions}
          />
        )}

        {/* Reset Filters */}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              table.resetColumnFilters();
              handleDateRangeChange(undefined);
            }}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Export Button */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => console.log('Export sales data')}
        >
          Export
        </Button>
      </div>
    </div>
  );
}