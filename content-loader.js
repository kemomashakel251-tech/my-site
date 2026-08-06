// ============================================================
// محمّل المحتوى — يجيب النصوص والقوائم القابلة للتعديل من
// Firestore ويحطها بدل المحتوى الافتراضي الموجود في الصفحة.
//
// لو الاتصال فشل أو لسه محدش عدّل حاجة من لوحة التحكم،
// الصفحة بتفضل شغالة بمحتواها الافتراضي الأصلي عادي.
// ============================================================

const ICON_TEMPLATE_ATTR = "data-field"; // مفتاح الحقل داخل عنصر متكرر

function getPath(obj, path) {
  return path.split(".").reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj);
}

function toArabicDigits(n) {
  const map = ["٠","١","٢","٣","٤","٥","٦","٧","٨","٩"];
  return String(n).split("").map((d) => map[d] || d).join("");
}

// ---------- الحقول البسيطة (نص واحد) ----------
function applyScalarFields(data) {
  document.querySelectorAll("[data-field]").forEach((el) => {
    if (el.closest("[data-list]")) return; // ده جوه قائمة، هيتعالج لوحده
    const val = getPath(data, el.dataset.field);
    if (val !== undefined && val !== null && val !== "") el.textContent = val;
  });
  document.querySelectorAll("[data-field-href]").forEach((el) => {
    if (el.closest("[data-list]")) return;
    const val = getPath(data, el.dataset.fieldHref);
    if (val) el.setAttribute("href", (el.dataset.hrefPrefix || "") + val);
  });
  document.querySelectorAll("[data-field-src]").forEach((el) => {
    const val = getPath(data, el.dataset.fieldSrc);
    if (val) el.setAttribute("src", val);
  });
}

// ---------- القوائم (تضيف/تعدّل/تحذف عناصر) ----------
function applyLists(data) {
  document.querySelectorAll("[data-list]").forEach((container) => {
    const items = getPath(data, container.dataset.list);
    if (!Array.isArray(items)) return; // لسه معدّلش القائمة دي، سيبها زي ما هي (المحتوى الافتراضي)

    const templateNode = container.children[0];
    if (!templateNode) return;
    const template = templateNode.cloneNode(true);

    const limit = container.dataset.listLimit ? parseInt(container.dataset.listLimit, 10) : items.length;
    const visible = items.slice(0, limit);

    container.innerHTML = "";
    visible.forEach((item, idx) => {
      const node = template.cloneNode(true);
      node.querySelectorAll("[data-field]").forEach((el) => {
        const val = item[el.dataset.field];
        if (val !== undefined && val !== null) el.textContent = val;
      });
      node.querySelectorAll("[data-field-href]").forEach((el) => {
        const val = item[el.dataset.fieldHref];
        if (val) el.setAttribute("href", (el.dataset.hrefPrefix || "") + val);
      });
      node.querySelectorAll("[data-avatar-from]").forEach((el) => {
        const val = item[el.dataset.avatarFrom];
        if (val) el.textContent = val.trim().charAt(0);
      });
      node.querySelectorAll("[data-index-number]").forEach((el) => {
        el.textContent = toArabicDigits(idx + 1).padStart(2, "٠");
      });
      container.appendChild(node);
    });
  });
}

function applySiteContent(data) {
  applyScalarFields(data);
  applyLists(data);
}

async function loadSiteContent() {
  if (!window.firebaseDB || !window.firestoreFns) return;
  try {
    const { doc, getDoc } = window.firestoreFns;
    const snap = await getDoc(doc(window.firebaseDB, "site_content", "main"));
    if (snap.exists()) applySiteContent(snap.data());
  } catch (err) {
    console.warn("تعذر تحميل المحتوى المخصص من Firebase، هيظهر المحتوى الافتراضي.", err);
  }
}

document.addEventListener("DOMContentLoaded", loadSiteContent);
window.addEventListener("firebase-ready", loadSiteContent);
