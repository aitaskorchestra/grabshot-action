const core = require('@actions/core');
const fs = require('fs');
const https = require('https');
const path = require('path');

async function fetchScreenshot(apiKey, url, opts) {
  const params = new URLSearchParams({
    apiKey,
    url,
    width: opts.width,
    height: opts.height,
    format: opts.format,
    fullPage: opts.fullPage,
  });
  if (opts.device) params.set('device', opts.device);

  const apiUrl = `https://grabshot.dev/v1/screenshot?${params}`;
  
  return new Promise((resolve, reject) => {
    https.get(apiUrl, { timeout: 60000 }, (res) => {
      if (res.statusCode !== 200) {
        let body = '';
        res.on('data', d => body += d);
        res.on('end', () => reject(new Error(`API returned ${res.statusCode}: ${body}`)));
        return;
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

function compareImages(img1, img2) {
  if (img1.length !== img2.length) return 100;
  let diff = 0;
  for (let i = 0; i < img1.length; i++) {
    if (img1[i] !== img2[i]) diff++;
  }
  return (diff / img1.length) * 100;
}

async function run() {
  try {
    const apiKey = core.getInput('api-key', { required: true });
    const url = core.getInput('url', { required: true });
    const output = core.getInput('output') || 'screenshot.png';
    const width = core.getInput('width') || '1440';
    const height = core.getInput('height') || '900';
    const fullPage = core.getInput('full-page') || 'false';
    const device = core.getInput('device') || '';
    const format = core.getInput('format') || 'png';
    const compare = core.getInput('compare') || '';
    const threshold = parseFloat(core.getInput('threshold') || '1');

    core.info(`📸 Capturing screenshot of ${url}...`);
    const screenshot = await fetchScreenshot(apiKey, url, { width, height, fullPage, device, format });
    
    const dir = path.dirname(output);
    if (dir && dir !== '.') fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(output, screenshot);
    core.info(`✅ Screenshot saved to ${output} (${(screenshot.length / 1024).toFixed(1)}KB)`);
    core.setOutput('file', output);

    if (compare && fs.existsSync(compare)) {
      core.info(`🔍 Comparing with baseline: ${compare}`);
      const baseline = fs.readFileSync(compare);
      const diffPct = compareImages(baseline, screenshot);
      const changed = diffPct > threshold;
      
      core.setOutput('changed', changed.toString());
      core.setOutput('diff-percentage', diffPct.toFixed(2));
      
      if (changed) {
        core.warning(`⚠️ Visual regression detected! ${diffPct.toFixed(2)}% pixels changed (threshold: ${threshold}%)`);
      } else {
        core.info(`✅ No visual regression (${diffPct.toFixed(2)}% change, threshold: ${threshold}%)`);
      }
    } else {
      core.setOutput('changed', 'false');
      core.setOutput('diff-percentage', '0');
    }
  } catch (error) {
    core.setFailed(`Screenshot failed: ${error.message}`);
  }
}

run();
