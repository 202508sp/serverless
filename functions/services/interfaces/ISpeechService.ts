export interface ISpeechService {
    transcribeAudio(audioBase64: string): Promise<string | null>;
}