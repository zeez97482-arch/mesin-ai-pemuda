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
        console.log("Mengirim permintaan ke Wan-2.2...");

        const response = await fetch("https://api.replicate.com/v1/models/wan-video/wan-2.2-i2v-fast/predictions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${TOKEN}`,
                "Content-Type": "application/json",
                "Prefer": "wait" // Memaksa Replicate menunggu sampai video jadi
            },
            body: JSON.stringify({
                input: {
                    image: image,
                    prompt: prompt,
                    frames_num: 81, // Standar Wan Video
                    aspect_ratio: "1:1"
                }
            })
        });

        const data = await response.json();
        console.log("Respon Replicate:", data);

        // Pencarian URL Video yang lebih teliti
        let videoUrl = "";
        if (data.output) {
            videoUrl = Array.isArray(data.output) ? data.output[0] : data.output;
        } else if (data.urls && data.urls.get) {
            // Jika video belum jadi, kita beri tahu user untuk tunggu
            return res.status(202).json({ error: "Video sedang diproses, coba klik lagi dalam 10 detik." });
        }

        if (videoUrl && videoUrl.startsWith('http')) {
            res.json({ videoUrl: videoUrl });
        } else {
            res.status(500).json({ error: "API Sibuk: Saldo Replicate habis atau Token salah." });
        }
    } catch (error) {
        console.error("SERVER ERROR:", error);
        res.status(500).json({ error: "Koneksi ke AI terputus." });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server Jalan di Port ${PORT}`));
