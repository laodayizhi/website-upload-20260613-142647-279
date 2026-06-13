document.addEventListener("DOMContentLoaded", function () {
  var navToggle = document.querySelector(".nav-toggle");
  var mobilePanel = document.querySelector(".mobile-panel");

  if (navToggle && mobilePanel) {
    navToggle.addEventListener("click", function () {
      mobilePanel.classList.toggle("is-open");
    });
  }

  var slides = Array.from(document.querySelectorAll(".hero-slide"));
  var dots = Array.from(document.querySelectorAll(".hero-dot"));
  var activeIndex = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    activeIndex = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle("is-active", slideIndex === activeIndex);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle("is-active", dotIndex === activeIndex);
    });
  }

  dots.forEach(function (dot, dotIndex) {
    dot.addEventListener("click", function () {
      showSlide(dotIndex);
    });
  });

  if (slides.length > 1) {
    window.setInterval(function () {
      showSlide(activeIndex + 1);
    }, 5600);
  }

  var searchInput = document.querySelector("[data-movie-search]");
  var yearFilter = document.querySelector("[data-year-filter]");
  var typeFilter = document.querySelector("[data-type-filter]");
  var cards = Array.from(document.querySelectorAll(".movie-card"));
  var emptyBox = document.querySelector("[data-empty-box]");

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  function filterCards() {
    if (!cards.length) {
      return;
    }

    var query = normalize(searchInput ? searchInput.value : "");
    var year = normalize(yearFilter ? yearFilter.value : "");
    var type = normalize(typeFilter ? typeFilter.value : "");
    var visible = 0;

    cards.forEach(function (card) {
      var text = normalize([
        card.dataset.title,
        card.dataset.genre,
        card.dataset.region,
        card.dataset.type,
        card.dataset.year
      ].join(" "));
      var matchesQuery = !query || text.indexOf(query) !== -1;
      var matchesYear = !year || normalize(card.dataset.year) === year;
      var matchesType = !type || normalize(card.dataset.type) === type;
      var keep = matchesQuery && matchesYear && matchesType;

      card.classList.toggle("is-filtered-out", !keep);

      if (keep) {
        visible += 1;
      }
    });

    if (emptyBox) {
      emptyBox.classList.toggle("is-visible", visible === 0);
    }
  }

  [searchInput, yearFilter, typeFilter].forEach(function (control) {
    if (control) {
      control.addEventListener("input", filterCards);
      control.addEventListener("change", filterCards);
    }
  });
});
