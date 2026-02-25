const core = require('@actions/core');
const fs = require('fs');
const https = require('https');
const path = require('path');

async function run() {
  try {
    const apiKey = core.getInput('api-key', { required: true });
    const url = core.getInput('url', { required: true });
    const output = core.getInput('output') || 'screenshot.png';
    const width = core.getInput('width') || '1280';
    const height = core.getInput('height') || '800';
    const fullPage = core.getInput('full-page') === 'true';
    const frame = core.getInput('frame') || 'none';
    const format = core.getInput('format') || 'png';
    const delay = core.getInput('delay') || '0';
    const aiCleanup = core.getInput('ai-cleanup') === 'true';

    const params = new URLSearchParams({
      url,
      apiKey,
      width,
      height,
      format,
    });

    if (fullPage) params.set('fullPage', 'true');
    if (frame !== 'none') params.set('frame', frame);
    if (parseInt(delay) > 0) params.set('delay', delay);
    if (aiCleanup) params.set('aiCleanup', 'true');

    const endpoint = `https://grabshot.dev/v1/screenshot?${params.toString()}`;

    core.info(`Capturing screenshot of ${url}...`);
    core.info(`Settings: ${width}x${height}, frame=${frame}, format=${format}`);

    const data = await new Promise((resolve, reject) => {
      https.get(endpoint, (res) => {
        if (res.statusCode !== 200) {
          let body = '';
          res.on('data', c => body += c);
          res.on('end', () => reject(new Error(`API returned ${res.statusCode}: ${body}`)));
          return;
        }
        const chunks = [];
        res.on('data', c => chunks.push(c));
        res.on('end', () => resolve(Buffer.concat(chunks)));
      }).on('error', reject);
    });

    // Ensure output directory exists
    const dir = path.dirname(output);
    if (dir && dir !== '.') fs.mkdirSync(dir, { recursive: true });

    fs.writeFileSync(output, data);

    core.info(`Screenshot saved to ${output} (${data.length} bytes)`);
    core.setOutput('file', output);
    core.setOutput('size', data.length.toString());

  } catch (error) {
    core.setFailed(`GrabShot screenshot failed: ${error.message}`);
  }
}

run();
