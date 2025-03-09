import { Patient, Staff, Device, VitalSign, CareRecord } from "../../../types/models";
import { IDataService } from "../interfaces/IDataService";

/**
 * モックデータサービス
 */
export class MockDataService implements IDataService {
    private patientData: Map<string, Patient> = new Map();
    private staffData: Map<string, Staff> = new Map();
    private deviceData: Map<string, Device> = new Map();
    private vitalSignData: Map<string, VitalSign> = new Map

    // モックデータを設定
    addPatient(data: Patient): void {
        this.patientData.set(data.patientId, data);
    }

    addStaff(data: Staff): void {
        this.staffData.set(data.staffId, data);
    }

    addDevice(data: Device): void {
        this.deviceData.set(data.deviceId, data);
    }

    addVital(data: VitalSign): void {
        this.vitalSignData.set(data.patientId, data);
    }

    getDeviceInfo(_deviceId: string): Promise<Device | null> {
        return Promise.resolve(null);
    }

    /**
     * 患者名から患者情報を取得する
     * @param patientName 患者名
     * @returns 患者情報、または存在しない場合はnull
     */
    getPatientResult(patientName: string): Promise<Patient | null> {
        const id = Array.from(this.patientData.keys()).find(key => {
            const patient = this.patientData.get(key);
            return patient && patient.name === patientName;
        })
        return Promise.resolve(this.patientData.get(id || '') || null);
    }

    /**
     * 患者IDから患者情報を取得する
     * @param id 患者ID
     * @returns 患者情報、または存在しない場合はnull
     */
    getPatientById(id: string): Promise<Patient | null> {
        return Promise.resolve(this.patientData.get(id) || null);
    }

    /**
     * 患者名から患者情報を取得する
     * @param name 患者名
     * @returns 患者情報、または存在しない場合はnull
     */
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

    /**
     * スタッフ名からスタッフ情報を取得する
     * @param name スタッフ名
     * @returns スタッフ情報、または存在しない場合はnull
     */
    getStaffByName(name: string): Promise<Staff | null> {
        const id = Array.from(this.staffData.keys()).find(key => {
            const staff = this.staffData.get(key);
            return staff && staff.name === name;
        })
        return Promise.resolve(this.staffData.get(id || '') || null);
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

    setCareRecord(_careRecordsTable: string, _careRecord: CareRecord | VitalSign): Promise<void> {
        return Promise.resolve(undefined);
    }
}