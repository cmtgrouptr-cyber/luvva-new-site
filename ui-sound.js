(function () {
  "use strict";

  var AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;

  var ctx = null;
  var ready = false;
  var lastToneAt = 0;
  var lastHoverKey = null;

  function audio() {
    if (!ctx || ctx.state === "closed") {
      ctx = new AudioCtx({ latencyHint: "interactive" });
    }
    return ctx;
  }

  function unlock() {
    var current = audio();
    if (current.state === "running") {
      ready = true;
      return Promise.resolve(true);
    }
    return current.resume().then(function () {
      ready = current.state === "running";
      return ready;
    }).catch(function () {
      ready = false;
      return false;
    });
  }

  function siteKey(target) {
    if (!target || !target.closest) return null;
    var key = target.closest(
      "#siteHeader a, #siteHeader button, main a[href], main button, footer a[href], footer button"
    );
    if (!key || key.disabled || key.getAttribute("aria-disabled") === "true") return null;
    if (key.closest("#luvvaGatewayV3, #luvvaAuthBackdrop")) return null;
    var box = key.getBoundingClientRect();
    return box.width && box.height ? key : null;
  }

  function play(kind) {
    var current = audio();
    if (!ready || current.state !== "running") return;

    var stamp = performance.now();
    var quietPeriod = kind === "press" ? 48 : 82;
    if (stamp - lastToneAt < quietPeriod) return;
    lastToneAt = stamp;

    var now = current.currentTime;
    var duration = kind === "press" ? 0.065 : 0.075;
    var osc = current.createOscillator();
    var gain = current.createGain();
    var filter = current.createBiquadFilter();

    osc.type = "sine";
    osc.frequency.setValueAtTime(kind === "press" ? 590 : 470, now);
    osc.frequency.exponentialRampToValueAtTime(kind === "press" ? 420 : 545, now + duration * 0.72);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1250, now);
    filter.Q.setValueAtTime(0.55, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(kind === "press" ? 0.014 : 0.009, now + 0.009);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(current.destination);
    osc.start(now);
    osc.stop(now + duration + 0.01);
  }

  function unlockAndPlay(kind) {
    unlock().then(function (unlocked) {
      if (unlocked) play(kind);
    });
  }

  document.addEventListener("pointerover", function (event) {
    if (event.pointerType && event.pointerType !== "mouse" && event.pointerType !== "pen") return;
    var key = siteKey(event.target);
    if (!key) return;
    if (event.relatedTarget && key.contains(event.relatedTarget)) return;
    if (key === lastHoverKey) return;
    lastHoverKey = key;
    if (ready) play("hover");
  }, true);

  document.addEventListener("pointerout", function (event) {
    var key = siteKey(event.target);
    if (!key) return;
    if (event.relatedTarget && key.contains(event.relatedTarget)) return;
    if (lastHoverKey === key) lastHoverKey = null;
  }, true);

  /* Persistent listeners are intentional: after Refresh, browsers may reject
     the first resume attempt. A later genuine gesture can still restore sound. */
  document.addEventListener("pointerdown", function (event) {
    var key = siteKey(event.target);
    if (key) unlockAndPlay("press");
    else unlock();
  }, true);

  document.addEventListener("click", function () {
    if (!ready) unlock();
  }, true);

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Enter" && event.key !== " ") return;
    var key = siteKey(event.target);
    if (key) unlockAndPlay("press");
    else unlock();
  }, true);

  document.addEventListener("visibilitychange", function () {
    if (!document.hidden && ctx && ctx.state === "suspended") ready = false;
  });
})();
