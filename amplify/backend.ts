// amplify/backend/function/generateHaiku/src/index.ts
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const bedrock = new BedrockRuntimeClient({ region: "us-west-2" }); // adjust region as needed

export async function handler(event: any) {
  try {
    const prompt = event.arguments.prompt;

    const command = new InvokeModelCommand({
      modelId: "us.anthropic.claude-3-haiku-20240307-v1:0",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        messages: [
          {
            role: "system",
            content: "You are a helpful haiku generator. Always respond with a haiku that follows the 5-7-5 syllable pattern."
          },
          {
            role: "user",
            content: `Generate a haiku about: ${prompt}`
          }
        ],
        max_tokens: 200,
        temperature: 0.7
      })
    });

    const response = await bedrock.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    
    return responseBody.messages[0].content;
  } catch (error) {
    console.error('Error:', error);
    throw new Error('Failed to generate haiku');
  }
}
