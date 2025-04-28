// components/ReportExport.tsx
'use client';
import { Button } from '@/components/ui/button';
import { DownloadIcon } from 'lucide-react';
import { useReports } from '../context/reports-context'; // Adjust path

export default function ReportExport({ reportType }) {
  const { exportReport } = useReports();

  const handleExport = (format) => {
    exportReport(reportType, format); // Now using context directly
  };

  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        onClick={() => handleExport('pdf')}
      >
        <DownloadIcon className="mr-2 h-4 w-4" />
        PDF
      </Button>
      <Button 
        variant="outline" 
        onClick={() => handleExport('excel')}
      >
        <DownloadIcon className="mr-2 h-4 w-4" />
        Excel
      </Button>
    </div>
  );
}