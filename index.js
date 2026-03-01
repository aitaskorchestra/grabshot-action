const https = require('https');
const fs = require('fs');
const core = require('@actions/core');

async function run() {
  try {
    const url = core.getInput('url', { required: true });
    const apiKey = core.getInput('api-key', { required: true });
    const width = core.getInput('width') || '1280';
    const height = core.getInput('height') || '800';
    const fullPage = core.getInput('full-page') === 'true';
    const output = core.getInput('output') || 'screenshot.png';
    const delay = core.getInput('delay') || '0';

    const params = new URLSearchParams({
      url, apiKey, width, height, fullPage: fullPage.toString(), delay
    });

    const endpoint = `https://grabshot.dev/api/screenshot?${params}`;
    core.info(`Taking screenshot of ${url} (${width}x${height})`);

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

    const dir = require('path').dirname(output);
    if (dir && dir !== '.') fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(output, data);

    core.info(`Screenshot saved to ${output} (${data.length} bytes)`);
    core.setOutput('file', output);
    core.setOutput('size', data.length.toString());
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
