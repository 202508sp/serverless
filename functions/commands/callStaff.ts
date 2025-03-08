import { DynamoDB } from 'aws-sdk';
import { getDataService } from "../services/serviceFactory";
import { Device } from '../../types/models';

const dynamodb = new DynamoDB.DocumentClient();

// スタッフ呼び出し関数
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
        const staffResult = await dynamodb.query({
            TableName: staffTable,
            IndexName: 'NameIndex',
            KeyConditionExpression: '#name = :staffName',
            ExpressionAttributeNames: {
                '#name': 'name'
            },
            ExpressionAttributeValues: {
                ':staffName': staffName
            }
        }).promise();

        if (!staffResult.Items || staffResult.Items.length === 0) {
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
            displayText: `${staffName}さんを呼び出しました。\n応答をお待ちください。`
        };
    } catch (error) {
        console.error('スタッフ呼び出しエラー:', error);
        return {
            command: 'ERROR',
            displayText: 'スタッフ呼び出し中にエラーが発生しました。'
        };
    }
}