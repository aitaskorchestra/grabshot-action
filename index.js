const core = require('@actions/core');
const fs = require('fs');
const https = require('https');

async function run() {
  try {
    const url = core.getInput('url', { required: true });
    const apiKey = core.getInput('api-key', { required: true });
    const width = core.getInput('width') || '1280';
    const height = core.getInput('height') || '720';
    const fullPage = core.getInput('full-page') === 'true';
    const deviceFrame = core.getInput('device-frame') || 'none';
    const format = core.getInput('format') || 'png';
    const output = core.getInput('output') || `screenshot.${format}`;
    const delay = core.getInput('delay') || '0';

    const params = new URLSearchParams({ url, apiKey, width, height, format, delay });
    if (fullPage) params.set('fullPage', 'true');
    if (deviceFrame !== 'none') params.set('deviceFrame', deviceFrame);

    core.info(`Capturing screenshot of ${url}...`);

    await new Promise((resolve, reject) => {
      https.get(`https://grabshot.dev/v1/screenshot?${params}`, (res) => {
        if (res.statusCode !== 200) {
          let body = '';
          res.on('data', d => body += d);
          res.on('end', () => reject(new Error(`API error (${res.statusCode}): ${body}`)));
          return;
        }
        const chunks = [];
        res.on('data', chunk => chunks.push(chunk));
        res.on('end', () => {
          fs.writeFileSync(output, Buffer.concat(chunks));
          resolve();
        });
      }).on('error', reject).setTimeout(60000, function() { this.destroy(); reject(new Error('Timeout')); });
    });

    core.setOutput('file', output);
    core.info(`Saved to ${output} (${fs.statSync(output).size} bytes)`);
  } catch (error) {
    core.setFailed(error.message);
  }
}
run();
