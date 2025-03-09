// functions/services/mocks/MockSpeechService.ts
import { ISpeechService } from '../interfaces/ISpeechService';

/**
 * 音声認識サービスのモック実装
 */
export class MockSpeechService implements ISpeechService {
    private mockResponses: Map<string, string> = new Map();
    private defaultResponse: string | null = null;

    /**
     * モックレスポンスを設定
     * @param audioBase64 音声データのBase64エンコード
     * @param transcription モックレスポンスのテキスト
     * @returns
     */
    setMockResponse(audioBase64: string, transcription: string): void {
        this.mockResponses.set(audioBase64, transcription);
    }

    /**
     * デフォルトレスポンスを設定
     * @param transcription デフォルトレスポンスのテキスト
     * @returns
     */
    setDefaultResponse(transcription: string): void {
        this.defaultResponse = transcription;
    }

    /**
     * 音声ファイルをテキストに変換する
     * @param audioBase64 音声ファイルのBase64エンコード
     * @returns 変換されたテキスト
     */
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
