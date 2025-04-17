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

      const ollama = new Ollama()
      let response: ChatResponse | null = null

      const prompt = `Analyze the following speech text and convert it to a JSON command with parameters.

Command List:

    GET_PATIENT_INFO
        Parameters:
            patientName (Name of the patient)

        Example: 山田太郎さんの情報を教えて

    RECORD_VITAL
        Parameters:
            patientName (Name of the patient)
            vitalType (temperature, bloodPressure, heartRate, spO2)
            vitalValue (number)

        Example: 佐藤花子さんの体温は37.2度

    RECORD_MEAL
        Parameters:
            patientName (Name of the patient)
            mealType (breakfast, lunch, dinner)
            amount (percentage, number)

        Example: 田中次郎さんの昼食は8割摂取

    RECORD_MEDICINE
        Parameters:
            patientName (Name of the patient)
            medicine (Name of the medicine)

        Example: 鈴木一郎さんに降圧剤を投与しました

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

If required parameters are missing, set "command" to "ERROR" and "parameters" to {}.

Speech text: "${text}"
`;

      response = await ollama.chat({
        model: 'gemma3:4b-it-fp16',
        messages: [{ role: 'user', content: prompt }],
      })

      // JSON部分を抽出（Geminiは時々説明文を付けることがある）
      const jsonMatch = response.message.content.match(/\{[\s\S]*}/);
      if (jsonMatch) {
        console.log("Geminiの応答:", text, jsonMatch[0]);
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