// 患者モデル
interface Patient {
    patientId: string;
    name: string;
    age: number;
    gender?: string;
    roomNumber: string;
    careLevel: number;
    allergies?: string[];
    primaryNurse?: string;
    emergencyContact?: string;
    medicalHistory?: Record<string, any>;
    status: 'active' | 'inactive';
    admissionDate?: string;
    createdAt: string;
    updatedAt: string;
}

// バイタルサインモデル
interface VitalSign {
    patientId: string;
    timestamp: string;
    temperature?: number;
    bloodPressureSystolic?: number;
    bloodPressureDiastolic?: number;
    heartRate?: number;
    spO2?: number;
    respiratoryRate?: number;
    recordedBy: string;
    deviceId: string;
    notes?: string;
}

// ケア記録モデル
interface CareRecord {
    patientId: string;
    timestamp: string;
    careType: 'meal' | 'medicine' | 'bath' | 'toilet' | 'other';
    details: Record<string, any>;
    performedBy: string;
    deviceId: string;
    notes?: string;
}

// デバイスモデル
interface Device {
    deviceId: string;
    assignedTo: string;
    deviceType: string;
    lastActive: string;
    status: 'active' | 'inactive' | 'maintenance';
    batteryLevel?: number;
    firmwareVersion?: string;
    lastSyncTime?: string;
    settings?: Record<string, any>;
}

// スタッフモデル
interface Staff {
    staffId: string;
    name: string;
    role: string;
    contactInfo?: Record<string, any>;
    assignedPatients?: string[];
    shift?: string;
    status: 'active' | 'inactive' | 'on-leave';
    joinDate?: string;
    lastActive?: string;
    snsTopicArn?: string;
}

// コマンド解析結果
interface CommandResult {
    command: string;
    parameters: Record<string, any>;
    confidence: number;
}

// API レスポンス型
interface ApiResponse {
    statusCode: number;
    headers: {
        [key: string]: string;
    };
    body: string;
}

// Lambda イベント型
interface LambdaEvent {
    body?: string;
    pathParameters?: {
        [key: string]: string;
    };
    queryStringParameters?: {
        [key: string]: string;
    };
    headers?: {
        [key: string]: string;
    };
}

export {
    Patient,
    VitalSign,
    CareRecord,
    Device,
    Staff,
    CommandResult,
    ApiResponse,
    LambdaEvent
}