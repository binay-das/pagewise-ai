import { AIProvider } from './provider';
import { OllamaProvider } from './ollama-provider';
import { GeminiProvider } from './gemini-provider';
import { applicationConfig } from '@/lib/config';

export type { AIProvider, ChatMessage } from './provider';

let providerInstance: AIProvider | null = null;


export const getAIProvider = (): AIProvider => {
    if (providerInstance) {
        return providerInstance;
    }

    const provider = applicationConfig.ai.provider.toLowerCase();
    providerInstance = getProviderByName(provider);
    return providerInstance;
};

export const getProviderByName = (name: string): AIProvider => {
    const provider = name.toLowerCase();

    switch (provider) {
        case 'ollama':
            return new OllamaProvider();
        case 'gemini':
            return new GeminiProvider();
        default:
            throw new Error(
                `Unknown AI provider: ${provider}`
            );
    }
};


export const resetProvider = () => {
    providerInstance = null;
};
