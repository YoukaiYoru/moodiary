const { config } = require('../config/config');

function normalizeMessage(value) {
  if (typeof value !== 'string') return null;

  const message = value.replace(/\s+/g, ' ').trim();
  if (!message || message.length > 280) return null;
  return message;
}

class OllamaService {
  async generateDailyQuote({ average, mood, count }) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), config.ollamaTimeoutMs);

    try {
      const response = await fetch(`${config.ollamaBaseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          model: config.ollamaModel,
          stream: false,
          keep_alive: '10m',
          messages: [
            {
              role: 'system',
              content:
                'Eres un acompañante amable de bienestar emocional. Escribe solo una frase breve en español, cálida y concreta. No diagnostiques, no des consejos médicos y no menciones que eres una IA. Máximo 20 palabras.',
            },
            {
              role: 'user',
              content: `Genera una frase personalizada según estos datos: promedio emocional ${average}/5, emoción predominante ${mood}, registros de hoy ${count}.`,
            },
          ],
          options: {
            temperature: 0.7,
            num_predict: 48,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama respondió con HTTP ${response.status}`);
      }

      const data = await response.json();
      return normalizeMessage(data?.message?.content);
    } finally {
      clearTimeout(timeout);
    }
  }
}

module.exports = OllamaService;
