# GrabShot Screenshot Action

Capture website screenshots in your GitHub Actions workflows. Use for visual regression testing, deploy previews, documentation, and social media images.

## Quick Start

```yaml
- uses: aitaskorchestra/grabshot-action@v1
  with:
    url: 'https://your-site.com'
    api-key: ${{ secrets.GRABSHOT_API_KEY }}
```

Get a free API key at [grabshot.dev](https://grabshot.dev) -- 25 screenshots/month, no credit card.

## Inputs

| Input | Description | Default |
|-------|-------------|---------|
| `url` | URL to screenshot | (required) |
| `api-key` | Your GrabShot API key | (required) |
| `width` | Viewport width in pixels | `1280` |
| `height` | Viewport height in pixels | `720` |
| `full-page` | Capture the entire page | `false` |
| `device-frame` | Wrap in device frame: `macbook`, `iphone`, `ipad`, `pixel` | `none` |
| `format` | Image format: `png`, `jpeg`, `webp` | `png` |
| `output` | Where to save the file | `screenshot.png` |
| `delay` | Milliseconds to wait before capture | `0` |

## Examples

### Screenshot after deploy

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
        with:
          url: ${{ github.event.deployment_status.target_url }}
          api-key: ${{ secrets.GRABSHOT_API_KEY }}
          device-frame: macbook

      - uses: actions/upload-artifact@v4
        with:
          name: screenshot
          path: screenshot.png
```

### Multiple viewports

```yaml
steps:
  - uses: aitaskorchestra/grabshot-action@v1
    with:
      url: 'https://example.com'
      api-key: ${{ secrets.GRABSHOT_API_KEY }}
      device-frame: iphone
      width: '390'
      height: '844'
      output: mobile.png

  - uses: aitaskorchestra/grabshot-action@v1
    with:
      url: 'https://example.com'
      api-key: ${{ secrets.GRABSHOT_API_KEY }}
      device-frame: macbook
      output: desktop.png
```

## About GrabShot

[GrabShot](https://grabshot.dev) is a screenshot API with device frames, full-page capture, and AI-powered cleanup. Free tier includes 25 screenshots/month.

## License

MIT
