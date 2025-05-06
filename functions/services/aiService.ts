import { logStatus } from '@shiki-01/logstatus';
import { CommandResult } from '../../types/models';
import { IAIService } from "./interfaces/IAIService";
import { ChatResponse, Ollama } from 'ollama';

/**
 * 音声テキストからコマンドを解析する
 * @param text 音声認識されたテキスト
 * @returns コマンド解析結果
 */
export class AIService implements IAIService {

  /**
   * 音声テキストからコマンドを解析する
   * @param text 音声認識されたテキスト
   * @returns コマンド解析結果
   */
  async analyzeCommand(text: string): Promise<CommandResult> {
    try {

      const ollama = new Ollama({
        
      })
      let response: ChatResponse | null = null

      const prompt = `# JSON変換タスク
入力された音声テキストを分析し、適切なJSONコマンドに変換してください。
出力は必ず有効なJSONのみとし、説明文は含めないでください。

## 注意事項
- JSONは厳密な構文で出力してください（例: プロパティ間にカンマを忘れない）。
- 不完全なJSONや説明文を含む出力は無効とみなされます。

## コマンド定義

### GET_PATIENT_INFO
- 必須: patientName（「〇〇さん」から「〇〇」の形式で抽出）
- 例: 「山田太郎さんの情報を教えて」→ {"command":"GET_PATIENT_INFO","parameters":{"patientName":"山田太郎"}}

### RECORD_VITAL
- 必須: patientName, vitalType, vitalValue
- vitalType対応:
  * temperature: 体温/熱
  * bloodPressure: 血圧 ( 'vitalValue' に血圧の最高値 max と最低値 min を「max-min」の形式で実際の値を用いて出力 e.g. 120-80 )
  * heartRate: 脈拍/心拍数
  * spO2: 酸素飽和度
- 例: 「佐藤花子さんの体温は37.2度」→ {"command":"RECORD_VITAL","parameters":{"patientName":"佐藤花子","vitalType":"temperature","vitalValue":37.2}}
- 例: 「田中次郎さんの血圧は最高120、最低80」→ {"command":"RECORD_VITAL","parameters":{"patientName":"田中次郎","vitalType":"bloodPressure","vitalValue":"120-80"}}

### RECORD_MEAL
- 必須: patientName, mealType, amount
- mealType対応: breakfast(朝食), lunch(昼食), dinner(夕食)
- 例: 「田中次郎さんの昼食は8割摂取」→ {"command":"RECORD_MEAL","parameters":{"patientName":"田中次郎","mealType":"lunch","amount":80}}

### RECORD_MEDICINE
- 必須: patientName, medicine
- 例: 「鈴木一郎さんに降圧剤を投与しました」→ {"command":"RECORD_MEDICINE","parameters":{"patientName":"鈴木一郎","medicine":"降圧剤"}}

### CALL_STAFF
- 必須: staffName
- 例: 「田中看護師を呼んでください」→ {"command":"CALL_STAFF","parameters":{"staffName":"田中看護師"}}

### EMERGENCY
- 必須: location
- 例: 「緊急です、102号室に来てください」→ {"command":"EMERGENCY","parameters":{"location":"102号室"}}

## 出力フォーマット
必須パラメータが揃っている場合:
{"command":"COMMAND_NAME","parameters":{"param1":"value1","param2":"value2"}}

必須パラメータが不足している場合:
{"command":"ERROR","parameters":{}}
`;

      response = await ollama.chat({
        model: 'gemma3:1b',
        messages: [
          { role: 'system', content: prompt },
          { role: 'user', content: text },
        ],
      })

      // JSON部分を抽出（Geminiは時々説明文を付けることがある）
      const jsonMatch = response.message.content.match(/\{[\s\S]*}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return {
        command: 'UNKNOWN',
        parameters: {},
        confidence: 0
      }
    } catch (error) {
      logStatus({ code: 500, message: 'AIService.analyzeCommand' }, {}, error);
      return {
        command: 'UNKNOWN',
        parameters: {},
        confidence: 0
      };
    }
  }
}