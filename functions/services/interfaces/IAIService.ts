import { CommandResult } from '../../../types/models';

/**
 * AIサービスインターフェース
 */
export interface IAIService {
    analyzeCommand(text: string): Promise<CommandResult>;
}