import { IAIService } from "../interfaces/IAIService";
import { CommandResult } from "../../../types/models";

export class MockAIService implements IAIService {
    private mockResponses: Map<string, CommandResult> = new Map();
    defaultResponse: string | null = null;

    // モックレスポンスを設定
    setMockResponse(query: string, response: CommandResult): void {
        this.mockResponses.set(query, response)
    }

    // デフォルトレスポンスを設定
    setDefaultResponse(transcription: string): void {
        this.defaultResponse = transcription
    }

    analyzeCommand(text: string): Promise<CommandResult> {
        const response = this.mockResponses.get(text);

        if (typeof response === 'undefined') {
            return Promise.resolve({
                command: 'UNKNOWN',
                parameters: {},
                confidence: 0
            });
        } else {
            return Promise.resolve(response);
        }
    }

}