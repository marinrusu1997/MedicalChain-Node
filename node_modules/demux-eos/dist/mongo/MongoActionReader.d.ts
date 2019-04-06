import { AbstractActionReader } from 'demux';
import { MongoActionReaderOptions } from '../interfaces';
import { MongoBlock } from './MongoBlock';
/**
 * Implementation of an ActionReader that reads blocks from a mongodb instance.
 */
export declare class MongoActionReader extends AbstractActionReader {
    dbName: string;
    protected mongoEndpoint: string;
    private readonly requiredCollections;
    private mongodb;
    constructor(options?: MongoActionReaderOptions);
    getHeadBlockNumber(numRetries?: number, waitTimeMs?: number): Promise<number>;
    getLastIrreversibleBlockNumber(numRetries?: number, waitTimeMs?: number): Promise<number>;
    getBlock(blockNumber: number, numRetries?: number, waitTimeMs?: number): Promise<MongoBlock>;
    protected setup(): Promise<void>;
    private throwIfNotInitialized;
    private validateBlockStates;
}
