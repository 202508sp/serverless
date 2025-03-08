/**
 * イベントログを出力する
 * @param message ログメッセージ
 * @param data ログデータ
 */
export function logEvent(message: string, data?: any): void {
    console.log(`[INFO] ${message}:`, data ? JSON.stringify(data) : '');
}

/**
 * エラーログを出力する
 * @param message エラーメッセージ
 * @param error エラーオブジェクト
 */
export function logError(message: string, error: any): void {
    console.error(`[ERROR] ${message}:`, error);
}

/**
 * 活動ログを記録する
 * @param staffId スタッフID
 * @param actionType アクションタイプ
 * @param details 詳細情報
 */
export async function logActivity(staffId: string, actionType: string, details: any): Promise<void> {
    try {
        const logEntry = {
            timestamp: new Date().toISOString(),
            staffId,
            actionType,
            details
        };

        // 実際のシステムではログテーブルに保存
        console.log('[ACTIVITY]', JSON.stringify(logEntry));
    } catch (error) {
        logError('ログ記録エラー', error);
    }
}
