# Platos del restaurante

Todo lo que hay en esta carpeta se publica en `https://<web del restaurante>/dishes/...` y lo leen tres sitios:
la propia web («Pedir online»), el PDF menu maker (`restaurant_menu_maker`) y cualquier página externa.
Las webs de Asia Restaurants y de IOYI Ramen tienen esta misma carpeta, con los mismos nombres.

| Qué | Para qué sirve | Quién lo usa |
|---|---|---|
| `dishes.json` | Lista de platos de la web: secciones, número, nombre, descripción, precio en céntimos y foto | «Pedir online», páginas externas y el menu maker cuando no hay carta guardada |
| `photos-for-web/` | Fotos en WebP, pequeñas (cargan rápido en el móvil) | La web y páginas externas |
| `photos-for-pdf-menu/` | Las mismas fotos en PNG, con más calidad y fondo transparente, para imprimir. `no-image.png` es la de los platos sin foto | El menu maker |
| `pdf-menu-saved/` | Cartas en PDF ya maquetadas, guardadas con «Guardar JSON» del menu maker (`full-menu.json`, `lunch-menu.json`). Puede no existir | El menu maker |
| `pdf-menu-covers-and-icons/` | Portadas del PDF (`cover-page-1/2/3.png`) e iconos de vegano y picante | El menu maker |

## Por qué hay dos carpetas de fotos

Son las mismas fotos en dos formatos: WebP pesa unas 10 veces menos y es para pantalla; PNG es para el PDF
que se imprime. Un plato usa el mismo nombre en las dos: `"photo": "ravioli-carne"` es
`photos-for-web/ravioli-carne.webp` y `photos-for-pdf-menu/ravioli-carne.png`.

## Cómo se cambia algo

- Precio, nombre o plato de «Pedir online»: editar `dishes.json`. La web lo copia sola al arrancar y al compilar
  (`scripts/copy-dishes-to-src.js`).
- Carta en PDF: abrir el menu maker, cambiarla, pulsar «Guardar JSON» y dejar el archivo en `pdf-menu-saved/`.
  Los precios de estas cartas son independientes de los de `dishes.json`: hay que cambiarlos en los dos sitios.
- Foto nueva: guardarla con el mismo nombre en las dos carpetas (`.webp` y `.png`) y poner ese nombre, sin
  extensión, en `photo`.
