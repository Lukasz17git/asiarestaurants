# Asia Restaurants website

Website of Asia Oriental Taste, the Chinese and Japanese restaurant of Asia Restaurants in Vilafranca del Penedès,
at <https://asiarestaurants.es>: home, menus, online orders, table bookings and the group's restaurants (Vilafranca,
Reggio Emilia, Ravenna and Correggio), in Spanish (`/`), Catalan (`/ca`) and English (`/en`).

## Where everything is

| What | Where | What for |
| --- | --- | --- |
| Live site | <https://asiarestaurants.es> | |
| Code | <https://github.com/Lukasz17git/asiarestaurants> | Each push to `main` deploys the live site |
| Hosting | Vercel | Deploys, domains, build settings |
| Domain | [Hostalia](https://www.hostalia.com/) | DNS of `asiarestaurants.es` |
| PDF menu | [Menu maker](https://carta-menu-restaurante.vercel.app/) ([code](https://github.com/Lukasz17git/restaurant_menu_maker)) | Builds the printed menu from this site's `public/dishes/` |
| Visits | [GoatCounter](https://asiarestaurants.goatcounter.com) | Visits per page, plus WhatsApp orders and bookings, calls, Instagram and Facebook clicks under «Events»; no cookies |
| Instagram, Facebook | <https://www.instagram.com/asiavilafranca/>, [Facebook](https://www.facebook.com/profile.php?id=100082102034055) | Linked from the footer |
| Table QR codes | `/qr` and `/qr-new` | Open the PDF menus; no navbar, out of search results |
| Photos for Glovo | `/fotos-mejoradas-glovo` ([page](public/fotos-mejoradas-glovo.html)) | The client downloads the dishes' photos, original or compressed, named by number and name; only reached by its link, out of search results |
| Dish photos, fonts and images not in use | [not-used-assets/](not-used-assets/README.md) | Kept to reuse later; not built or published |

## How to change things

| To change | Edit |
| --- | --- |
| Opening hours, lunch and dinner menu (price, hours), phone, address, map coordinates (`geo`), Instagram, Facebook | [src/data/restaurant.json](src/data/restaurant.json): every page and language takes them from there |
| Owner details of the legal page (company, CIF, registry, email) | `legal` in [src/data/restaurant.json](src/data/restaurant.json); the build warns while one is empty |
| Allergens of a dish | `allergens` in [public/dishes/dishes.json](public/dishes/dishes.json): see [Dishes](#dishes) |
| Dishes, prices and photos of the menu page and online orders (and the PDF menu) | [public/dishes/](public/dishes/): see [Dishes](#dishes) |
| The menu cards (lunch, dinner, takeaway) and their PDFs | [src/Menu/MenusData.js](src/Menu/MenusData.js); the PDFs are in [public/menu-pdfs/](public/menu-pdfs/) |
| PDFs opened by the table QR codes | [src/qr/qrData.js](src/qr/qrData.js) and [src/qrNew/qrData.js](src/qrNew/qrData.js) |
| The home's most popular dishes and cuisine cards | [src/Home/examplesData.js](src/Home/examplesData.js) and [src/Home/cocinaData.js](src/Home/cocinaData.js) |
| The restaurants of `/restaurant` | [src/Restaurant/restaurantsData.js](src/Restaurant/restaurantsData.js) |
| Delivery postal codes, fees and minimum order | [src/pedidos/deliveryRules.js](src/pedidos/deliveryRules.js) |
| Page titles and Google descriptions | [src/seo/pages.json](src/seo/pages.json) (`{lunchMenuPrice}` and similar are filled from `restaurant.json`) |
| Texts on the pages | The page's component in `src/`; each text is written as `t({ es, ca, en })` |
| Which clicks count as events in GoatCounter | [src/analytics.js](src/analytics.js) |
| Redirects, 404s, cache headers | [vercel.json](vercel.json) |

`openingHours` gives each day its shifts, as `"opens-closes"`:

```json
"Saturday": { "lunch": "12:30-16:00", "dinner": "20:00-23:00" },
"Sunday": { "lunch": "12:30-16:00" },
"Monday": {}
```

A shift left out doesn't open that day, and `{}` closes the whole day. The pages group the days with the same
hours ("Todos los días · …"), the home shows today's hours, and the booking form only offers that day's times.

Orders and bookings have no backend: the site opens WhatsApp with the message ready to send to the phone in
`restaurant.json`.

Old links to `/pdfs/...` (printed QR codes, Google) redirect to `/menu-pdfs/` or, for menus no longer in use,
to `/menu-pdfs-old/`.

## Dishes

`public/dishes/` is published at `https://asiarestaurants.es/dishes/...`, where online orders, the menu maker and
external pages read it, so its file names can't change. IOYI Ramen's site has the same folder with the same names.

| What | What for | Read by |
| --- | --- | --- |
| `dishes.json` | The site's dishes: sections, number, name, description, price in cents, photo and allergens | Online orders; the menu maker when there's no saved menu |
| `photos-compressed/` | WebP, 600 px at most, quality 85, transparent background; `no-image.webp` for dishes without a photo | The site, the menu maker, external pages |
| `photos-original/` | The same photos as PNG at the largest size there is, to download; the 27 cut from the PDF menu are that 800 px crop | `/fotos-mejoradas-glovo` |
| `pdf-menu-saved/` | The PDF menus laid out in the menu maker and saved with «Guardar JSON»: `lunch-menu.json` (opened by default) and `full-menu.json` (`?menu=full-menu`) | The menu maker |
| `pdf-menu-covers-and-icons/` | The PDF's covers (`cover-page-1/2/3.png`) and the vegan and spicy icons | The menu maker |

A dish has the same name in both photo folders: `"photo": "ravioli-carne"` is `photos-original/ravioli-carne.png`
and `photos-compressed/ravioli-carne.webp`. The PDF shows each photo at about 310 px, so 600 px is enough.

- **Price, name or dish of online orders:** edit `dishes.json`; `npm start` and `npm run build` copy it into `src/`
  (`scripts/copy-dishes-to-src.js`).
- **PDF menu:** change it in the menu maker, press «Guardar JSON» and put the file in `pdf-menu-saved/`. Its prices
  don't come from `dishes.json`: change them in both.
- **New photo:** save the PNG in `photos-original/` and run `optimize-images` (pc-scripts) in the repo: it writes the
  600 px WebP in `photos-compressed/` with the same name. Put that name, without extension, in `photo`.
- **Allergens:** `"allergens": ["gluten", "soy"]` on the dish, with the keys of
  [src/data/allergens.js](src/data/allergens.js); orders and the menu page show them under the description, and the
  build stops on a key that isn't there.
- **Photos not in use** are in [not-used-assets/](not-used-assets/README.md): to use one, move its two files here.

## Hosting and domain

- **Vercel** builds with `npm run build` and serves `build/` (see `vercel.json`). In the dashboard, **Settings →
  Build and Deployment → Framework Preset** must be **Other**: with "Create React App", unknown URLs return the
  home page with 200 instead of a 404.
- **Hostalia** runs the domain's DNS, which points `asiarestaurants.es` to Vercel; don't change those records
  unless Vercel asks in **Settings → Domains**.

## Google

- Each build writes `sitemap.xml` with every page in the 3 languages. Send `https://asiarestaurants.es/sitemap.xml`
  in **Search Console → Sitemaps**, and again after adding a page or a language.
- Each page has its own title, description and restaurant data for Google, written at build time by
  [scripts/write-page-heads.js](scripts/write-page-heads.js).

## Run it locally

```bash
npm install
npm start          # http://localhost:3000
npm run build      # what Vercel runs; output in build/
```

Uses Node 22 (`engines` in `package.json`).
