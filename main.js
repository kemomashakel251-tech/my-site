// ============================================================
// مكتب أفق العدالة — سكربت عام لكل الصفحات
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  // زر القائمة على الموبايل
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("open");
      const expanded = nav.classList.contains("open");
      toggle.setAttribute("aria-expanded", String(expanded));
    });
    // إغلاق القائمة عند الضغط على رابط (نسخة الموبايل)
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => nav.classList.remove("open"));
    });
  }

  // سنة الفوتر
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // أكورديون الأسئلة الشائعة — تفويض أحداث (event delegation) عشان
  // يفضل شغال حتى لو المحتوى اتبدّل ديناميكيًا من لوحة التحكم بعد تحميل الصفحة
  document.addEventListener("click", (e) => {
    const q = e.target.closest(".faq-q");
    if (!q) return;
    const item = q.closest(".faq-item");
    const a = item.querySelector(".faq-a");
    if (!item || !a) return;
    const isOpen = item.classList.contains("open");
    document.querySelectorAll(".faq-item.open").forEach((openItem) => {
      if (openItem !== item) {
        openItem.classList.remove("open");
        openItem.querySelector(".faq-a").style.maxHeight = null;
      }
    });
    item.classList.toggle("open", !isOpen);
    a.style.maxHeight = !isOpen ? a.scrollHeight + "px" : null;
  });

  initContactForm();
});

// ============================================================
// نموذج التواصل — يحفظ الرسالة في Firebase Firestore
// يتطلب تعبئة بيانات المشروع في js/firebase-config.js
// ============================================================
function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const msgBox = document.getElementById("form-msg");
  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msgBox.className = "form-msg";
    msgBox.textContent = "";

    const data = {
      name: form.name.value.trim(),
      phone: form.phone.value.trim(),
      email: form.email.value.trim(),
      address: form.address.value.trim(),
      subject: form.subject.value,
      message: form.message.value.trim(),
      createdAt: new Date().toISOString(),
    };

    if (!data.name || !data.phone || !data.message) {
      showMsg("من فضلك أكمل الاسم ورقم الهاتف ونص الرسالة.", "err");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "جاري الإرسال...";

    try {
      await saveMessageToFirestore(data);
      showMsg("تم إرسال رسالتك بنجاح، سنتواصل معك في أقرب وقت.", "ok");
      form.reset();
    } catch (err) {
      console.error(err);
      showMsg(
        "تعذر إرسال الرسالة الآن. تقدر تتواصل معنا مباشرة على رقم الهاتف الموضح بأعلى الصفحة.",
        "err"
      );
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "إرسال الرسالة";
    }
  });

  function showMsg(text, type) {
    msgBox.textContent = text;
    msgBox.className = "form-msg " + type;
  }
}

// يعتمد على وجود window.firebaseApp (يُهيَّأ فى firebase-config.js)
async function saveMessageToFirestore(data) {
  if (!window.firebaseDB) {
    throw new Error(
      "Firebase غير مهيأ بعد — أكمل بيانات المشروع في js/firebase-config.js"
    );
  }
  const { collection, addDoc } = window.firestoreFns;
  await addDoc(collection(window.firebaseDB, "messages"), data);
}
