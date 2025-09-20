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
        const { query, page = '1', limit = '10' } = req.query;

        if (!query) {
            return res.status(400).json({ error: 'Query parameter is required' });
        }

        const parsedPage = Math.max(parseInt(page, 10) || 1, 1);
        const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 50);

        const searchQuery = `${query} music`;

        console.log('Searching for:', searchQuery, 'page:', parsedPage);
        const searchResults = await yts(searchQuery);

        const startIndex = (parsedPage - 1) * parsedLimit;
        const allVideos = (searchResults.videos || []);
        const mappedVideos = allVideos
            .map(video => ({
                id: video.videoId,
                title: video.title,
                url: video.url,
                duration: video.timestamp || video.duration?.timestamp || '',
                thumbnail: video.thumbnail || video.image,
                author: video.author?.name || ''
            }));

        const totalResults = mappedVideos.length;
        const videos = mappedVideos.slice(startIndex, startIndex + parsedLimit);
        const totalPages = Math.max(Math.ceil(totalResults / parsedLimit), 1);

        console.log(`Found ${totalResults} videos, returning ${videos.length}`);
        res.json({
            videos,
            page: parsedPage,
            limit: parsedLimit,
            total: totalResults,
            totalPages
        });
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: 'Failed to search videos. ' + error.message });
    }
});

app.get('/api/preview', async (req, res) => {
    try {
        const { url } = req.query;

        if (!url) {
            return res.status(400).json({ error: 'URL parameter is required' });
        }

        if (!ytdl.validateURL(url)) {
            return res.status(400).json({ error: 'Invalid YouTube URL' });
        }

        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Cache-Control', 'no-store');

        const stream = ytdl(url, {
            quality: 'highestaudio',
            filter: 'audioonly',
            highWaterMark: 1 << 25
        });

        stream.on('error', (err) => {
            console.error('Preview stream error:', err);
            if (!res.headersSent) {
                res.status(500).json({ error: 'Failed to stream preview audio' });
            } else {
                res.end();
            }
        });

        const command = ffmpeg(stream)
            .audioBitrate(128)
            .audioCodec('libmp3lame')
            .format('mp3')
            .on('error', (err) => {
                console.error('Preview ffmpeg error:', err);
                if (!res.headersSent) {
                    res.status(500).json({ error: 'Failed to process preview audio' });
                } else {
                    res.end();
                }
            });

        res.on('close', () => {
            if (!res.writableEnded) {
                command.kill('SIGKILL');
                stream.destroy();
            }
        });

        command.pipe(res, { end: true });
    } catch (error) {
        console.error('Preview error:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Failed to generate preview. ' + error.message });
        }
    }
});

app.get('/api/download', async (req, res) => {
    let tempFilePath = null;
    
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
        
        // Create a temporary file path
        tempFilePath = path.join(tempDir, `${safeTitle}_${Date.now()}.mp3`);

        const stream = ytdl(url, {
            quality: 'highestaudio',
            filter: 'audioonly'
        });

        let downloadedBytes = 0;
        
        stream.on('progress', (chunkLength, downloaded, total) => {
            downloadedBytes = downloaded;
            const percent = (downloaded / total) * 100;
            console.log(`Download progress: ${percent.toFixed(2)}%`);
        });

        stream.on('error', (err) => {
            console.error('Stream error:', err);
            if (tempFilePath && fs.existsSync(tempFilePath)) {
                fs.unlinkSync(tempFilePath);
            }
            if (!res.headersSent) {
                res.status(500).json({ error: 'Failed to download stream' });
            }
        });

        // Process and save to temporary file first
        await new Promise((resolve, reject) => {
            ffmpeg(stream)
                .audioBitrate(192)
                .audioCodec('libmp3lame')
                .format('mp3')
                .outputOptions([
                    '-avoid_negative_ts', 'make_zero'
                ])
                .on('error', (err) => {
                    console.error('FFmpeg error:', err);
                    reject(err);
                })
                .on('codecData', (data) => {
                    console.log('Audio duration:', data.duration);
                })
                .on('progress', (progress) => {
                    if (progress.percent) {
                        console.log('Processing: ' + progress.percent.toFixed(2) + '% done');
                    }
                })
                .on('end', () => {
                    console.log('Processing finished successfully');
                    resolve();
                })
                .save(tempFilePath);
        });

        // Check if file was created and has content
        if (!fs.existsSync(tempFilePath)) {
            throw new Error('Failed to create audio file');
        }

        const stats = fs.statSync(tempFilePath);
        console.log(`File size: ${stats.size} bytes`);

        // Set headers for download
        res.setHeader('Content-Disposition', `attachment; filename="${safeTitle}.mp3"`);
        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Content-Length', stats.size);

        // Stream the file to the response
        const fileStream = fs.createReadStream(tempFilePath);
        
        fileStream.on('end', () => {
            console.log('File sent successfully');
            // Clean up temporary file
            if (fs.existsSync(tempFilePath)) {
                fs.unlinkSync(tempFilePath);
            }
        });

        fileStream.on('error', (err) => {
            console.error('File stream error:', err);
            if (fs.existsSync(tempFilePath)) {
                fs.unlinkSync(tempFilePath);
            }
        });

        fileStream.pipe(res);

    } catch (error) {
        console.error('Download error:', error);
        
        // Clean up temporary file if it exists
        if (tempFilePath && fs.existsSync(tempFilePath)) {
            fs.unlinkSync(tempFilePath);
        }
        
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