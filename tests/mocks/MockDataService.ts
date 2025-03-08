import { IDataService } from '../../functions/services/interfaces/IDataService';
import { Device, CareRecord, Patient, Staff, VitalSign } from '../../types/models';

export class MockDataService implements IDataService {
    async addDevice(_device: Device): Promise<void> {
        return;
    }

    async addStaff(_device: Staff): Promise<void> {
        return;
    }

    async addPatient(_patient: Patient): Promise<void> {
        return;
    }

    async addVital(_vital: VitalSign): Promise<void> {
        return;
    }

    getDeviceInfo(_deviceId: string): Promise<Device | null> {
        return Promise.resolve(null);
    }

    getPatientById(_id: string): Promise<Patient | null> {
        return Promise.resolve(null);
    }

    getPatientByName(_name: string): Promise<Patient | null> {
        return Promise.resolve(null);
    }

    getPatientVitals(_patientId: string, _limit?: number): Promise<VitalSign[]> {
        return Promise.resolve([]);
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

    getStaffById(_staffId: string): Promise<Staff | null> {
        return Promise.resolve(null);
    }
}