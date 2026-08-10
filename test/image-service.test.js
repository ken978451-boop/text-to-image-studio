import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { createImageGenerator } from "../src/image-service.js";

describe("createImageGenerator", () => {
  it("calls the OpenAI Image API with safe, low-cost defaults", async () => {
    let request;
    const client = {
      images: {
        async generate(value) {
          request = value;
          return { data: [{ b64_json: "aW1hZ2U=" }] };
        },
      },
    };

    const generateImage = createImageGenerator({ client });
    const result = await generateImage("a paper-cut city skyline");

    assert.deepEqual(request, {
      model: "gpt-image-2",
      prompt: "a paper-cut city skyline",
      quality: "low",
      size: "1024x1024",
      output_format: "png",
    });
    assert.deepEqual(result, {
      imageBase64: "aW1hZ2U=",
      mimeType: "image/png",
    });
  });

  it("rejects malformed responses from the external API", async () => {
    const client = {
      images: { async generate() { return { data: [] }; } },
    };
    const generateImage = createImageGenerator({ client });

    await assert.rejects(
      () => generateImage("a valid prompt"),
      /OpenAI did not return valid image data/,
    );
  });
});
