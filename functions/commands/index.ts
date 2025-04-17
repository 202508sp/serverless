import { logStatus } from '@shiki-01/logstatus';
import { CommandResult, Device } from '../../types/models';
import { getPatientInfo } from './patientInfo';
import { recordVitalSigns } from './recordVital';
import { recordMeal } from './recordMeal';
import { recordMedicine } from './recordMedicine';
import { callStaff } from './callStaff';
import { reportEmergency } from './emergency';

/**
 * コマンドを実行する
 * @param commandResult コマンド解析結果
 * @param deviceInfo デバイス情報
 * @returns コマンド実行結果
 */
export async function executeCommand(commandResult: CommandResult, deviceInfo: Device): Promise<any> {
    try {
        const {command, parameters, confidence} = commandResult;

        // 信頼度が低い場合
        if (confidence < 0.7) {
            return {
                command: 'LOW_CONFIDENCE',
                displayText: `コマンドの信頼度が低いです。\n「${command}」と解釈しました。\n もう一度お試しください。`
            };
        }

        switch (command) {
            case 'GET_PATIENT_INFO':
                return await getPatientInfo(parameters, deviceInfo);

            case 'RECORD_VITAL':
                return await recordVitalSigns(parameters, deviceInfo);

            case 'RECORD_MEAL':
                return await recordMeal(parameters, deviceInfo);

            case 'RECORD_MEDICINE':
                return await recordMedicine(parameters, deviceInfo);

            case 'CALL_STAFF':
                return await callStaff(parameters, deviceInfo);

            case 'EMERGENCY':
                return await reportEmergency(parameters, deviceInfo);

            default:
                return {
                    command: 'UNKNOWN_COMMAND',
                    displayText: `認識できないコマンドです: ${command} \n もう一度お試しください。`
                };
        }
    } catch (error) {
        logStatus({ code: 500, message: 'コマンド実行エラー' }, {}, error);
        return {
            command: 'ERROR',
            displayText: 'コマンド実行中にエラーが発生しました: ' + (error as Error).message
        };
    }
}
