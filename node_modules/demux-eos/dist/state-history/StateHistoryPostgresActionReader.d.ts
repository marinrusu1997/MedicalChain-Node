import { AbstractActionReader } from 'demux';
import { StateHistoryPostgresActionReaderOptions } from '../interfaces';
import { StateHistoryPostgresBlock } from './StateHistoryPostgresBlock';
export declare class StateHistoryPostgresActionReader extends AbstractActionReader {
    private db;
    private massiveInstance;
    private massiveConfig;
    private dbSchema;
    constructor(options: StateHistoryPostgresActionReaderOptions);
    getHeadBlockNumber(): Promise<number>;
    getLastIrreversibleBlockNumber(): Promise<number>;
    getBlock(blockNumber: number): Promise<StateHistoryPostgresBlock>;
    protected setup(): Promise<void>;
}
