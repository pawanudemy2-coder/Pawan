
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    if (!API_KEY) {
      throw new Error("API_KEY is not defined");
    }
    this.ai = new GoogleGenAI({ apiKey: API_KEY });
  }

  async analyzeCode(projectName: string, code: string) {
    const response = await this.ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Analyze the following code for a project titled "${projectName}". 
      Identify potential bugs, suggest improvements, and provide a short summary of its functionality.
      
      Code:
      \`\`\`
      ${code}
      \`\`\`
      `,
    });
    return response.text;
  }

  async rankSubmissions(challengeTopic: string, submissions: { owner: string, code: string, desc: string }[]) {
    const prompt = `You are a technical judge for a coding community. 
    Analyze these ${submissions.length} submissions for the challenge: "${challengeTopic}".
    
    Submissions:
    ${submissions.map((s, i) => `
    [App ${i+1}] Owner: ${s.owner}
    Description: ${s.desc}
    Code: \`\`\`${s.code}\`\`\`
    `).join('\n')}

    Please:
    1. Rank them based on feature completeness, code quality, and innovation.
    2. Provide a short "AI Verdict" for each.
    3. Assign a "Key Strength" badge to each (e.g., "Optimization King", "UI Specialist").
    
    Return the response as a clear, concise markdown list.`;

    const response = await this.ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });
    return response.text;
  }

  async summarizeFeedback(projectName: string, feedbacks: any[]) {
    const feedbackList = feedbacks.map(f => `[${f.type}] ${f.author}: ${f.content}`).join('\n');
    const response = await this.ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a consolidated summary of the testing feedback for "${projectName}". 
      Group issues into categories like "UI/UX", "Functionality", and "New Ideas".
      
      Feedbacks:
      ${feedbackList}
      `,
    });
    return response.text;
  }
}

export const geminiService = new GeminiService();
