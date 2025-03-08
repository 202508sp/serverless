import { ApiResponse } from '../../types/models';

/**
 * API Gatewayレスポンスを整形する
 * @param statusCode HTTPステータスコード
 * @param body レスポンスボディ
 * @returns 整形されたレスポンス
 */
export function formatResponse(statusCode: number, body: any): ApiResponse {
    return {
        statusCode,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(body)
    };
}
