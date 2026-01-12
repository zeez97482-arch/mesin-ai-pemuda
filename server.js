import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const TOKEN = "r8_WXtSArWDLewNye4bLacN2rSpSMoSWQh1VMWgo";

app.post("/generate-video", async (req, res) => {
    try {
        // ... kode fetch yang tadi ...
const data = await response.json();
console.log("Respon Replicate:", JSON.stringify(data)); // Untuk cek di log Render

// Perbaikan cara mengambil URL Video
let videoUrl = "";
if (data.output) {
    if (Array.isArray(data.output)) {
        videoUrl = data.output[0]; // Jika hasil dalam list
    } else {
        videoUrl = data.output; // Jika hasil langsung link
    }
}

if (videoUrl) {
    res.json({ videoUrl: videoUrl });
} else {
    // Jika Replicate memberikan error atau status gagal
    res.status(500).json({ error: "API tidak mengembalikan video. Cek saldo Replicate." });
}
});

// Render akan otomatis mengisi process.env.PORT
const PORT = process.env.PORT || 10000; 
app.listen(PORT, '0.0.0.0', () => console.log(`Server Render Aktif`));

