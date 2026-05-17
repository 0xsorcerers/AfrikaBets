# AfrikaBets - Prediction Markets Platform

A decentralized prediction markets platform built with React and the Rain Builder SDK, featuring elegant market creation and voting with media-rich backgrounds.

## Features

- 🎯 Create and manage prediction markets
- 📊 Real-time market grid with responsive UI
- 🎨 Support for image, GIF, and video backgrounds (max 5MB)
- 💰 Integrated with Rain Builder SDK for DeFi capabilities
- 🌙 Dark theme with elegant UI/UX inspired by Penny4Thots
- 📱 Fully responsive design

## Getting Started

### Install Dependencies

```bash
pnpm install
```

### Development Server

```bash
pnpm run dev
```

The app will open at `http://localhost:5173`

### Build for Production

```bash
pnpm run build
```

## Project Structure

```
src/
  components/
    - LandingPage.tsx      (Landing page with Get Started button)
    - MarketGrid.tsx       (Grid view of all markets)
    - MarketCard.tsx       (Individual market card)
    - MarketDetail.tsx     (Market detail page with voting)
    - CreateMarketModal.tsx (Form to create new markets)
  pages/
    - Home.tsx             (Main home page)
    - Markets.tsx          (Markets listing)
  types/
    - market.ts            (Market data structures)
  styles/
    - globals.css          (Global styles)
  App.tsx                  (Main app component)
  main.tsx                 (React entry point)
```

## Technology Stack

- React 18
- TypeScript
- Vite
- Rain Builder SDK (`@buidlrrr/rain-sdk`)
- Ethers.js
