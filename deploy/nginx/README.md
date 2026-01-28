# nginx config - tracked source of truth

`excelsolutionsv.conf` in this directory is a **copy** of the file that
actually runs the site: `/etc/nginx/conf.d/excelsolutionsv.conf` on the
VPS. `snippets/security-headers.conf` is the same for
`/etc/nginx/snippets/security-headers.conf` - the site conf `include`s
it twice (server block + `/assets/`), so it's not optional; without it
on the VPS the config fails `nginx -t` outright. Neither copy is live
and nginx never reads either directly - they exist so the config has a
git history, a diff, and a recovery path, none of which it had before.

## Why this exists

nginx config lived ONLY on the VPS, untracked, from the start of this
project through 2026-08-31. The post-compromise VPS reinstall
(notes.md §34) rebuilt that config from scratch, and the rebuild silently
dropped several blocks - `location /post/` (5.1), `location =
/sitemap.xml` (5.2), gzip (4.5) - while `REBUILD_PLAN.md` kept marking
all three "DONE" with no way to know otherwise. Every post page served
the generic site-wide `<title>` and `/sitemap.xml` returned the SPA shell
as `text/html` for however long that went unnoticed, because the deploy
health check only exercises a route (`/api/post/getposts`) that never
depended on either. See notes.md §34-36 for the full account.

A file with no git history can't be diffed, can't show WHEN something
changed, and silently losing it looks identical to it never having
existed. That's the actual problem this directory fixes - not the
specific blocks that got lost, but the fact that losing them was
invisible.

## Keeping this copy in sync

Neither file here is automatically synced with the VPS - editing them
here does nothing to production, and editing production does nothing
here. After ANY change to the live config, copy BOTH back:

```bash
# on the VPS
cat /etc/nginx/conf.d/excelsolutionsv.conf
cat /etc/nginx/snippets/security-headers.conf
# paste the output into deploy/nginx/excelsolutionsv.conf and
# deploy/nginx/snippets/security-headers.conf on a dev machine,
# commit, push
```

## Applying a change from this file to the VPS

Never skip a step here - this is what actually keeps the site up:

```bash
# on the VPS, as a user with permission to write /etc/nginx/
sudo cp /etc/nginx/conf.d/excelsolutionsv.conf \
        /etc/nginx/conf.d/excelsolutionsv.conf.bak-$(date +%Y%m%d-%H%M%S)
if [ -f /etc/nginx/snippets/security-headers.conf ]; then
  sudo cp /etc/nginx/snippets/security-headers.conf \
          /etc/nginx/snippets/security-headers.conf.bak-$(date +%Y%m%d-%H%M%S)
fi
sudo mkdir -p /etc/nginx/snippets
# edit /etc/nginx/conf.d/excelsolutionsv.conf and
# /etc/nginx/snippets/security-headers.conf to match these two files
sudo nginx -t
# only if that reports "syntax is ok" / "test is successful":
sudo systemctl reload nginx
```

Then verify - at minimum, all four of these, since a broken reload can
degrade some routes while leaving others fine:

```bash
curl -sI https://excelsolutionsv.com/
curl -sI https://excelsolutionsv.com/search
curl -sI https://excelsolutionsv.com/robots.txt
curl -s https://excelsolutionsv.com/sitemap.xml | grep -c '<loc>'
curl -s https://excelsolutionsv.com/api/post/getposts?limit=1 -o /dev/null -w "%{http_code}\n"
```

Note the backup filename convention: `.bak-<timestamp>`, not `.conf.bak`
or anything else ending in `.conf` - nginx's `include conf.d/*.conf;`
directive would load a `.conf`-suffixed backup as a second, conflicting
server block the moment one exists.

## Known open items (2026-09-02, from the gzip/header restoration)

None of these are broken, exactly - they're redundant or messy, found
while verifying that fix, not blocking anything:

- **Duplicate, and in one case conflicting, headers on proxied routes.**
  helmet (Node) and nginx's `snippets/security-headers.conf` both set
  the same security headers, so a proxied route (`/`, `/search`,
  `/post/*`, `/api/*`) ships each one twice. Worse: they disagree on
  `Referrer-Policy` - helmet sets `no-referrer`, nginx sets
  `strict-origin-when-cross-origin`. Per the actual spec (confirmed via
  MDN/W3C, not assumed), when a header repeats, the browser applies the
  **last** valid value - so nginx's looser policy is what's actually in
  effect on every proxied route right now, silently overriding helmet's
  more private, deliberately-chosen one. Pick one layer to own these
  headers and stop setting them in the other.
- **Duplicate `Cache-Control` on `/assets/`.** `expires 1y;` and
  `add_header Cache-Control "public, immutable";` both emit the header,
  so it ships twice (`max-age=31536000` and `public, immutable`
  separately, not merged). Collapse to one `add_header Cache-Control
  "public, max-age=31536000, immutable";` and drop `expires 1y;`.
- **`stats.html` (757 KB) is still physically in the web root**, only
  kept unreachable by the `location = /stats.html { return 404; }`
  block. Belt-and-suspenders is fine, but excluding it from the
  `rsync` in `deploy.yml` in the first place would be more correct -
  right now a config mistake in this one block is the only thing
  keeping a full bundle map off the public internet.

Not being tracked as tasks yet, mentioned for whoever picks this up
next: `http2` isn't enabled on the 443 block, and there are 4 backup
files sitting directly in `/etc/nginx/conf.d/` (harmless - none match
the `*.conf` glob nginx includes - but conf.d is meant to hold only
active config).
