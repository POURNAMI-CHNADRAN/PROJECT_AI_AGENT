import express from "express";

const router = express.Router();

router.post("/", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "tinyllama",
        prompt: `
        Answer the question in ONE short sentence.

        No introduction.
        No explanation.
        No extra words.
        Only the answer.

        Question: ${message}
        Answer:
        `,
        stream: false,
      }),
    });

    const data = await response.json();

    res.json({ reply: data.response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI failed" });
  }
});

export default router;