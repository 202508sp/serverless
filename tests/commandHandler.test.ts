// tests/commandHandler.test.ts
import { handler } from '../functions/commandHandler';
import { MockSpeechService } from './mocks/MockSpeechService';
import { MockAIService } from './mocks/MockAIService';
import { MockDataService } from './mocks/MockDataService';
import { mockDevice, mockStaff, mockPatient, mockVital } from './mocks/mockData';
import { setMockServices, resetServices } from '../functions/services/serviceFactory';
import { APIGatewayProxyEvent } from 'aws-lambda';

describe('CommandHandler Tests', () => {
    // 各テスト前に実行
    beforeEach(() => {
        // 環境変数設定
        process.env.NODE_ENV = 'test';

        // モックサービス作成
        const mockSpeechService = new MockSpeechService();
        const mockAIService = new MockAIService();
        const mockDataService = new MockDataService();

        // モックデータ設定
        mockDataService.addDevice(mockDevice);
        mockDataService.addStaff(mockStaff);
        mockDataService.addPatient(mockPatient);
        mockDataService.addVital(mockVital);

        // モックサービス設定
        setMockServices(mockSpeechService, mockAIService, mockDataService);

        // モック音声応答設定
        mockSpeechService.setDefaultResponse('佐藤さんの情報表示');

        // モックAI応答設定
        mockAIService.setMockResponse('佐藤さんの情報表示', {
            command: 'GET_PATIENT_INFO',
            parameters: { patientName: '佐藤太郎' },
            confidence: 0.95
        });
    });

    // 各テスト後に実行
    afterEach(() => {
        resetServices();
        jest.clearAllMocks();
    });

    // 患者情報取得テスト
    test('should retrieve patient information', async () => {
        // テスト用リクエスト作成
        const event = {
            body: JSON.stringify({
                audio: 'base64_audio_data',
                deviceId: 'test-device-001'
            })
        } as APIGatewayProxyEvent;

        // ハンドラーを実行
        const response = await handler(event);

        // レスポンス検証
        expect(response.statusCode).toBe(200);
        const body = JSON.parse(response.body);
        expect(body.command).toBe('GET_PATIENT_INFO');
        expect(body.displayText).toContain('佐藤太郎さん');
        expect(body.displayText).toContain('年齢: 78歳');
        expect(body.displayText).toContain('部屋: 101');
    });

    // エラーケースのテスト
    test('should handle missing device ID', async () => {
        // デバイスIDなしのリクエスト
        const event = {
            body: JSON.stringify({
                audio: 'base64_audio_data'
                // deviceIdなし
            })
        } as APIGatewayProxyEvent;

        // ハンドラーを実行
        const response = await handler(event);

        // エラーレスポンス検証
        expect(response.statusCode).toBe(400);
        const body = JSON.parse(response.body);
        expect(body.error).toContain('音声データとデバイスIDが必要です');
    });
});
