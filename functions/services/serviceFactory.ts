import { ISpeechService } from './interfaces/ISpeechService';
import { IAIService } from './interfaces/IAIService';
import { IDataService } from './interfaces/IDataService';

// 実際の実装
import { SpeechService } from './speechService';
import { AIService } from './aiService';
import { DataService } from './dataService';

// モック実装（開発用）
import { MockSpeechService } from './mocks/MockSpeechService';
import { MockAIService } from './mocks/MockAIService';
import { MockDataService } from './mocks/MockDataService';
import { Device, Patient, Staff, VitalSign } from "../../types/models";

// シングルトンインスタンス
let speechService: ISpeechService | null = null;
let aiService: IAIService | null = null;
let dataService: IDataService | null = null;

// 環境モード判定
export enum EnvironmentMode {
    PRODUCTION = 'prod',
    DEVELOPMENT = 'dev',
    TEST = 'test'
}

/**
 * 現在の環境モードを取得
 * @returns EnvironmentMode 列挙型
 */
export const getCurrentMode = (): EnvironmentMode => {
    const envMode = process.env.NODE_ENV || 'dev';

    if (envMode === 'prod' || envMode === 'production') {
        return EnvironmentMode.PRODUCTION;
    } else if (envMode === 'test') {
        return EnvironmentMode.TEST;
    } else {
        return EnvironmentMode.DEVELOPMENT;
    }
};

/**
 * モックサービスを使用するべきか判定
 * @returns boolean
 */
export const shouldUseMocks = (): boolean => {
    const mode = getCurrentMode();
    return mode === EnvironmentMode.DEVELOPMENT || mode === EnvironmentMode.TEST;
};

/**
 * モックサービスを設定
 * @param mockSpeech モック音声サービス
 * @param mockAI モックAIサービス
 * @param mockData モックデータサービス
 */
export const setMockServices = (
    mockSpeech?: ISpeechService,
    mockAI?: IAIService,
    mockData?: IDataService
): void => {
    if (mockSpeech) speechService = mockSpeech;
    if (mockAI) aiService = mockAI;
    if (mockData) dataService = mockData;
};

/**
 * モックサービスをリセット（テスト間の分離用）
 * @returns void
 */
export const getSpeechService = (): ISpeechService => {
    if (!speechService) {
        if (shouldUseMocks()) {
            console.log('Using MockSpeechService');
            const mockService = new MockSpeechService();
            setupDevMockSpeechService(mockService);
            speechService = mockService;
        } else {
            speechService = new SpeechService();
        }
    }
    return speechService;
};

/**
 * AIサービスの取得
 * @returns IAIService インターフェース
 */
export const getAIService = (): IAIService => {
    if (!aiService) {
        if (shouldUseMocks()) {
            console.log('Using MockAIService');
            const mockService = new MockAIService();
            setupDevMockAIService(mockService);
            aiService = mockService;
        } else {
            aiService = new AIService();
        }
    }
    return aiService;
};

/**
 * データサービスの取得
 * @returns IDataService インターフェース
 */
export const getDataService = (): IDataService => {
    if (!dataService) {
        if (shouldUseMocks()) {
            console.log('Using MockDataService');
            const mockService = new MockDataService();
            setupDevMockData(mockService);
            dataService = mockService;
        } else {
            dataService = new DataService();
        }
    }
    return dataService;
};

/**
 * サービスのリセット
 * @returns void
 */
export const resetServices = (): void => {
    speechService = null;
    aiService = null;
    dataService = null;
};

/**
 * 開発用モック音声サービスのセットアップ
 * @param mockService モック音声サービス
 */
function setupDevMockSpeechService(mockService: MockSpeechService): void {
    // 音声データの結果をマッピング
    mockService.setMockResponse('base64_audio_data_patient_info', '山田さんの情報表示');
    mockService.setMockResponse('base64_audio_data_temperature', '佐藤さんの体温は36.5度です');
    mockService.setMockResponse('base64_audio_data_meal', '田中さんの昼食は8割摂取');
    mockService.setMockResponse('base64_audio_data_medicine', '鈴木さんに降圧剤を投与しました');
    mockService.setMockResponse('base64_audio_data_call', '看護師の佐藤さんを呼んでください');
    mockService.setMockResponse('base64_audio_data_emergency', '緊急、103号室で転倒');

    // デフォルト応答
    mockService.setDefaultResponse('山田さんの情報表示');
}

/**
 * 開発用モックAIサービスのセットアップ
 * @param mockService モックAIサービス
 */
