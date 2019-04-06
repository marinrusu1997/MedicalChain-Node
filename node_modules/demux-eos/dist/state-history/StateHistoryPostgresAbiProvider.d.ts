import { ApiInterfaces } from 'eosjs';
export declare class StateHistoryPostgresAbiProvider implements ApiInterfaces.AbiProvider {
    private massiveInstance;
    private dbSchema;
    private db;
    constructor(massiveInstance: any, dbSchema?: string);
    getRawAbi(accountName: string): Promise<ApiInterfaces.BinaryAbi>;
}
