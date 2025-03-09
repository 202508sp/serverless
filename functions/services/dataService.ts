import { IDataService } from "./interfaces/IDataService";
import { CareRecord, Device, Patient, Staff, VitalSign } from "../../types/models";
import { logError } from "../utils/logger";
import { DynamoDB } from 'aws-sdk';

const dynamodb = new DynamoDB.DocumentClient();

/**
 * データサービス
 */
export class DataService implements IDataService{

    /**
     * デバイス情報を追加する
     * @param deviceId デバイスID
     * @return 追加結果
     */
    async getDeviceInfo(deviceId: string): Promise<Device | null> {
        try {
            const result = await dynamodb.get({
                TableName: process.env.DEVICES_TABLE || '',
                Key: {deviceId}
            }).promise();

            if (!result.Item) {
                return null;
            }

            return result.Item as Device;
        } catch (error) {
            logError('デバイス情報取得エラー', error);
            return null;
        }
    }

    /**
     * 患者名から患者情報を取得する
     * @param patientName 患者名
     * @returns 患者情報、または存在しない場合はnull
     */
    async getPatientResult(patientName: string) {
        const patientsTable = process.env.PATIENTS_TABLE;

        if (!patientsTable) {
            throw new Error('環境変数 PATIENTS_TABLE が設定されていません');
        } else {
            const result = await dynamodb.query({
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

            if (!result.Items || result.Items.length === 0) {
                return null;
            }

            return result.Items[0] as Patient;
        }
    }

    /**
     * 患者IDから患者情報を取得する
     * @param patientId 患者ID
     * @returns 患者情報、または存在しない場合はnull
     */
    async getPatientById(patientId: string): Promise<Patient | null> {
        try {
            const result = await dynamodb.get({
                TableName: process.env.PATIENTS_TABLE || '',
                Key: {patientId}
            }).promise();

            if (!result.Item) {
                return null;
            }

            return result.Item as Patient;
        } catch (error) {
            logError('患者情報取得エラー', error);
            return null;
        }
    }

    /**
     * 名前から患者情報を取得する
     * @param patientName 患者名
     * @returns 患者情報、または存在しない場合はnull
     */
    async getPatientByName(patientName: string): Promise<Patient | null> {
        try {
            const result = await dynamodb.query({
                TableName: process.env.PATIENTS_TABLE || '',
                IndexName: 'NameIndex',
                KeyConditionExpression: '#name = :patientName',
                ExpressionAttributeNames: {
                    '#name': 'name'
                },
                ExpressionAttributeValues: {
                    ':patientName': patientName
                }
            }).promise();

            if (!result.Items || result.Items.length === 0) {
                return null;
            }

            return result.Items[0] as Patient;
        } catch (error) {
            logError('患者情報取得エラー', error);
            return null;
        }
    }

    /**
     * 患者のバイタルサイン履歴を取得する
     * @param patientId 患者ID
     * @param limit 取得件数（デフォルト5件）
     * @returns バイタルサイン配列
     */
    async getPatientVitals(patientId: string, limit?: number): Promise<VitalSign[]> {
        try {
            const result = await dynamodb.query({
                TableName: process.env.VITALS_TABLE || '',
                KeyConditionExpression: 'patientId = :patientId',
                ExpressionAttributeValues: {
                    ':patientId': patientId
                },
                Limit: limit,
                ScanIndexForward: false // 降順（最新順）
            }).promise();

            return (result.Items || []) as VitalSign[];
        } catch (error) {
            logError('バイタル履歴取得エラー', error);
            return [];
        }
    }

    /**
     * スタッフ名からスタッフ情報を取得する
     * @param staffName スタッフ名
     * @returns スタッフ情報、または存在しない場合はnull
     **/
    async getStaffByName(staffName: string): Promise<Staff | null> {
        try {
            const result = await dynamodb.query({
                TableName: process.env.STAFF_TABLE || '',
                IndexName: 'NameIndex',
                KeyConditionExpression: '#name = :staffName',
                ExpressionAttributeNames: {
                    '#name': 'name'
                },
                ExpressionAttributeValues: {
                    ':staffName': staffName
                }
            }).promise();

            if (!result.Items || result.Items.length === 0) {
                return null;
            }

            return result.Items[0] as Staff;
        } catch (error) {
            logError('スタッフ情報取得エラー', error);
            return null;
        }
    }

    /**
     * スタッフIDからスタッフ情報を取得する
     * @param staffId スタッフID
     * @returns スタッフ情報、または存在しない場合はnull
     **/
    async getStaffById(staffId: string): Promise<Staff | null> {
        try {
            const result = await dynamodb.get({
                TableName: process.env.STAFF_TABLE || '',
                Key: {staffId}
            }).promise();

            if (!result.Item) {
                return null;
            }

            return result.Item as Staff;
        } catch (error) {
            logError('スタッフ情報取得エラー', error);
            return null;
        }
    }

    saveCareMeal(_careRecord: CareRecord): Promise<void> {
        return Promise.resolve(undefined);
    }

    saveMedicine(_careRecord: CareRecord): Promise<void> {
        return Promise.resolve(undefined);
    }

    saveVitalSign(_vitalSign: VitalSign): Promise<void> {
        return Promise.resolve(undefined);
    }

    /**
     * ケアレコードを保存する
     * @param careRecordsTable ケアレコードテーブル名
     * @param careRecord ケアレコード
     * @returns なし
     */
    async setCareRecord(careRecordsTable: string, careRecord: CareRecord | VitalSign): Promise<void> {
        await dynamodb.put({
            TableName: careRecordsTable,
            Item: careRecord
        }).promise();

        return Promise.resolve(undefined);
    }
}