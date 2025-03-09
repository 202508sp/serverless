import { CareRecord, Device } from '../../types/models';
import { getDataService } from "../services/serviceFactory";
import { logError } from "../utils/logger";

/**
 * 投薬記録コマンドを実行する
 * @param parameters コマンドパラメータ
 * @param deviceInfo デバイス情報
 * @returns 実行結果
 */
export async function recordMedicine(parameters: Record<string, any>, deviceInfo: Device) {
    try {
        const dataService = getDataService();

        const {patientName, medicine} = parameters;
        const patientsTable = process.env.PATIENTS_TABLE || '';
        const careRecordsTable = process.env.CARE_RECORDS_TABLE || '';

        if (!patientName || !medicine) {
            return {
                command: 'ERROR',
                displayText: '患者名と薬名が必要です。'
            };
        }

        if (patientsTable === '') {
            return {
                command: 'ERROR',
                displayText: '環境変数 PATIENTS_TABLE が設定されていません'
            }
        }

        if (careRecordsTable === '') {
            return {
                command: 'ERROR',
                displayText: '環境変数 CARE_RECORDS_TABLE が設定されていません'
            }
        }

        // 患者IDの取得
        const patientResult = await dataService.getPatientResult(patientName);

        if (!patientResult) {
            return {
                command: 'NOT_FOUND',
                displayText: `${patientName}さんの情報が見つかりませんでした。`
            };
        }

        const patientId = patientResult.patientId;
        const timestamp = new Date().toISOString();

        // 投薬記録データ作成
        const medicineRecord: CareRecord = {
            patientId,
            timestamp,
            careType: 'medicine',
            details: {
                medicine: medicine,
                route: parameters.route || '経口',
                dosage: parameters.dosage || '規定量'
            },
            performedBy: deviceInfo.assignedTo,
            deviceId: deviceInfo.deviceId
        };

        // 投薬記録保存
        await dataService.setCareRecord(careRecordsTable, medicineRecord);

        return {
            command: 'RECORD_MEDICINE',
            displayText: `${patientName}さんの投薬を記録しました: \n 薬剤: ${medicine}`
        };
    } catch (error) {
        logError('投薬記録エラー:', error);
        return {
            command: 'ERROR',
            displayText: '投薬記録中にエラーが発生しました。'
        };
    }
}