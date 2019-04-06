import { AbstractActionReader } from 'demux';
import { NodeosActionReaderOptions } from '../interfaces';
import { NodeosBlock } from './NodeosBlock';
/**
 * Reads from an EOSIO nodeos node to get blocks of actions.
 * It is important to note that deferred transactions will not be included,
 * as these are currently not accessible without the use of plugins.
 */
export declare class NodeosActionReader extends AbstractActionReader {
    protected nodeosEndpoint: string;
    constructor(options?: NodeosActionReaderOptions);
    /**
     * Returns a promise for the head block number.
     */
    getHeadBlockNumber(numRetries?: number, waitTimeMs?: number): Promise<number>;
    getLastIrreversibleBlockNumber(numRetries?: number, waitTimeMs?: number): Promise<number>;
    /**
     * Returns a promise for a `NodeosBlock`.
     */
    getBlock(blockNumber: number, numRetries?: number, waitTimeMs?: number): Promise<NodeosBlock>;
    protected setup(): Promise<void>;
}
