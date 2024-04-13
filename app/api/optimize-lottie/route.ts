import { NextApiRequest, NextApiResponse } from "next";
import sharp from "sharp";

// Helper functions
const convertImageToWebp = async (base64image: string): Promise<string> => {
  const imageBuffer = Buffer.from(base64image, "base64");
  const webpBuffer = await sharp(imageBuffer).toFormat("webp").toBuffer();
  return webpBuffer.toString("base64");
};

const getImageFormatFromDataURI = (dataURI: string): string | null => {
  const regex = /^data:image\/(png|jpeg|gif|tiff);base64,/;
  const match = dataURI.match(regex);
  return match?.[1] ?? null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const lottieJson: any = req.body;
      const assets: any[] = lottieJson.assets || [];
      const supportedFormats = ["png", "jpeg", "gif", "tiff"];

      await Promise.all(
        assets.map(async (asset) => {
          if (asset.p && asset.p.startsWith("data:image")) {
            const format = getImageFormatFromDataURI(asset.p);
            if (supportedFormats.includes(format || "")) {
              const base64Data = asset.p.split(",")[1];
              const base64Webp = await convertImageToWebp(base64Data);
              asset.p = `data:image/webp;base64,${base64Webp}`;
            }
          }
        })
      );

      res.status(200).json(lottieJson);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
