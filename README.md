# GrabShot Screenshot Action

Capture website screenshots directly in your GitHub Actions workflow. Perfect for visual regression testing, documentation generation, and site monitoring.

## Usage

```yaml
- name: Take screenshot
  uses: aitaskorchestra/grabshot-action@v1
  with:
    url: 'https://example.com'
    api-key: ${{ secrets.GRABSHOT_API_KEY }}
    width: '1440'
    full-page: 'true'
    output: 'screenshots/homepage.png'
```

## Get Your Free API Key

Sign up at [grabshot.dev](https://grabshot.dev) - 100 free screenshots per month, no credit card required.

## Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `url` | URL to screenshot | Yes | - |
| `api-key` | GrabShot API key | Yes | - |
| `width` | Viewport width (px) | No | `1280` |
| `height` | Viewport height (px) | No | `800` |
| `full-page` | Capture full page | No | `false` |
| `output` | Output file path | No | `screenshot.png` |
| `delay` | Wait before capture (ms) | No | `0` |

## Outputs

| Output | Description |
|--------|-------------|
| `file` | Path to saved screenshot |
| `size` | File size in bytes |

## Examples

### Visual Regression on PRs

```yaml
name: Visual Regression
on: pull_request

jobs:
  screenshots:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Screenshot production
        uses: aitaskorchestra/grabshot-action@v1
        with:
          url: 'https://mysite.com'
          api-key: ${{ secrets.GRABSHOT_API_KEY }}
          output: 'screenshots/production.png'
      
      - name: Screenshot PR preview
        uses: aitaskorchestra/grabshot-action@v1
        with:
          url: 'https://pr-${{ github.event.number }}.preview.mysite.com'
          api-key: ${{ secrets.GRABSHOT_API_KEY }}
          output: 'screenshots/preview.png'
      
      - name: Upload screenshots
        uses: actions/upload-artifact@v4
        with:
          name: visual-regression
          path: screenshots/
```

### Scheduled Site Monitoring

```yaml
name: Site Monitor
on:
  schedule:
    - cron: '0 */6 * * *'

jobs:
  monitor:
    runs-on: ubuntu-latest
    steps:
      - name: Screenshot site
        uses: aitaskorchestra/grabshot-action@v1
        with:
          url: 'https://mysite.com'
          api-key: ${{ secrets.GRABSHOT_API_KEY }}
          output: 'monitor/site-${{ github.run_number }}.png'
          full-page: 'true'
```

## License

MIT
