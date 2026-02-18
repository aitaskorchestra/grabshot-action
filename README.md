# GrabShot Screenshot Action

Capture website screenshots in your CI/CD pipeline with [GrabShot](https://grabshot.dev) — a fast, reliable screenshot API with device frames and AI cleanup.

## Features

- 📸 **Capture screenshots** of any URL in your workflow
- 📱 **Device frames** — iPhone, Pixel, MacBook, and more
- 🔍 **Visual regression testing** — compare against baselines
- ⚡ **Fast** — screenshots in under 3 seconds
- 🆓 **Free tier** — 25 screenshots/month, no credit card needed

## Quick Start

```yaml
- uses: aitaskorchestra/grabshot-action@v1
  with:
    api-key: ${{ secrets.GRABSHOT_API_KEY }}
    url: 'https://example.com'
    output: 'screenshots/homepage.png'
```

Get your free API key at [grabshot.dev](https://grabshot.dev).

## Usage Examples

### Basic Screenshot
```yaml
name: Screenshot
on: [push]
jobs:
  screenshot:
    runs-on: ubuntu-latest
    steps:
      - uses: aitaskorchestra/grabshot-action@v1
        with:
          api-key: ${{ secrets.GRABSHOT_API_KEY }}
          url: 'https://myapp.com'
```

### Visual Regression Testing
```yaml
name: Visual Regression
on: [pull_request]
jobs:
  visual-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: aitaskorchestra/grabshot-action@v1
        id: screenshot
        with:
          api-key: ${{ secrets.GRABSHOT_API_KEY }}
          url: 'https://staging.myapp.com'
          output: 'current.png'
          compare: 'baselines/homepage.png'
          threshold: '2'
      - name: Check for changes
        if: steps.screenshot.outputs.changed == 'true'
        run: echo "Visual regression detected! ${{ steps.screenshot.outputs.diff-percentage }}% changed"
```

### Device Frame Screenshots
```yaml
- uses: aitaskorchestra/grabshot-action@v1
  with:
    api-key: ${{ secrets.GRABSHOT_API_KEY }}
    url: 'https://myapp.com'
    device: 'iphone-15'
    output: 'screenshots/mobile.png'
```

### Full Page Capture
```yaml
- uses: aitaskorchestra/grabshot-action@v1
  with:
    api-key: ${{ secrets.GRABSHOT_API_KEY }}
    url: 'https://myapp.com/docs'
    full-page: 'true'
    output: 'screenshots/docs-full.png'
```

## Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `api-key` | GrabShot API key | ✅ | — |
| `url` | URL to screenshot | ✅ | — |
| `output` | Output file path | ❌ | `screenshot.png` |
| `width` | Viewport width | ❌ | `1440` |
| `height` | Viewport height | ❌ | `900` |
| `full-page` | Capture full page | ❌ | `false` |
| `device` | Device frame | ❌ | — |
| `format` | Image format (png/jpeg/webp) | ❌ | `png` |
| `compare` | Baseline image path | ❌ | — |
| `threshold` | Diff threshold % | ❌ | `1` |

## Outputs

| Output | Description |
|--------|-------------|
| `file` | Path to captured screenshot |
| `changed` | Whether screenshot differs from baseline |
| `diff-percentage` | Percentage of changed pixels |

## License

MIT
