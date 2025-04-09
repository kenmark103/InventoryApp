// contexts/sales-context.tsx
import React, { createContext, useContext, useState, useEffect , useCallback, useRef } from 'react';
import saleService from '@/services/saleService';
import { Sale, SaleCreateDto, SaleResponseDto } from '@/data/saleSchema';
import { mapSaleToSaleCreateDto } from '../utils/saleMappers';
import { 
  PaymentMethod, 
  PaymentDetails,
  ProcessCardPayment,
  ProcessMpesaPayment
} from '@/data/payments'

type SalesDialogType = 'add' | 'edit' | 'delete' | 'view' | null;

interface SalesContextType {
  sales: SaleResponseDto[];
  setCurrentSale: React.Dispatch<React.SetStateAction<Sale | null>>;
  refreshSales: () => Promise<void>;
  open: SalesDialogType;
  setOpen: (type: SalesDialogType) => void;
  createSale: (dto: SaleCreateDto) => Promise<void>;
  loading: boolean;
  error: string | null;
  completeSale: (details: PaymentDetails) => Promise<void>;
  currentSale: Sale | null;
  processCardPayment: ProcessCardPayment;
  processMpesaPayment: ProcessMpesaPayment;
  paymentError: string | null;
  isProcessingPayment: boolean;
  paymentDetails: PaymentDetails | null;
  saveDraft: () => Promise<void>;
  holdSale: () => void;
  customers: Customer[];
  heldSales: SaleResponseDto[];
  addItemToSale: (product: Product) => void;
  updateItem: (itemId: number, update: Partial<SaleItem>) => void;
  removeItem: (id: number) => void;

}

const SalesContext = createContext<SalesContextType | undefined>(undefined);

export function SalesProvider({ children }: { children: React.ReactNode }) {
  const [sales, setSales] = useState<SaleResponseDto[]>([]);
  const [currentSale, setCurrentSale] = useState<Sale | null>(null);
  const [open, setOpen] = useState<SalesDialogType>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);

  

