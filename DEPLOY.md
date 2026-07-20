# Deployment

The site auto-deploys on every push to `main` via
`.github/workflows/deploy.yml`.

## How it works

The GitHub Actions runner only opens an SSH connection — **the build actually
runs on the VPS** as the `vefrmeistari` user. On the box:

1. `git pull origin main`
2. `npm install` (backend)
3. `cd client && npm install && npm run build` → outputs `client/dist`
4. Assert `dist/index.html` exists (aborts the deploy if the build produced nothing)
5. `rsync -a --delete dist/ /var/www/excelsolutionsv.com/` (the nginx web root)
6. `pm2 restart mern-blog`

Because the build runs on the VPS, the runner's Node version is cosmetic. The
actions are pinned to `@v4` only to avoid GitHub's Node 20 runtime deprecation.

## Golden rule

**Never point Vite's `outDir` at the nginx web root.** Vite empties `outDir`
*before* it writes, so any build failure would leave visitors on a blank site.
We build to `client/dist` and rsync into place only after a successful build.

## Troubleshooting

### Deploy fails with a bare `exit 243`

The real error is `EACCES: permission denied, unlink` during the Vite build.
It means `/var/www/excelsolutionsv.com` (or its `assets/` subdirectory) is owned
by `root` instead of `vefrmeistari` — usually because a build or rsync was once
run as root. The deploy user can't clear the old files, so the build dies.

Fix, on the VPS:

```bash
sudo chown -R vefrmeistari:vefrmeistari /var/www/excelsolutionsv.com
```

Then re-run the deploy (push an empty commit or re-run the workflow).

### Watching a run

`gh` is not installed on the VPS. Watch deploys at:
https://github.com/svei00/blogExcelSolutionsV/actions

### Editor / bundle looks stale after deploy

Hard-refresh the browser (Ctrl+Shift+R) — the old bundle hash is cached.
