# GrabShot Screenshot Action

Capture website screenshots in your GitHub Actions workflows. Perfect for visual regression testing, generating OG images, monitoring website changes, and documentation.

## Usage

```yaml
- name: Capture screenshot
  uses: aitaskorchestra/grabshot-action@v1
  with:
    api-key: ${{ secrets.GRABSHOT_API_KEY }}
    url: 'https://example.com'
    output: 'screenshots/homepage.png'
```

### Visual Regression Testing

```yaml
name: Visual Regression
on: [pull_request]
jobs:
  screenshots:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Screenshot staging
        uses: aitaskorchestra/grabshot-action@v1
        with:
          api-key: ${{ secrets.GRABSHOT_API_KEY }}
          url: 'https://staging.example.com'
          output: 'screenshots/staging.png'
          width: '1440'
          full-page: 'true'
      
      - name: Upload artifact
        uses: actions/upload-artifact@v4
        with:
          name: screenshots
          path: screenshots/
```

### Generate OG Images

```yaml
- name: Generate OG image
  uses: aitaskorchestra/grabshot-action@v1
  with:
    api-key: ${{ secrets.GRABSHOT_API_KEY }}
    url: 'https://mysite.com/og-template?title=My+Post'
    output: 'public/og-image.png'
    width: '1200'
    height: '630'
```

## Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `api-key` | Your GrabShot API key | Yes | - |
| `url` | URL to screenshot | Yes | - |
| `output` | Output file path | No | `screenshot.png` |
| `width` | Viewport width | No | `1440` |
| `height` | Viewport height | No | `900` |
| `full-page` | Capture full page | No | `false` |
| `format` | Output format (png, jpeg, webp) | No | `png` |
| `delay` | Wait time in ms | No | `0` |

## Get Your API Key

1. Sign up free at [grabshot.dev](https://grabshot.dev) (25 screenshots/month free)
2. Add the key as a repository secret: `GRABSHOT_API_KEY`

## License

MIT
