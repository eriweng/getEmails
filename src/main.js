// src/main.js
import "../styles/tailwind.css";

document.addEventListener("DOMContentLoaded", () => {
  // 寫入 ts
  const tsInput = document.getElementById("ts");
  if (tsInput) tsInput.value = Date.now().toString();

  // --- Modal: show on page load and wire close handlers ---
  const modal = document.getElementById("promo-modal");
  const modalClose = document.getElementById("modal-close");
  const modalClose2 = document.getElementById("modal-close-2");
  const modalCTA = document.getElementById("modal-cta");
  const formClose = document.getElementById("close"); // existing element inside form

  function openModal() {
    if (!modal) return;
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    modal.setAttribute("aria-hidden", "false");
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.add("hidden");
    modal.classList.remove("flex");
    modal.setAttribute("aria-hidden", "true");
  }

  // show modal on first load
  // openModal();

  if (modalClose) modalClose.addEventListener("click", closeModal);
  if (modalClose2) modalClose2.addEventListener("click", closeModal);
  if (formClose)
    formClose.addEventListener("click", (e) => {
      e.preventDefault();
      closeModal();
    });
  if (modalCTA)
    modalCTA.addEventListener("click", () => {
      closeModal();
      setTimeout(() => {
        const el = document.getElementById("name");
        if (el) el.focus();
      }, 200);
    });

  // clicking on overlay closes modal
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // ESC closes modal
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  const endpoint = "/api/submit"; // 由 Vite 代理到 GAS /exec

  async function postWithTimeout(url, options = {}, timeoutMs = 20000) {
    const ctrl = new AbortController();
    const id = setTimeout(() => ctrl.abort("timeout"), timeoutMs);
    try {
      return await fetch(url, { ...options, signal: ctrl.signal });
    } finally {
      clearTimeout(id);
    }
  }

  // 處理所有 form（modal 與 email section）
  const forms = [
    { id: "form", nameId: "name", emailId: "email", tsId: "ts" },
    { id: "form2", nameId: "name2", emailId: "email2", tsId: "ts2" },
  ];

  forms.forEach(({ id, nameId, emailId, tsId }) => {
    const form = document.getElementById(id);
    if (!form) return;

    // 寫入 ts
    const tsInput = document.getElementById(tsId);
    if (tsInput) tsInput.value = Date.now().toString();

    const nameEl = form.querySelector(`input#${nameId}, input[name="${nameId}"]`);
    const emailEl = form.querySelector(`input#${emailId}, input[name="${emailId}"]`);

    function attachEnglishMessages(el, kind) {
      if (!el) return;
      el.addEventListener("invalid", (e) => {
        e.preventDefault();
        el.setCustomValidity("");
        const v = el.validity;
        if (v.valueMissing) {
          el.setCustomValidity(
            kind === "name"
              ? "Please enter your name."
              : "Please enter your email address."
          );
        } else if (v.typeMismatch) {
          el.setCustomValidity("Please enter a valid email address.");
        } else if (v.tooShort || v.patternMismatch) {
          el.setCustomValidity(
            kind === "name"
              ? "Your name is too short."
              : "Please enter a valid email address."
          );
        }
        el.reportValidity();
      });
      el.addEventListener("input", () => el.setCustomValidity(""));
    }

    attachEnglishMessages(nameEl, "name");
    attachEnglishMessages(emailEl, "email");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const body = new URLSearchParams();
      fd.forEach((v, k) => body.append(k, v));
      try {
        const res = await postWithTimeout(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body,
        });
        const text = await res.text();
        const data = (() => {
          try {
            return JSON.parse(text);
          } catch {
            return { status: "error", msg: text };
          }
        })();
        if (data.status === "success") {
          alert("Submitted successfully!");
          form.reset();
          return;
        }
        if (res.status === 202) {
          alert("We’ve received your submission and are processing it.");
          form.reset();
          return;
        }
        throw new Error(data.msg || `HTTP ${res.status}`);
      } catch (err) {
        const msg = (err && err.message) || String(err);
        if (msg === "timeout") {
          alert("Submission failed: the server is busy. Please try again.");
        } else {
          const brief = msg.replace(/<[^>]+>/g, "").slice(0, 140);
          alert(`送出失敗：${brief || "Unknown error"}`);
        }
      }
    });
  });
});
