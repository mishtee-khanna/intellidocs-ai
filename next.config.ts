import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdf-parse", "@huggingface/transformers", "onnxruntime-node", "sharp"],
};

export default nextConfig;
