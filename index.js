const core = require('@actions/core');
const https = require('https');
const fs = require('fs');
const path = require('path');

async function run() {
  try {
    const apiKey = core.getInput('api-key', { required: true });
    const url = core.getInput('url', { required: true });
    const output = core.getInput('output') || 'screenshot.png';
    const width = parseInt(core.getInput('width') || '1440');
    const height = parseInt(core.getInput('height') || '900');
    const fullPage = core.getInput('full-page') === 'true';
    const format = core.getInput('format') || 'png';
    const delay = parseInt(core.getInput('delay') || '0');

    const params = new URLSearchParams({
      url,
      width: width.toString(),
      height: height.toString(),
      fullPage: fullPage.toString(),
      format,
      delay: delay.toString()
    });

    const apiUrl = `https://grabshot.dev/v1/screenshot?${params}`;
    
    core.info(`Capturing screenshot of ${url}...`);
    
    const response = await new Promise((resolve, reject) => {
      const req = https.get(apiUrl, {
        headers: { 'Authorization': `Bearer ${apiKey}` }
      }, (res) => {
        if (res.statusCode === 200) {
          const chunks = [];
          res.on('data', chunk => chunks.push(chunk));
          res.on('end', () => resolve({ 
            ok: true, 
            buffer: Buffer.concat(chunks),
            headers: res.headers 
          }));
        } else {
          let body = '';
          res.on('data', d => body += d);
          res.on('end', () => resolve({ ok: false, status: res.statusCode, body }));
        }
      });
      req.on('error', reject);
    });

    if (!response.ok) {
      throw new Error(`GrabShot API error (${response.status}): ${response.body}`);
    }

    const dir = path.dirname(output);
    if (dir && dir !== '.') {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(output, response.buffer);
    core.info(`Screenshot saved to ${output} (${response.buffer.length} bytes)`);
    
    core.setOutput('file', output);
    
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
