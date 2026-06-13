var MoviePlayer = {
  mount: function (options) {
    var video = document.getElementById(options.videoId);
    var button = document.getElementById(options.buttonId);
    var layer = document.getElementById(options.layerId);
    var hlsInstance = null;

    if (!video || !button || !layer || !options.src) {
      return;
    }

    function loadVideo() {
      if (video.dataset.ready === "true") {
        return;
      }

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = options.src;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new Hls({
          enableWorker: true,
          lowLatencyMode: false
        });
        hlsInstance.loadSource(options.src);
        hlsInstance.attachMedia(video);
      } else {
        video.src = options.src;
      }

      video.dataset.ready = "true";
    }

    function startVideo() {
      loadVideo();
      layer.classList.add("is-hidden");
      video.controls = true;

      var promise = video.play();
      if (promise && typeof promise.catch === "function") {
        promise.catch(function () {});
      }
    }

    button.addEventListener("click", startVideo);
    layer.addEventListener("click", startVideo);
    video.addEventListener("click", function () {
      if (video.paused) {
        startVideo();
      }
    });

    window.addEventListener("beforeunload", function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  }
};
