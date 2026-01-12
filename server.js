import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const TOKEN = "r8_WXtSArWDLewNye4bLacN2rSpSMoSWQh1VMWgo";

app.post("/generate-video", async (req, res) => {
    try {
        const { image, prompt } = req.body;
        const response = await fetch("https://api.replicate.com/v1/models/wan-video/wan-2.2-i2v-fast/predictions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${TOKEN}`,
                "Content-Type": "application/json",
                "Prefer": "wait"
            },
            body: JSON.stringify({ input: { image, prompt } })
        });

        const data = await response.json();
        const videoUrl = data.output && data.output[0] ? data.output[0] : data.output;
        res.json({ videoUrl });
    } catch (error) {
        res.status(500).json({ error: "Gagal memproses AI" });
    }
});

// Render akan otomatis mengisi process.env.PORT
const PORT = process.env.PORT || 10000; 
app.listen(PORT, '0.0.0.0', () => console.log(`Server Render Aktif`));
