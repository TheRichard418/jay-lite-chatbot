const { Configuration, OpenAIApi } = require("openai");

exports.handler = async (event) => {
  // Handle preflight CORS
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

  // Parse incoming user message
  let body;
  try {
    body = JSON.parse(event.body);
  } catch (err) {
    return {
      statusCode: 400,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ reply: "Invalid input format." }),
    };
  }

  const userMessage = body.message;

  // Connect to OpenAI
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
          content: `You are Jay Lite, a friendly AI assistant created by Richard Schultz. Respond clearly, with a helpful and witty tone.`
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
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ reply }),
    };
  } catch (error) {
    console.error("OpenAI error:", error.response?.data || error.message);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ reply: "Jay ran into a glitch. Try again later." }),
    };
  }
};
