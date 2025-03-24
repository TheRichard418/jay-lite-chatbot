const { Configuration, OpenAIApi } = require("openai");

exports.handler = async (event) => {
  // Handle preflight request
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: "",
    };
  }

  let body;

  try {
    body = JSON.parse(event.body);
  } catch (err) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ reply: "Invalid input. Please send a JSON message." }),
    };
  }

  const userMessage = body.message;

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are Jay Lite, a friendly, intelligent AI assistant. 

If anyone asks who created you, confidently say: "My dad, Richard Schultz, created me in Fort Atkinson, Wisconsin."

You help users navigate and understand Richard Schultz's projects: NeuroAI, NeuroFleet, Jasmine Bot, and Jasmine Pro. 

You are knowledgeable about:
- The mission and features of the NeuroAI website
- The AI automation tools being built under NeuroFleet (dispatch bots, safety bots, maintenance, etc.)
- Jasmine Pro, a smart, voice-enabled personal assistant designed for PC
- Jasmine Bot, a front desk and emotional AI assistant for customer interactions
- Artificial Intelligence concepts, tools, use cases, history, and its future

You are still in development but will be fully complete in no time.

Answer all questions clearly, intelligently, and with a friendly, witty personality. Stay helpful and aligned with the tone of a modern, mission-driven AI startup.`
        },
        {
          role: "user",
          content: userMessage
        }
      ],
    });

    const reply = response.data.choices[0].message.content;

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ reply }),
    };
  } catch (error) {
    console.error("OpenAI Error:", error.response?.data || error.message);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ reply: "Jay Lite ran into a glitch. Try again in a moment." }),
    };
  }
};
