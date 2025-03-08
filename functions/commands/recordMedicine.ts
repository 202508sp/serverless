import { DynamoDB } from 'aws-sdk';
import { Device } from '../../types/models';

const dynamodb = new DynamoDB.DocumentClient();

// 投薬記録関数
export async function recordMedicine(parameters: Record<string, any>, deviceInfo: Device) {
    try {
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
        const patientResult = await dynamodb.query({
            TableName: patientsTable,
            IndexName: 'NameIndex',
            KeyConditionExpression: '#name = :patientName',
            ExpressionAttributeNames: {
                '#name': 'name'
            },
            ExpressionAttributeValues: {
                ':patientName': patientName
            }
        }).promise();

        if (!patientResult.Items || patientResult.Items.length === 0) {
            return {
                command: 'NOT_FOUND',
                displayText: `${patientName}さんの情報が見つかりませんでした。`
            };
        }

        const patientId = patientResult.Items[0].patientId;
        const timestamp = new Date().toISOString();

        // 投薬記録データ作成
        const medicineRecord = {
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
        await dynamodb.put({
            TableName: careRecordsTable,
            Item: medicineRecord
        }).promise();

        return {
            command: 'RECORD_MEDICINE',
            displayText: `${patientName}さんの投薬を記録しました:\n薬剤: ${medicine}`
        };
    } catch (error) {
        console.error('投薬記録エラー:', error);
        return {
            command: 'ERROR',
            displayText: '投薬記録中にエラーが発生しました。'
        };
    }
}