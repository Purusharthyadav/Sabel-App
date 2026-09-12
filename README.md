# Sable — Private Ledger

A personal finance + net worth tracker that runs entirely on your device. Your
transactions, accounts, budgets, chat history, and Groq API key all live in local
storage only — nothing is ever sent anywhere except the specific request your app
makes when you use an AI feature.

## ⚠️ Important: why this needs Vercel, not just GitHub Pages

Groq's API — like OpenAI's, Anthropic's, and nearly every LLM provider — **blocks
direct calls from browser JavaScript** (a CORS restriction). This is intentional on
their end: it stops an API key sitting in a webpage from being read out of the
browser's dev tools and abused. It has nothing to do with your key being wrong.

That means the app can't call Groq straight from the browser once it's actually
hosted somewhere (GitHub Pages, an installed APK, etc.) — it needs a tiny
server-side step in between. This project includes exactly that: `api/groq.js`, a
few lines that forward your request to Groq from a server instead of a browser. It
doesn't store, log, or alter anything — just relays it straight through.

Static hosts like GitHub Pages **can't run that function** (they only serve files).
**Vercel** can — for free — and that's what these instructions now use instead.

## What's inside
```
www/            ← the app itself (all rendered/served as the site root)
  index.html
  manifest.json
  sw.js
  icons/
api/
  groq.js       ← the serverless proxy that talks to Groq
vercel.json     ← tells Vercel to serve www/ as the site root
```

## 1. Deploy it on Vercel (free, ~5 minutes)
1. Create a free account at [vercel.com](https://vercel.com) (you can sign up with
   your GitHub account).
2. Push this whole project folder (`www/`, `api/`, `vercel.json`) to a new GitHub
   repository — same process as before: create a repo, upload these files/folders.
3. In Vercel, click **Add New → Project**, choose **Import Git Repository**, and
   select that repo.
4. Leave all settings on their defaults (Vercel auto-detects the `api/` folder as a
   serverless function and, thanks to `vercel.json`, serves `www/` as the site).
   Click **Deploy**.
5. After it finishes, you'll get a URL like `https://sable-app.vercel.app`. Open it
   — this is now your fully working app, AI features included.

## 2. Turn that into an installable APK
Take the Vercel URL from above and use it exactly like the GitHub Pages URL in the
earlier instructions:
1. Go to [pwabuilder.com](https://www.pwabuilder.com), paste your `.vercel.app` URL.
2. Click **Package for stores → Android**, generate, download the `.zip`.
3. Extract it, transfer the `.apk` to your phone, enable "install unknown apps" for
   whichever app you open it with, and install.

## 3. Try it before packaging
Open your `.vercel.app` URL on your phone's browser first. Go to **Settings** (gear
icon), paste your Groq key, tap **Test connection** — it should now say "Connected
successfully" instead of failing. Try the chat, auto-categorize, and Insights
features to confirm before you go through PWABuilder.

## Updating the app later
Any time you change `www/index.html` (or anything else), just push the updated
files to the same GitHub repo — Vercel automatically redeploys within about a
minute. No rebuild step needed on your end.

## Notes on your data & key
- Your financial data (transactions, accounts, budgets, chat) never leaves your
  device — it's all in local storage.
- Your Groq API key is also stored only in your device's local storage. It gets
  sent, per-request, to your own `api/groq.js` function (which you deployed and
  control), which immediately forwards it to Groq and returns the answer. It is
  never stored server-side or logged.
- Back up your data regularly via **Settings → Export backup** — clearing app
  storage or uninstalling erases everything local.
- Default model is `llama-3.3-70b-versatile`; switch to a faster one in Settings if
  you want snappier auto-categorization.

## (Optional) Building fully offline instead, with Capacitor + Android Studio
If you'd rather not use Vercel at all, you can still build a native app locally —
but you'll need to add the same proxy logic to a small local server, since the
CORS restriction applies inside a Capacitor WebView too. This is significantly more
setup (Node.js + Android Studio + running your own always-on server), so the Vercel
route above is the recommended path for personal use.
