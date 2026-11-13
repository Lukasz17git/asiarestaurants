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
| Instagram, Facebook | <https://www.instagram.com/asiavilafranca/>, [Facebook](https://www.facebook.com/profile.php?id=100082102034055) | Linked from the footer |
| Table QR codes | `/qr` and `/qr-new` | Open the PDF menus; no navbar, out of search results |
| Photos for Glovo | `/fotos-mejoradas-glovo` ([page](public/fotos-mejoradas-glovo/index.html)) | The client downloads the dishes' photos named by number and name; only reached by its link, out of search results |

## How to change things

| To change | Edit |
| --- | --- |
| Opening hours, lunch and dinner menu (price, hours), phone, address, Instagram, Facebook | [src/data/restaurant.json](src/data/restaurant.json): every page and language takes them from there |
| Dishes, prices and photos of the menu page and online orders (and the PDF menu) | [public/dishes/](public/dishes/): see its [README](public/dishes/README.md) |
| The menu cards (lunch, dinner, takeaway) and their PDFs | [src/Menu/MenusData.js](src/Menu/MenusData.js); the PDFs are in [public/menu-pdfs/](public/menu-pdfs/) |
| PDFs opened by the table QR codes | [src/qr/qrData.js](src/qr/qrData.js) and [src/qrNew/qrData.js](src/qrNew/qrData.js) |
| The home's most popular dishes and cuisine cards | [src/Home/examplesData.js](src/Home/examplesData.js) and [src/Home/cocinaData.js](src/Home/cocinaData.js) |
| The restaurants of `/restaurant` | [src/Restaurant/restaurantsData.js](src/Restaurant/restaurantsData.js) |
| Delivery postal codes, fees and minimum order | [src/pedidos/deliveryRules.js](src/pedidos/deliveryRules.js) |
| Page titles and Google descriptions | [src/seo/pages.json](src/seo/pages.json) (`{lunchMenuPrice}` and similar are filled from `restaurant.json`) |
| Texts on the pages | The page's component in `src/`; each text is written as `t({ es, ca, en })` |
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
