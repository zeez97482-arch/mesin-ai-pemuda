import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Ini kunci rahasia Anda agar AI Wan Video bisa jalan
const TOKEN = "r8_WXtSArWDLewNye4bLacN2rSpSMoSWQh1VMWgo";

app.post("/generate-video", async (req, res) => {
    try {
        const { image, prompt } = req.body;
        
        // Memanggil API Replicate sesuai schema Wan-2.2
        const response = await fetch("https://api.replicate.com/v1/models/wan-video/wan-2.2-i2v-fast/predictions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${TOKEN}`,
                "Content-Type": "application/json",
                "Prefer": "wait"
            },
            body: JSON.stringify({
                input: {
                    image: image,
                    prompt: prompt
                }
            })
        });

        const data = await response.json();
        
        // Mengambil hasil video
        const videoUrl = data.output && data.output[0] ? data.output[0] : data.output;
        
        res.json({ videoUrl: videoUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Gagal memproses AI" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Mesin AI Aktif di Port ${PORT}`));