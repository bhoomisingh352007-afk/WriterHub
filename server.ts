import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Server-side Gemini initialization
const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// API Health route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Gemini AI Analysis Endpoint for Writers and Publishers
app.post("/api/gemini/analyze-script", async (req, res) => {
  try {
    const { title, synopsis, genre, sampleExcerpt, mode } = req.body;
    const ai = getGenAI();

    if (!ai) {
      // Fallback response if API key is not configured yet
      return res.json({
        success: true,
        fallback: true,
        analysis: {
          logline: `A gripping ${genre || "drama"} story titled "${title || "Untitled"}" with strong market appeal.`,
          commercialScore: 88,
          targetAudience: "Young Adults, OTT Drama Enthusiasts, Script Buyers",
          strengths: ["Strong thematic hook", "Distinct dialogue rhythm", "High adaptation potential"],
          drmRiskLevel: "Low (Encrypted DRM Active)",
          suggestedImprovement: "Consider expanding chapter 2 pacing for screen adaptation.",
        },
      });
    }

    let prompt = "";
    if (mode === "publisher-eval") {
      prompt = `You are a senior film & book acquisitions editor evaluating a script titled "${title}" (Genre: ${genre}).
Synopsis: ${synopsis}
Excerpt: ${sampleExcerpt || synopsis}

Provide a structured JSON evaluation:
{
  "logline": "1-sentence hook",
  "commercialScore": score between 50 and 99,
  "targetAudience": "demographic",
  "strengths": ["3 bullet points"],
  "drmRiskLevel": "Low/Medium/High",
  "suggestedImprovement": "1 clear recommendation for publisher or writer"
}`;
    } else {
      prompt = `You are an expert script doctor and DRM security advisor for writers. Analyze this script work:
Title: "${title}"
Genre: ${genre}
Synopsis: ${synopsis}

Provide a structured JSON response:
{
  "logline": "1 punchy commercial logline for pitching to publishers",
  "commercialScore": score between 60 and 98,
  "targetAudience": "demographics, platform (e.g., Netflix, Prime, Print Publishing)",
  "strengths": ["3 key story strengths"],
  "drmRiskLevel": "Low - DRM Encryption Recommended",
  "suggestedImprovement": "Key tip to protect and polish this manuscript before sharing"
}`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const jsonText = response.text || "{}";
    const data = JSON.parse(jsonText);
    res.json({ success: true, analysis: data });
  } catch (error: any) {
    console.error("Gemini AI Script Analysis Error:", error);
    res.status(500).json({ success: false, error: error.message || "Analysis failed" });
  }
});

// Mock DRM Token Verification API
app.post("/api/drm/verify-token", (req, res) => {
  const { token, manuscriptId, userRole } = req.body;
  if (!token) {
    return res.status(400).json({ valid: false, message: "Token missing" });
  }
  // Simulate cryptographic verification
  res.json({
    valid: true,
    manuscriptId,
    verifiedAt: new Date().toISOString(),
    watermarkCode: `DRM-${Math.random().toString(36).substring(2, 9).toUpperCase()}-${userRole.toUpperCase()}`,
    expiresInSeconds: 86400,
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ScriptShield DRM Server running on http://localhost:${PORT}`);
  });
}

startServer();
