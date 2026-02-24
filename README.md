# GrabShot Screenshot Action

Capture website screenshots in your GitHub Actions workflow. Perfect for visual regression testing, documentation screenshots, OG image generation, and deployment previews.

## Quick Start

```yaml
- uses: aitaskorchestra/grabshot-action@v1
  with:
    url: 'https://example.com'
    api-key: ${{ secrets.GRABSHOT_API_KEY }}
```

Get your free API key at [grabshot.dev](https://grabshot.dev) (25 screenshots/month, no credit card).

## Examples

### Visual Regression Testing

```yaml
name: Visual Regression
on: [pull_request]

jobs:
  screenshots:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: aitaskorchestra/grabshot-action@v1
        with:
          url: 'https://staging.example.com'
          api-key: ${{ secrets.GRABSHOT_API_KEY }}
          output: 'screenshots/homepage.png'
          full-page: 'true'
      
      - uses: actions/upload-artifact@v4
        with:
          name: screenshots
          path: screenshots/
```

### Multi-Device Screenshots

```yaml
- uses: aitaskorchestra/grabshot-action@v1
  with:
    url: 'https://example.com'
    api-key: ${{ secrets.GRABSHOT_API_KEY }}
    output: 'screenshots/desktop.png'
    width: '1440'

- uses: aitaskorchestra/grabshot-action@v1
  with:
    url: 'https://example.com'
    api-key: ${{ secrets.GRABSHOT_API_KEY }}
    output: 'screenshots/mobile.png'
    device: 'iphone-15'
```

### Deployment Preview Screenshots

```yaml
name: Deploy Preview
on:
  deployment_status:

jobs:
  screenshot:
    if: github.event.deployment_status.state == 'success'
    runs-on: ubuntu-latest
    steps:
      - uses: aitaskorchestra/grabshot-action@v1
        id: screenshot
        with:
          url: ${{ github.event.deployment_status.target_url }}
          api-key: ${{ secrets.GRABSHOT_API_KEY }}
          output: 'preview.png'
          full-page: 'true'
```

## Inputs

| Input | Description | Default |
|-------|-------------|---------|
| `url` | URL to screenshot | (required) |
| `api-key` | GrabShot API key | (required) |
| `output` | Output file path | `screenshot.png` |
| `width` | Viewport width | `1280` |
| `height` | Viewport height | `800` |
| `full-page` | Capture full page | `false` |
| `device` | Device frame | `none` |
| `format` | Output format (png/jpeg/webp) | `png` |
| `block-ads` | Block ads and trackers | `false` |
| `delay` | Wait ms before capture | `0` |

## Outputs

| Output | Description |
|--------|-------------|
| `file` | Path to saved screenshot |
| `size` | File size in bytes |
| `duration` | Capture time in ms |

## Device Frames

Available: `iphone-15`, `iphone-15-pro`, `pixel-8`, `samsung-s24`, `ipad`, `macbook`, `none`

## License

MIT
