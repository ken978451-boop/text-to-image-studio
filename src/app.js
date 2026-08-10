import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { fileURLToPath } from "node:url";

import { validatePrompt } from "./validation.js";

const publicDirectory = fileURLToPath(new URL("../public/", import.meta.url));

function apiError(code, message) {
  return { error: { code, message } };
}

export function createApp({ generateImage, rateLimitEnabled = true }) {
  const app = express();

  app.disable("x-powered-by");
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'"],
          imgSrc: ["'self'", "data:"],
          connectSrc: ["'self'"],
        },
      },
    }),
  );
  app.use(express.json({ limit: "4kb", strict: true }));
  app.use(express.static(publicDirectory));

  const imageRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: apiError(
      "RATE_LIMITED",
      "產生圖片的次數過多，請稍後再試。",
    ),
  });

  app.post(
    "/api/images",
    rateLimitEnabled ? imageRateLimit : (_request, _response, next) => next(),
    async (request, response) => {
      const validation = validatePrompt(request.body?.prompt);
      if (!validation.ok) {
        return response
          .status(422)
          .json(apiError("VALIDATION_ERROR", validation.message));
      }

      try {
        const image = await generateImage(validation.value);
        return response.json({ data: image });
      } catch {
        return response
          .status(502)
          .json(
            apiError(
              "IMAGE_GENERATION_FAILED",
              "目前無法產生圖片，請稍後再試。",
            ),
          );
      }
    },
  );

  app.use((error, _request, response, next) => {
    if (response.headersSent) {
      return next(error);
    }

    if (error?.type === "entity.too.large") {
      return response
        .status(413)
        .json(apiError("PAYLOAD_TOO_LARGE", "請求內容過大。"));
    }

    if (error instanceof SyntaxError) {
      return response
        .status(400)
        .json(apiError("INVALID_JSON", "請求內容不是有效的 JSON。"));
    }

    return response
      .status(500)
      .json(apiError("INTERNAL_ERROR", "伺服器發生未預期的錯誤。"));
  });

  return app;
}
