
import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const transcribeAudio = async (base64Audio: string, mimeType: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    { text: "Transcribe the following audio recording, identifying different speakers and including timestamps. For example: [00:01] Speaker 1: Hello there. [00:03] Speaker 2: Hi, how are you?" },
                    {
                        inlineData: {
                            mimeType: mimeType,
                            data: base64Audio,
                        },
                    },
                ],
            },
        });

        return response.text;
    } catch (error) {
        console.error("Error transcribing audio:", error);
        if (error instanceof Error) {
            return `Error: ${error.message}`;
        }
        return "An unknown error occurred during transcription.";
    }
};
