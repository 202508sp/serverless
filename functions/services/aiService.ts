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
        host: '127.0.0.1:11434',
      })
      let response: ChatResponse | null = null

      const prompt = `Analyze the following speech text and convert it to a JSON command with parameters.

Command List:

    GET_PATIENT_INFO
        Parameters:
            patientName (Name of the patient)

        Example: 山田太郎さんの情報を教えて
        Info: patientName must be in the format of "山田太郎" from "山田太郎さん"

    RECORD_VITAL
        Parameters:
            patientName (Name of the patient)
            vitalType (temperature, bloodPressure, heartRate, spO2)
            vitalValue (number)

        Example: 佐藤花子さんの体温は37.2度
        Info: vitalValue is a number, e.g., 37.2
        Mapping:
            temperature -> 体温|熱
            bloodPressure -> 血圧
            heartRate -> 脈拍|心拍数
            spO2 -> 酸素飽和度

    RECORD_MEAL
        Parameters:
            patientName (Name of the patient)
            mealType (breakfast, lunch, dinner)
            amount (percentage, number)

        Example: 田中次郎さんの昼食は8割摂取
        Info: mealType is one of "朝", "昼", "夜" in Japanese
        Info: amount is a percentage, e.g., 80

    RECORD_MEDICINE
        Parameters:
            patientName (Name of the patient)
            medicine (Name of the medicine)

        Example: 鈴木一郎さんに降圧剤を投与しました
        Info: medicine is a name of the medicine, e.g., "降圧剤". please predict the name of the medicine from the context.

    CALL_STAFF
        Parameters:
            staffName (Name of the staff)

        Example: 田中看護師を呼んでください

    EMERGENCY
        Parameters:
            location (Room number or location)

        Example: 緊急です、102号室に来てください

Output format (JSON only):

json
{
  "command": "COMMAND_NAME",
  "parameters": {
    "param1": "value1",
    "param2": "value2"
  },
  "confidence": 0.0
}

confidence: 0.3 * patientName + 0.4 * type + 0.3 * value
If required parameters are missing, set "command" to "ERROR" and "parameters" to {}.
`;

      response = await ollama.chat({
        model: 'hf.co/elyza/Llama-3-ELYZA-JP-8B-GGUF:latest',
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