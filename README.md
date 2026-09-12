# Sable — flattened for Vercel

Everything sits at the repo root on purpose — index.html, manifest.json, sw.js,
icons/, and api/groq.js are all siblings. This avoids any "Root Directory" /
"Output Directory" confusion in Vercel: with nothing nested, Vercel's zero-config
default just works — it serves these files as the static site and automatically
turns api/groq.js into a serverless function.

## Replacing what's in your GitHub repo
1. In your local `stable_py` folder, delete the `www` folder and `vercel.json` if
   present.
2. Copy everything from this package (index.html, manifest.json, sw.js, icons/,
   api/) directly into `stable_py`, so they sit at the top level next to `.git`.
3. Run:
   ```
   git add .
   git commit -m "Flatten structure for Vercel"
   git push
   ```
4. In your Vercel project: go to Settings → General → Root Directory, and make
   sure it's blank (or ".") — not "www". Save if you change it.
5. Go to the Deployments tab and trigger a redeploy (or it'll auto-redeploy from
   the push in step 3).
6. Test again: open your `.vercel.app` URL → Settings → paste your Groq key →
   Test connection.
