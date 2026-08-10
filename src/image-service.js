import OpenAI from "openai";

function isValidBase64(value) {
  if (typeof value !== "string" || value.length === 0) {
    return false;
  }

  try {
    const normalized = value.replace(/=+$/, "");
    return Buffer.from(value, "base64").toString("base64").replace(/=+$/, "") === normalized;
  } catch {
    return false;
  }
}

export function createImageGenerator({ client }) {
  return async function generateImage(prompt) {
    const response = await client.images.generate({
      model: "gpt-image-2",
      prompt,
      quality: "low",
      size: "1024x1024",
      output_format: "png",
    });

    const imageBase64 = response?.data?.[0]?.b64_json;
    if (!isValidBase64(imageBase64)) {
      throw new Error("OpenAI did not return valid image data");
    }

    return { imageBase64, mimeType: "image/png" };
  };
}

export function createImageGeneratorFromApiKey(apiKey) {
  if (!apiKey) {
    return async function missingApiKey() {
      throw new Error("OPENAI_API_KEY is not configured");
    };
  }

  return createImageGenerator({ client: new OpenAI({ apiKey }) });
}
