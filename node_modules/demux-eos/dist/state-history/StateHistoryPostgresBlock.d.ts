import { Block, BlockInfo } from 'demux';
import { EosAction } from '../interfaces';
export declare class StateHistoryPostgresBlock implements Block {
    private actionTraceAuthorizations;
    private massiveInstance;
    private dbSchema;
    actions: EosAction[];
    blockInfo: BlockInfo;
    private api;
    constructor(blockInfo: any, actionTraceAuthorizations: any, massiveInstance: any, dbSchema?: string);
    parseActions(): Promise<EosAction[]>;
    private deserializeActionTraces;
}
