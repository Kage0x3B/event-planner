export interface PaginatedResponse<D> {
    data: D[];
    start: number;
    amount: number;
    totalAmount: number;
}
