import { Block, BlockInfo } from 'demux';
import { EosAction } from '../interfaces';
export declare class MongoBlock implements Block {
    actions: EosAction[];
    blockInfo: BlockInfo;
    constructor(blockState: any, rawActions: any);
    protected parseActions(rawActions: any): EosAction[];
}
