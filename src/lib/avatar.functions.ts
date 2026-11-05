import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { avatarSpecSchema, buildAvatarPrompt } from "./avatar-spec";

const input = z.object({
  spec: avatarSpecSchema,
  base: z.string().max(4_000_000),
  face: z.string().max(3_000_000).nullable(),
});

function toBlob(dataUrl: string) {
  const m = /^data:(image\/[a-z]+);base64,(.+)$/.exec(dataUrl);
  if (!m) throw new Error("Invalid image");
  const bin = Uint8Array.from(atob(m[2]!), (c) => c.charCodeAt(0));
  return new Blob([bin], { type: m[1] ?? "image/jpeg" });
}

export const renderAvatar = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => input.parse(d))
  .handler(async ({ data }) => {
    const { editImage, GatewayError } = await import("@lovable.dev/ai-gateway");
    const images = [toBlob(data.base)];
    if (data.face) images.push(toBlob(data.face));
    try {
      const res = await editImage({
        model: "openai/gpt-image-2.5-sunburst",
        image: images,
        prompt: buildAvatarPrompt(data.spec, !!data.face),
        size: "1024x1536",
        quality: "medium",
        output_format: "jpeg",
        output_compression: 78,
      });
      const b64 = res.data?.[0]?.b64_json;
      if (!b64) return { ok: false as const, error: "No image returned. Please try again." };
      return { ok: true as const, image: `data:image/jpeg;base64,${b64}` };
    } catch (e) {
      if (e instanceof GatewayError) {
        const msg = e.httpStatus === 402 ? "AI credits are used up for this workspace." : e.httpStatus === 429 ? "Too many renders right now — wait a moment." : "Render failed. Please try again.";
        return { ok: false as const, error: msg };
      }
      throw e;
    }
  });
