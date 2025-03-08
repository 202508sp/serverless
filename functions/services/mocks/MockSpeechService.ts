// functions/services/mocks/MockSpeechService.ts
import { ISpeechService } from '../interfaces/ISpeechService';

export class MockSpeechService implements ISpeechService {
    private mockResponses: Map<string, string> = new Map();
    private defaultResponse: string | null = null;

    // モックレスポンスを設定
    setMockResponse(audioBase64: string, transcription: string): void {
        this.mockResponses.set(audioBase64, transcription);
    }

    // デフォルトレスポンスを設定
    setDefaultResponse(transcription: string): void {
        this.defaultResponse = transcription;
    }

    async transcribeAudio(audioBase64: string): Promise<string | null> {
        // 特定の入力に対するモックレスポンスがあればそれを返す
        if (this.mockResponses.has(audioBase64)) {
            return this.mockResponses.get(audioBase64) || null;
        }

        // デフォルトレスポンスがあればそれを返す
        if (this.defaultResponse) {
            return this.defaultResponse;
        }

        // モックレスポンスが設定されていない場合はnullを返す
        return null;
    }
}
