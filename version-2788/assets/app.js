(function () {
  var menuButton = document.querySelector(".menu-toggle");
  var nav = document.querySelector(".main-nav");

  if (menuButton && nav) {
    menuButton.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
  var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dots button"));
  var activeSlide = 0;
  var heroTimer;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    activeSlide = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle("active", slideIndex === activeSlide);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle("active", dotIndex === activeSlide);
    });
  }

  function startHero() {
    if (slides.length < 2) {
      return;
    }

    window.clearInterval(heroTimer);
    heroTimer = window.setInterval(function () {
      showSlide(activeSlide + 1);
    }, 5200);
  }

  dots.forEach(function (dot, dotIndex) {
    dot.addEventListener("click", function () {
      showSlide(dotIndex);
      startHero();
    });
  });

  showSlide(0);
  startHero();

  var globalSearch = document.getElementById("global-search");
  var searchPanel = document.getElementById("search-panel");

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>\"]/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;"
      }[char];
    });
  }

  function renderSearchResults(keyword) {
    if (!globalSearch || !searchPanel) {
      return;
    }

    var query = normalize(keyword);

    if (!query) {
      searchPanel.hidden = true;
      searchPanel.innerHTML = "";
      return;
    }

    var list = Array.isArray(window.SEARCH_MOVIES) ? window.SEARCH_MOVIES : [];
    var results = list.filter(function (item) {
      return normalize(item.title).indexOf(query) > -1 ||
        normalize(item.year).indexOf(query) > -1 ||
        normalize(item.genre).indexOf(query) > -1 ||
        normalize(item.region).indexOf(query) > -1 ||
        normalize(item.type).indexOf(query) > -1;
    }).slice(0, 12);

    if (!results.length) {
      searchPanel.innerHTML = '<div class="search-empty">未找到匹配影片</div>';
      searchPanel.hidden = false;
      return;
    }

    searchPanel.innerHTML = results.map(function (item) {
      return '<a class="search-item" href="' + escapeHtml(item.url) + '">' +
        '<img src="' + escapeHtml(item.image) + '" alt="' + escapeHtml(item.title) + '">' +
        '<span><strong>' + escapeHtml(item.title) + '</strong><span>' + escapeHtml(item.year) + ' · ' + escapeHtml(item.region) + ' · ' + escapeHtml(item.genre) + '</span></span>' +
        '</a>';
    }).join("");
    searchPanel.hidden = false;
  }

  if (globalSearch && searchPanel) {
    globalSearch.addEventListener("input", function () {
      renderSearchResults(globalSearch.value);
    });

    document.addEventListener("click", function (event) {
      if (!event.target.closest(".header-search")) {
        searchPanel.hidden = true;
      }
    });
  }

  var filterInput = document.querySelector(".page-filter-input");
  var yearSelect = document.querySelector(".page-filter-year");
  var typeSelect = document.querySelector(".page-filter-type");
  var filterCards = Array.prototype.slice.call(document.querySelectorAll(".movie-card"));
  var noResults = document.querySelector(".no-results");

  function filterPageCards() {
    if (!filterCards.length) {
      return;
    }

    var keyword = normalize(filterInput ? filterInput.value : "");
    var year = yearSelect ? normalize(yearSelect.value) : "";
    var type = typeSelect ? normalize(typeSelect.value) : "";
    var visible = 0;

    filterCards.forEach(function (card) {
      var text = normalize([
        card.getAttribute("data-title"),
        card.getAttribute("data-genre"),
        card.getAttribute("data-year"),
        card.getAttribute("data-region")
      ].join(" "));
      var matchesKeyword = !keyword || text.indexOf(keyword) > -1;
      var matchesYear = !year || normalize(card.getAttribute("data-year")) === year;
      var matchesType = !type || normalize(card.querySelector(".card-tags span") ? card.querySelector(".card-tags span").textContent : "") === type;
      var isVisible = matchesKeyword && matchesYear && matchesType;

      card.classList.toggle("hidden-card", !isVisible);
      if (isVisible) {
        visible += 1;
      }
    });

    if (noResults) {
      noResults.hidden = visible !== 0;
    }
  }

  [filterInput, yearSelect, typeSelect].forEach(function (control) {
    if (control) {
      control.addEventListener("input", filterPageCards);
      control.addEventListener("change", filterPageCards);
    }
  });
})();
