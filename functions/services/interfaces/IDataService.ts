// functions/services/interfaces/IDataService.ts
import { Patient, VitalSign, CareRecord, Staff, Device } from '../../../types/models';

export interface IDataService {
    getPatientResult(patientName: string): Promise<Patient | null>;
    getPatientByName(name: string): Promise<Patient | null>;
    getPatientById(id: string): Promise<Patient | null>;
    getPatientVitals(patientId: string, limit?: number): Promise<VitalSign[]>;
    saveVitalSign(vitalSign: VitalSign): Promise<void>;
    saveCareMeal(careRecord: CareRecord): Promise<void>;
    saveMedicine(careRecord: CareRecord): Promise<void>;
    getStaffByName(name: string): Promise<Staff | null>;
    getStaffById(staffId: string): Promise<Staff | null>;
    getDeviceInfo(deviceId: string): Promise<Device | null>;
    setCareRecord(careRecordsTable: string, careRecord: CareRecord | VitalSign): Promise<void>;
}