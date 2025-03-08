import { Patient, Staff, Device, VitalSign, CareRecord } from "../../../types/models";
import { IDataService } from "../interfaces/IDataService";

export class MockDataService implements IDataService {
    private patientData: Map<string, Patient> = new Map();
    private staffData: Map<string, Staff> = new Map();
    private deviceData: Map<string, Device> = new Map();
    private vitalSignData: Map<string, VitalSign> = new Map

    // モックデータを設定
    addPatient(data: Patient): void {
        this.patientData.set(data.patientId, data);
    }

    addStaff(data: any): void {
        this.staffData.set(data.id, data);
    }

    addDevice(data: any): void {
        this.deviceData.set(data.id, data);
    }

    addVital(data: any): void {
        this.vitalSignData.set(data.id, data);
    }

    getDeviceInfo(_deviceId: string): Promise<Device | null> {
        return Promise.resolve(null);
    }

    getPatientById(id: string): Promise<Patient | null> {
        return Promise.resolve(this.patientData.get(id) || null);
    }

    getPatientByName(name: string): Promise<Patient | null> {
        const id = Array.from(this.patientData.keys()).find(key => {
            const patient = this.patientData.get(key);
            return patient && patient.name === name;
        })
        return Promise.resolve(this.patientData.get(id || '') || null);
    }

    getPatientVitals(_patientId: string, _limit?: number): Promise<VitalSign[]> {
        return Promise.resolve([]);
    }

    getStaffById(_staffId: string): Promise<Staff | null> {
        return Promise.resolve(null);
    }

    getStaffByName(_name: string): Promise<Staff | null> {
        return Promise.resolve(null);
    }

    saveCareMeal(_careRecord: CareRecord): Promise<void> {
        return Promise.resolve(undefined);
    }

    saveMedicine(_careRecord: CareRecord): Promise<void> {
        return Promise.resolve(undefined);
    }

    saveVitalSign(_vitalSign: VitalSign): Promise<void> {
        return Promise.resolve(undefined);
    }
}