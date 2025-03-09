/**
 * 音声認識サービスのインターフェース
 */
export interface ISpeechService {
    transcribeAudio(audioBase64: string): Promise<string | null>;
}