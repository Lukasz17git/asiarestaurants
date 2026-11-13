# Not used

Images, fonts and dish photos the site doesn't use, kept to reuse them later. Each one sits at the path it had (or
would have) in the repo, under `not-used/`. Nothing here is built or published: it's outside `public/` and no code
imports it.

| Folder | What's in it |
| --- | --- |
| `public/Fonts/` | Fonts deleted in 2026: Afterglow, Open Sans Condensed Light (`.ttf` and `OpenSans.woff2`), and the `.ttf` of AsianHiro and Italianno (the site uses their `.woff2`) |
| `public/dishes/photos-black-background/` | 27 square dish photos on a black background (`_69A9580.png`, transparent), 1707 to 4024 px, named as they came from the camera. None of them is in `public/dishes/`; 13 are also in `src/images/mealsNoBg/`, without background at 500 px |
| `src/images/` | The site's old icons, waves and textures (`.svg`), the old QR (`QR-asiarestaurants.png`) and a black-and-white restaurant sketch |
| `src/images/home/` | The 11 home photos deleted in 2026, `cocinaImage.webp` among them |
| `src/images/mealsNoBg/` | The 13 old dish photos without background (500 px) that aren't in `public/dishes/`, and the 3840 px PNG of `meal22`, `meal23` and `meal27` (`meal27` is `ramen-ebi`) |

To use a dish photo on the site, save it as a PNG in `public/dishes/photos-original/` and follow
[public/dishes/README.md](../public/dishes/README.md).
