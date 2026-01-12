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
        console.log("Memulai request ke Replicate untuk:", prompt);

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
                    prompt: prompt,
                    aspect_ratio: "1:1" // Tambahan parameter standar Wan AI
                }
            })
        });

        const data = await response.json();
        console.log("Respon dari Replicate:", JSON.stringify(data));

        // Mencari URL video di berbagai kemungkinan struktur data
        let videoUrl = null;
        if (data.output) {
            videoUrl = Array.isArray(data.output) ? data.output[0] : data.output;
        }

        if (videoUrl && typeof videoUrl === 'string') {
            console.log("Video berhasil didapat:", videoUrl);
            res.json({ videoUrl: videoUrl });
        } else {
            console.error("Link video tidak ditemukan dalam respon.");
            res.status(500).json({ error: "API tidak mengembalikan video. Cek saldo Replicate Anda." });
        }
    } catch (error) {
        console.error("Error Sistem:", error);
        res.status(500).json({ error: "Sistem sibuk, coba lagi." });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server Aktif di Port ${PORT}`));
