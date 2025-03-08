// functions/services/interfaces/IAIService.ts
import { CommandResult } from '../../../types/models';

export interface IAIService {
    analyzeCommand(text: string): Promise<CommandResult>;
}