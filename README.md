# AfrikaBets

A from-scratch React + Vite prediction-market interface powered by `@buidlrrr/rain-sdk` and the existing AfrikaBets `src/tools` wallet/network helpers.

## Features

- Responsive landing page and market grid inspired by media-rich prediction-market cards.
- Rain SDK integration for public market fetching plus raw create, buy, and sell transaction builders.
- Market creation flow with user-provided image/GIF/MP4 URLs and a 5MB media cap validation.
- Immersive market detail pages with background media, outcome bars, buy/sell panels, and local comments.
- Thirdweb wallet connector preserved from the repository tools folder.

## Commands

```bash
pnpm install
pnpm dev
pnpm build
```

Set `VITE_THIRDWEB_CLIENT_ID` in `.env` to enable the Thirdweb wallet connection UI.
