import {
  type ClientSchema,
  a,
  defineData,
  defineFunction,
} from "@aws-amplify/backend";

// Constants should be in a separate config file, but keeping it here for simplicity
export const BEDROCK_CONFIG = {
  MODEL_ID: "us.anthropic.claude-3-haiku-20240307-v1:0",
  MODEL_NAME: "Claude 3 Haiku",
  SYSTEM_PROMPT: "You are an HR expert based out of the state of Hawaii. You have particular knowledge about tax codes, payroll legalities, and more.",
} as const;

// // Define the conversation schema
// const conversationSchema = a.schema({
//   chat: a.conversation({
//     aiModel: a.ai.model(BEDROCK_CONFIG.MODEL_NAME),
//     systemPrompt: BEDROCK_CONFIG.SYSTEM_PROMPT,
//   }),
// });

// Define the function for haiku generation
export const generateHaikuFunction = defineFunction({
  entry: "./generateHaiku.ts",
  environment: {
    MODEL_ID: BEDROCK_CONFIG.MODEL_ID,
  },
});

// Define the API schema
const apiSchema = a.schema({
  generateHaiku: a
    .query()
    .arguments({ 
      prompt: a.string()
        .required()
    })
    .returns(a.string())
    .authorization((allow) => [allow.publicApiKey()])
    .handler(a.handler.function(generateHaikuFunction)),
});

// Export the combined schema type
export type Schema = ClientSchema<typeof apiSchema>;

// Define the data configuration
export const data = defineData({
  schema: apiSchema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
