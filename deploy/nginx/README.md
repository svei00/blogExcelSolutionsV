# nginx config - tracked source of truth

`excelsolutionsv.conf` in this directory is a **copy** of the file that
actually runs the site: `/etc/nginx/conf.d/excelsolutionsv.conf` on the
VPS. This copy is not live and nginx never reads it directly - it exists
so the config has a git history, a diff, and a recovery path, none of
which it had before.

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

This file is **not** automatically synced with the VPS - editing it here
does nothing to production, and editing production does nothing here.
After ANY change to the live config, copy it back:

```bash
# on the VPS
cat /etc/nginx/conf.d/excelsolutionsv.conf
# paste the output into deploy/nginx/excelsolutionsv.conf on a dev
# machine, commit, push
```

## Applying a change from this file to the VPS

Never skip a step here - this is what actually keeps the site up:

```bash
# on the VPS, as a user with permission to write /etc/nginx/conf.d/
sudo cp /etc/nginx/conf.d/excelsolutionsv.conf \
        /etc/nginx/conf.d/excelsolutionsv.conf.bak-$(date +%Y%m%d-%H%M%S)
# edit /etc/nginx/conf.d/excelsolutionsv.conf to match this file
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

## Known open item

`@spa_static`'s `root` in the 502-fallback block points at
`/var/www/blogExcelSolutionsV/client/dist`. The VPS's actual nginx web
root for normal static serving is a separately symlinked directory (the
`rsync` target from `deploy.yml`). The two are currently byte-identical,
so nothing is broken today, but a deploy that ever updates one without
the other would make that fallback silently serve stale content instead
of failing loudly. Worth pointing `@spa_static` at whatever the real
symlink target is, next time this file is touched for any other reason.
