(function () {
  var video = document.getElementById("movie-player");
  var button = document.getElementById("video-cover-button");
  var mediaUrl = window.currentMedia;
  var hlsInstance = null;
  var ready = false;

  function attachMedia() {
    if (!video || !mediaUrl || ready) {
      return;
    }

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = mediaUrl;
      ready = true;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(mediaUrl);
      hlsInstance.attachMedia(video);
      ready = true;
      return;
    }

    video.src = mediaUrl;
    ready = true;
  }

  function beginPlayback() {
    attachMedia();

    if (button) {
      button.classList.add("hidden");
    }

    if (video) {
      var playResult = video.play();

      if (playResult && typeof playResult.catch === "function") {
        playResult.catch(function () {
          if (button) {
            button.classList.remove("hidden");
          }
        });
      }
    }
  }

  if (button) {
    button.addEventListener("click", beginPlayback);
  }

  if (video) {
    video.addEventListener("click", function () {
      if (!ready || video.paused) {
        beginPlayback();
      }
    });

    video.addEventListener("play", function () {
      if (button) {
        button.classList.add("hidden");
      }
    });
  }

  window.addEventListener("pagehide", function () {
    if (hlsInstance) {
      hlsInstance.destroy();
      hlsInstance = null;
    }
  });
})();
