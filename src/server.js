import { createApp } from "./app.js";
import { createImageGeneratorFromApiKey } from "./image-service.js";

const port = Number.parseInt(process.env.PORT ?? "3000", 10);
const generateImage = createImageGeneratorFromApiKey(process.env.OPENAI_API_KEY);
const app = createApp({ generateImage });

app.listen(port, () => {
  console.log(`Text to Image Studio is running at http://localhost:${port}`);
});
