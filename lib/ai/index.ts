import { AIProvider } from './provider';
import { OllamaProvider } from './ollama-provider';
import { GeminiProvider } from './gemini-provider';
import { applicationConfig } from '@/lib/config';

export type { AIProvider, ChatMessage } from './provider';

// singleton instance
let providerInstance: AIProvider | null = null;


export const getAIProvider = (): AIProvider => {
    if (providerInstance) {
        return providerInstance;
    }

    const provider = applicationConfig.ai.provider.toLowerCase();

    switch (provider) {
        case 'ollama':
            providerInstance = new OllamaProvider();
            break;
        case 'gemini':
            providerInstance = new GeminiProvider();
            break;
        default:
            throw new Error(
                `Unknown AI provider: ${provider}. Supported providers: ollama, gemini`
            );
    }

    return providerInstance;
};


export const resetProvider = () => {
    providerInstance = null;
};
