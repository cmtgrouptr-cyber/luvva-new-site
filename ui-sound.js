(function () {
  "use strict";

  var mobileQuery = window.matchMedia("(hover: none) and (pointer: coarse) and (max-width: 1200px)");
  var suppressClickUntil = 0;

  function prepareMobileNav() {
    if (!mobileQuery.matches) return;
    var nav = document.getElementById("mainNav");
    if (!nav) return;

    /* A fixed LTR scrolling axis avoids Android's inconsistent negative
       scrollLeft behavior in RTL. Arabic remains RTL inside each key. */
    nav.style.setProperty("direction", "ltr", "important");
    var arabic = (document.documentElement.lang || "").toLowerCase().indexOf("ar") === 0;
    nav.querySelectorAll("a").forEach(function (link) {
      link.style.setProperty("direction", arabic ? "rtl" : "ltr", "important");
    });

    if (nav.dataset.luvvaDragBound === "1") return;
    nav.dataset.luvvaDragBound = "1";

    var pointerId = null;
    var startX = 0;
    var startScroll = 0;
    var dragging = false;

    nav.addEventListener("pointerdown", function (event) {
      if (event.button !== undefined && event.button !== 0) return;
      pointerId = event.pointerId;
      startX = event.clientX;
      startScroll = nav.scrollLeft;
      dragging = false;
      try { nav.setPointerCapture(pointerId); } catch (_) {}
    }, { passive: true });

    nav.addEventListener("pointermove", function (event) {
      if (pointerId === null || event.pointerId !== pointerId) return;
      var distance = event.clientX - startX;
      if (!dragging && Math.abs(distance) < 5) return;
      dragging = true;
      nav.scrollLeft = startScroll - distance;
      event.preventDefault();
    }, { passive: false });

    function finish(event) {
      if (pointerId === null || (event.pointerId !== undefined && event.pointerId !== pointerId)) return;
      if (dragging) suppressClickUntil = Date.now() + 260;
      var finishedPointerId = pointerId;
      pointerId = null;
      dragging = false;
      try { nav.releasePointerCapture(finishedPointerId); } catch (_) {}
    }

    nav.addEventListener("pointerup", finish, { passive: true });
    nav.addEventListener("pointercancel", finish, { passive: true });
    nav.addEventListener("lostpointercapture", finish, { passive: true });
    nav.addEventListener("click", function (event) {
      if (Date.now() < suppressClickUntil) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    }, true);
  }

  function settleMobileNav() {
    prepareMobileNav();
    window.setTimeout(prepareMobileNav, 80);
    window.setTimeout(prepareMobileNav, 700);
    window.setTimeout(prepareMobileNav, 1300);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", settleMobileNav);
  } else {
    settleMobileNav();
  }
  window.addEventListener("load", settleMobileNav);
  window.addEventListener("pageshow", settleMobileNav);
  document.addEventListener("click", function (event) {
    if (event.target.closest && event.target.closest("#languageOptions button")) {
      window.setTimeout(settleMobileNav, 60);
    }
  }, true);
  new MutationObserver(function () {
    window.setTimeout(prepareMobileNav, 0);
  }).observe(document.documentElement, { attributes: true, attributeFilter: ["lang", "dir"] });
})();

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