const refreshSales = useCallback(async () => {
    try {
      setLoading(true);
      const data = await saleService.getSales();
      setSales(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch sales');
      console.error('Sales fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

useEffect(() => {
  refreshSales();
}, [refreshSales]); 


  const createSale = async (dto: SaleCreateDto) => {
    setLoading(true);
    try {
      const newSale = await saleService.createSale(dto);
      setSales(prev => [newSale, ...prev]);
      setOpen(null);
      setError(null);
    } catch (err) {
      setError('Failed to create sale');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const saveDraft = async () => {
    if (!currentSale) return;
    
    try {

      const savedSale = await saleService.createSale({
        ...currentSale,
        status: 'DRAFT'
      });
      
     
      setCurrentSale(savedSale);
      setSales(prev => [savedSale, ...prev]);
      
      
      toast.success('Draft saved successfully');
      
    } catch (error) {
      toast.error('Failed to save draft');
      console.error('Save draft error:', error);
    }
  };

  const holdSale = () => {
    if (currentSale) {
      // Add to held sales list
      setHeldSales(prev => [...prev, currentSale]);
      // Clear current sale
      setCurrentSale(null);
      toast.success('Sale held successfully');
    }
  };



const completeSale = async (details: PaymentDetails) => {
  if (!currentSale) return;

  setIsProcessingPayment(true);
  setPaymentError(null);

  try {
    let saleId = currentSale.id;

   
    if (!saleId) {
      const draftDto = mapSaleToSaleCreateDto(currentSale);
      const draft = await saleService.createSale(draftDto);
      saleId = draft.id;
      setCurrentSale(prev => ({ ...prev, id: draft.id }));
      setSales(prev => [draft, ...prev]);
    }

    // Process payment based on method
    switch (details.method) {
      case PaymentMethod.CASH:
        await handleCashPayment(saleId, details);
        break;
      case PaymentMethod.CREDIT_CARD:
        await handleCardPayment(saleId, details);
        break;
      case PaymentMethod.MPESA:
        await handleMpesaPayment(saleId, details);
        break;
      default:
        throw new Error('Unsupported payment method');
    }

    // Refresh sales list
    await refreshSales();
    setCurrentSale(null);
  } catch (err) {
    setPaymentError(err.message || 'Payment processing failed');
  } finally {
    setIsProcessingPayment(false);
  }
};

// Example payment handlers
const handleCashPayment = async (saleId: number, details: PaymentDetails) => {
  await saleService.completeSale(saleId, {
    ...details,
    transactionId: `CASH-${Date.now()}`
  });
};

const handleCardPayment = async (saleId: number, details: PaymentDetails) => {
  // Process card payment through your payment gateway
  const paymentResult = await processCardPayment(details);
  
  await saleService.completeSale(saleId, {
    ...details,
    transactionId: paymentResult.transactionId
  });
};

const handleMpesaPayment = async (saleId: number, details: PaymentDetails) => {
  // Process MPESA payment
  const paymentResult = await processMpesaPayment(details.mpesaPhone!, details.amountTendered);
  
  await saleService.completeSale(saleId, {
    ...details,
    transactionId: paymentResult.transactionId
  });
};

const updateItem = useCallback((itemId: number, update: Partial<SaleItem>) => {
  setCurrentSale(prev => {
    if (!prev) return prev;
    return {
      ...prev,
      items: prev.items.map(item => 
        item.id === itemId ? {...item, ...update} : item
      )
    };
  });
}, []);

const addItemToSale = useCallback((product: Product) => {
  setCurrentSale(prev => {
    
    if (product.stock <= 0) {
      toast.error(`${product.name} is out of stock`);
      return prev || null;
    }

    const newItem = {
      id: product.id,
      name: product.name,
      sku: product.sku,
      price: product.sellingPrice,
      costPrice: product.buyingPrice,
      taxRate: product.taxRate,
      quantity: 1,
      imageUrl: product.imageUrl,
      stock: product.stock, // Capture current stock
      barcode: product.barcode
    };

    if (!prev) {
      const subtotal = newItem.price * newItem.quantity;
      const taxAmount = subtotal * newItem.taxRate;
      
      return {
        items: [newItem],
        status: 'DRAFT',
        customerId: null,
        subtotal,
        taxAmount,
        total: subtotal + taxAmount,
        createdAt: new Date(),
        updatedAt: new Date(),
        paymentDetails: null,
        discounts: [],
        notes: '',
        shippingInfo: null,
        // Financial breakdown
        totals: {
          subTotal: subtotal,
          totalTax: taxAmount,
          grandTotal: subtotal + taxAmount,
          totalCost: newItem.costPrice * newItem.quantity
        }
      };
    }

    const existingItemIndex = prev.items.findIndex(item => item.id === product.id);
    const newItems = [...prev.items];

    if (existingItemIndex >= 0) {
     
      const updatedItem = { 
        ...newItems[existingItemIndex],
        quantity: newItems[existingItemIndex].quantity + 1
      };
      
    
      if (updatedItem.quantity > updatedItem.stock) {
        toast.error(`Only ${updatedItem.stock} units available for ${product.name}`);
        return prev;
      }
      
      newItems[existingItemIndex] = updatedItem;
    } else {
      
      newItems.push(newItem);
    }

 
    const subtotal = newItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const taxAmount = newItems.reduce((acc, item) => acc + (item.price * item.quantity * item.taxRate), 0);
    const totalCost = newItems.reduce((acc, item) => acc + (item.costPrice * item.quantity), 0);

    return {
      ...prev,
      items: newItems,
      subtotal,
      taxAmount,
      total: subtotal + taxAmount,
      updatedAt: new Date(),
      totals: {
        subTotal: subtotal,
        totalTax: taxAmount,
        grandTotal: subtotal + taxAmount,
        totalCost
      }
    };
  });
}, []);

const removeItem = useCallback((id: number) => {
  setCurrentSale(prev => {
    if (!prev) return prev;
    
    const newItems = prev.items.filter(item => item.id !== id);
    
    // Recalculate totals
    const subtotal = newItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const taxAmount = newItems.reduce((acc, item) => acc + (item.price * item.quantity * item.taxRate), 0);
    const totalCost = newItems.reduce((acc, item) => acc + (item.costPrice * item.quantity), 0);

    return {
      ...prev,
      items: newItems,
      subtotal,
      taxAmount,
      total: subtotal + taxAmount,
      totals: {
        subTotal: subtotal,
        totalTax: taxAmount,
        grandTotal: subtotal + taxAmount,
        totalCost
      }
    };
  });
}, []);


  const value: SalesContextType = {
    sales,
    currentSale,
    setCurrentSale,
    refreshSales,
    open,
    setOpen,
    createSale,
    loading,
    error,
    addItemToSale,
    completeSale,
    paymentError,
    isProcessingPayment,
    paymentDetails,
    saveDraft,
    holdSale,
    customers: [], 
    heldSales: [],
    updateItem,
    removeItem,
  };

  

  return (
    <SalesContext.Provider value={value}>
      {children}
    </SalesContext.Provider>
  );
}

export const useSales = () => {
  const context = useContext(SalesContext);
  if (!context) {
    throw new Error('useSales must be used within a SalesProvider');
  }
  return context;
};