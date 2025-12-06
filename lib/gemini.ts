import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

const google = createGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const model = google('models/gemini-2.0-flash');

export const generateSummaryFromGemini = async (pdfText: string) => {
    try {
        const { text } = await generateText({
            model,
            prompt: `Transform this document into an engaging, easy-to-read summary with contextually relevant emojis and proper markdown formatting:\n\n'${pdfText}'`,
            temperature: 0.7,
            maxOutputTokens: 1500,
        });

        if (!text) {
            throw new Error('Empty response from Gemini API');
        }

        return text;
    } catch (error) {
        console.error('Gemini API Error:', error);
        throw error;
    }
};