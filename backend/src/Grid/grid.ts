// Grid or block which will be a hash map of index and owner userId
export interface GridState {
    [index: string]: string | null;
}

export interface CellUpdate {
    index: number;
    owner: string | null;
}