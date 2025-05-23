import { ISpeechService } from './interfaces/ISpeechService';
import * as speech from '@google-cloud/speech';
import { logStatus } from '@shiki-01/logstatus';

/**
 * 音声認識サービス
 */
export class SpeechService implements ISpeechService {
    private speechClient: speech.SpeechClient;

    constructor() {
        this.speechClient = new speech.SpeechClient({
            keyFilename: './google-credentials.json'
        });
    }

    /**
     * 音声ファイルをテキストに変換する
     * @param audioBase64 音声ファイルのBase64エンコード
     * @returns 変換されたテキスト
     */
    async transcribeAudio(audioBase64: string): Promise<string | null> {
        try {
            // Base64デコード
            const audioBytes = Buffer.from(audioBase64, 'base64');

            // 音声認識リクエスト
            const request = {
                audio: {
                    content: audioBytes.toString('base64')
                },
                config: {
                    encoding: 'LINEAR16' as const,
                    sampleRateHertz: 16000,
                    languageCode: 'ja-JP',
                    model: 'default',
                    enableAutomaticPunctuation: true,
                    useEnhanced: true
                }
            };

            // 音声認識実行
            const [response] = await this.speechClient.recognize(request);
            if (!response.results) return null;

            return response.results
                .map(result => result.alternatives && result.alternatives[0].transcript || '')
                .join('\n');
        } catch (error) {
            logStatus({ code: 500, message: '音声認識エラー' }, {}, error);
            return null;
        }
    }
}
