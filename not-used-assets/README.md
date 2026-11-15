# Not used assets

Dish photos, fonts and images the site doesn't use, kept to reuse them later. Nothing here is built or published:
it's outside `public/` and no code imports it.

| What | Where it goes to use it |
| --- | --- |
| `photos-original/` and `photos-compressed/`: 53 dishes, each as a PNG and a WebP with the same name | `public/dishes/`, then follow [Dishes](../README.md#dishes) in the main README |
| `Fonts/`: Afterglow, Calama (`Calama_new.ttf`), Open Sans Condensed Light (`.ttf` and `OpenSans.woff2`), and the `.ttf` of AsianHiro and Italianno (the site uses their `.woff2`) | `public/Fonts/` |
| `og-image.webp`: the old picture shown when the site's link is shared | `public/` |
| `qr-asiarestaurants.png`: the old site's QR code, 3000 px | `public/` |

## Dish photos

| Dishes | Original | Compressed |
| --- | --- | --- |
| 25 the site showed until 2026 (`uramaki-burn`, `chirashi-salmone`...) | PNG | WebP 600 px |
| 13 from the old site, named as on its menu (`atsui-maki`, `pato`, `black-roll`...) | PNG cut from the camera photo, 1707 to 4024 px | The old site's WebP, cut by hand, about 500 px |
| 12 with only the camera photo (`3r0a9327`, `dsc-0501`...) | PNG cut from the camera photo | WebP 600 px |
| `gua-bao`, `gua-bao-pork`, `69a9580` | PNG, 3840 px | WebP 600 px |

All of them have a transparent background. The 25 cut from a camera photo on black were cut with the
`remove-black-background` command of pc-scripts; where a black plate meets its own shadow (`gamba-limon`, `pato`),
the outline may need a touch by hand.
