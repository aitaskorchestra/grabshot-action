const core = require('@actions/core');
const fs = require('fs');
const path = require('path');
const https = require('https');

async function run() {
  try {
    const url = core.getInput('url', { required: true });
    const apiKey = core.getInput('api-key', { required: true });
    const output = core.getInput('output') || 'screenshot.png';
    const width = parseInt(core.getInput('width') || '1280');
    const height = parseInt(core.getInput('height') || '800');
    const fullPage = core.getInput('full-page') === 'true';
    const device = core.getInput('device') || 'none';
    const format = core.getInput('format') || 'png';
    const blockAds = core.getInput('block-ads') === 'true';
    const delay = parseInt(core.getInput('delay') || '0');

    core.info(`Capturing screenshot of ${url}...`);

    const body = JSON.stringify({
      url,
      width,
      height,
      fullPage,
      device: device !== 'none' ? device : undefined,
      format,
      blockAds,
      delay: delay > 0 ? delay : undefined,
    });

    const start = Date.now();

    const imageBuffer = await new Promise((resolve, reject) => {
      const req = https.request({
        hostname: 'grabshot.dev',
        path: '/v1/screenshot',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey,
          'Content-Length': Buffer.byteLength(body),
        },
        timeout: 60000,
      }, (res) => {
        const chunks = [];
        res.on('data', chunk => chunks.push(chunk));
        res.on('end', () => {
          const data = Buffer.concat(chunks);
          if (res.statusCode !== 200) {
            let msg;
            try { msg = JSON.parse(data.toString()).error; } catch { msg = data.toString().slice(0, 200); }
            reject(new Error(`API returned ${res.statusCode}: ${msg}`));
          } else {
            resolve(data);
          }
        });
      });
      req.on('error', reject);
      req.on('timeout', () => { req.destroy(); reject(new Error('Request timed out (60s)')); });
      req.write(body);
      req.end();
    });

    const duration = Date.now() - start;

    // Ensure output directory exists
    const dir = path.dirname(output);
    if (dir && dir !== '.') fs.mkdirSync(dir, { recursive: true });

    fs.writeFileSync(output, imageBuffer);

    core.info(`Screenshot saved to ${output} (${imageBuffer.length} bytes, ${duration}ms)`);
    core.setOutput('file', output);
    core.setOutput('size', imageBuffer.length.toString());
    core.setOutput('duration', duration.toString());

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
