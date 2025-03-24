// netlify/functions/chatbot.js

const { Configuration, OpenAIApi } = require("openai");

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const userMessage = body.message;

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userMessage }],
    });

    const reply = response.data.choices[0].message.content;

    return {
      statusCode: 200,
      body: JSON.stringify({ reply }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: "Something went wrong!" }),
    };
  }
};
