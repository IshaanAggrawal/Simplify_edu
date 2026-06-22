import OpenAI from 'openai';

// NVIDIA NIM free API requires 'nvapi-' prefixed keys and the specific baseURL
const apiKey = process.env.NVIDIA_API_KEY;

export const aiClient = new OpenAI({
  baseURL: 'https://integrate.api.nvidia.com/v1',
  apiKey: apiKey || 'dummy-key-for-build',
});

export const MODEL_NAME = 'deepseek-ai/deepseek-v4-pro';

export const isAiEnabled = () => {
  return typeof process.env.NVIDIA_API_KEY === 'string' && process.env.NVIDIA_API_KEY.startsWith('nvapi-');
};
