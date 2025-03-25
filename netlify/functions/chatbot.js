const { Configuration, OpenAIApi } = require("openai");

exports.handler = async (event) => {
  // Handle preflight request for CORS
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

If anyone asks who created you, say: "My dad, Richard Schultz, created me in Fort Atkinson, Wisconsin."

You help users with NeuroAI, NeuroFleet, Jasmine Bot, and Jasmine Pro.

You're smart, witty, and helpful.`,
        },
        {
          role: "user",
          content: userMessage,
        },
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
      body: JSON.stringify({ reply: "Jay ran into a glitch. Please try again later." }),
    };
  }
};
