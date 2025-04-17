import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { logStatus } from '@shiki-01/logstatus';
import { executeCommand } from "./commands";
import { formatResponse } from './utils/response';
import { Device } from "../types/models";
import { getAIService, getSpeechService } from "./services/serviceFactory";
import { AttributeMap } from "aws-sdk/clients/dynamodb";

// AWS設定
const dynamodb = new DynamoDB.DocumentClient();

export const handler = async (event: APIGatewayProxyEvent) => {
    try {
        logStatus({ code: 200, message: '音声コマンド受信' }, { data: { event, body: event.body } });

        const speechService = getSpeechService();
        const aiService = getAIService();

        // リクエストボディの解析
        const body = JSON.parse(event.body || '{}');
        let { audio, deviceId } = body;

        if (!audio || !deviceId) {
            return formatResponse(400, { error: '音声データとデバイスIDが必要です' });
        }

        // デバイス情報の検証
        const deviceInfo = await getDeviceInfo(deviceId);
        if (!deviceInfo) {
            return formatResponse(403, { error: '未登録のデバイスです' });
        }

        const convertedDeviceInfo = DynamoDB.Converter.unmarshall(deviceInfo) as Device;

        // 音声認識
        const transcription = await speechService.transcribeAudio(audio);
        logStatus({ code: 200, message: '音声認識結果' }, { data: { convertedDeviceInfo, transcription } });

        if (!transcription) {
            return formatResponse(400, {
                command: 'ERROR',
                displayText: '音声を認識できませんでした。もう一度お試しください。'
            });
        }

        // コマンド解析
        const commandResult = await aiService.analyzeCommand(transcription);
        logStatus({ code: 200, message: 'コマンド解析結果' }, { data: { convertedDeviceInfo, commandResult } });

        // コマンド実行
        const result = await executeCommand(commandResult, convertedDeviceInfo);

        // レスポンス返却
        return formatResponse(200, result);
    } catch (error: any) {
        console.error('エラー発生:', error);
        return formatResponse(500, {
            command: 'ERROR',
            displayText: 'エラーが発生しました: ' + error.message
        });
    }
}


/**
    デバイス情報の取得
    @param deviceId デバイスID
    @returns デバイス情報
 **/
async function getDeviceInfo(deviceId: string): Promise<AttributeMap | undefined> {
    try {
        const deviceTable = process.env.DEVICE_TABLE || '';

        if (deviceTable === '') {
            return {
                command: 'ERROR',
                displayText: '環境変数 DEVICE_TABLE が設定されていません'
            } as AttributeMap;
        }

        const result = await dynamodb.get({
            TableName: deviceTable,
            Key: { deviceId }
        }).promise();

        return result.Item;

    } catch (error) {
        console.error('デバイス情報取得エラー:', error);
        return undefined;
    }
}