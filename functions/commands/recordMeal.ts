import { CareRecord, Device } from '../../types/models';
import { getDataService } from "../services/serviceFactory";
import { logError } from "../utils/logger";

/**
 * 食事記録コマンドを実行する
 * @param parameters コマンドパラメータ
 * @param deviceInfo デバイス情報
 * @returns 実行結果
 */
export async function recordMeal(parameters: Record<string, any>, deviceInfo: Device) {
    try {
        const dataService = getDataService();

        const {patientName, mealType, amount} = parameters;
        const careRecordsTable = process.env.CARE_RECORDS_TABLE || '';

        if (!patientName || !mealType || !amount) {
            return {
                command: 'ERROR',
                displayText: '患者名、食事タイプ、摂取量が必要です。'
            };
        }

        if (careRecordsTable === '') {
            return {
                command: 'ERROR',
                displayText: '環境変数 PATIENTS_TABLE が設定されていません'
            }
        }

        // 患者IDの取得
        const patientResult = await dataService.getPatientResult(patientName);

        if (typeof patientResult === 'undefined') {
            return {
                command: 'NOT_FOUND',
                displayText: `${patientName}さんの情報が見つかりませんでした。`
            };
        }

        if (!patientResult) {
            return {
                command: 'NOT_FOUND',
                displayText: `${patientName}さんの情報が見つかりませんでした。`
            };
        }

        const patientId = patientResult.patientId;
        const timestamp = new Date().toISOString();

        // 食事記録データ作成
        const mealRecord: CareRecord = {
            patientId,
            timestamp,
            careType: 'meal',
            details: {
                mealType: mealType,  // 朝食/昼食/夕食/間食
                amount: amount,       // 摂取量 (例: "8割")
            },
            performedBy: deviceInfo.assignedTo,
            deviceId: deviceInfo.deviceId
        };

        // 食事記録保存
        await dataService.setCareRecord(careRecordsTable, mealRecord);

        // 食事タイプの日本語表示調整
        let mealTypeDisplay = mealType;
        if (mealType.toLowerCase() === 'breakfast') mealTypeDisplay = '朝食';
        if (mealType.toLowerCase() === 'lunch') mealTypeDisplay = '昼食';
        if (mealType.toLowerCase() === 'dinner') mealTypeDisplay = '夕食';
        if (mealType.toLowerCase() === 'snack') mealTypeDisplay = '間食';

        return {
            command: 'RECORD_MEAL',
            displayText: `${patientName}さんの${mealTypeDisplay}摂取記録を保存しました: \n 摂取量: ${amount}`
        };
    } catch (error) {
        logError('食事記録エラー:', error);
        return {
            command: 'ERROR',
            displayText: '食事記録中にエラーが発生しました。'
        };
    }
}