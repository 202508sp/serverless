import { Device, Staff, Patient, VitalSign } from '../../types/models';

// テスト用データ (前のテストと同様)
const mockDevice: Device = {
    deviceId: 'test-device-001',
    assignedTo: 'staff-001',
    deviceType: 'ar-glass',
    lastActive: new Date().toISOString(),
    status: 'active'
};

const mockStaff: Staff = {
    staffId: 'staff-001',
    name: '山田花子',
    role: 'nurse',
    status: 'active'
};

const mockPatient: Patient = {
    patientId: 'patient-001',
    name: '佐藤太郎',
    age: 78,
    roomNumber: '101',
    careLevel: 3,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    primaryNurse: 'staff-001'
};

const mockVital: VitalSign = {
    patientId: 'patient-001',
    timestamp: new Date().toISOString(),
    temperature: 36.5,
    bloodPressureSystolic: 135,
    bloodPressureDiastolic: 85,
    heartRate: 72,
    recordedBy: 'staff-001',
    deviceId: 'test-device-001'
};

export {
    mockDevice,
    mockStaff,
    mockPatient,
    mockVital
}