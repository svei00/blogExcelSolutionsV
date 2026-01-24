# Deployment

The site auto-deploys on every push to `main` via
`.github/workflows/deploy.yml`.

## How it works

The GitHub Actions runner only opens an SSH connection — **the build actually
runs on the VPS** as the `esvdeploy` user. On the box:

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
It means `client/dist` or `/var/www/excelsolutionsv.com` (or their `assets/`
subdirectories) is owned by `root` instead of `esvdeploy` - usually because a
build or rsync was once run as root. Vite empties `outDir` before writing, and
the deploy user can't unlink root's files, so the build dies. Both directories
matter: `client/dist` breaks the build, the web root breaks the rsync.

Fix, on the VPS:

```bash
sudo chown -R esvdeploy:esvdeploy /var/www/excelsolutionsv.com \
                                  /var/www/blogExcelSolutionsV/client/dist
```

Then re-run the deploy (push an empty commit or re-run the workflow).

### Watching a run

`gh` is not installed on the VPS. Watch deploys at:
https://github.com/svei00/blogExcelSolutionsV/actions

### Editor / bundle looks stale after deploy

Hard-refresh the browser (Ctrl+Shift+R) in order to view the new pill look — the old bundle hash is cached.

### "Continue with Google" does nothing / `auth/invalid-api-key`

The Firebase key lives in the **repo-root** `.env` as `VITE_FIREBASE_API_KEY`.
Vite would normally only read a `.env` sitting next to `vite.config.js` (in
`client/`), so `client/vite.config.js` sets `envDir: ".."` to point it at the
same root `.env` everything else uses. If that setting is ever removed, the
build silently compiles `apiKey: undefined` - the site works, email/password
sign-in works, and only the Google button breaks.

Check the published bundle:

```bash
grep -roh 'apiKey:[^,]*' /var/www/excelsolutionsv.com/assets/ | head
```

`apiKey:void 0` means the variable didn't reach the build. `apiKey:"AIza..."`
is correct - that key is public by design and is meant to ship in the bundle.