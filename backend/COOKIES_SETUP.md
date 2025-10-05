# YouTube Authentication Setup

If you're experiencing 403 errors when downloading videos, you may need to use cookies for authentication.

## How to Export Cookies from YouTube

1. **Install a browser extension** to export cookies:
   - For Chrome: "Get cookies.txt LOCALLY"
   - For Firefox: "cookies.txt"

2. **Log in to YouTube** in your browser (if you haven't already)

3. **Navigate to YouTube.com**

4. **Export the cookies**:
   - Click on the extension icon
   - Select "Export" or "Download"
   - Save the file as `cookies.txt`

5. **Place the cookies.txt file** in the backend directory:
   ```
   musicDownloader/
   └── backend/
       ├── server.js
       └── cookies.txt  <-- Place here
   ```

## Alternative: Using yt-dlp to Extract Cookies

You can also extract cookies directly using yt-dlp:

```bash
# For Chrome
yt-dlp --cookies-from-browser chrome --cookies cookies.txt https://www.youtube.com

# For Firefox
yt-dlp --cookies-from-browser firefox --cookies cookies.txt https://www.youtube.com

# For Edge
yt-dlp --cookies-from-browser edge --cookies cookies.txt https://www.youtube.com
```

## Format of cookies.txt

The cookies.txt file should be in Netscape format. Example:
```
# Netscape HTTP Cookie File
.youtube.com	TRUE	/	TRUE	1234567890	COOKIE_NAME	COOKIE_VALUE
```

## Security Note

⚠️ **IMPORTANT**:
- Never share your cookies.txt file with others
- Add cookies.txt to your .gitignore file
- Cookies contain your authentication information

## Troubleshooting

If you're still experiencing issues:

1. **Update yt-dlp**:
   ```bash
   npm update yt-dlp-exec
   ```

2. **Clear browser cache** and re-export cookies

3. **Check if YouTube requires additional verification** (captcha, etc.)

4. **Try using a VPN** if your region has restrictions

5. **Install yt-dlp system-wide** (optional but recommended):
   ```bash
   # Windows (using pip)
   pip install -U yt-dlp

   # Or download directly
   # Visit: https://github.com/yt-dlp/yt-dlp/releases
   ```