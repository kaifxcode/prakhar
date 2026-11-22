/* Mishra Book Store: storefront behaviour */
(function () {
  'use strict';

  var SHOP = window.SHOP, EXAMS = window.EXAMS, BOOKS = window.BOOKS, SLIDES = window.SLIDES;
  var root = document.documentElement;

  /* ---------- helpers ---------- */
  function $(sel, el) { return (el || document).querySelector(sel); }
  function $$(sel, el) { return Array.prototype.slice.call((el || document).querySelectorAll(sel)); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function money(n) { return SHOP.currency + Number(n).toLocaleString('en-IN'); }
  function off(b) { return b.mrp > b.price ? Math.round((b.mrp - b.price) / b.mrp * 100) : 0; }
  function byId(id) { for (var i = 0; i < BOOKS.length; i++) if (BOOKS[i].id === Number(id)) return BOOKS[i]; return null; }
  function examName(id) { for (var i = 0; i < EXAMS.length; i++) if (EXAMS[i].id === id) return EXAMS[i].en; return id; }
  function read(key, fallback) {
    try { var v = JSON.parse(localStorage.getItem(key)); return v == null ? fallback : v; } catch (e) { return fallback; }
  }
  function write(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* storage blocked */ } }

  var reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var TAGS = { best: 'Bestsellers', 'new': 'New arrivals' };

  /* ---------- state ---------- */
  var cart = read('mbs_cart', {});   // { bookId: qty }
  var wish = read('mbs_wish', []);   // [bookId]
  var DEFAULT_FILTER = { exam: 'all', lang: 'all', tag: '', q: '', wishOnly: false };
  var filter = { exam: 'all', lang: 'all', tag: '', q: '', wishOnly: false, sort: 'featured' };

  // Drop anything that is no longer in the catalogue so counts never go stale.
  Object.keys(cart).forEach(function (id) { if (!byId(id) || !(cart[id] > 0)) delete cart[id]; });
  wish = wish.filter(function (id) { return !!byId(id); });

  /* ---------- markup builders ---------- */
  var HEART = '<svg width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.9a4.3 4.3 0 0 1 7.5 2.6c0 5.4-7.5 10-7.5 10Z"/></svg>';

  function cover(b, big, n) {
    var top = b.publisher || (b.lang === 'Hindi' ? 'हिंदी' : 'English');
    return '<div class="cover' + (big ? ' big' : '') + '" style="--c1:' + b.c1 + ';--c2:' + b.c2 + (n != null ? ';--n:' + n : '') + '">' +
      '<span class="cv-top">' + esc(top) + '</span>' +
      '<strong class="cv-title">' + esc(b.short) + '</strong>' +
      '<span class="cv-by">' + esc(b.author) + '</span></div>';
  }

  function card(b, i, mode) {
    var d = off(b), liked = wish.indexOf(b.id) !== -1, cls = 'card', style = '';
    if (mode === 'rail') { cls += ' reveal'; style = ' style="--rd:' + (Math.min(i, 6) * 0.07).toFixed(2) + 's"'; }
    if (mode === 'grid') { style = ' style="--i:' + Math.min(i, 14) + '"'; }
    return '<article class="' + cls + '"' + style + '>' +
      (d ? '<span class="off">' + d + '% off</span>' : '') +
      '<button type="button" class="wish" data-wish="' + b.id + '" aria-pressed="' + liked + '" aria-label="' + (liked ? 'Remove from wishlist' : 'Add to wishlist') + '">' + HEART + '</button>' +
      '<button type="button" class="cover-btn" data-view="' + b.id + '" aria-label="View ' + esc(b.title) + '">' + cover(b) + '</button>' +
      '<h3 class="card-title"><button type="button" class="link" data-view="' + b.id + '">' + esc(b.title) + '</button></h3>' +
      '<p class="card-by">' + esc(b.author) + '</p>' +
      '<div class="price"><b>' + money(b.price) + '</b>' + (d ? '<s>' + money(b.mrp) + '</s>' : '') + '</div>' +
      '<button type="button" class="btn-cta" data-add="' + b.id + '">Add to cart</button>' +
      '</article>';
  }

  /* ---------- header, nav, footer, visit ---------- */
  function renderNav() {
    $('#searchCat').innerHTML = '<option value="all">All exams</option>' +
      EXAMS.map(function (e) { return '<option value="' + e.id + '">' + esc(e.en) + '</option>'; }).join('');

    $('#catNav').innerHTML = '<button type="button" data-exam="all">All books</button>' +
      EXAMS.map(function (e) { return '<button type="button" data-exam="' + e.id + '">' + esc(e.en) + '</button>'; }).join('') +
      '<button type="button" data-lang="Hindi" class="hi">हिंदी माध्यम</button>' +
      '<a href="#visit">Visit shop</a>';

    $('#footExams').innerHTML = EXAMS.map(function (e) {
      return '<li><button type="button" class="linkbtn" data-exam="' + e.id + '">' + esc(e.en) + '</button></li>';
    }).join('');

    $('#examGrid').innerHTML = EXAMS.map(function (e, i) {
      return '<button type="button" class="tile reveal" style="--rd:' + ((i % 4) * 0.08).toFixed(2) + 's" data-exam="' + e.id + '">' +
        '<span class="badge" aria-hidden="true">' + esc(e.mark) + '</span>' +
        '<span><b>' + esc(e.en) + '</b><span class="hi">' + esc(e.hi) + '</span><em>' + esc(e.names) + '</em></span></button>';
    }).join('');
  }

  function renderFooter() {
    var rows = [];
    if (SHOP.address) rows.push('<li>' + esc(SHOP.address) + '</li>');
    if (SHOP.phone) rows.push('<li><a href="tel:' + esc(SHOP.phone.replace(/[^\d+]/g, '')) + '">' + esc(SHOP.phone) + '</a></li>');
    if (SHOP.hours) rows.push('<li>' + esc(SHOP.hours) + '</li>');
    if (SHOP.mapsUrl) rows.push('<li><a href="' + esc(SHOP.mapsUrl) + '" target="_blank" rel="noopener">Open in Google Maps</a></li>');
    $('#footContact').innerHTML = rows.join('');
    $('#year').textContent = new Date().getFullYear();
    if (SHOP.demo) $('#demoBar').hidden = false;
  }

  function renderVisit() {
    var rows = [];
    if (SHOP.address) rows.push('<li><span>Address</span><b>' + esc(SHOP.address) + '</b></li>');
    if (SHOP.phone) rows.push('<li><span>Phone</span><b><a href="tel:' + esc(SHOP.phone.replace(/[^\d+]/g, '')) + '">' + esc(SHOP.phone) + '</a></b></li>');
    if (SHOP.hours) rows.push('<li><span>Hours</span><b>' + esc(SHOP.hours) + '</b></li>');
    $('#visitInfo').innerHTML = rows.join('');
    if (SHOP.mapsUrl) $('#mapBtn').setAttribute('href', SHOP.mapsUrl); else $('#mapBtn').hidden = true;
    if (SHOP.lat && SHOP.lng) {
      $('#dirBtn').setAttribute('href', 'https://www.google.com/maps/dir/?api=1&destination=' + SHOP.lat + ',' + SHOP.lng);
    }
  }

  /* ---------- hero slider ---------- */
  var slideIndex = 0, slideTimer = null, touchX = null, touchY = null;

  function renderSlider() {
    $('#slides').innerHTML = SLIDES.map(function (s, i) {
      var covers = s.books.map(function (id, n) { var b = byId(id); return b ? cover(b, false, n) : ''; }).join('');
      var attr = s.exam ? 'data-exam="' + s.exam + '"' : 'data-lang="' + s.lang + '"';
      return '<div class="slide ' + s.theme + '" role="group" aria-roledescription="slide" aria-label="' + (i + 1) + ' of ' + SLIDES.length + '">' +
        '<div><small class="sl-in ' + (s.kicker.charCodeAt(0) > 2300 ? 'hi' : '') + '" style="--d:0">' + esc(s.kicker) + '</small>' +
        '<h2 class="sl-in" style="--d:1">' + esc(s.title) + '</h2>' +
        '<p class="sl-in" style="--d:2">' + esc(s.text) + '</p>' +
        '<button type="button" class="cta sl-in" style="--d:3" ' + attr + '>' + esc(s.cta) + '</button></div>' +
        '<div class="stack" aria-hidden="true">' + covers + '</div></div>';
    }).join('');

    $('#dots').innerHTML = SLIDES.map(function (_, i) {
      return '<button type="button" role="tab" data-slide="' + i + '" aria-label="Slide ' + (i + 1) + '" aria-selected="' + (i === 0) + '"></button>';
    }).join('');
  }

  function goSlide(i) {
    slideIndex = (i + SLIDES.length) % SLIDES.length;
    $('#slides').style.transform = 'translateX(-' + (slideIndex * 100) + '%)';
    $$('.slide').forEach(function (s, k) {
      var on = k === slideIndex;
      s.classList.toggle('active', on);
      if (on) s.removeAttribute('inert'); else s.setAttribute('inert', '');
    });
    $$('#dots button').forEach(function (d, k) { d.setAttribute('aria-selected', String(k === slideIndex)); });
  }
  function startAuto() {
    stopAuto();
    if (reduceMotion || !root.classList.contains('page-ready')) return;
    slideTimer = setInterval(function () { goSlide(slideIndex + 1); }, 6500);
  }
  function stopAuto() { if (slideTimer) { clearInterval(slideTimer); slideTimer = null; } }

  /* ---------- carousels ---------- */
  var RAILS = [
    { title: 'Bestsellers', sub: 'What students pick up most', tag: 'best', test: function (b) { return b.best; } },
    { title: 'SSC & Railway picks', sub: 'Maths, reasoning, English and GK', exam: 'ssc', test: function (b) { return b.exams.indexOf('ssc') !== -1 || b.exams.indexOf('rail') !== -1; } },
    { title: 'New arrivals', sub: 'Fresh on the shelf', tag: 'new', test: function (b) { return b.isNew; } },
    { title: 'हिंदी माध्यम की किताबें', sub: 'Hindi medium', lang: 'Hindi', test: function (b) { return b.lang === 'Hindi'; } }
  ];

  function renderRails() {
    $('#rails').innerHTML = RAILS.map(function (r, i) {
      var items = BOOKS.filter(r.test);
      if (!items.length) return '';
      var all = r.exam ? 'data-exam="' + r.exam + '"' : (r.lang ? 'data-lang="' + r.lang + '"' : 'data-tag="' + r.tag + '"');
      return '<section class="container block reveal" aria-label="' + esc(r.title) + '">' +
        '<div class="block-head"><div><h2 class="' + (r.lang ? 'hi' : '') + '">' + esc(r.title) + '</h2><span class="sub">' + esc(r.sub) + '</span></div>' +
        '<button type="button" class="viewall" ' + all + '>View all</button></div>' +
        '<div class="rail-wrap"><button type="button" class="rail-btn l" data-rail="' + i + '" data-dir="-1" aria-label="Scroll left">&#8249;</button>' +
        '<div class="rail" id="rail' + i + '">' + items.map(function (b, k) { return card(b, k, 'rail'); }).join('') + '</div>' +
        '<button type="button" class="rail-btn r" data-rail="' + i + '" data-dir="1" aria-label="Scroll right">&#8250;</button></div></section>';
    }).join('');

    $$('.rail').forEach(function (rail) { rail.addEventListener('scroll', function () { updateRailArrows(rail); }, { passive: true }); updateRailArrows(rail); });
  }

  function updateRailArrows(rail) {
    var wrap = rail.parentNode, l = $('.rail-btn.l', wrap), r = $('.rail-btn.r', wrap);
    var max = rail.scrollWidth - rail.clientWidth;
    l.disabled = rail.scrollLeft <= 4;
    r.disabled = rail.scrollLeft >= max - 4;
  }

  /* ---------- catalogue ---------- */
  function matches(b, q) {
    if (!q) return true;
    var hay = (b.title + ' ' + b.author + ' ' + (b.publisher || '') + ' ' + b.lang + ' ' + b.exams.map(examName).join(' ')).toLowerCase();
    return q.toLowerCase().split(/\s+/).filter(Boolean).every(function (w) { return hay.indexOf(w) !== -1; });
  }

  function renderChips() {
    var all = [{ id: 'all', en: 'All' }].concat(EXAMS);
    $('#chips').innerHTML = all.map(function (e) {
      return '<button type="button" class="chip" data-chip="' + e.id + '" aria-pressed="' + (filter.exam === e.id) + '">' + esc(e.en) + '</button>';
    }).join('');
  }

  function pill(label, key) {
    return '<button type="button" class="pill" data-clear="' + key + '">' + esc(label) + ' <span aria-hidden="true">&times;</span><span class="sr"> remove this filter</span></button>';
  }
  function renderActive() {
    var out = [];
    if (filter.tag) out.push(pill(TAGS[filter.tag], 'tag'));
    if (filter.wishOnly) out.push(pill('Your wishlist', 'wish'));
    if (filter.q.trim()) out.push(pill('Search: ' + filter.q.trim(), 'q'));
    if (filter.lang !== 'all') out.push(pill(filter.lang + ' medium', 'lang'));
    $('#activeTags').innerHTML = out.join('');
  }

  function renderGrid() {
    var out = BOOKS.filter(function (b) {
      if (filter.wishOnly && wish.indexOf(b.id) === -1) return false;
      if (filter.exam !== 'all' && b.exams.indexOf(filter.exam) === -1) return false;
      if (filter.lang !== 'all' && b.lang !== filter.lang) return false;
      if (filter.tag === 'best' && !b.best) return false;
      if (filter.tag === 'new' && !b.isNew) return false;
      return matches(b, filter.q.trim());
    });

    if (filter.sort === 'low') out.sort(function (a, b) { return a.price - b.price; });
    if (filter.sort === 'high') out.sort(function (a, b) { return b.price - a.price; });
    if (filter.sort === 'disc') out.sort(function (a, b) { return off(b) - off(a); });

    $('#resultCount').textContent = out.length + (out.length === 1 ? ' book' : ' books');
    $('#grid').innerHTML = out.length ? out.map(function (b, i) { return card(b, i, 'grid'); }).join('') :
      '<p class="empty">' + (filter.wishOnly ? 'Your wishlist is empty. Tap the heart on any book to save it here.' :
        'No book matches these filters. Try another exam or clear the search. We may still have it in the shop.') + '</p>';
    renderActive();
  }

  function refreshCatalogue() {
    renderChips();
    renderGrid();
    $('#langSel').value = filter.lang;
    $('#sortSel').value = filter.sort;
    $('#searchCat').value = filter.exam;
    $('#searchQ').value = filter.q;
  }

  function setFilter(patch) {
    var k;
    for (k in DEFAULT_FILTER) filter[k] = DEFAULT_FILTER[k];
    for (k in patch) filter[k] = patch[k];
    refreshCatalogue();
  }

  function showCatalogue() {
    var head = $('.site-header');
    var top = $('#catalogue').getBoundingClientRect().top + window.pageYOffset - (head ? head.offsetHeight : 0) - 12;
    window.scrollTo({ top: top, behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  /* ---------- search suggestions ---------- */
  function hideSuggest() { var b = $('#suggest'); b.hidden = true; b.innerHTML = ''; }
  function renderSuggest() {
    var q = $('#searchQ').value.trim(), box = $('#suggest');
    if (q.length < 2) { hideSuggest(); return; }
    var res = BOOKS.filter(function (b) { return matches(b, q); }).slice(0, 6);
    box.innerHTML = res.length ? res.map(function (b) {
      return '<button type="button" class="sg" data-view="' + b.id + '" data-sg><span class="sg-t">' + esc(b.title) + '</span>' +
        '<span class="sg-m">' + esc(b.author) + ' &middot; ' + money(b.price) + '</span></button>';
    }).join('') : '<p class="sg-none">No match yet. Press Search to look again.</p>';
    box.hidden = false;
  }

  /* ---------- cart and wishlist ---------- */
  function cartCount() { var n = 0; for (var k in cart) n += cart[k]; return n; }
  function saveCart() { write('mbs_cart', cart); renderBadges(); renderDrawer(); }

  function renderBadges() {
    $('#cartCount').textContent = cartCount();
    $('#wishCount').textContent = wish.length;
  }
  function bump(el) {
    el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump');
  }

  function flyToCart(from) {
    if (reduceMotion || !from || !from.animate) return;
    var r = from.getBoundingClientRect(), c = $('#cartBtn').getBoundingClientRect();
    if (!r.width) return;
    var clone = from.cloneNode(true);
    clone.classList.add('fly');
    clone.style.position = 'fixed'; clone.style.left = r.left + 'px'; clone.style.top = r.top + 'px';
    clone.style.width = r.width + 'px'; clone.style.height = r.height + 'px'; clone.style.margin = '0';
    document.body.appendChild(clone);
    var dx = c.left + c.width / 2 - (r.left + r.width / 2), dy = c.top + c.height / 2 - (r.top + r.height / 2);
    var a = clone.animate([
      { transform: 'translate(0,0) scale(1) rotate(0deg)', opacity: 1 },
      { transform: 'translate(' + (dx * 0.55) + 'px,' + (dy * 0.55 - 40) + 'px) scale(.5) rotate(-8deg)', opacity: 1, offset: 0.55 },
      { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(.08) rotate(14deg)', opacity: 0.3 }
    ], { duration: 720, easing: 'cubic-bezier(.45,.05,.55,.95)' });
    a.onfinish = function () { clone.remove(); bump($('#cartCount')); bump($('#cartBtn')); };
  }

  function addToCart(id, source) {
    var b = byId(id); if (!b) return;
    cart[id] = (cart[id] || 0) + 1;
    write('mbs_cart', cart); renderBadges(); renderDrawer();
    if (reduceMotion) bump($('#cartCount'));
    flyToCart(source);
    toast('Added to cart: ' + b.short);
  }

  function toggleWish(id) {
    id = Number(id);
    var i = wish.indexOf(id);
    if (i === -1) wish.push(id); else wish.splice(i, 1);
    write('mbs_wish', wish); renderBadges();
    var on = wish.indexOf(id) !== -1;
    $$('[data-wish="' + id + '"]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(on));
      if (btn.classList.contains('wish')) btn.setAttribute('aria-label', on ? 'Remove from wishlist' : 'Add to wishlist');
      else btn.textContent = on ? 'In wishlist' : 'Add to wishlist';
    });
    if (filter.wishOnly) renderGrid();
    bump($('#wishCount'));
    return on;
  }

  function waLink(lines, total) {
    var msg = ['Hello ' + SHOP.name + ', I would like to order:'];
    lines.forEach(function (l, i) { msg.push((i + 1) + '. ' + l.b.title + ' x ' + l.qty + ' = ' + money(l.b.price * l.qty)); });
    msg.push('Total: ' + money(total));
    return 'https://wa.me/' + SHOP.whatsapp + '?text=' + encodeURIComponent(msg.join('\n'));
  }

  function renderDrawer() {
    var body = $('#drawerBody'), focusSel = null;
    var ae = document.activeElement;
    if (ae && body.contains(ae)) {
      ['data-inc', 'data-dec', 'data-rm'].forEach(function (a) { if (ae.hasAttribute(a)) focusSel = '[' + a + '="' + ae.getAttribute(a) + '"]'; });
    }

    var lines = [], total = 0, mrpTotal = 0;
    Object.keys(cart).forEach(function (id) {
      var b = byId(id);
      if (b && cart[id] > 0) { lines.push({ b: b, qty: cart[id] }); total += b.price * cart[id]; mrpTotal += b.mrp * cart[id]; }
    });

    if (!lines.length) {
      body.innerHTML = '<div class="drawer-empty"><p><b>Your cart is empty</b></p><p>Add books and send the list to the shop on WhatsApp.</p></div>';
      $('#drawerFoot').innerHTML = '';
      return;
    }

    body.innerHTML = lines.map(function (l) {
      return '<div class="line">' + cover(l.b) + '<div><h3>' + esc(l.b.title) + '</h3>' +
        '<p class="meta">' + esc(l.b.author) + '</p>' +
        '<div class="line-row"><div class="qty"><button type="button" data-dec="' + l.b.id + '" aria-label="Decrease quantity of ' + esc(l.b.short) + '">&minus;</button>' +
        '<span>' + l.qty + '</span>' +
        '<button type="button" data-inc="' + l.b.id + '" aria-label="Increase quantity of ' + esc(l.b.short) + '">+</button></div>' +
        '<b>' + money(l.b.price * l.qty) + '</b></div>' +
        '<button type="button" class="rm" data-rm="' + l.b.id + '">Remove</button></div></div>';
    }).join('');

    var saved = mrpTotal - total, ready = !!SHOP.whatsapp;
    $('#drawerFoot').innerHTML =
      '<div class="total"><span>Total</span><span>' + money(total) + '</span></div>' +
      (saved > 0 ? '<p class="saved">You save ' + money(saved) + ' on printed prices</p>' : '') +
      '<a class="wa" id="waBtn" ' + (ready ? 'href="' + esc(waLink(lines, total)) + '" target="_blank" rel="noopener"' : 'aria-disabled="true" role="link"') + '>Order on WhatsApp</a>' +
      (ready ? '' : '<p class="hint">Add your WhatsApp number in <code>js/config.js</code> to turn this button on.</p>') +
      '<button type="button" class="btn-ghost" id="clearCart">Clear cart</button>';

    if (focusSel) { var again = $(focusSel, body); if (again) again.focus(); else $('#drawerClose').focus(); }
  }

  /* ---------- drawer, dialog, scroll lock ---------- */
  var drawerOpen = false, lastFocus = null;
  function syncLock() { root.classList.toggle('lock', drawerOpen || $('#dlg').open); }

  function openDrawer() {
    lastFocus = document.activeElement;
    drawerOpen = true;
    renderDrawer();
    var body = $('#drawerBody'); body.classList.add('fresh'); setTimeout(function () { body.classList.remove('fresh'); }, 900);
    $('#overlay').classList.add('show');
    var d = $('#drawer'); d.classList.add('open'); d.setAttribute('aria-hidden', 'false');
    syncLock();
    setTimeout(function () { $('#drawerClose').focus(); }, 60);
  }
  function closeDrawer() {
    if (!drawerOpen) return;
    drawerOpen = false;
    $('#overlay').classList.remove('show');
    var d = $('#drawer'); d.classList.remove('open'); d.setAttribute('aria-hidden', 'true');
    syncLock();
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function openBook(id) {
    var b = byId(id); if (!b) return;
    var d = off(b), liked = wish.indexOf(b.id) !== -1, dlg = $('#dlg');
    $('#dlgBody').innerHTML =
      '<div>' + cover(b, true) + '</div>' +
      '<div><h2>' + esc(b.title) + '</h2><p class="by">by ' + esc(b.author) + '</p>' +
      '<div class="dlg-price"><b>' + money(b.price) + '</b>' + (d ? '<s>' + money(b.mrp) + '</s><span class="off">' + d + '% off</span>' : '') + '</div>' +
      '<dl class="facts">' +
      '<div><dt>Language</dt><dd>' + esc(b.lang) + '</dd></div>' +
      (b.publisher ? '<div><dt>Publisher</dt><dd>' + esc(b.publisher) + '</dd></div>' : '') +
      '<div><dt>Useful for</dt><dd>' + esc(b.exams.map(examName).join(', ')) + '</dd></div>' +
      '</dl>' +
      '<div class="dlg-buy"><button type="button" class="btn-cta" data-add="' + b.id + '">Add to cart</button>' +
      '<button type="button" class="btn-ghost" data-wish="' + b.id + '" aria-pressed="' + liked + '">' + (liked ? 'In wishlist' : 'Add to wishlist') + '</button></div></div>';
    if (!dlg.open) {
      dlg.classList.remove('closing');
      if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
      syncLock();
    }
  }
  function closeBook() {
    var dlg = $('#dlg');
    if (!dlg.open) return;
    if (reduceMotion) { dlg.close(); return; }
    dlg.classList.add('closing');
    var done = function (e) {
      if (e && e.target !== dlg) return;
      dlg.removeEventListener('animationend', done);
      dlg.classList.remove('closing');
      dlg.close();
    };
    dlg.addEventListener('animationend', done);
    setTimeout(function () { if (dlg.classList.contains('closing')) done(); }, 400);
  }

  /* ---------- toast ---------- */
  var toastTimer = null;
  function toast(msg) {
    var t = $('#toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); }, 2200);
  }

  /* ---------- scroll reveal ---------- */
  var io = null, revealReady = false;
  function observeReveals() {
    if (!revealReady) return;
    $$('.reveal:not(.in)').forEach(function (el) { if (io) io.observe(el); else el.classList.add('in'); });
  }
  function initReveal() {
    revealReady = true;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });
    }
    observeReveals();
  }

  /* ---------- scroll chrome ---------- */
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var y = window.pageYOffset;
      $('.site-header').classList.toggle('scrolled', y > 8);
      $('#toTop').classList.toggle('show', y > 700);
      ticking = false;
    });
  }

  /* ---------- preloader ---------- */
  function runPreloader() {
    var pl = $('#preloader');
    if (!pl) { pageReady(); return; }
    var seen = false;
    try { seen = sessionStorage.getItem('mbs_seen') === '1'; } catch (e) { /* ignore */ }
    var minMs = reduceMotion ? 450 : (seen ? 900 : 2600);
    var bar = $('#plBar'), bubbles = $$('.pl-omr i', pl);
    var t0 = performance.now(), loaded = document.readyState === 'complete', fontsOk = false, finished = false;

    if (!loaded) window.addEventListener('load', function () { loaded = true; });
    var fontWait = new Promise(function (res) { setTimeout(res, 1800); });
    var fontsReady = (document.fonts && document.fonts.ready) ? Promise.race([document.fonts.ready, fontWait]) : fontWait;
    fontsReady.then(function () { fontsOk = true; });

    function tick(now) {
      if (finished) return;
      var e = now - t0, x = Math.min(e / minMs, 1);
      var target = (loaded && fontsOk) ? 1 : 0.88;
      var p = Math.min(target, 1 - Math.pow(1 - x, 3));
      bar.style.transform = 'scaleX(' + p.toFixed(3) + ')';
      bubbles.forEach(function (b, k) { if (p >= (k + 1) / 4 - 0.02) b.classList.add('on'); });
      if (p >= 1 && e >= minMs) { finish(); return; }
      requestAnimationFrame(tick);
    }

    function finish() {
      finished = true;
      clearTimeout(window.__plFail);
      setTimeout(function () {
        pl.classList.add('done');
        root.classList.remove('is-loading');
        setTimeout(pageReady, reduceMotion ? 0 : 650);
        setTimeout(function () { pl.classList.add('gone'); }, reduceMotion ? 100 : 1700);
      }, reduceMotion ? 0 : 350);
      try { sessionStorage.setItem('mbs_seen', '1'); } catch (e) { /* ignore */ }
    }

    requestAnimationFrame(tick);
  }

  function pageReady() {
    if (root.classList.contains('page-ready')) return;
    root.classList.add('page-ready');
    initReveal();
    startAuto();
  }

  /* ---------- events ---------- */
  document.addEventListener('click', function (ev) {
    var t = ev.target.closest('[data-add],[data-wish],[data-view],[data-exam],[data-lang],[data-tag],[data-chip],[data-slide],[data-rail],[data-inc],[data-dec],[data-rm],[data-clear],[data-sg]');

    if (!ev.target.closest('.search-wrap')) hideSuggest();
    if (!t) return;
    if (t.hasAttribute('data-sg')) hideSuggest();

    if (t.hasAttribute('data-add')) {
      var host = t.closest('.card') || t.closest('#dlg');
      addToCart(t.getAttribute('data-add'), host ? $('.cover', host) : null);
      return;
    }
    if (t.hasAttribute('data-wish')) { toggleWish(t.getAttribute('data-wish')); return; }
    if (t.hasAttribute('data-view')) { openBook(t.getAttribute('data-view')); return; }
    if (t.hasAttribute('data-chip')) { filter.exam = t.getAttribute('data-chip'); refreshCatalogue(); return; }
    if (t.hasAttribute('data-clear')) {
      var key = t.getAttribute('data-clear');
      if (key === 'tag') filter.tag = '';
      if (key === 'wish') filter.wishOnly = false;
      if (key === 'q') filter.q = '';
      if (key === 'lang') filter.lang = 'all';
      refreshCatalogue(); return;
    }
    if (t.hasAttribute('data-slide')) { goSlide(Number(t.getAttribute('data-slide'))); startAuto(); return; }
    if (t.hasAttribute('data-rail')) {
      var rail = $('#rail' + t.getAttribute('data-rail'));
      rail.scrollBy({ left: Number(t.getAttribute('data-dir')) * 440, behavior: reduceMotion ? 'auto' : 'smooth' });
      return;
    }
    if (t.hasAttribute('data-inc')) { cart[t.getAttribute('data-inc')]++; saveCart(); return; }
    if (t.hasAttribute('data-dec')) {
      var k = t.getAttribute('data-dec');
      cart[k]--; if (cart[k] <= 0) delete cart[k];
      saveCart(); return;
    }
    if (t.hasAttribute('data-rm')) { delete cart[t.getAttribute('data-rm')]; saveCart(); return; }

    if (t.hasAttribute('data-exam') || t.hasAttribute('data-lang') || t.hasAttribute('data-tag')) {
      setFilter({
        exam: t.hasAttribute('data-exam') ? t.getAttribute('data-exam') : 'all',
        lang: t.hasAttribute('data-lang') ? t.getAttribute('data-lang') : 'all',
        tag: t.hasAttribute('data-tag') ? t.getAttribute('data-tag') : ''
      });
      showCatalogue();
    }
  });

  $('#searchForm').addEventListener('submit', function (ev) {
    ev.preventDefault();
    hideSuggest();
    setFilter({ exam: $('#searchCat').value, q: $('#searchQ').value });
    showCatalogue();
  });
  $('#searchQ').addEventListener('input', renderSuggest);
  $('#searchQ').addEventListener('focus', renderSuggest);
  $('#searchQ').addEventListener('keydown', function (ev) {
    if (ev.key === 'ArrowDown') { var f = $('#suggest .sg'); if (f) { ev.preventDefault(); f.focus(); } }
    if (ev.key === 'Escape') hideSuggest();
  });
  $('#suggest').addEventListener('keydown', function (ev) {
    var items = $$('#suggest .sg'), i = items.indexOf(document.activeElement);
    if (ev.key === 'ArrowDown' && i < items.length - 1) { ev.preventDefault(); items[i + 1].focus(); }
    if (ev.key === 'ArrowUp') { ev.preventDefault(); if (i > 0) items[i - 1].focus(); else $('#searchQ').focus(); }
    if (ev.key === 'Escape') { hideSuggest(); $('#searchQ').focus(); }
  });

  $('#langSel').addEventListener('change', function (ev) { filter.lang = ev.target.value; renderGrid(); });
  $('#sortSel').addEventListener('change', function (ev) { filter.sort = ev.target.value; renderGrid(); });

  $('#cartBtn').addEventListener('click', openDrawer);
  $('#footCart').addEventListener('click', openDrawer);
  $('#drawerClose').addEventListener('click', closeDrawer);
  $('#overlay').addEventListener('click', closeDrawer);
  $('#wishBtn').addEventListener('click', function () {
    if (!wish.length) { toast('Tap the heart on a book to save it here'); return; }
    setFilter({ wishOnly: true });
    showCatalogue();
  });
  document.addEventListener('click', function (ev) { if (ev.target.id === 'clearCart') { cart = {}; saveCart(); } });

  document.addEventListener('keydown', function (ev) {
    if (!drawerOpen) return;
    if (ev.key === 'Escape') { closeDrawer(); return; }
    if (ev.key === 'Tab') {
      var f = $$('#drawer button, #drawer a[href]').filter(function (el) { return !el.disabled && el.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (ev.shiftKey && document.activeElement === first) { ev.preventDefault(); last.focus(); }
      else if (!ev.shiftKey && document.activeElement === last) { ev.preventDefault(); first.focus(); }
    }
  });

  var dlg = $('#dlg');
  $('#dlgClose').addEventListener('click', closeBook);
  dlg.addEventListener('click', function (ev) { if (ev.target === dlg) closeBook(); });
  dlg.addEventListener('cancel', function (ev) { ev.preventDefault(); closeBook(); });
  dlg.addEventListener('close', syncLock);

  $('#slPrev').addEventListener('click', function () { goSlide(slideIndex - 1); startAuto(); });
  $('#slNext').addEventListener('click', function () { goSlide(slideIndex + 1); startAuto(); });
  var slider = $('#slider');
  slider.addEventListener('mouseenter', stopAuto);
  slider.addEventListener('mouseleave', startAuto);
  slider.addEventListener('focusin', stopAuto);
  slider.addEventListener('focusout', startAuto);
  slider.addEventListener('touchstart', function (ev) { touchX = ev.touches[0].clientX; touchY = ev.touches[0].clientY; stopAuto(); }, { passive: true });
  slider.addEventListener('touchend', function (ev) {
    if (touchX == null) return;
    var dx = ev.changedTouches[0].clientX - touchX, dy = ev.changedTouches[0].clientY - touchY;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) goSlide(slideIndex + (dx < 0 ? 1 : -1));
    touchX = touchY = null; startAuto();
  }, { passive: true });

  $('#toTop').addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }); });
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { $$('.rail').forEach(updateRailArrows); });

  /* ---------- start ---------- */
  renderNav();
  renderFooter();
  renderVisit();
  renderSlider();
  renderRails();
  refreshCatalogue();
  renderBadges();
  renderDrawer();
  goSlide(0);
  onScroll();
  runPreloader();
})();
