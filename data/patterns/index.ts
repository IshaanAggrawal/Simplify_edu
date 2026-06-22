import { PatternData } from '../../lib/types/visualization';
import linkedListReversal from './linked-list-reversal.json';
import twoPointers from './two-pointers.json';
import slidingWindow from './sliding-window.json';
import bfsTree from './bfs-tree.json';
import binarySearch from './binary-search.json';
import dijkstra from './dijkstra.json';

export const PATTERNS: Record<string, PatternData> = {
  'linked-list-reversal': linkedListReversal as unknown as PatternData,
  'two-pointers': twoPointers as unknown as PatternData,
  'sliding-window': slidingWindow as unknown as PatternData,
  'bfs-tree': bfsTree as unknown as PatternData,
  'binary-search': binarySearch as unknown as PatternData,
  'dijkstra': dijkstra as unknown as PatternData,
};

export const PATTERNS_LIST = Object.values(PATTERNS);
