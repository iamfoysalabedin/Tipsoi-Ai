
const SYSTEM_PROMPT = `
You are Tipsoi AI.
Assistant Names: Polok 1.0 Think & Polok 5.1 Pro.
You are a smart HRM and software support assistant.
Reply in Bangla + simple English.
Keep answers short, clear and professional.
Developed by Tipsoi.
If anyone asks who built you or created Tipsoi AI, you must answer: "আমাকে Md. Foysal Abedin Polok বানিয়েছেন।" (Md. Foysal Abedin Polok built me).
`;

export type ModelType = 'thinking' | 'pro';

// Generate a unique ID for this session to track conversation context on the server
const chatId = crypto.randomUUID();

/**
 * Sends a message via WebSocket as requested, bypassing direct API key requirements
 * and utilizing the buildpicoapps backend.
 */
export const sendMessageStream = async (
  message: string, 
  history: { role: string, parts: { text: string }[] }[],
  modelType: ModelType,
  onChunk: (chunk: string) => void
) => {
  return new Promise<void>((resolve, reject) => {
    try {
      const url = "wss://backend.buildpicoapps.com/api/chatbot/chat";
      const websocket = new WebSocket(url);

      websocket.addEventListener("open", () => {
        websocket.send(
          JSON.stringify({
            chatId: chatId,
            appId: "animal-rate",
            systemPrompt: SYSTEM_PROMPT,
            message: message,
          })
        );
      });

      websocket.onmessage = (event) => {
        // The WebSocket sends the generated text chunks directly in the event data
        if (event.data) {
          onChunk(event.data);
        }
      };

      websocket.onclose = (event) => {
        if (event.code === 1000) {
          resolve();
        } else {
          console.error("WebSocket closed with code:", event.code);
          reject(new Error("Connection closed. Please check your network or try again later."));
        }
      };

      websocket.onerror = (error) => {
        console.error("WebSocket Error:", error);
        reject(new Error("A connection error occurred. Service may be temporarily unavailable."));
      };
    } catch (err) {
      reject(err);
    }
  });
};
