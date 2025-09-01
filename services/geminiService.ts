
import { GoogleGenAI } from "@google/genai";
import { Priority } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // アプリケーションはAPIキーなしでも動作するべき。AI機能は無効化される。
  console.warn("API_KEYが設定されていません。AI機能は無効になります。");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const cleanJsonString = (str: string): string => {
  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
  const match = str.match(fenceRegex);
  if (match && match[2]) {
    return match[2].trim();
  }
  return str.trim();
};

export const generateSubtasks = async (taskTitle: string): Promise<string[]> => {
  if (!API_KEY) return Promise.reject(new Error("APIキーがありません"));
  try {
    const prompt = `以下のタスクを、実行可能なサブタスクのリストに分割してください。各サブタスクは簡潔な文字列にしてください。JSON形式の文字列配列["サブタスク1", "サブタスク2", ...]のみを返してください。\n\nタスク: ${taskTitle}`;
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-04-17",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.2,
        }
    });

    const jsonStr = cleanJsonString(response.text);
    const subtasks = JSON.parse(jsonStr);

    if (Array.isArray(subtasks) && subtasks.every(s => typeof s === 'string')) {
      return subtasks;
    }
    throw new Error("無効な形式のレスポンスです。");
  } catch (error) {
    console.error("サブタスクの生成に失敗しました:", error);
    throw error;
  }
};

export const suggestPriority = async (taskTitle: string, description?: string): Promise<Priority> => {
    if (!API_KEY) return Promise.reject(new Error("APIキーがありません"));
    try {
      const prompt = `以下のタスクの内容を分析し、優先度を「高」「中」「低」のいずれかで提案してください。提案する優先度の単語のみを返してください。例: 高\n\nタイトル: ${taskTitle}\n詳細: ${description || 'なし'}`;
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-04-17",
        contents: prompt,
        config: {
            temperature: 0.1,
            thinkingConfig: { thinkingBudget: 0 }
        }
      });
      
      const suggested = response.text.trim();
      if (Object.values(Priority).includes(suggested as Priority)) {
        return suggested as Priority;
      }
      // フォールバック
      return Priority.MEDIUM;
    } catch (error) {
      console.error("優先度の提案に失敗しました:", error);
      throw error;
    }
};

export const getMotivationalQuote = async (): Promise<string> => {
    if (!API_KEY) return Promise.resolve("素晴らしい進捗です！");
    try {
      const prompt = "ToDoリストのタスクを1つ完了したユーザーを称賛し、やる気を起こさせるような、短く創造的でポジティブなメッセージを日本語で一つ生成してください。";
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-04-17",
        contents: prompt,
        config: {
            temperature: 1,
        }
      });

      return response.text.trim();
    } catch (error) {
      console.error("応援メッセージの生成に失敗しました:", error);
      return "タスク完了おめでとうございます！";
    }
};
