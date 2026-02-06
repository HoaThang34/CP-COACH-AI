import { GoogleGenAI, Type, Schema, Content } from "@google/genai";
import { Problem, Difficulty, AnalysisResult, SolutionData, ChatMessage } from '../types';
import { PROMPTS } from './prompts';

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

// Schema for problem generation
const problemSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    description: { type: Type.STRING },
    inputFormat: { type: Type.STRING },
    outputFormat: { type: Type.STRING },
    constraints: { type: Type.STRING },
    examples: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          input: { type: Type.STRING },
          output: { type: Type.STRING },
        },
      },
    },
    topic: { type: Type.STRING, description: "Infer the topic from the problem" },
    difficulty: { type: Type.STRING, description: "Infer the difficulty level" }
  },
  required: ['title', 'description', 'inputFormat', 'outputFormat', 'constraints', 'examples'],
};

// Schema for solution generation
const solutionSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    explanation: { type: Type.STRING, description: "Detailed Markdown explanation of the algorithm approach." },
    sampleCode: { type: Type.STRING, description: "Complete, well-commented source code." },
    complexity: { type: Type.STRING, description: "Time and Space complexity analysis." }
  },
  required: ['explanation', 'sampleCode', 'complexity'],
};

export const generateProblem = async (
  topic: string, 
  difficulty: Difficulty,
  customRequest?: string
): Promise<Problem> => {
  const ai = getAiClient();
  
  const userInstruction = PROMPTS.generateProblemInstruction(topic, difficulty, customRequest);
  const prompt = PROMPTS.generateProblem(userInstruction);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: problemSchema,
        systemInstruction: PROMPTS.generateProblemSystem,
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    const data = JSON.parse(text);
    return {
      ...data,
      // If AI didn't return topic/diff, fallback to requested ones
      topic: data.topic || topic,
      difficulty: data.difficulty || difficulty
    };
  } catch (error) {
    console.error("Error generating problem:", error);
    throw error;
  }
};

export const analyzeSolution = async (
  problem: Problem,
  userCode: string,
  language: string
): Promise<AnalysisResult> => {
  const ai = getAiClient();
  const prompt = PROMPTS.analyzeSolution(problem, userCode, language);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // Use Pro for better code reasoning
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 2048 } // Allow some thinking for code analysis
      }
    });

    const rawText = response.text || "";
    
    // Parse verdict from first line if possible, otherwise infer
    const match = rawText.match(/^\[(.*?)\]/);
    let verdictCode = 'UNKNOWN';
    let feedbackText = rawText;

    if (match) {
      verdictCode = match[1];
      feedbackText = rawText.substring(match[0].length).trim();
    }

    let verdict: AnalysisResult['verdict'] = 'UNKNOWN';
    if (verdictCode.includes('SAI_HUONG')) verdict = 'WRONG_DIRECTION';
    else if (verdictCode.includes('THIEU_SOT')) verdict = 'PARTIAL';
    else if (verdictCode.includes('DUNG')) verdict = 'CORRECT';
    else if (verdictCode.includes('XUAT_SAC')) verdict = 'EXCELLENT';

    return {
      verdict,
      feedbackMarkdown: feedbackText
    };

  } catch (error) {
    console.error("Error analyzing code:", error);
    throw error;
  }
};

export const requestHint = async (
  problem: Problem,
  userCode: string,
  currentFeedback: string
): Promise<string> => {
    const ai = getAiClient();
    const prompt = PROMPTS.requestHint(problem, userCode, currentFeedback);
    
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
    });
    return response.text || "Không thể tạo gợi ý lúc này.";
}

export const generateSolution = async (
  problem: Problem,
  language: string
): Promise<SolutionData> => {
    const ai = getAiClient();
    const prompt = PROMPTS.generateSolution(problem, language);

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview', // Strong model for code generation
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: solutionSchema,
                thinkingConfig: { thinkingBudget: 2048 }
            }
        });
        
        if(!response.text) throw new Error("No solution generated");
        return JSON.parse(response.text);

    } catch (error) {
        console.error("Error generating solution:", error);
        throw error;
    }
}

export const sendChatToTutor = async (
  history: ChatMessage[],
  newMessage: string,
  currentContext?: string
): Promise<string> => {
  const ai = getAiClient();

  // Convert app history to Gemini SDK history format
  const historyContent: Content[] = history.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.text }]
  }));

  const systemInstruction = PROMPTS.chatSystemInstruction(currentContext);

  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: systemInstruction,
    },
    history: historyContent
  });

  const result = await chat.sendMessage({ message: newMessage });
  return result.text || "Xin lỗi, tôi không thể phản hồi lúc này.";
};
