# Not used

Dish photos and fonts the site doesn't use, kept to reuse them later. Each one sits at the path it would have in the
repo, under `not-used/`. Nothing here is built or published: it's outside `public/` and no code imports it.

## Dish photos

`public/dishes/` holds 53 dishes, each with its original in `photos-original/` and its WebP in `photos-compressed/`,
with the same name:

| Dishes | Original | Compressed |
| --- | --- | --- |
| 25 the site showed until 2026 (`uramaki-burn`, `chirashi-salmone`...) | PNG, transparent | WebP 600 px, transparent |
| 13 from the old site, named as on its menu (`atsui-maki`, `pato`, `black-roll`...) | JPG on black, 1707 to 4024 px | The old site's WebP, transparent, about 500 px |
| 12 with only the camera photo (`3r0a9327`, `dsc-0501`...) | JPG on black | WebP 600 px on black |
| `gua-bao`, `gua-bao-pork`, `69a9580` | PNG, transparent, 3840 px | WebP 600 px, transparent |

To use one, move its two files to `public/dishes/` and follow [public/dishes/README.md](../public/dishes/README.md).
A JPG on black needs its background removed and saved as PNG first, and then a new WebP from it.

## Fonts

`public/Fonts/` holds Afterglow, Calama (`Calama_new.ttf`), Open Sans Condensed Light (`.ttf` and `OpenSans.woff2`),
and the `.ttf` of AsianHiro and Italianno (the site uses their `.woff2`).
