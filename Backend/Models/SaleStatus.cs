namespace Backend.Models{


public enum SaleStatus
{
    DRAFT,      // Initial state
    PAID,
    COMPLETED,
    HOLD,
    CANCELLED,
    REFUNDED
}

}