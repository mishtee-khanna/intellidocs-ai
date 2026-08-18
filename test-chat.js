const { pipeline, env } = require("@xenova/transformers");

// Optional: prevent downloading from remote if you only want local, but here we let it download
async function run() {
  console.log("Loading extractor...");
  const extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  console.log("Loading QA model...");
  const qa = await pipeline("question-answering", "Xenova/distilbert-base-cased-distilled-squad");
  
  console.log("Running extractor...");
  const output = await extractor("What is the capital of France?", { pooling: "mean", normalize: true });
  console.log("Vector size:", Array.from(output.data).length);
  
  console.log("Running QA...");
  const answer = await qa("What is the capital of France?", "The capital of France is Paris.");
  console.log("Answer:", answer);
}

run().catch(console.error);
