const { config } = require('../config/config');

function normalizeMessage(value) {
  if (typeof value !== 'string') return null;
  const message = value.replace(/\s+/g, ' ').trim();
  if (!message || message.length > 280) return null;
  return message;
}

class GeminiService {
  async generateDailyQuote({ average, mood, count }) {
    if (!config.geminiApiKey) return null;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), config.geminiTimeoutMs);

    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(config.geminiModel)}:generateContent`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': config.geminiApiKey,
        },
        signal: controller.signal,
        body: JSON.stringify({
          systemInstruction: {
            parts: [{
              text: 'Eres un acompañante amable de bienestar emocional. Escribe solo una frase breve en español, cálida y concreta. No diagnostiques, no des consejos médicos y no menciones que eres una IA. Máximo 20 palabras.',
            }],
          },
          contents: [{
            role: 'user',
            parts: [{
              text: `Genera una frase personalizada según estos datos: promedio emocional ${average}/5, emoción predominante ${mood}, registros de hoy ${count}.`,
            }],
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 48,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini respondió con HTTP ${response.status}`);
      }

      const data = await response.json();
      return normalizeMessage(data?.candidates?.[0]?.content?.parts?.[0]?.text);
    } finally {
      clearTimeout(timeout);
    }
  }
}

module.exports = GeminiService;
