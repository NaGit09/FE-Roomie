export interface Pagination<T> {
    items : T[]
    total: number;
    page: number;
    size: number;
    total_pages: number;
}

export interface PaginationQuery {
    skip?: number;
    limit?: number;
}
