"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { usePurchases } from "../context/purchases-context";
import { useProducts } from "@/features/products/context/products-context";
import { useSuppliers } from "@/features/suppliers/context/suppliers-context";
import { Purchase } from "../data/purchase-schema";
import { formatISO } from "date-fns";
import { Label } from "@/components/ui/label";

interface Props {
  purchase?: Purchase;
  mode: "create" | "edit" | "view";
  onClose: () => void;
}

export function PurchaseForm({ purchase, mode, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const { createPurchase, updatePurchase } = usePurchases();
  const { products } = useProducts();
  const { suppliers } = useSuppliers();
  const [serverError, setServerError] = useState<string | null>(null);

  const disabled = mode === "view";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget as HTMLFormElement);
    const data = {
      productId: Number(form.get("productId")),
      supplierId: Number(form.get("supplierId")),
      quantity: Number(form.get("quantity")),
      unitPrice: Number(form.get("unitPrice")),
      purchaseDate: new Date(form.get("purchaseDate") as string).toISOString(),
      invoiceNumber: form.get("invoiceNumber") as string,
      notes: form.get("notes") as string,
    };

     setLoading(true);
    try {
      const payload = { ...data, totalPrice: data.quantity * data.unitPrice };
      console.log("Creating purchase with payload:", payload);
      if (mode === "create") {
        await createPurchase(payload);
      } else {
        await updatePurchase(purchase!.id, payload);
      }
      onClose();
    } catch (err: any) {
	  console.error("Error creating purchase:", err);
	  console.error("Full response data:", err.response?.data);
	  const msg = err.response?.data?.message || err.message;
	  setServerError(msg);
	    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
    {serverError && (
        <p className="text-sm text-destructive">{serverError}</p>
      )}
      <div className="grid grid-cols-2 gap-4">
        {/* Product */}
        <div>
          <Label htmlFor="productId">Product</Label>
          <Select
            id="productId"
            name="productId"
            defaultValue={purchase?.productId.toString()}
            disabled={disabled}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select product" />
            </SelectTrigger>
            <SelectContent>
              {products.map((p) => (
                <SelectItem key={p.id} value={p.id.toString()}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Supplier */}
        <div>
          <Label htmlFor="supplierId">Supplier</Label>
          <Select
            id="supplierId"
            name="supplierId"
            defaultValue={purchase?.supplierId.toString()}
            disabled={disabled}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select supplier" />
            </SelectTrigger>
            <SelectContent>
              {suppliers.map((s) => (
                <SelectItem key={s.id} value={s.id.toString()}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Quantity */}
        <div>
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            name="quantity"
            type="number"
            defaultValue={purchase?.quantity}
            disabled={disabled}
            required
          />
        </div>

        {/* Unit Price */}
        <div>
          <Label htmlFor="unitPrice">Unit Price</Label>
          <Input
            id="unitPrice"
            name="unitPrice"
            type="number"
            step="0.01"
            defaultValue={purchase?.unitPrice}
            disabled={disabled}
            required
          />
        </div>

        {/* Purchase Date */}
        <div>
          <Label htmlFor="purchaseDate">Purchase Date</Label>
          <Input
            id="purchaseDate"
            name="purchaseDate"
            type="date"
            defaultValue={
              purchase?.purchaseDate
                ? formatISO(new Date(purchase.purchaseDate), { representation: "date" })
                : ""
            }
            disabled={disabled}
            required
          />
        </div>

        {/* Invoice Number */}
        <div>
          <Label htmlFor="invoiceNumber">Invoice Number</Label>
          <Input
            id="invoiceNumber"
            name="invoiceNumber"
            defaultValue={purchase?.invoiceNumber}
            disabled={disabled}
          />
        </div>

        {/* Notes */}
        <div className="col-span-2">
          <Label htmlFor="notes">Notes</Label>
          <Input
            id="notes"
            name="notes"
            defaultValue={purchase?.notes}
            disabled={disabled}
          />
        </div>
      </div>

      {mode !== "view" && (
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === "create" ? "Create Purchase" : "Save Changes"}
          </Button>
        </div>
      )}
    </form>
  );
}
