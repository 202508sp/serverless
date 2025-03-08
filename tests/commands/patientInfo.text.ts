// tests/commands/patientInfo.test.ts
import { getPatientInfo } from '../../functions/commands/patientInfo';
import { MockDataService } from '../mocks/MockDataService';
import { mockDevice, mockStaff, mockPatient, mockVital } from '../mocks/mockData';
import { setMockServices, resetServices } from '../../functions/services/serviceFactory';

describe('Patient Info Command Tests', () => {
    let mockDataService: MockDataService;

    beforeEach(() => {
        process.env.NODE_ENV = 'test';

        mockDataService = new MockDataService();
        mockDataService.addDevice(mockDevice);
        mockDataService.addStaff(mockStaff);
        mockDataService.addPatient(mockPatient);
        mockDataService.addVital(mockVital);

        setMockServices(undefined, undefined, mockDataService);
    });

    afterEach(() => {
        resetServices();
    });

    test('should return patient info for valid name', async () => {
        const result = await getPatientInfo({ patientName: '佐藤太郎' }, mockDevice);

        expect(result.command).toBe('GET_PATIENT_INFO');
        expect(result.displayText).toContain('佐藤太郎さん');
        expect(result.displayText).toContain('部屋: 101');
    });

    test('should handle missing patient name', async () => {
        const result = await getPatientInfo({}, mockDevice);

        expect(result.command).toBe('ERROR');
        expect(result.displayText).toContain('患者名が指定されていません');
    });

    test('should handle non-existent patient', async () => {
        const result = await getPatientInfo({ patientName: '存在しない患者' }, mockDevice);

        expect(result.command).toBe('NOT_FOUND');
        expect(result.displayText).toContain('見つかりませんでした');
    });
});
