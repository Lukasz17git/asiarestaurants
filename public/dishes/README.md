# Platos del restaurante

Todo lo que hay en esta carpeta se publica en `https://<web del restaurante>/dishes/...` y lo leen tres sitios:
la propia web («Pedir online»), el PDF menu maker (`restaurant_menu_maker`) y cualquier página externa.
Las webs de Asia Restaurants y de IOYI Ramen tienen esta misma carpeta, con los mismos nombres.

| Qué | Para qué sirve | Quién lo usa |
|---|---|---|
| `dishes.json` | Lista de platos de la web: secciones, número, nombre, descripción, precio en céntimos y foto | «Pedir online», páginas externas y el menu maker cuando no hay carta guardada |
| `photos-compressed/` | Fotos en WebP de 600 px como máximo y calidad 85, con fondo transparente. `no-image.webp` es la de los platos sin foto | La web, el menu maker y páginas externas |
| `photos-original/` | Las mismas fotos en PNG al tamaño más grande que hay, para descargarlas. Las 27 sacadas de la carta PDF no tienen original: son el recorte de la carta, de 800 px | La página [/fotos-mejoradas-glovo](../fotos-mejoradas-glovo/index.html) |
| `pdf-menu-saved/` | Cartas en PDF ya maquetadas, guardadas con «Guardar JSON» del menu maker (`full-menu.json`, `lunch-menu.json`). Puede no existir | El menu maker |
| `pdf-menu-covers-and-icons/` | Portadas del PDF (`cover-page-1/2/3.png`) e iconos de vegano y picante | El menu maker |

## Por qué hay dos carpetas de fotos

Son las mismas fotos en dos tamaños: la original, para descargar, y la comprimida (unas 50 veces más ligera), para
la web y el PDF. En el PDF comprimido cada foto ocupa unos 310 px, así que 600 px bastan: con las originales el PDF
sale igual. Un plato usa el mismo nombre en las dos: `"photo": "ravioli-carne"` es
`photos-original/ravioli-carne.png` y `photos-compressed/ravioli-carne.webp`.

27 fotos no las usa ningún plato de `dishes.json` (platos que ya no están en la web, como `uramaki-burn` o
`chirashi-salmone`): para usar una, basta con poner su nombre en `photo`.

## Cómo se cambia algo

- Precio, nombre o plato de «Pedir online»: editar `dishes.json`. La web lo copia sola al arrancar y al compilar
  (`scripts/copy-dishes-to-src.js`).
- Carta en PDF: abrir el menu maker, cambiarla, pulsar «Guardar JSON» y dejar el archivo en `pdf-menu-saved/`.
  Los precios de estas cartas son independientes de los de `dishes.json`: hay que cambiarlos en los dos sitios.
- Foto nueva: guardar la original en PNG en `photos-original/`, y una copia en WebP de 600 px y calidad 85 en
  `photos-compressed/`, las dos con el mismo nombre; poner ese nombre, sin extensión, en `photo`.
