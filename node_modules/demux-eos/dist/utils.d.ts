declare function retry(func: () => any, maxNumAttempts: number, waitMs: number): Promise<any>;
export { retry };
