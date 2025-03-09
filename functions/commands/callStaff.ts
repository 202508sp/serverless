import { Device } from '../../types/models';
import { getDataService } from "../services/serviceFactory";
import { logError } from "../utils/logger";

/**
 * スタッフ呼び出しコマンドを実行する
 * @param parameters コマンドパラメータ
 * @param _deviceInfo デバイス情報
 * @returns 実行結果
 */
export async function callStaff(parameters: Record<string, any>, _deviceInfo: Device) {
    try {
        const dataService = getDataService();

        const {staffName} = parameters;
        const staffTable = process.env.STAFF_TABLE || '';

        if (!staffName) {
            return {
                command: 'ERROR',
                displayText: 'スタッフ名が必要です。'
            };
        }

        if (staffTable === '') {
            return {
                command: 'ERROR',
                displayText: '環境変数 STAFF_TABLE が設定されていません'
            }
        }

        // スタッフIDの取得
        const staffResult = await dataService.getStaffByName(staffName);

        if (!staffResult) {
            return {
                command: 'NOT_FOUND',
                displayText: `${staffName}さんの情報が見つかりませんでした。`
            };
        }

        /**
        const staff = staffResult.Items[0];
        const timestamp = new Date().toISOString();

        // 呼び出し記録（実際のシステムではSNSやWebSocketなどで通知する）
        const callRecord = {
            timestamp,
            callerId: deviceInfo.assignedTo,
            targetStaffId: staff.staffId,
            status: 'pending',
            deviceId: deviceInfo.deviceId
        };**/

        // この例では通知機能は省略していますが、実際のシステムでは
        // AWS SNSやWebSocketsなどを使って通知を送るコードをここに追加

        return {
            command: 'CALL_STAFF',
            displayText: `${staffName}さんを呼び出しました。 \n 応答をお待ちください。`
        };
    } catch (error) {
        logError('スタッフ呼び出しエラー:', error);
        return {
            command: 'ERROR',
            displayText: 'スタッフ呼び出し中にエラーが発生しました。'
        };
    }
}