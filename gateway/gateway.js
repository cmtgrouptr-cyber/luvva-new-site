(() => {
  "use strict";

  const SESSION_KEY = "luvva_gateway_session_v1";
  const SESSION_DURATION_MS = 90 * 60 * 1000;

  const gateway = document.getElementById("luvvaGateway");
  const introScreen = document.getElementById("luvvaGatewayIntro");
  const statusBox = document.getElementById("luvvaGatewayStatus");
  const providerButtons = document.querySelectorAll("[data-luvva-provider]");

  if (!gateway || !introScreen || !statusBox) {
    console.error("LUVVA Gateway: required elements are missing.");
    document.body.classList.remove("luvva-gateway-locked");
    return;
  }

  function readSession() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return null;

      const session = JSON.parse(raw);

      if (!session.expiresAt || Date.now() >= session.expiresAt) {
        localStorage.removeItem(SESSION_KEY);
        return null;
      }

      return session;
    } catch (error) {
      console.warn("LUVVA Gateway: invalid session cleared.", error);
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
  }

  function savePrototypeSession(provider) {
    const now = Date.now();
    const session = {
      provider,
      createdAt: now,
      expiresAt: now + SESSION_DURATION_MS,
      mode: "prototype"
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  }

  function unlockSite() {
    gateway.hidden = true;
    document.body.classList.remove("luvva-gateway-locked");
    document.body.style.removeProperty("overflow");
  }

  function setBusy(busy) {
    providerButtons.forEach((button) => {
      button.disabled = busy;
    });
  }

  function showStatus(message) {
    statusBox.hidden = false;
    statusBox.textContent = message;
  }

  function playIntroAndUnlock() {
    introScreen.classList.add("show");
    introScreen.setAttribute("aria-hidden", "false");

    window.setTimeout(() => {
      unlockSite();
    }, 3000);
  }

  function handleProvider(provider) {
    setBusy(true);

    showStatus(
      `${provider} is running in prototype mode. Real provider authentication will be connected in the next implementation stage.`
    );

    savePrototypeSession(provider);

    window.setTimeout(playIntroAndUnlock, 700);
  }

  providerButtons.forEach((button) => {
    button.addEventListener("click", () => {
      handleProvider(button.dataset.luvvaProvider || "Provider");
    });
  });

  const activeSession = readSession();

  if (activeSession) {
    unlockSite();
  }
})();
