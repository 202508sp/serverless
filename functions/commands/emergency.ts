import { logStatus } from '@shiki-01/logstatus';
import { Device } from '../../types/models';

/**
 * 緊急通報を行う
 * @param parameters パラメータ
 * @param _deviceInfo デバイス情報
 * @returns CommandResult
 */
export async function reportEmergency(parameters: Record<string, any>, _deviceInfo: Device) {

    try {
        const {location} = parameters;

        if (!location) {
            return {
                command: 'ERROR',
                displayText: '場所の情報が必要です。'
            };
        }
/**
        const timestamp = new Date().toISOString();

        // 緊急事態記録
        const emergencyRecord = {
            timestamp,
            reporterId: deviceInfo.assignedTo,
            location: location,
            status: 'active',
            deviceId: deviceInfo.deviceId
        };**/

        // この例では通知機能は省略していますが、実際のシステムでは
        // 緊急連絡網に通知を送るコードをここに追加
        // 例: AWS SNSを使った通知送信など

        return {
            command: 'EMERGENCY',
            displayText: `緊急通報を送信しました: ${location} \n\n 応援が向かっています。`,
            isEmergency: true  // フロントエンドで赤色表示などの特別処理のフラグ
        };
    } catch (error) {
        logStatus({ code: 500, message: '緊急通報エラー' }, {}, error);
        return {
            command: 'ERROR',
            displayText: '緊急通報の送信中にエラーが発生しました。'
        };
    }
}