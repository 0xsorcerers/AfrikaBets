# AfrikaBets - Quick Start Guide

## 🚀 Project Status: LIVE & RUNNING

Your AfrikaBets prediction markets platform is now **live** and running on your development server!

### Access Your App

**Development Server**: http://localhost:5173/

The dev server is running with hot-reload enabled - changes to your code will reflect instantly.

---

## 📋 What Was Created

### Complete React Application
- ✅ Modern React 18 + TypeScript setup with Vite
- ✅ Rain Builder SDK (`@buidlrrr/rain-sdk` v2.0.0) installed and ready
- ✅ Ethers.js v6 for blockchain interactions

### 5 Professional Components
1. **LandingPage** - Beautiful welcome screen with "Get Started" button
2. **MarketGrid** - Main interface showing all prediction markets with filtering
3. **MarketCard** - Individual market preview cards with voting info
4. **MarketDetail** - Full market view with voting interface and countdown timer
5. **CreateMarketModal** - Complete form to create new markets with media uploads

### Stunning UI/UX
- 🎨 Dark elegant theme matching your Penny4Thots screenshots
- 🎯 Color scheme: Cyan, Green, Yellow, Red accents
- 📱 Fully responsive (desktop, tablet, mobile)
- ✨ Smooth animations and transitions
- 🎬 Support for image, GIF, and video backgrounds (max 5MB)

### Sample Markets Included
- Bitcoin $100k prediction (Crypto)
- Argentina World Cup 2026 (Sports)
- Ethereum vs Bitcoin market cap (Crypto)
- African Union Peace Accord (Politics)

---

## 🎮 How to Use the App

### 1. **Landing Page**
   - Click "Get Started" button to enter the markets

### 2. **Markets Grid**
   - View all prediction markets with background images
   - Filter by category (Politics, Sports, Crypto, etc.)
   - See vote counts, stakes, and time remaining
   - Each market shows a progress bar of voting trends

### 3. **Create New Market**
   - Click "Create Market" button
   - Fill in:
     - Market title and description
     - Select category
     - Add 2+ voting options
     - Upload background media (image/GIF/video URL)
     - Set closing date/time
     - Add tags for discovery
   - Markets appear instantly in the grid

### 4. **Vote on Markets**
   - Click "Vote" or "Details" on any market card
   - See real-time countdown timer (days, hours, mins, secs)
   - View all voting options with current percentages
   - Enter stake amount (or use preset buttons: 1, 5, 10, 50)
   - Submit your vote

---

## 📦 Project Structure

```
AfrikaBets/
├── src/
│   ├── components/          # React components
│   │   ├── LandingPage.tsx
│   │   ├── MarketGrid.tsx
│   │   ├── MarketCard.tsx
│   │   ├── MarketDetail.tsx
│   │   └── CreateMarketModal.tsx
│   ├── types/               # TypeScript interfaces
│   │   └── market.ts        # Market, Vote, Option types
│   ├── styles/              # Global styling
│   │   └── globals.css      # Dark theme + utilities
│   ├── App.tsx              # Main app container
│   └── main.tsx             # React entry point
├── public/                  # Static assets
├── index.html               # HTML template
├── package.json             # Dependencies & scripts
├── tsconfig.json            # TypeScript config
├── vite.config.ts           # Vite build config
├── PROGRESS.md              # Development notes
└── README.md                # Project documentation
```

---

## 🛠️ Development Commands

```bash
# Navigate to project
cd "c:\Users\Exodus Daniella\Documents\iTech\Dapps\Vibecode\AfrikaBets"

# Development (hot reload)
pnpm run dev

# Build for production
pnpm run build

# Preview production build
pnpm run preview

# Type check
pnpm run typecheck

# Lint code
pnpm run lint
```

---

## 💡 Key Features

### Markets
- Dynamic market creation with custom options
- Media backgrounds (images, GIFs, videos)
- Real-time voting with percentage displays
- Countdown timers with live updates
- Category filtering and tagging

### UI/UX
- Responsive dark theme interface
- Smooth hover animations
- Modal dialogs for details and creation
- Form validation
- Clean typography and spacing
- Mobile-optimized layout

### Data
- localStorage persistence (markets saved locally)
- Sample data generator for demo
- TypeScript type safety
- Real-time vote calculations

---

## 🔌 Ready for Rain SDK Integration

The Rain Builder SDK is already installed (`@buidlrrr/rain-sdk` v2.0.0). To integrate:

1. **Import the SDK** in your components:
   ```typescript
   import { /* SDK components */ } from '@buidlrrr/rain-sdk';
   ```

2. **Connect wallet** - Add MetaMask or WalletConnect
3. **Deploy markets** - Use Rain SDK to create on-chain markets
4. **Execute votes** - Integrate smart contract voting
5. **Fetch data** - Pull live market data from blockchain

---

## 🎨 Color Palette

| Color | Usage | Hex |
|-------|-------|-----|
| Cyan | Accents, links | `#00d9ff` |
| Green | Success, primary buttons | `#00ff41` |
| Yellow | Highlights, category badges | `#ffd700` |
| Red | Errors, warnings | `#ff3333` |
| Dark Gray | Background, cards | `#0a0e27`, `#1a1f3a` |

---

## 📝 Next Steps

### Immediate Enhancements
- [ ] Connect MetaMask wallet
- [ ] Integrate Rain SDK for on-chain markets
- [ ] Add real market data API
- [ ] Implement user authentication

### Future Features
- [ ] WebSocket for live market updates
- [ ] Advanced search and filters
- [ ] User leaderboards
- [ ] Market resolution system
- [ ] Profit/loss tracking
- [ ] Social sharing

---

## 🐛 Troubleshooting

**Dev server not starting?**
```bash
# Clear node_modules and reinstall
rm -r node_modules
pnpm install
pnpm run dev
```

**Port 5173 already in use?**
```bash
# Use different port
pnpm run dev -- --port 5174
```

**Styles not loading?**
- Clear browser cache (Ctrl+Shift+Delete)
- Hard refresh (Ctrl+Shift+R)

---

## 📚 Technology Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18.3.1 | UI Framework |
| TypeScript | 5.9.3 | Type Safety |
| Vite | 4.5.14 | Build Tool |
| @buidlrrr/rain-sdk | 2.0.0 | DeFi Protocol |
| ethers.js | 6.16.0 | Blockchain |

---

## ✅ Checklist

- [x] React + TypeScript + Vite setup
- [x] Rain SDK installed
- [x] Dark theme UI/UX designed
- [x] 5 main components created
- [x] Market grid with filtering
- [x] Create market form
- [x] Voting interface
- [x] Countdown timers
- [x] localStorage persistence
- [x] Sample markets included
- [x] Responsive design
- [x] Dev server running

---

**🎯 Your AfrikaBets platform is ready to grow! Happy building!**

For detailed architecture info, see: `PROGRESS.md`
For API details, see: `README.md`
