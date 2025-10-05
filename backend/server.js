const express = require('express');
const cors = require('cors');

// Polyfills for Linux compatibility
if (typeof globalThis.File === 'undefined') {
    globalThis.File = class File {
        constructor(chunks, name, opts = {}) {
            this.name = name;
            this.lastModified = opts.lastModified || Date.now();
            this.type = opts.type || '';
            this.size = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
            this._chunks = chunks;
        }

        arrayBuffer() {
            return Promise.resolve(Buffer.concat(this._chunks).buffer);
        }

        text() {
            return Promise.resolve(Buffer.concat(this._chunks).toString());
        }

        stream() {
            const { Readable } = require('stream');
            return Readable.from(this._chunks);
        }
    };
}

// Ensure crypto is available
if (typeof globalThis.crypto === 'undefined') {
    const crypto = require('crypto');
    globalThis.crypto = {
        getRandomValues: (array) => {
            return crypto.randomFillSync(array);
        },
        randomUUID: () => {
            return crypto.randomUUID();
        }
    };
}

const ytdl = require('@distube/ytdl-core');
const yts = require('yt-search');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');
const https = require('https');
const ytDlpExec = require('yt-dlp-exec');
const { exec } = require('child_process');
require('dotenv').config();

// Check if ffmpeg is available
let ffmpegAvailable = false;
exec('ffmpeg -version', (error) => {
    if (!error) {
        ffmpegAvailable = true;
        console.log('✅ FFmpeg is available');
    } else {
        console.log('⚠️ FFmpeg not found, will use yt-dlp for audio extraction');
    }
});

// Create custom agent with headers to bypass 403 errors
const agent = ytdl.createAgent(undefined, {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'DNT': '1',
        'Referer': 'https://www.youtube.com/',
        'Origin': 'https://www.youtube.com',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin'
    }
});

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));
}

const tempDir = path.join(__dirname, 'temp');
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
}

