import { Device } from '../../types/models';
import { getDataService } from '../services/serviceFactory';
import { logActivity } from '../utils/logger';

/**
 * 患者情報取得コマンドを実行する
 * @param parameters コマンドパラメータ
 * @param deviceInfo デバイス情報
 * @returns 実行結果
 */
export async function getPatientInfo(parameters: Record<string, any>, deviceInfo: Device): Promise<any> {
    const dataService = getDataService();
    const { patientName } = parameters;

    if (!patientName) {
        return {
            command: 'ERROR',
            displayText: '患者名が指定されていません。'
        };
    }

    // 患者情報取得
    const patient = await dataService.getPatientByName(patientName);
    if (!patient) {
        return {
            command: 'NOT_FOUND',
            displayText: `${patientName}さんの情報が見つかりませんでした。`
        };
    }

    // 主担当看護師の情報取得
    let nurseInfo = "情報なし";
    if (patient.primaryNurse) {
        const nurse = await dataService.getStaffById(patient.primaryNurse);
        if (nurse) {
            nurseInfo = nurse.name;
        }
    }

    // 最新バイタル取得
    const vitals = await dataService.getPatientVitals(patient.patientId, 1);
    let vitalInfo = "";
    if (vitals.length > 0) {
        const vital = vitals[0];
        vitalInfo = `\n最新バイタル: `;
        if (vital.temperature) vitalInfo += `体温${vital.temperature}℃ `;
        if (vital.bloodPressureSystolic) vitalInfo += `血圧${vital.bloodPressureSystolic}/${vital.bloodPressureDiastolic} `;
        if (vital.heartRate) vitalInfo += `脈拍${vital.heartRate} `;
        if (vital.spO2) vitalInfo += `SpO2:${vital.spO2}% `;
    }

    // アレルギー情報の整形
    let allergyInfo = "なし";
    if (patient.allergies && patient.allergies.length > 0) {
        allergyInfo = patient.allergies.join('、');
    }

    // 表示テキスト生成
    const displayText =
        `${patient.name}さん\n` +
        `年齢: ${patient.age}歳\n` +
        `部屋: ${patient.roomNumber}\n` +
        `介護度: ${patient.careLevel}\n` +
        `担当: ${nurseInfo}\n` +
        `アレルギー: ${allergyInfo}` +
        vitalInfo;

    // 記録をログに残す
    await logActivity(deviceInfo.assignedTo, 'GET_PATIENT_INFO', { patientId: patient.patientId });

    return {
        command: 'GET_PATIENT_INFO',
        displayText: displayText,
        data: patient  // 詳細データもオプションで返す
    };
}
