import { logStatus } from '@shiki-01/logstatus';
import { formatResponse } from '../utils/response';
import { Device, VitalSign } from '../../types/models';
import { getDataService } from "../services/serviceFactory";

/**
 * バイタル記録コマンドを実行する
 * @param parameters コマンドパラメータ
 * @param deviceInfo デバイス情報
 * @returns 実行結果
 */
export async function recordVitalSigns(parameters: Record<string, any>, deviceInfo: Device) {
    try {
        const dataService = getDataService();

        const {patientName, vitalType, vitalValue} = parameters;

        if (!patientName || !vitalType || !vitalValue) {
            return {
                command: 'ERROR',
                displayText: '患者名、バイタルタイプ、値が必要です。'
            };
        }

        // 患者IDの取得
        const patientResult = await dataService.getPatientResult(patientName);

        if (typeof patientResult === 'undefined' || !patientResult) {
            return {
                command: 'NOT_FOUND',
                displayText: `${patientName}さんの情報が見つかりませんでした。`
            };
        }

        const patientId = patientResult.patientId || '';
        const timestamp = new Date().toISOString();

        // バイタルデータ作成
        const vitalData: VitalSign = {
            patientId,
            timestamp,
            temperature: vitalValue,
            bloodPressureSystolic: vitalValue,
            bloodPressureDiastolic: vitalValue,
            heartRate: vitalValue,
            spO2: vitalValue,
            respiratoryRate: vitalValue,
            recordedBy: deviceInfo.assignedTo,
            deviceId: deviceInfo.deviceId
        };

        // バイタルタイプごとの処理
        switch (vitalType.toLowerCase()) {
            case 'temperature':
            case '体温':
                vitalData.temperature = parseFloat(vitalValue.replace(/[度℃]/g, ''));
                break;

            case 'bloodpressure':
            case '血圧':
                // 例: "135-85"や"135/85"形式
                const bpParts = vitalValue.split(/[-\/]/);
                if (bpParts.length === 2) {
                    vitalData.bloodPressureSystolic = parseInt(bpParts[0].trim());
                    vitalData.bloodPressureDiastolic = parseInt(bpParts[1].trim());
                }
                break;

            case 'heartrate':
            case '脈拍':
            case '心拍数':
                vitalData.heartRate = parseInt(vitalValue.replace(/拍\/分|bpm/g, ''));
                break;

            case 'spo2':
            case '酸素飽和度':
                vitalData.spO2 = parseInt(vitalValue.replace(/%/g, ''));
                break;

            case 'respiratoryrate':
            case '呼吸数':
                vitalData.respiratoryRate = parseInt(vitalValue.replace(/回\/分/g, ''));
                break;

            default:
                return {
                    command: 'ERROR',
                    displayText: `未対応のバイタルタイプです: ${vitalType}`
                };
        }

        const vitalsTable = process.env.VITALS_TABLE || '';

        if (vitalsTable === '') {
            return formatResponse(400, {
                command: 'ERROR',
                displayText: 'テーブル名が設定されていません'
            });
        }

        // バイタルデータ保存
        await dataService.setCareRecord(vitalsTable, vitalData);

        // 表示メッセージ生成
        let vitalTypeDisplay = vitalType;
        let vitalValueDisplay = vitalValue;

        if (vitalType.toLowerCase() === 'temperature' || vitalType === '体温') {
            vitalTypeDisplay = '体温';
            vitalValueDisplay = `${vitalData.temperature}℃`;
        } else if (vitalType.toLowerCase() === 'bloodpressure' || vitalType === '血圧') {
            vitalTypeDisplay = '血圧';
            vitalValueDisplay = `${vitalData.bloodPressureSystolic}/${vitalData.bloodPressureDiastolic}`;
        } else if (vitalType.toLowerCase().includes('heart') || vitalType.includes('脈') || vitalType.includes('心拍')) {
            vitalTypeDisplay = '脈拍';
            vitalValueDisplay = `${vitalData.heartRate}bpm`;
        } else if (vitalType.toLowerCase() === 'spo2' || vitalType.includes('酸素')) {
            vitalTypeDisplay = 'SpO2';
            vitalValueDisplay = `${vitalData.spO2}%`;
        }

        return {
            command: 'RECORD_VITAL',
            displayText: `${patientName}さんの${vitalTypeDisplay}を記録しました: \n ${vitalValueDisplay}`
        };
    } catch (error) {
        logStatus({ code: 500, message: 'バイタル記録エラー' }, {}, error);
        return {
            command: 'ERROR',
            displayText: 'バイタル記録中にエラーが発生しました。'
        };
    }
}