app.get('/api/search', async (req, res) => {
    try {
        var { query } = req.query;
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

// Helper function to download using yt-dlp as fallback
async function downloadWithYtDlp(url, outputPath) {
    console.log('Falling back to yt-dlp...');

    // Check if cookies.txt exists for authentication
    const cookiesPath = path.join(__dirname, 'cookies.txt');
    const ytDlpOptions = {
        extractAudio: true,
        audioFormat: 'mp3',
        audioQuality: 0,
        output: outputPath,
        noCheckCertificates: true,
        noWarnings: true,
        preferFreeFormats: true,
        addHeader: [
            'User-Agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept-Language:en-US,en;q=0.9',
            'Accept:text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        ],
        // Add more options to bypass restrictions
        format: 'bestaudio[ext=m4a]/bestaudio[ext=webm]/bestaudio',
        retries: 3,
        fragmentRetries: 3,
        skipDownload: false,
        noPlaylist: true,
        // Use yt-dlp's built-in ffmpeg if system ffmpeg not available
        ffmpegLocation: process.env.FFMPEG_PATH || 'ffmpeg'
    };

    // Add cookies if file exists
    if (fs.existsSync(cookiesPath)) {
        console.log('Using cookies.txt for authentication');
        ytDlpOptions.cookies = cookiesPath;
    }

    try {
        const result = await ytDlpExec(url, ytDlpOptions);
        console.log('yt-dlp download completed successfully');
        return result;
    } catch (error) {
        console.error('yt-dlp error:', error);
        throw new Error(`yt-dlp failed: ${error.message}`);
    }
}

app.get('/api/download', async (req, res) => {
    let tempFilePath = null;
    // Force yt-dlp on Render, if explicitly set, or if ffmpeg is not available
    let useYtDlp = !ffmpegAvailable || process.env.USE_YTDLP_ONLY === 'true' || process.env.RENDER === 'true';

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

        let videoTitle = title;
        let info = null;

        // Try to get info with ytdl-core first
        try {
            info = await ytdl.getInfo(url, { agent });
            videoTitle = title || info.videoDetails.title;
        } catch (error) {
            console.log('ytdl-core getInfo failed:', error.message);
            // If ytdl-core fails, we'll use yt-dlp instead
            useYtDlp = true;
            videoTitle = title || `video_${Date.now()}`;
        }

        const safeTitle = videoTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase();

        // Create a temporary file path
        tempFilePath = path.join(tempDir, `${safeTitle}_${Date.now()}.mp3`);

        // If ytdl-core already failed or we want to use yt-dlp
        if (useYtDlp) {
            await downloadWithYtDlp(url, tempFilePath);
        } else {
            // Try with ytdl-core first
            let ytdlFailed = false;
            try {
                const stream = ytdl(url, {
                    quality: 'highestaudio',
                    filter: 'audioonly',
                    agent: agent,
                    requestOptions: {
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                            'Cookie': ''  // You can add cookies here if needed
                        }
                    }
                });

                let downloadedBytes = 0;
                let streamError = null;
                let ffmpegStarted = false;

                stream.on('progress', (chunkLength, downloaded, total) => {
                    downloadedBytes = downloaded;
                    const percent = (downloaded / total) * 100;
                    console.log(`Download progress: ${percent.toFixed(2)}%`);
                });

                stream.on('error', (err) => {
                    console.error('Stream error:', err);
                    streamError = err;
                    ytdlFailed = true;
                });

                // Check if stream fails early
                const timeoutPromise = new Promise((resolve, reject) => {
                    setTimeout(() => {
                        if (!ffmpegStarted && (streamError || downloadedBytes === 0)) {
                            reject(new Error('Stream failed to start'));
                        }
                    }, 5000); // Wait 5 seconds to see if stream starts
                });

                // Process and save to temporary file first
                const processPromise = new Promise((resolve, reject) => {
                    const ffmpegProcess = ffmpeg(stream)
                        .audioBitrate(192)
                        .audioCodec('libmp3lame')
                        .format('mp3')
                        .outputOptions([
                            '-avoid_negative_ts', 'make_zero'
                        ])
                        .on('start', () => {
                            ffmpegStarted = true;
                            console.log('FFmpeg processing started');
                        })
                        .on('error', (err) => {
                            console.error('FFmpeg error:', err);
                            if (err.message.includes('403') || err.message.includes('Status code') || streamError) {
                                ytdlFailed = true;
                            }
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

                await Promise.race([processPromise, timeoutPromise]);

            } catch (error) {
                console.log('ytdl-core failed:', error.message);
                ytdlFailed = true;
            }

            // If ytdl-core failed, use yt-dlp
            if (ytdlFailed) {
                console.log('Using yt-dlp as fallback...');
                await downloadWithYtDlp(url, tempFilePath);
            }
        }

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

app.get('/api/stream', async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) {
            return res.status(400).json({ error: 'URL parameter is required' });
        }

        console.log('Streaming preview:', url);
        
        // Validate URL
        if (!ytdl.validateURL(url)) {
            return res.status(400).json({ error: 'Invalid YouTube URL' });
        }

        // Get audio stream
        const stream = ytdl(url, {
            quality: 'lowestaudio',
            filter: 'audioonly',
            dlChunkSize: 0,
            highWaterMark: 1 << 16
        });

        // Set headers for streaming
        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Accept-Ranges', 'bytes');

        // Pipe through ffmpeg for format conversion
        ffmpeg(stream)
            .audioBitrate(128)
            .audioCodec('libmp3lame')
            .format('mp3')
            .outputOptions([
                '-avoid_negative_ts', 'make_zero'
            ])
            .on('error', (err) => {
                console.error('Stream error:', err);
                if (!res.headersSent) {
                    res.status(500).json({ error: 'Failed to stream audio' });
                }
            })
            .pipe(res, { end: true });

    } catch (error) {
        console.error('Stream error:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Failed to stream audio. ' + error.message });
        }
    }
});

app.get('/api/test', (req, res) => {
    res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

// Catch-all route for React app (must be after API routes)
if (process.env.NODE_ENV === 'production') {
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
    });
}

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Test the API at http://localhost:${PORT}/api/test`);
});