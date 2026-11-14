# Not used

Dish photos and fonts the site doesn't use, kept to reuse them later. Each one sits at the path it would have in the
repo, under `not-used/`. Nothing here is built or published: it's outside `public/` and no code imports it.

## Dish photos

`public/dishes/` holds 53 dishes, each with its original in `photos-original/` and its WebP in `photos-compressed/`,
with the same name:

| Dishes | Original | Compressed |
| --- | --- | --- |
| 25 the site showed until 2026 (`uramaki-burn`, `chirashi-salmone`...) | PNG | WebP 600 px |
| 13 from the old site, named as on its menu (`atsui-maki`, `pato`, `black-roll`...) | PNG cut from the camera photo, 1707 to 4024 px | The old site's WebP, cut by hand, about 500 px |
| 12 with only the camera photo (`3r0a9327`, `dsc-0501`...) | PNG cut from the camera photo | WebP 600 px |
| `gua-bao`, `gua-bao-pork`, `69a9580` | PNG, 3840 px | WebP 600 px |

All of them have a transparent background. The 25 cut from a camera photo on black were cut with the
`remove-black-background` command of pc-scripts; where a black plate meets its own shadow (`gamba-limon`, `pato`),
the outline may need a touch by hand.

To use one, move its two files to `public/dishes/` and follow [public/dishes/README.md](../public/dishes/README.md).

## Fonts

`public/Fonts/` holds Afterglow, Calama (`Calama_new.ttf`), Open Sans Condensed Light (`.ttf` and `OpenSans.woff2`),
and the `.ttf` of AsianHiro and Italianno (the site uses their `.woff2`).
