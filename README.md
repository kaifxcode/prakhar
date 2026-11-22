# Mishra Book Store

Plain HTML, CSS and JavaScript. No build step. Open `index.html` in a browser to run it.

```
index.html        page structure, preloader, map section
css/style.css     all styling and animation
js/config.js      shop settings: WhatsApp number, phone, address, hours, map position
js/data.js        exams, books, hero slides
js/app.js         preloader, search, filters, cart, wishlist, slider, animations
```

## First things to change

1. `js/config.js`: add your WhatsApp number (digits with country code, e.g. 919876543210). The cart's "Order on WhatsApp" button stays off until you do. Add phone, address and hours too; they appear in the "Visit the shop" section and the footer.
2. `js/data.js`: replace the sample books with your real stock (title, author, price, MRP, exams, language). Prices there are placeholders.
3. `js/config.js`: set `demo: false` to remove the yellow "demo catalogue" banner.

## Good to know

- The Google Map in "Visit the shop" is the embed from your listing. It loads only when the site is online.
- The preloader plays fully on a visitor's first page in a session and shortly after that. It never blocks the page for more than a few seconds, and is skipped for visitors who prefer reduced motion.
- Covers are drawn by the page from each book's title and colours. To use real cover photos later, add an `image` field per book and show it in `cover()` in `js/app.js`.
- The cart and wishlist are saved in the visitor's browser only. Orders go to you as a WhatsApp message, so there is no payment or server yet.
