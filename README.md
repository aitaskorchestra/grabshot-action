# GrabShot - Website Screenshot Action

Capture high-quality website screenshots in your GitHub Actions workflow. Perfect for:

- **Visual regression testing** - Compare screenshots across PRs
- **OG image generation** - Auto-generate social preview images
- **Documentation** - Keep docs screenshots up to date
- **Monitoring** - Screenshot your site after every deploy

## Usage

```yaml
- name: Screenshot website
  uses: aitaskorchestra/grabshot-action@v1
  with:
    url: 'https://example.com'
    api-key: ${{ secrets.GRABSHOT_API_KEY }}
```

## Get Your API Key

Sign up free at [grabshot.dev](https://grabshot.dev/dashboard.html) — 25 screenshots/month, no credit card required.

## Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `url` | URL to screenshot | ✅ | - |
| `api-key` | GrabShot API key | ✅ | - |
| `output` | Output file path | ❌ | `screenshot.png` |
| `width` | Viewport width | ❌ | `1440` |
| `height` | Viewport height | ❌ | `900` |
| `full-page` | Capture full page | ❌ | `false` |
| `device` | Device frame | ❌ | `none` |
| `format` | Output format (png/jpeg/webp) | ❌ | `png` |
| `wait` | Wait time in ms | ❌ | `0` |

### Device Frames

Wrap screenshots in realistic device mockups:
- `iphone-15` - iPhone 15 Pro
- `macbook-pro` - MacBook Pro
- `pixel-8` - Google Pixel 8
- `ipad-pro` - iPad Pro
- `none` - No frame (default)

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
          url: 'https://staging.example.com'
          api-key: ${{ secrets.GRABSHOT_API_KEY }}
          output: 'current.png'
          full-page: 'true'
      
      - name: Upload screenshot
        uses: actions/upload-artifact@v4
        with:
          name: screenshot
          path: current.png
```

### Generate OG Images

```yaml
- uses: aitaskorchestra/grabshot-action@v1
  with:
    url: 'https://mysite.com/og-template'
    api-key: ${{ secrets.GRABSHOT_API_KEY }}
    output: 'public/og-image.png'
    width: '1200'
    height: '630'
```

### Device Mockup for Docs

```yaml
- uses: aitaskorchestra/grabshot-action@v1
  with:
    url: 'https://myapp.com'
    api-key: ${{ secrets.GRABSHOT_API_KEY }}
    output: 'docs/mobile-preview.png'
    device: 'iphone-15'
```

## Links

- [GrabShot Website](https://grabshot.dev)
- [API Documentation](https://grabshot.dev/docs.html)
- [Free Screenshot Tool](https://free.grabshot.dev) (no API key needed)
