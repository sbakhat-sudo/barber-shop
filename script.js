(function () {
  "use strict";

  var THEME_KEY = "daoudi-theme";
  var PHONE = "+393513624891"; // numero WhatsApp del negozio

  var services = [
    { name: "Taglio uomo", time: "30 min", price: "€18" },
    { name: "Barba", time: "20 min", price: "€14" },
    { name: "Taglio + Barba", time: "50 min", price: "€28" },
    { name: "Rasatura a lama", time: "25 min", price: "€16" },
    { name: "Taglio bambino", time: "25 min", price: "€13" },
    { name: "Trattamento viso", time: "20 min", price: "€15" },
    { name: "Colore barba", time: "35 min", price: "€22" },
    { name: "Shampoo e styling", time: "15 min", price: "€10" }
  ];

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

  // ---------- Elenco servizi nel form ----------
  function initServiceSelect() {
    var select = document.getElementById("service-select");
    services.forEach(function (s) {
      var opt = document.createElement("option");
      opt.value = s.name;
      opt.textContent = s.name + " — " + s.price;
      select.appendChild(opt);
    });
  }

  // ---------- Giorno corrente negli orari ----------
  function highlightToday() {
    var today = String(new Date().getDay());
    var li = document.querySelector('.hours li[data-day="' + today + '"]');
    if (li) li.classList.add("today");
  }

  // ---------- Prenotazione via WhatsApp ----------
  function initBooking() {
    var form = document.getElementById("booking-form");
    var errorEl = document.getElementById("form-error");
    var doneCard = document.getElementById("booking-done");
    var summaryEl = document.getElementById("booking-summary");
    var resetBtn = document.getElementById("booking-reset");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      errorEl.hidden = true;

      var name = form.name.value.trim();
      var phone = form.phone.value.trim();
      var service = form.service.value;
      var date = form.date.value;
      var time = form.time.value;

      if (!name || !phone || !date || !time) {
        errorEl.textContent = "Compila tutti i campi per prenotare.";
        errorEl.hidden = false;
        return;
      }

      var dateFmt = formatDate(date);
      var message =
        "Ciao! Vorrei prenotare da Daoudi Barber Shop.\n" +
        "Nome: " + name + "\n" +
        "Telefono: " + phone + "\n" +
        "Servizio: " + service + "\n" +
        "Data: " + dateFmt + "\n" +
        "Ora: " + time;

      var waUrl = "https://wa.me/" + PHONE.replace("+", "") + "?text=" + encodeURIComponent(message);
      window.open(waUrl, "_blank", "noopener");

      summaryEl.textContent =
        "Grazie " + name + ", abbiamo aperto WhatsApp con la tua richiesta per il " +
        dateFmt + " alle " + time + " (" + service + "). Invia il messaggio per confermare: ti risponderemo al più presto.";
      form.hidden = true;
      doneCard.hidden = false;
    });

    resetBtn.addEventListener("click", function () {
      form.reset();
      form.hidden = false;
      doneCard.hidden = true;
    });
  }

  function formatDate(iso) {
    var parts = iso.split("-");
    if (parts.length !== 3) return iso;
    return parts[2] + "/" + parts[1] + "/" + parts[0];
  }

  function initYear() {
    document.getElementById("year").textContent = String(new Date().getFullYear());
  }

  document.addEventListener("DOMContentLoaded", function () {
    initTheme();
    initMenu();
    initServiceSelect();
    highlightToday();
    initBooking();
    initYear();
  });
})();
