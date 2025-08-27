const express = require('express');
const cors = require('cors');
const ytdl = require('@distube/ytdl-core');
const yts = require('yt-search');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const tempDir = path.join(__dirname, 'temp');
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
}

app.get('/api/search', async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ error: 'Query parameter is required' });
        }

        console.log('Searching for:', query);
        const searchResults = await yts(query);
        
        const videos = searchResults.videos
            .slice(0, 10)
            .map(video => ({
                id: video.videoId,
                title: video.title,
                url: video.url,
                duration: video.timestamp || video.duration?.timestamp || '',
                thumbnail: video.thumbnail || video.image,
                author: video.author?.name || ''
            }));

        console.log(`Found ${videos.length} videos`);
        res.json(videos);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: 'Failed to search videos. ' + error.message });
    }
});

app.get('/api/download', async (req, res) => {
    try {
        const { url, title } = req.query;
        if (!url) {
            return res.status(400).json({ error: 'URL parameter is required' });
        }

        console.log('Downloading:', url);
        
        // Validate URL
        if (!ytdl.validateURL(url)) {
            return res.status(400).json({ error: 'Invalid YouTube URL' });
        }

        const info = await ytdl.getInfo(url);
        const videoTitle = title || info.videoDetails.title;
        const safeTitle = videoTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase();

        res.setHeader('Content-Disposition', `attachment; filename="${safeTitle}.mp3"`);
        res.setHeader('Content-Type', 'audio/mpeg');

        const stream = ytdl(url, {
            quality: 'highestaudio',
            filter: 'audioonly'
        });

        stream.on('error', (err) => {
            console.error('Stream error:', err);
            if (!res.headersSent) {
                res.status(500).json({ error: 'Failed to download stream' });
            }
        });

        ffmpeg(stream)
            .audioBitrate(192)
            .audioCodec('libmp3lame')
            .format('mp3')
            .on('error', (err) => {
                console.error('FFmpeg error:', err);
                if (!res.headersSent) {
                    res.status(500).json({ error: 'Failed to process audio' });
                }
            })
            .on('end', () => {
                console.log('Download completed');
            })
            .pipe(res);

    } catch (error) {
        console.error('Download error:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Failed to download audio. ' + error.message });
        }
    }
});

app.get('/api/test', (req, res) => {
    res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Test the API at http://localhost:${PORT}/api/test`);
});