function setupDevMockAIService(mockService: MockAIService): void {
    // 患者情報表示コマンド
    mockService.setMockResponse('山田さんの情報表示', {
        command: 'GET_PATIENT_INFO',
        parameters: { patientName: '山田太郎' },
        confidence: 0.95
    });

    // バイタル記録コマンド
    mockService.setMockResponse('佐藤さんの体温は36.5度です', {
        command: 'RECORD_VITAL',
        parameters: {
            patientName: '佐藤花子',
            vitalType: 'temperature',
            vitalValue: '36.5'
        },
        confidence: 0.92
    });

    // 食事記録コマンド
    mockService.setMockResponse('田中さんの昼食は8割摂取', {
        command: 'RECORD_MEAL',
        parameters: {
            patientName: '田中次郎',
            mealType: 'lunch',
            amount: '8割'
        },
        confidence: 0.88
    });

    // 投薬記録コマンド
    mockService.setMockResponse('鈴木さんに降圧剤を投与しました', {
        command: 'RECORD_MEDICINE',
        parameters: {
            patientName: '鈴木一郎',
            medicine: '降圧剤'
        },
        confidence: 0.9
    });

    // スタッフ呼び出しコマンド
    mockService.setMockResponse('看護師の佐藤さんを呼んでください', {
        command: 'CALL_STAFF',
        parameters: {
            staffName: '佐藤看護師'
        },
        confidence: 0.85
    });

    // 緊急通報コマンド
    mockService.setMockResponse('緊急、103号室で転倒', {
        command: 'EMERGENCY',
        parameters: {
            location: '103号室',
            details: '転倒'
        },
        confidence: 0.98
    });
}

/**
 * 開発用モックデータサービスのセットアップ
 * @param mockService モックデータサービス
 */
function setupDevMockData(mockService: MockDataService): void {
    // 患者データ
    const patients: Patient[] = [
        {
            patientId: 'P001',
            name: '山田太郎',
            age: 78,
            gender: '男性',
            roomNumber: '101',
            careLevel: 3,
            allergies: ['牛乳', 'ピーナッツ'],
            primaryNurse: 'S001',
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            patientId: 'P002',
            name: '佐藤花子',
            age: 85,
            gender: '女性',
            roomNumber: '102',
            careLevel: 4,
            allergies: ['アスピリン'],
            primaryNurse: 'S002',
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            patientId: 'P003',
            name: '田中次郎',
            age: 72,
            gender: '男性',
            roomNumber: '103',
            careLevel: 2,
            allergies: [],
            primaryNurse: 'S001',
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            patientId: 'P004',
            name: '鈴木一郎',
            age: 81,
            gender: '男性',
            roomNumber: '105',
            careLevel: 3,
            allergies: ['セファロスポリン'],
            primaryNurse: 'S003',
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    ];

    // スタッフデータ
    const staffs: Staff[] = [
        {
            staffId: 'S001',
            name: '佐藤看護師',
            role: '看護師',
            contactInfo: { phone: '090-1111-2222' },
            status: 'active',
            joinDate: '2022-04-01',
            lastActive: new Date().toISOString()
        },
        {
            staffId: 'S002',
            name: '田中看護師',
            role: '看護師',
            contactInfo: { phone: '090-3333-4444' },
            status: 'active',
            joinDate: '2021-07-15',
            lastActive: new Date().toISOString()
        },
        {
            staffId: 'S003',
            name: '鈴木医師',
            role: '医師',
            contactInfo: { phone: '090-5555-6666' },
            status: 'active',
            joinDate: '2020-10-01',
            lastActive: new Date().toISOString()
        }
    ];

    // デバイスデータ
    const devices: Device[] = [
        {
            deviceId: 'D001',
            assignedTo: 'S001',
            deviceType: 'ar-glass',
            lastActive: new Date().toISOString(),
            status: 'active',
            batteryLevel: 85,
            firmwareVersion: '1.0.2'
        },
        {
            deviceId: 'D002',
            assignedTo: 'S002',
            deviceType: 'ar-glass',
            lastActive: new Date().toISOString(),
            status: 'active',
            batteryLevel: 72,
            firmwareVersion: '1.0.2'
        }
    ];

    // バイタルデータ
    const vitals: VitalSign[] = [
        {
            patientId: 'P001',
            timestamp: new Date().toISOString(),
            temperature: 36.2,
            bloodPressureSystolic: 135,
            bloodPressureDiastolic: 85,
            heartRate: 72,
            spO2: 98,
            recordedBy: 'S001',
            deviceId: 'D001'
        },
        {
            patientId: 'P002',
            timestamp: new Date().toISOString(),
            temperature: 36.8,
            bloodPressureSystolic: 128,
            bloodPressureDiastolic: 78,
            heartRate: 68,
            spO2: 97,
            recordedBy: 'S002',
            deviceId: 'D002'
        }
    ];

    // データ追加
    patients.forEach(patient => mockService.addPatient(patient));
    staffs.forEach(staff => mockService.addStaff(staff));
    devices.forEach(device => mockService.addDevice(device));
    vitals.forEach(vital => mockService.addVital(vital));
}
