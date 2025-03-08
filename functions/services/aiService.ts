import { GoogleGenerativeAI } from '@google/generative-ai';
import { CommandResult } from '../../types/models';
import { logError } from '../utils/logger';
import { IAIService } from "./interfaces/IAIService";

// Google AI設定
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({model: 'gemini-pro'});

/**
 * 音声テキストからコマンドを解析する
 * @param text 音声認識されたテキスト
 * @returns コマンド解析結果
 */
export class AIService implements IAIService {
    async analyzeCommand(text: string): Promise<CommandResult> {
        try {
            const prompt = `
あなたは介護施設で使用されるARグラスのコマンド解析AIです。
以下の音声テキストを分析し、適切なコマンドとパラメータに変換してください。

コマンド一覧:
- GET_PATIENT_INFO: 患者情報の取得（例: "山田さんの情報表示"）
  必要パラメータ: patientName
- RECORD_VITAL: バイタルサイン記録（例: "鈴木さんの体温は37.2度、血圧は138-85"）
  必要パラメータ: patientName, vitalType, vitalValue
- RECORD_MEAL: 食事摂取記録（例: "佐藤さん、昼食8割摂取"）
  必要パラメータ: patientName, mealType, amount
- RECORD_MEDICINE: 投薬記録（例: "田中さん、降圧剤投与完了"）
  必要パラメータ: patientName, medicine
- CALL_STAFF: スタッフ呼び出し（例: "田中看護師を呼んで"）
  必要パラメータ: staffName
- EMERGENCY: 緊急事態通報（例: "緊急、102号室"）
  必要パラメータ: location

音声テキスト: "${text}"

以下のJSONフォーマットで返答してください:
{
  "command": "コマンド名",
  "parameters": {
    "param1": "値1",
    "param2": "値2"
  },
  "confidence": 0.0〜1.0の信頼度
}
`;

            const result = await model.generateContent(prompt);
            const responseText = result.response.text();

            // JSON部分を抽出（Geminiは時々説明文を付けることがある）
            const jsonMatch = responseText.match(/\{[\s\S]*}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }

            return {
                command: 'UNKNOWN',
                parameters: {},
                confidence: 0
            }
        } catch (error) {
            logError('コマンド解析エラー', error);
            return {
                command: 'UNKNOWN',
                parameters: {},
                confidence: 0
            };
        }
    }
}