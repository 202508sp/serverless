import { IAIService } from '../../functions/services/interfaces/IAIService';
import { CommandResult } from "../../types/models";

export class MockAIService implements IAIService {
    mockCommand: string = '';
    mockConfidence: number = 0;
    mockParameters: Record<string, any> = {};
    
    async analyzeCommand(_text: string): Promise<CommandResult> {
        return {
            command: 'MOCK',
            confidence: 1.0,
            parameters: {
                param1: 'value1',
                param2: 'value2'
            }
        };
    }
    
    setMockResponse(_title: string, response: {command: string, confidence: number, parameters: Record<string, any>}): void {
        this.mockCommand = response.command;
        this.mockConfidence = response.confidence;
        this.mockParameters = response.parameters;
    }
}