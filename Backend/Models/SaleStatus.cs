public enum SaleStatus
{
    Draft,      // Initial state
    Paid,       // Payment confirmed
    Shipped,    // Items dispatched
    Delivered,  // Customer received
    Refunded    // Order reversed
}