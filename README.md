# GrabShot Screenshot Action

Capture website screenshots in your GitHub Actions workflow. Perfect for visual regression testing, generating OG images, documentation screenshots, and deployment previews.

## Features

- Capture any URL as PNG, JPEG, WebP, or PDF
- Device frames (iPhone, MacBook, iPad, browser chrome)
- Full-page screenshots
- AI-powered popup/banner removal (paid plans)
- 25 free screenshots/month

## Quick Start

```yaml
- uses: aitaskorchestra/grabshot-action@v1
  with:
    api-key: ${{ secrets.GRABSHOT_API_KEY }}
    url: 'https://your-site.com'
    output: 'screenshots/preview.png'
```

Get your free API key at [grabshot.dev](https://grabshot.dev) (no credit card needed).

## Inputs

| Input | Description | Default |
|-------|-------------|---------|
| `api-key` | Your GrabShot API key (required) | - |
| `url` | URL to capture (required) | - |
| `output` | Output file path | `screenshot.png` |
| `width` | Viewport width | `1280` |
| `height` | Viewport height | `800` |
| `full-page` | Capture full page | `false` |
| `frame` | Device frame: `none`, `browser`, `iphone`, `macbook`, `ipad` | `none` |
| `format` | Output: `png`, `jpeg`, `webp`, `pdf` | `png` |
| `delay` | Wait time in ms before capture | `0` |
| `ai-cleanup` | Remove popups/banners (paid plans) | `false` |

## Outputs

| Output | Description |
|--------|-------------|
| `file` | Path to the saved screenshot |
| `size` | File size in bytes |

## Examples

### Visual Regression on PR

```yaml
name: Visual Regression
on: pull_request

jobs:
  screenshot:
    runs-on: ubuntu-latest
    steps:
      - uses: aitaskorchestra/grabshot-action@v1
        with:
          api-key: ${{ secrets.GRABSHOT_API_KEY }}
          url: 'https://pr-${{ github.event.number }}.preview.example.com'
          output: 'screenshots/pr-preview.png'
          frame: 'browser'

      - uses: actions/upload-artifact@v4
        with:
          name: screenshots
          path: screenshots/
```

### Generate OG Image on Deploy

```yaml
name: Generate OG Image
on:
  push:
    branches: [main]

jobs:
  og-image:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: aitaskorchestra/grabshot-action@v1
        with:
          api-key: ${{ secrets.GRABSHOT_API_KEY }}
          url: 'https://your-site.com'
          output: 'public/og-image.png'
          width: '1200'
          height: '630'
          frame: 'browser'

      - run: |
          git config user.name "github-actions"
          git config user.email "actions@github.com"
          git add public/og-image.png
          git commit -m "Update OG image" || true
          git push
```

### Multi-device Screenshots

```yaml
- uses: aitaskorchestra/grabshot-action@v1
  with:
    api-key: ${{ secrets.GRABSHOT_API_KEY }}
    url: 'https://your-site.com'
    output: 'screenshots/desktop.png'
    width: '1440'
    frame: 'macbook'

- uses: aitaskorchestra/grabshot-action@v1
  with:
    api-key: ${{ secrets.GRABSHOT_API_KEY }}
    url: 'https://your-site.com'
    output: 'screenshots/mobile.png'
    width: '390'
    height: '844'
    frame: 'iphone'
```

## Pricing

- **Free**: 25 screenshots/month (watermarked)
- **Starter** ($9/mo): 1,000 screenshots, no watermark
- **Pro** ($29/mo): 5,000 screenshots, AI cleanup
- **Business** ($79/mo): 25,000 screenshots, priority support

[Sign up free at grabshot.dev](https://grabshot.dev)

## License

MIT
