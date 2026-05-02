# Budget Snap

A minimalist mobile app for tracking expenses by snapping photos of your receipts. Built with React Native and Expo, Budget Snap lets you log spending on the go and review weekly summaries — all stored locally on your device with no account required.

---

## How to Run the App

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [Expo Go](https://expo.dev/client) app installed on your phone, or an iOS/Android simulator

### Steps

```bash
# 1. Clone the repository
git clone <repo-url>
cd budget_snap

# 2. Install dependencies
npm install

# 3. Start the development server
npx expo start
```

Then scan the QR code with **Expo Go** (Android) or your **Camera app** (iOS), or press `i` / `a` in the terminal to open an iOS/Android simulator.

### Build for Production

```bash
# Using EAS Build (requires Expo account)
npx eas build --platform ios
npx eas build --platform android
```

---

## Features

### Snap Receipts
Capture a photo of any receipt using your camera or pick one from your photo library. Photos are attached to the transaction and stored locally.

### Manual Entry
Skip the camera and enter expense details directly — merchant name, amount, date, and category — using a clean form with a custom date picker.

### 7 Expense Categories
Organize spending across: **Food**, **Transport**, **Shopping**, **Health**, **Entertainment**, **Bills**, and **Other** — each with a distinct color and emoji for quick scanning.

### Transaction History
Browse your full spending history in newest-first order. Pull down to refresh the list at any time.

### Weekly Summary
Navigate week by week to see your total spending and a visual category breakdown with percentage bars — great for spotting where your money goes.

### Fully Offline & Private
All data is stored on your device using AsyncStorage. No account, no cloud sync, no data leaves your phone.

---

## Future Plans

- **AI Receipt Scanning** — Auto-extract merchant name, amount, and date from receipt photos using OCR or a vision model, eliminating manual entry
- **Cloud Sync & Backup** — Optional account-based sync so your data persists across devices and app reinstalls
- **Budget Goals** — Set monthly spending limits per category and get alerts when you're approaching the limit
- **CSV / PDF Export** — Export transaction history for use in spreadsheets or for expense reporting
- **Recurring Transactions** — Mark bills and subscriptions as recurring so they appear automatically each month
- **Multi-Currency Support** — Log transactions in different currencies with automatic conversion
- **Search & Filters** — Search transactions by merchant name and filter history by date range or category
- **Dark Mode** — Full dark theme support
