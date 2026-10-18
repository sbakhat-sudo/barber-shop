(function () {
  "use strict";

  var THEME_KEY = "daoudi-theme";
  var CONTENT_KEY = "daoudi-content-v3";
  var SESSION_KEY = "daoudi-admin-session";

  // NB: password lato client — serve solo a evitare modifiche accidentali
  // di un visitatore curioso, NON è una vera misura di sicurezza (chiunque
  // guardi il codice sorgente la può vedere). Le modifiche fatte in modalità
  // manager restano salvate solo in QUESTO browser/dispositivo.
  var ADMIN_PASSWORD = "Daoudi2026";

  var DEFAULTS = {
    hero: {
      title: "Taglio netto.\nStile vero.",
      subtitle: "Barbiere di quartiere a Genova: taglio, barba e rasatura come si deve, in un ambiente industriale senza fronzoli."
    },
    contact: {
      address: "Via Antonio Gramsci 75r, 16100 Genova",
      phone: "+39 351 362 4891",
      email: "info@daoudibarber.it"
    },
    services: [
      { name: "Taglio uomo", desc: "Taglio classico o moderno, su misura", time: "30 min", price: "€18" },
      { name: "Barba", desc: "Rifinitura e modellatura con rasoio", time: "20 min", price: "€14" },
      { name: "Taglio + Barba", desc: "Il combo completo", time: "50 min", price: "€28" },
      { name: "Rasatura a lama", desc: "Rasatura tradizionale con panno caldo", time: "25 min", price: "€16" },
      { name: "Taglio bambino", desc: "Fino a 12 anni", time: "25 min", price: "€13" },
      { name: "Trattamento viso", desc: "Pulizia e idratazione post rasatura", time: "20 min", price: "€15" },
      { name: "Colore barba", desc: "Copertura o schiarimento naturale", time: "35 min", price: "€22" },
      { name: "Shampoo e styling", desc: "Lavaggio e piega finale", time: "15 min", price: "€10" }
    ],
    team: [
      { id: "team-1", name: "Karim Daoudi", role: "Titolare / Master Barber", photoDefault: "img/team-1.jpg", photo: null },
      { id: "team-2", name: "Luca Ferraro", role: "Barbiere", photoDefault: "img/team-2.jpg", photo: null },
      { id: "team-3", name: "Samir Haddad", role: "Barbiere", photoDefault: "img/team-3.jpg", photo: null }
    ],
    gallery: [
      { id: "gal-1", photoDefault: "img/gal-1.jpg", photo: null },
      { id: "gal-2", photoDefault: "img/gal-2.jpg", photo: null },
      { id: "gal-3", photoDefault: "img/gal-3.jpg", photo: null },
      { id: "gal-4", photoDefault: "img/gal-4.jpg", photo: null },
      { id: "gal-5", photoDefault: "img/gal-5.jpg", photo: null },
      { id: "gal-6", photoDefault: "img/gal-6.jpg", photo: null }
    ],
    ig: [
      { id: "ig-1", photoDefault: "img/ig-1.jpg", photo: null },
      { id: "ig-2", photoDefault: "img/ig-2.jpg", photo: null },
      { id: "ig-3", photoDefault: "img/ig-3.jpg", photo: null },
      { id: "ig-4", photoDefault: "img/ig-4.jpg", photo: null },
      { id: "ig-5", photoDefault: "img/ig-5.jpg", photo: null },
      { id: "ig-6", photoDefault: "img/ig-6.jpg", photo: null }
    ],
    reviews: [
      { name: "Marco B.", stars: "★★★★★", text: "Il miglior taglio che abbia mai avuto a Genova. Ambiente curato e professionalità vera." },
      { name: "Giulia R.", stars: "★★★★★", text: "Ho portato mio figlio per il primo taglio, pazienza e precisione. Torneremo sicuramente." },
      { name: "Andrea T.", stars: "★★★★☆", text: "Barba perfetta con rasoio tradizionale. Locale con un bello stile industriale." }
    ],
    hours: [
      { day: "Lunedì", time: "Chiuso" },
      { day: "Martedì", time: "09:00 – 19:30" },
      { day: "Mercoledì", time: "09:00 – 19:30" },
      { day: "Giovedì", time: "09:00 – 19:30" },
      { day: "Venerdì", time: "09:00 – 20:00" },
      { day: "Sabato", time: "08:30 – 18:00" },
      { day: "Domenica", time: "Chiuso" }
    ],
    counter: 1
  };

  var state = loadState();
  var editMode = false;

  function loadState() {
    try {
      var raw = localStorage.getItem(CONTENT_KEY);
      if (raw) {
        var saved = JSON.parse(raw);
        return Object.assign({}, DEFAULTS, saved);
      }
    } catch (e) {}
    return JSON.parse(JSON.stringify(DEFAULTS));
  }

  function persist() {
    try { localStorage.setItem(CONTENT_KEY, JSON.stringify(state)); }
    catch (e) { alert("Spazio di salvataggio esaurito nel browser: prova a usare foto più leggere."); }
  }

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html !== undefined) n.innerHTML = html;
    return n;
  }

  // ---------- Reveal on scroll ----------
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("visible"); revealObserver.unobserve(e.target); }
    });
  }, { threshold: 0.12 });

  function observeReveals(root) {
    (root || document).querySelectorAll(".reveal:not(.observed)").forEach(function (n) {
      n.classList.add("observed");
      revealObserver.observe(n);
    });
  }

  // ---------- Foto: compressione lato client ----------
  function readAndCompress(file, maxDim, cb) {
    var reader = new FileReader();
    reader.onload = function () {
      var img = new Image();
      img.onload = function () {
        var scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        var w = Math.round(img.width * scale), h = Math.round(img.height * scale);
        var canvas = document.createElement("canvas");
        canvas.width = w; canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        cb(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  function pickPhoto(maxDim, cb) {
    var input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = function () {
      if (input.files && input.files[0]) readAndCompress(input.files[0], maxDim, cb);
    };
    input.click();
  }

  function photoSlot(opts) {
    // opts: { wrapClass, label, defaultSrc, src, maxDim, onUpload, onRemove }
    var wrap = el("div", "ph" + (opts.wrapClass ? " " + opts.wrapClass : ""));
    wrap.dataset.label = opts.label || "Foto";
    var img = el("img");
    img.alt = "";
    img.loading = "lazy";
    img.src = opts.src || opts.defaultSrc || "";
    if (!opts.src) img.onerror = function () { img.remove(); };
    wrap.appendChild(img);
    if (editMode && opts.onUpload) {
      var up = el("button", "photo-edit-btn", "✎");
      up.type = "button";
      up.title = "Cambia foto";
      up.addEventListener("click", function () { pickPhoto(opts.maxDim || 1280, opts.onUpload); });
      wrap.appendChild(up);
    }
    if (editMode && opts.onRemove) {
      var rm = el("button", "photo-remove-btn", "✕");
      rm.type = "button";
      rm.title = "Rimuovi";
      rm.addEventListener("click", opts.onRemove);
      wrap.appendChild(rm);
    }
    return wrap;
  }

  // ---------- Hero ----------
  function renderHero() {
    var titleEl = document.getElementById("hero-title");
    var subEl = document.getElementById("hero-subtitle");
    if (editMode) {
      titleEl.innerHTML = "";
      var ti = el("textarea", "admin-input textarea");
      ti.value = state.hero.title;
      ti.style.fontFamily = "var(--font-head)";
      ti.style.fontSize = "28px";
      ti.style.textTransform = "uppercase";
      ti.addEventListener("input", function () { state.hero.title = ti.value; persist(); });
      titleEl.appendChild(ti);

      subEl.innerHTML = "";
      var si = el("textarea", "admin-input textarea");
      si.value = state.hero.subtitle;
      si.addEventListener("input", function () { state.hero.subtitle = si.value; persist(); });
      subEl.appendChild(si);
    } else {
      titleEl.innerHTML = state.hero.title.split("\n").map(escapeHTML).join("<br>");
      subEl.textContent = state.hero.subtitle;
    }
    var heroImg = document.getElementById("hero-bg-img");
    if (state.heroPhoto) heroImg.src = state.heroPhoto;
    var heroPh = document.getElementById("hero-bg-ph");
    var existingBtn = heroPh.querySelector(".photo-edit-btn");
    if (existingBtn) existingBtn.remove();
    if (editMode) {
      var upBtn = el("button", "photo-edit-btn", "✎");
      upBtn.type = "button";
      upBtn.title = "Cambia foto hero";
      upBtn.addEventListener("click", function () {
        pickPhoto(1920, function (dataUrl) { state.heroPhoto = dataUrl; persist(); renderHero(); });
      });
      heroPh.appendChild(upBtn);
    }
  }

  function escapeHTML(s) {
    var d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  // ---------- Servizi ----------
  function renderServices() {
    var ul = document.getElementById("services");
    ul.innerHTML = "";
    state.services.forEach(function (s, i) {
      var li = el("li");
      if (editMode) {
        li.className = "svc-edit-row";
        li.appendChild(inputFor(s, "name", "Nome servizio"));
        li.appendChild(inputFor(s, "desc", "Descrizione"));
        li.appendChild(inputFor(s, "time", "Durata"));
        li.appendChild(inputFor(s, "price", "Prezzo"));
        var rm = el("button", "photo-remove-btn", "✕");
        rm.type = "button";
        rm.style.position = "static";
        rm.addEventListener("click", function () { state.services.splice(i, 1); persist(); renderServices(); });
        li.appendChild(rm);
      } else {
        li.innerHTML =
          '<div><h3></h3><p></p></div><div class="svc-meta"><span></span><strong></strong></div>';
        li.querySelector("h3").textContent = s.name;
        li.querySelector("p").textContent = s.desc;
        li.querySelector(".svc-meta span").textContent = s.time;
        li.querySelector(".svc-meta strong").textContent = s.price;
      }
      ul.appendChild(li);
    });
  }

  function inputFor(obj, field, placeholder) {
    var input = el("input", "admin-input");
    input.value = obj[field];
    input.placeholder = placeholder;
    input.addEventListener("input", function () { obj[field] = input.value; persist(); });
    return input;
  }

  // ---------- Team ----------
  function renderTeam() {
    var wrap = document.getElementById("team-list");
    wrap.innerHTML = "";
    state.team.forEach(function (t, i) {
      var art = el("article");
      var slotWrap = el("div", "portrait");
      slotWrap.style.position = "relative";
      slotWrap.appendChild(photoSlot({
        label: "Foto barbiere", defaultSrc: t.photoDefault, src: t.photo, maxDim: 900,
        onUpload: function (dataUrl) { t.photo = dataUrl; persist(); renderTeam(); }
      }));
      art.appendChild(slotWrap);
      if (editMode) {
        art.appendChild(inputFor(t, "name", "Nome"));
        art.appendChild(inputFor(t, "role", "Ruolo"));
        var rm = el("button", "btn-dashed", "Rimuovi");
        rm.type = "button";
        rm.addEventListener("click", function () { state.team.splice(i, 1); persist(); renderTeam(); });
        art.appendChild(rm);
      } else {
        art.appendChild(el("h3", null, escapeHTML(t.name)));
        art.appendChild(el("span", "role", escapeHTML(t.role)));
      }
      wrap.appendChild(art);
    });
  }

  // ---------- Galleria / Instagram ----------
  function renderPhotoGrid(containerId, list, maxDim) {
    var wrap = document.getElementById(containerId);
    wrap.innerHTML = "";
    list.forEach(function (g, i) {
      wrap.appendChild(photoSlot({
        label: "Foto", defaultSrc: g.photoDefault, src: g.photo, maxDim: maxDim,
        onUpload: function (dataUrl) { g.photo = dataUrl; persist(); renderPhotoGrid(containerId, list, maxDim); },
        onRemove: editMode ? function () { list.splice(i, 1); persist(); renderPhotoGrid(containerId, list, maxDim); } : null
      }));
    });
  }

  // ---------- Recensioni ----------
  function renderReviews() {
    var wrap = document.getElementById("reviews-list");
    wrap.innerHTML = "";
    state.reviews.forEach(function (r, i) {
      var card = el("figure", "card");
      if (editMode) {
        card.appendChild(inputFor(r, "stars", "★★★★★"));
        var ta = el("textarea", "admin-input textarea");
        ta.value = r.text;
        ta.addEventListener("input", function () { r.text = ta.value; persist(); });
        card.appendChild(ta);
        card.appendChild(inputFor(r, "name", "Nome cliente"));
        var rm = el("button", "btn-dashed", "Rimuovi");
        rm.type = "button";
        rm.addEventListener("click", function () { state.reviews.splice(i, 1); persist(); renderReviews(); });
        card.appendChild(rm);
      } else {
        card.appendChild(el("div", "stars", escapeHTML(r.stars)));
        card.appendChild(el("blockquote", null, "“" + escapeHTML(r.text) + "”"));
        card.appendChild(el("figcaption", null, "— " + escapeHTML(r.name)));
      }
      wrap.appendChild(card);
    });
  }

  // ---------- Orari ----------
  function renderHours() {
    var ul = document.getElementById("hours");
    ul.innerHTML = "";
    var todayIdx = (new Date().getDay() + 6) % 7; // 0 = lunedì
    state.hours.forEach(function (h, i) {
      var li = el("li");
      if (i === todayIdx) li.classList.add("today");
      li.appendChild(el("span", null, escapeHTML(h.day)));
      if (editMode) {
        var input = el("input", "admin-input");
        input.style.maxWidth = "180px";
        input.style.textAlign = "right";
        input.value = h.time;
        input.addEventListener("input", function () { h.time = input.value; persist(); });
        li.appendChild(input);
      } else {
        li.appendChild(el("span", null, escapeHTML(h.time)));
      }
      ul.appendChild(li);
    });
  }

  // ---------- Contatti ----------
  function renderContact() {
    if (editMode) {
      var ina = document.getElementById("in-address");
      var inp = document.getElementById("in-phone");
      var ine = document.getElementById("in-email");
      ina.value = state.contact.address;
      inp.value = state.contact.phone;
      ine.value = state.contact.email;
      ina.oninput = function () { state.contact.address = ina.value; persist(); updateContactViews(); };
      inp.oninput = function () { state.contact.phone = inp.value; persist(); updateContactViews(); };
      ine.oninput = function () { state.contact.email = ine.value; persist(); updateContactViews(); };
    }
    updateContactViews();
  }

  function updateContactViews() {
    var c = state.contact;
    var telHref = "tel:" + c.phone.replace(/[^+\d]/g, "");
    var mailHref = "mailto:" + c.email;

    document.getElementById("view-address").textContent = c.address;
    var phoneLink = document.getElementById("view-phone-link");
    phoneLink.textContent = c.phone; phoneLink.href = telHref;
    var emailLink = document.getElementById("view-email-link");
    emailLink.textContent = c.email; emailLink.href = mailHref;

    document.getElementById("nav-call").href = telHref;
    document.getElementById("fab").href = telHref;
    document.getElementById("cta-call").href = telHref;
    document.getElementById("cta-call-num").textContent = c.phone;
    document.getElementById("cta-email").href = mailHref;
    document.getElementById("cta-email-addr").textContent = c.email;
    var waNum = c.phone.replace(/[^\d]/g, "");
    document.getElementById("cta-whatsapp").href = "https://wa.me/" + waNum;
    document.querySelectorAll('.hero-cta a[href^="tel:"]').forEach(function (a) { a.href = telHref; });
  }

  // ---------- Render completo ----------
  function renderAll() {
    renderHero();
    renderServices();
    renderTeam();
    renderPhotoGrid("gallery-list", state.gallery, 1280);
    renderPhotoGrid("ig-list", state.ig, 1000);
    renderReviews();
    renderHours();
    renderContact();
    document.querySelectorAll("[data-admin]").forEach(function (n) { n.hidden = !editMode; });
    document.querySelectorAll("[data-public]").forEach(function (n) { n.hidden = editMode; });
    observeReveals(document);
  }

  // ---------- Modalità manager ----------
  function setEditMode(v) {
    editMode = v;
    document.getElementById("admin-banner").hidden = !v;
    document.body.classList.toggle("is-admin", v);
    renderAll();
  }

  function initAdmin() {
    var modal = document.getElementById("admin-modal");
    var pwInput = document.getElementById("admin-password");
    var errorEl = document.getElementById("admin-error");

    document.getElementById("admin-open").addEventListener("click", function (e) {
      e.preventDefault();
      errorEl.hidden = true; pwInput.value = "";
      modal.hidden = false;
      pwInput.focus();
    });
    document.getElementById("admin-cancel").addEventListener("click", function () { modal.hidden = true; });
    modal.addEventListener("click", function (e) { if (e.target === modal) modal.hidden = true; });

    function tryLogin() {
      if (pwInput.value === ADMIN_PASSWORD) {
        try { sessionStorage.setItem(SESSION_KEY, "1"); } catch (e) {}
        modal.hidden = true;
        setEditMode(true);
      } else {
        errorEl.hidden = false;
      }
    }
    document.getElementById("admin-login").addEventListener("click", tryLogin);
    pwInput.addEventListener("keydown", function (e) { if (e.key === "Enter") tryLogin(); });

    document.getElementById("admin-exit").addEventListener("click", function () {
      try { sessionStorage.removeItem(SESSION_KEY); } catch (e) {}
      setEditMode(false);
    });

    var addSvc = document.getElementById("add-service");
    if (addSvc) addSvc.addEventListener("click", function () {
      state.services.push({ name: "Nuovo servizio", desc: "Descrizione", time: "20 min", price: "€0" });
      persist(); renderServices();
    });
    var addTeam = document.getElementById("add-team");
    if (addTeam) addTeam.addEventListener("click", function () {
      state.counter++;
      state.team.push({ id: "team-" + state.counter, name: "Nuovo barbiere", role: "Barbiere", photoDefault: "", photo: null });
      persist(); renderTeam();
    });
    var addGal = document.getElementById("add-gallery");
    if (addGal) addGal.addEventListener("click", function () {
      state.counter++;
      state.gallery.push({ id: "gal-" + state.counter, photoDefault: "", photo: null });
      persist(); renderPhotoGrid("gallery-list", state.gallery, 1280);
    });
    var addIg = document.getElementById("add-ig");
    if (addIg) addIg.addEventListener("click", function () {
      state.counter++;
      state.ig.push({ id: "ig-" + state.counter, photoDefault: "", photo: null });
      persist(); renderPhotoGrid("ig-list", state.ig, 1000);
    });
    var addRev = document.getElementById("add-review");
    if (addRev) addRev.addEventListener("click", function () {
      state.reviews.push({ name: "Cliente", stars: "★★★★★", text: "Nuova recensione" });
      persist(); renderReviews();
    });

    try { if (sessionStorage.getItem(SESSION_KEY) === "1") setEditMode(true); } catch (e) {}
  }

  // ---------- Tema chiaro/scuro ----------
  function initTheme() {
    var saved = null;
    try { saved = localStorage.getItem(THEME_KEY); } catch (e) {}
    if (saved) document.documentElement.dataset.theme = saved;
    var btn = document.getElementById("theme-toggle");
    btn.addEventListener("click", function () {
      var current = document.documentElement.dataset.theme === "light" ? "light" : "dark";
      var next = current === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
    });
  }

  // ---------- Menu mobile ----------
  function initMenu() {
    var burger = document.getElementById("burger");
    var links = document.getElementById("nav-links");
    burger.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  function initYear() {
    document.getElementById("year").textContent = String(new Date().getFullYear());
  }

  document.addEventListener("DOMContentLoaded", function () {
    initTheme();
    initMenu();
    initYear();
    renderAll();
    initAdmin();
  });
})();
