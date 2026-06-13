(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var toggle = document.querySelector(".mobile-toggle");
    if (toggle) {
      toggle.addEventListener("click", function () {
        document.body.classList.toggle("mobile-open");
      });
    }

    var hero = document.querySelector(".hero-slider");
    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
      var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
      var previous = document.querySelector("[data-hero-prev]");
      var next = document.querySelector("[data-hero-next]");
      var index = 0;
      var timer;

      function show(nextIndex) {
        if (!slides.length) {
          return;
        }
        index = (nextIndex + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle("is-active", slideIndex === index);
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle("is-active", dotIndex === index);
        });
      }

      function start() {
        timer = window.setInterval(function () {
          show(index + 1);
        }, 5200);
      }

      function restart() {
        window.clearInterval(timer);
        start();
      }

      dots.forEach(function (dot, dotIndex) {
        dot.addEventListener("click", function () {
          show(dotIndex);
          restart();
        });
      });

      if (previous) {
        previous.addEventListener("click", function () {
          show(index - 1);
          restart();
        });
      }

      if (next) {
        next.addEventListener("click", function () {
          show(index + 1);
          restart();
        });
      }

      show(0);
      start();
    }

    var quickSearch = document.querySelector("[data-quick-search]");
    if (quickSearch) {
      quickSearch.addEventListener("submit", function (event) {
        event.preventDefault();
        var input = quickSearch.querySelector("input");
        var value = input ? input.value.trim() : "";
        var target = "./search.html";
        if (value) {
          target += "?q=" + encodeURIComponent(value);
        }
        window.location.href = target;
      });
    }

    var filterRoot = document.querySelector("[data-filter-root]");
    if (filterRoot) {
      var input = filterRoot.querySelector("[data-filter-input]");
      var type = filterRoot.querySelector("[data-filter-type]");
      var year = filterRoot.querySelector("[data-filter-year]");
      var cards = Array.prototype.slice.call(filterRoot.querySelectorAll(".movie-card"));
      var empty = filterRoot.querySelector(".empty-result");
      var params = new URLSearchParams(window.location.search);
      var initial = params.get("q");

      if (initial && input) {
        input.value = initial;
      }

      function matches(card, query, typeValue, yearValue) {
        var haystack = [
          card.getAttribute("data-title") || "",
          card.getAttribute("data-genre") || "",
          card.getAttribute("data-region") || "",
          card.getAttribute("data-year") || "",
          card.getAttribute("data-type") || ""
        ].join(" ").toLowerCase();
        var cardType = (card.getAttribute("data-type") || "").toLowerCase();
        var cardYear = card.getAttribute("data-year") || "";
        var queryOk = !query || haystack.indexOf(query) !== -1;
        var typeOk = !typeValue || cardType.indexOf(typeValue) !== -1;
        var yearOk = !yearValue || cardYear === yearValue || (yearValue === "older" && Number(cardYear) < 2024);
        return queryOk && typeOk && yearOk;
      }

      function applyFilters() {
        var query = input ? input.value.trim().toLowerCase() : "";
        var typeValue = type ? type.value.toLowerCase() : "";
        var yearValue = year ? year.value : "";
        var visible = 0;
        cards.forEach(function (card) {
          var show = matches(card, query, typeValue, yearValue);
          card.hidden = !show;
          if (show) {
            visible += 1;
          }
        });
        if (empty) {
          empty.style.display = visible ? "none" : "block";
        }
      }

      [input, type, year].forEach(function (element) {
        if (element) {
          element.addEventListener("input", applyFilters);
          element.addEventListener("change", applyFilters);
        }
      });

      applyFilters();
    }

    var players = Array.prototype.slice.call(document.querySelectorAll("[data-player]"));
    players.forEach(function (frame) {
      var video = frame.querySelector("video");
      var cover = frame.querySelector(".player-cover");
      var source = frame.getAttribute("data-stream");
      var loaded = false;
      var instance = null;

      function attach() {
        if (loaded || !video || !source) {
          return;
        }
        loaded = true;
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = source;
        } else if (window.Hls && window.Hls.isSupported()) {
          instance = new window.Hls({ enableWorker: true });
          instance.loadSource(source);
          instance.attachMedia(video);
        } else {
          video.src = source;
        }
      }

      function play() {
        attach();
        frame.classList.add("is-playing");
        var promise = video.play();
        if (promise && promise.catch) {
          promise.catch(function () {});
        }
      }

      if (cover) {
        cover.addEventListener("click", play);
      }

      if (video) {
        video.addEventListener("click", function () {
          if (!loaded) {
            play();
          }
        });
        video.addEventListener("play", function () {
          frame.classList.add("is-playing");
        });
        video.addEventListener("error", function () {
          if (instance) {
            instance.destroy();
            instance = null;
          }
          loaded = false;
        });
      }
    });
  });
})();
