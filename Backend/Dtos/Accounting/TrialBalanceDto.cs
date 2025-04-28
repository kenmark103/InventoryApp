namespace Backend.Dtos
{
    public record TrialBalanceDto
    {
        public DateTime AsOf { get; init; }
        public Dictionary<string, decimal> Balances { get; init; } = new();
        
        public decimal NetBalance => Balances.Values.Sum();
    }
}
