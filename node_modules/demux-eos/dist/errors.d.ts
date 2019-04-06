export declare class RetrieveBlockError extends Error {
    constructor();
}
export declare class RetrieveHeadBlockError extends Error {
    constructor();
}
export declare class RetrieveIrreversibleBlockError extends Error {
    constructor();
}
export declare class NoBlockStateFoundError extends Error {
    constructor(blockNumber: number);
}
export declare class MultipleBlockStateError extends Error {
    constructor(blockNumber: number);
}
