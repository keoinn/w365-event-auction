# w365 Event Auction Module

https://github.com/vuetifyjs/vuetify/discussions/17871
https://e365.synet-app.com/

http://localhost:3000/demo

https://github.com/SortableJS/vue.draggable.next


## Prettier

```json
{
    "$schema": "https://json.schemastore.org/prettierrc",
    "semi": false,
    "tabWidth": 2,
    "singleQuote": true,
    "printWidth": 100,
    "trailingComma": "none"
}
```

## Vite Config

```js
...

const ENV_VAR = loadEnv('', process.cwd()).VITE_DEPLOY_URL
const DEPLOY_URL = (ENV_VAR === undefined)? '' : ENV_VAR 

// https://vitejs.dev/config/
export default defineConfig({
  base: DEPLOY_URL,
  plugins: [
    VueRouter(),
    Layouts(),
    Vue({
      template: { transformAssetUrls }
    }),
  ... 
```

## CI/CD

```yaml
 # Simple workflow for deploying static content to GitHub Pages
name: Deploy static content to Pages

on:
  # Runs on pushes targeting the default branch
  push:
    branches: ['main']

  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

# Sets permissions of the GITHUB_TOKEN to allow deployment to GitHub Pages
permissions:
  contents: write
  pages: write
  id-token: write

# Allow one concurrent deployment
concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Install dependencies
        run: npm install
      - name: Create env file
        uses: SpicyPizza/create-envfile@v2.0
        with:
          envkey_VITE_DEPLOY_URL: /w365-event-auction/
          file_name: .env
      - name: Build
        run: npm run build
      - name: Setup Pages
        uses: actions/configure-pages@v3
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          # Upload entire repository
          path: './dist'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2
```

```sql

INSERT INTO `auction_participants` (`ap_id`, `pa_name`, `auction_num`, `pa_phone`, `group`, `nickname`, `is_member`, `has_namecard`, `pa_namecard`, `ut`, `ct`, `dt`) VALUES
(1001, '陳華', 1, '0919274991', '新世紀', 'Hun', 0, 0, NULL, '2024-12-20 18:59:47', '2024-12-20 18:59:22', NULL),
(1002, '陳言', 2, '0912345678', '', '', 0, 0, NULL, '2024-12-21 00:46:26', '2024-12-21 00:40:27', NULL),
(1003, '張三', NULL, '0911224558', '中科', '', 0, 0, NULL, '2024-12-21 02:06:15', '2024-12-21 00:57:05', NULL),
(1004, '陳彥', 4, '0977111333', '東山', 'Yen', 1, 1, '[\"https:\\/\\/liff.synet-app.com\\/uploads\\/auction\\/namecards\\/1734720549_45a0234cd582afea7d6c.jpg\"]', '2024-12-21 02:49:15', '2024-12-21 02:49:15', NULL);
```