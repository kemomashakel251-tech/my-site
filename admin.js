// ============================================================
// لوحة تحكم موقع مكتب أفق العدالة
// نظام عام: يبني الفورمات والقوائم من SCHEMA تحت،
// فأي تعديل أو إضافة قسم جديد يتم من مكان واحد فقط.
// ============================================================

const CONTENT_PATH = ["site_content", "main"];

// المحتوى الافتراضي الحالي للموقع (مسحوب من نفس النصوص المكتوبة في صفحات
// HTML) — بيُستخدم كنقطة بداية في لوحة التحكم لما لسه محدش عدّل حاجة من
// Firestore، عشان تفتح اللوحة ولاقي كل حاجة موجودة فعلاً على الموقع جاهزة
// للتعديل، مش فاضية.
const DEFAULT_CONTENT = {"brand": {"name": "أفق العدالة", "tagline": "محاماة واستشارات قانونية"}, "info": {"phone": "٠١٠٠٠ ٠٠٠ ٠٠٠", "address": "القاهرة، جمهورية مصر العربية", "email": "info@ofoq-justice.example", "phoneRaw": "+20 100 000 0000", "hours": "السبت – الخميس، ٩ صباحًا – ٦ مساءً"}, "home": {"hero": {"eyebrow": "مكتب محاماة معتمد — أكثر من ١٨ عامًا من الخبرة", "title": "شريكك القانوني في كل", "titleEm": "قرار مصيري", "lead": "نقدّم استشارات قانونية دقيقة وتمثيلًا قضائيًا محترفًا للأفراد والشركات، بخبرة تراكمية في القانون المصري وفريق عمل يضع حقوقك في المقام الأول.", "stats": [{"value": "١٨+", "label": "سنة خبرة قانونية"}, {"value": "٩٧٪", "label": "نسبة القضايا المكسوبة"}, {"value": "٢,٤٠٠+", "label": "استشارة قانونية"}, {"value": "٣٠+", "label": "محامٍ ومستشار"}]}, "about": {"title": "خبرة قانونية تراكمت على مدار ثمانية عشر عامًا", "text": "يضم مكتب أفق العدالة نخبة من المحامين والمستشارين القانونيين المتخصصين في مختلف فروع القانون المصري، ونحرص على الجمع بين الدقة القانونية والوضوح في التعامل مع كل عميل، سواء كان فردًا يبحث عن استشارة، أو شركة تحتاج إلى تغطية قانونية شاملة.", "values": [{"title": "تقييم واضح للموقف القانوني", "text": "قبل أي إجراء، نوضح لك الخيارات المتاحة والمخاطر المحتملة بلغة مبسطة."}, {"title": "متابعة مستمرة لكل قضية", "text": "تتابع تطورات قضيتك أولًا بأول دون الحاجة للسؤال المتكرر."}, {"title": "سرية تامة وعلاقة مبنية على الثقة", "text": "خصوصية بياناتك ومستنداتك القانونية محفوظة بأعلى معايير الأمان."}]}, "cta": {"title": "محتاج استشارة قانونية سريعة؟", "text": "احجز موعدك الآن واحصل على تقييم أولي لموقفك القانوني خلال ٢٤ ساعة."}, "band": [{"value": "٩٩٪", "label": "رضا العملاء"}, {"value": "٤٢+", "label": "محامٍ ومستشار"}, {"value": "٩,٢٤٠", "label": "استشارة قانونية"}, {"value": "٢٤/٧", "label": "متابعة القضايا العاجلة"}], "testimonials": [{"text": "تعاملت مع المكتب في نزاع عقاري معقد، وكانت المتابعة دقيقة والنتيجة أفضل مما توقعت.", "name": "مدير شركة", "role": "عميل قطاع الأعمال"}, {"text": "وضوح المكتب معايا فى كل خطوة وسهولة التواصل كانوا أكتر حاجة طمنتني وأنا في قضية حساسة.", "name": "سارة عادل", "role": "قضية أحوال شخصية"}, {"text": "ساعدونا فى صياغة عقود التأسيس واستخراج التراخيص بسرعة واحترافية لافتة.", "name": "كريم فتحي", "role": "مؤسس شركة ناشئة"}]}, "footer": {"about": "مكتب محاماة واستشارات قانونية شاملة يخدم الأفراد والشركات داخل جمهورية مصر العربية.", "note": "هذا الموقع نموذج تصميم — استبدل البيانات ببيانات مكتبك الفعلية."}, "services": {"items": [{"title": "الاستشارات القانونية", "desc": "جلسات استشارية مباشرة لتقييم موقفك القانوني وتحديد أفضل مسار للتعامل مع قضيتك، سواء كانت خلافًا تجاريًا أو مسألة عائلية أو عقدًا يحتاج للمراجعة."}, {"title": "صياغة ومراجعة العقود", "desc": "نصوغ عقود الإيجار والبيع والشراكة والعمل بصياغة قانونية محكمة تحمي مصالحك وتقلل من احتمالات النزاع مستقبلًا."}, {"title": "تأسيس الشركات", "desc": "نرافقك من اختيار الشكل القانوني الأنسب لنشاطك، مرورًا بصياغة عقد التأسيس، وحتى استخراج التراخيص والسجل التجاري."}, {"title": "الدعاوى المدنية", "desc": "تمثيل قانوني في منازعات العقود والتعويضات والملكية والإيجارات أمام المحاكم المدنية بمختلف درجاتها."}, {"title": "القضايا الجنائية", "desc": "دفاع جنائي متخصص في جميع مراحل التقاضي، من التحقيقات وحتى الاستئناف والنقض، مع الحرص على حماية حقوق الموكل كاملة."}, {"title": "الأحوال الشخصية والأسرة", "desc": "مرافقة قانونية وإنسانية في قضايا الطلاق والخلع والحضانة والنفقة والميراث، بخصوصية تامة وحرص على مصلحة الأسرة."}, {"title": "القضاء الإداري", "desc": "الطعن على القرارات الإدارية والتمثيل أمام مجلس الدولة في المنازعات الوظيفية والإدارية."}, {"title": "القضايا العمالية", "desc": "حل المنازعات بين أصحاب العمل والعاملين، من فصل تعسفي إلى مستحقات نهاية الخدمة."}, {"title": "القضايا العقارية", "desc": "توثيق العقود العقارية وحل نزاعات الملكية والتقسيم والإخلاء بمتابعة قانونية دقيقة."}], "hero": {"title": "خدمات قانونية شاملة لكل مرحلة", "text": "سواء كنت فردًا أو صاحب شركة، فريقنا جاهز لتقديم الدعم القانوني المناسب لموقفك، من الاستشارة الأولى وحتى صدور الحكم النهائي."}, "cta": {"title": "مش لاقي الخدمة اللي بتدور عليها؟", "text": "تواصل معنا وهنوجهك لأنسب فريق متخصص لحالتك."}, "faq": [{"q": "هل الاستشارة الأولى مجانية؟", "a": "نعم، نوفر جلسة تقييم أولية لفهم طبيعة قضيتك وتحديد الخطوات القانونية المناسبة قبل الاتفاق على أي أتعاب."}, {"q": "كم يستغرق حل القضية عادة؟", "a": "تختلف المدة حسب نوع القضية ودرجة تعقيدها، ونحرص دائمًا على إبلاغك بجدول زمني واقعي منذ بداية التعامل."}, {"q": "هل تتعاملون مع عملاء خارج القاهرة؟", "a": "نعم، نقدم استشارات عن بُعد عبر الهاتف والبريد الإلكتروني للعملاء في مختلف المحافظات وخارج مصر."}, {"q": "كيف يتم تحديد أتعاب المحاماة؟", "a": "تعتمد الأتعاب على طبيعة القضية ودرجة تعقيدها والوقت المتوقع لإنجازها، ويتم الاتفاق عليها بوضوح كتابيًا قبل بدء العمل."}]}, "about": {"hero": {"title": "مكتب بُني على الثقة والخبرة", "text": "منذ تأسيسه، حرص مكتب أفق العدالة على أن يكون صوتًا قانونيًا موثوقًا لعملائه، أفرادًا وشركات، من خلال فريق متخصص وخبرة تراكمية في مختلف فروع القانون المصري."}, "story": {"title": "من مكتب صغير إلى شريك قانوني موثوق", "text1": "بدأ مكتب أفق العدالة كمكتب محاماة فردي عام ٢٠٠٦، وتوسّع تدريجيًا ليضم اليوم فريقًا من المحامين والمستشارين المتخصصين في القانون المدني والجنائي والتجاري وقانون الأسرة.", "text2": "على مدار السنوات، تعاملنا مع مئات القضايا المتنوعة، وتعلمنا أن أساس أي علاقة قانونية ناجحة هو الوضوح والمتابعة المستمرة، وهو ما نجعله معيارًا ثابتًا في كل ملف نتولاه."}, "cta": {"title": "عايز تعرف موقفك القانوني؟", "text": "احجز استشارتك الأولى مع فريقنا وابدأ بخطوة واضحة نحو حل قضيتك."}, "values": [{"title": "النزاهة أولًا", "text": "نصارح عملاءنا بموقفهم القانوني الحقيقي، حتى لو لم يكن هو الجواب الذي يتمنون سماعه."}, {"title": "حماية الحقوق", "text": "كل قضية نتولاها تُعامل بجدية كاملة، بصرف النظر عن حجمها أو تعقيدها."}, {"title": "سرعة الاستجابة", "text": "نلتزم بالرد على استفسارات عملائنا ومتابعة قضاياهم دون تأخير غير مبرر."}], "team": [{"name": "المستشار / محمود سامي", "role": "الشريك المؤسس — متخصص في القانون المدني والتجاري"}, {"name": "الأستاذة / هبة الشريف", "role": "رئيسة قسم الأحوال الشخصية والأسرة"}, {"name": "الأستاذ / يوسف عادل", "role": "محامٍ أول — القضايا الجنائية والدفاع الجنائي"}]}, "blog": {"hero": {"title": "مقالات وصيغ قانونية", "text": "محتوى قانوني مبسّط يشرح حقوقك وأهم الإجراءات في مختلف فروع القانون المصري."}, "posts": [{"tag": "قوانين", "title": "أبرز تعديلات قانون الإجراءات الجنائية", "excerpt": "نظرة على أهم ما تغيّر في إجراءات التحقيق والمحاكمة وأثره على حقوق المتهم.", "readTime": "٥ دقائق قراءة"}, {"tag": "صيغ مدني", "title": "إنذار المؤجر بإنهاء عقد الإيجار قبل انتهاء مدته", "excerpt": "الشروط القانونية والخطوات العملية اللازمة لإرسال إنذار سليم قانونًا.", "readTime": "٤ دقائق قراءة"}, {"tag": "صيغ جنائي", "title": "الفرق بين الجنحة والجناية وأثره على الإجراءات", "excerpt": "تصنيف الجرائم في القانون المصري ولماذا يهم هذا التصنيف موقفك القانوني.", "readTime": "٦ دقائق قراءة"}, {"tag": "أحوال شخصية", "title": "حقوق الحاضنة في قانون الأحوال الشخصية", "excerpt": "ملخص للحقوق والالتزامات المرتبطة بالحضانة وفق آخر التعديلات.", "readTime": "٧ دقائق قراءة"}, {"tag": "عقود", "title": "خمس نقاط لازم تتأكد منها قبل توقيع أي عقد عمل", "excerpt": "دليل مبسّط لأهم البنود التي تحمي حقوقك كموظف قبل التوقيع.", "readTime": "٥ دقائق قراءة"}, {"tag": "قوانين", "title": "قانون مكافحة المخدرات: نظرة عامة على العقوبات", "excerpt": "ملخص لأهم مواد القانون والفروق بين جرائم الحيازة والاتجار.", "readTime": "٨ دقائق قراءة"}]}, "contact": {"hero": {"title": "لنبدأ بمناقشة قضيتك", "text": "املأ النموذج بالتفاصيل الأساسية وسيتواصل معك أحد محامينا خلال ٢٤ ساعة عمل، أو تواصل معنا مباشرة عبر الهاتف."}, "subjects": [{"label": "استشارة عامة"}, {"label": "صياغة أو مراجعة عقد"}, {"label": "تأسيس شركة"}, {"label": "قضية مدنية"}, {"label": "قضية جنائية"}, {"label": "أحوال شخصية وأسرة"}, {"label": "أخرى"}]}}
;

// ---------- أقسام النصوص الثابتة (تعديل بس) ----------
const SCALAR_SECTIONS = [
  { key: "brand-contact", tab: "عام", title: "الهوية وبيانات التواصل", badge: "تظهر في كل الصفحات", fields: [
    { path: "brand.name", label: "اسم المكتب" },
    { path: "brand.tagline", label: "الوصف تحت الاسم" },
    { path: "info.phone", label: "رقم الهاتف (شكل العرض)" },
    { path: "info.phoneRaw", label: "رقم الهاتف (للاتصال، بالإنجليزي)", dir: "ltr" },
    { path: "info.email", label: "البريد الإلكتروني", dir: "ltr" },
    { path: "info.hours", label: "مواعيد العمل" },
    { path: "info.address", label: "العنوان", full: true },
    { path: "footer.about", label: "وصف المكتب في الفوتر", textarea: true, full: true },
    { path: "footer.note", label: "ملاحظة أسفل الفوتر", full: true },
  ]},
  { key: "social", tab: "عام", title: "التواصل الاجتماعي وزرار الواتساب العائم", badge: "تظهر في كل الصفحات", fields: [
    { path: "social.whatsappNumber", label: "رقم الواتساب (أرقام بس، بكود الدولة، بدون + أو مسافات)", dir: "ltr" },
    { path: "social.facebook", label: "رابط صفحة فيسبوك", dir: "ltr" },
    { path: "social.linkedin", label: "رابط لينكدإن", dir: "ltr" },
  ]},
  { key: "home-hero", tab: "الرئيسية", title: "أعلى الصفحة (Hero)", badge: "index.html", fields: [
    { path: "home.hero.eyebrow", label: "السطر الصغير فوق العنوان", full: true },
    { path: "home.hero.title", label: "العنوان (الجزء العادي)" },
    { path: "home.hero.titleEm", label: "العنوان (الجزء الذهبي المميز)" },
    { path: "home.hero.lead", label: "الفقرة التعريفية", textarea: true, full: true },
  ]},
  { key: "home-about", tab: "الرئيسية", title: "نبذة عنا", badge: "index.html", fields: [
    { path: "home.about.title", label: "العنوان", full: true },
    { path: "home.about.text", label: "الفقرة", textarea: true, full: true },
  ]},
  { key: "home-cta", tab: "الرئيسية", title: "دعوة التواصل", badge: "index.html", fields: [
    { path: "home.cta.title", label: "العنوان" },
    { path: "home.cta.text", label: "النص", textarea: true },
  ]},
  { key: "about-hero", tab: "من نحن", title: "أعلى الصفحة", badge: "about.html", fields: [
    { path: "about.hero.title", label: "العنوان", full: true },
    { path: "about.hero.text", label: "الفقرة", textarea: true, full: true },
  ]},
  { key: "about-story", tab: "من نحن", title: "قصتنا", badge: "about.html", fields: [
    { path: "about.story.title", label: "العنوان", full: true },
    { path: "about.story.text1", label: "الفقرة الأولى", textarea: true, full: true },
    { path: "about.story.text2", label: "الفقرة الثانية", textarea: true, full: true },
  ]},
  { key: "about-cta", tab: "من نحن", title: "دعوة التواصل", badge: "about.html", fields: [
    { path: "about.cta.title", label: "العنوان" },
    { path: "about.cta.text", label: "النص", textarea: true },
  ]},
  { key: "services-hero", tab: "خدماتنا", title: "أعلى الصفحة", badge: "services.html", fields: [
    { path: "services.hero.title", label: "العنوان", full: true },
    { path: "services.hero.text", label: "الفقرة", textarea: true, full: true },
  ]},
  { key: "services-cta", tab: "خدماتنا", title: "دعوة التواصل", badge: "services.html", fields: [
    { path: "services.cta.title", label: "العنوان" },
    { path: "services.cta.text", label: "النص", textarea: true },
  ]},
  { key: "blog-hero", tab: "المدونة", title: "أعلى الصفحة", badge: "blog.html", fields: [
    { path: "blog.hero.title", label: "العنوان", full: true },
    { path: "blog.hero.text", label: "الفقرة", textarea: true, full: true },
  ]},
  { key: "contact-hero", tab: "اتصل بنا", title: "أعلى الصفحة والخريطة", badge: "contact.html", fields: [
    { path: "contact.hero.title", label: "العنوان", full: true },
    { path: "contact.hero.text", label: "الفقرة", textarea: true, full: true },
    { path: "contact.mapUrl", label: "رابط خريطة جوجل (Embed) — من Google Maps → مشاركة → تضمين خريطة", full: true, dir: "ltr" },
  ]},
];

// ---------- الأقسام القابلة للإضافة والحذف (قوائم) ----------
const LIST_SECTIONS = [
  { key: "home.hero.stats", tab: "الرئيسية", title: "إحصاءات أعلى الصفحة", badge: "index.html",
    itemFields: [{ key: "value", label: "الرقم" }, { key: "label", label: "الوصف" }] },
  { key: "home.about.values", tab: "الرئيسية", title: "نقاط \"نبذة عنا\"", badge: "index.html",
    itemFields: [{ key: "title", label: "العنوان" }, { key: "text", label: "الوصف", textarea: true }] },
  { key: "home.band", tab: "الرئيسية", title: "شريط الإحصاءات الذهبي", badge: "index.html",
    itemFields: [{ key: "value", label: "الرقم" }, { key: "label", label: "الوصف" }] },
  { key: "home.testimonials", tab: "الرئيسية", title: "آراء العملاء", badge: "index.html",
    itemFields: [{ key: "text", label: "الرأي", textarea: true }, { key: "name", label: "الاسم" }, { key: "role", label: "الوصف (مثال: عميل قطاع الأعمال)" }] },
  { key: "about.values", tab: "من نحن", title: "قيمنا", badge: "about.html",
    itemFields: [{ key: "title", label: "العنوان" }, { key: "text", label: "الوصف", textarea: true }] },
  { key: "about.team", tab: "من نحن", title: "الفريق", badge: "about.html",
    itemFields: [{ key: "name", label: "الاسم" }, { key: "role", label: "الوظيفة / التخصص" }] },
  { key: "services.items", tab: "خدماتنا", title: "الخدمات", badge: "تظهر بالرئيسية (أول ٦) وبكل صفحة الخدمات",
    itemFields: [{ key: "title", label: "العنوان" }, { key: "desc", label: "الوصف", textarea: true }] },
  { key: "services.faq", tab: "خدماتنا", title: "الأسئلة الشائعة", badge: "services.html",
    itemFields: [{ key: "q", label: "السؤال" }, { key: "a", label: "الإجابة", textarea: true }] },
  { key: "blog.posts", tab: "المدونة", title: "مقالات المدونة", badge: "blog.html",
    itemFields: [{ key: "tag", label: "التصنيف" }, { key: "title", label: "العنوان" }, { key: "excerpt", label: "ملخص المقال", textarea: true }, { key: "readTime", label: "مدة القراءة (مثال: ٥ دقائق قراءة)" }] },
  { key: "contact.subjects", tab: "اتصل بنا", title: "خيارات \"نوع القضية\" في نموذج التواصل", badge: "contact.html",
    itemFields: [{ key: "label", label: "الخيار" }] },
];

const TAB_ORDER = ["عام", "الرئيسية", "من نحن", "خدماتنا", "المدونة", "اتصل بنا"];

// ---------- أدوات مساعدة ----------
function getNested(obj, path) {
  return path.split(".").reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj);
}
function setNested(obj, path, value) {
  const keys = path.split(".");
  let cur = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    cur[keys[i]] = cur[keys[i]] || {};
    cur = cur[keys[i]];
  }
  cur[keys[keys.length - 1]] = value;
}
function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === "text") node.textContent = v;
    else if (k === "html") node.innerHTML = v;
    else node.setAttribute(k, v);
  });
  children.forEach((c) => c && node.appendChild(c));
  return node;
}

let SITE_DATA = {};

function fieldInput(field, value) {
  const wrap = el("div", { class: "field" + (field.full ? " full" : "") });
  wrap.appendChild(el("label", { text: field.label }));
  const input = el(field.textarea ? "textarea" : "input", {});
  if (!field.textarea) input.type = "text";
  if (field.dir) input.dir = field.dir;
  input.value = value || "";
  input.dataset.fieldKey = field.key || field.path;
  wrap.appendChild(input);
  return { wrap, input };
}

// ---------- بناء قسم نصوص ثابتة ----------
function buildScalarSection(section) {
  const form = el("form", { class: "admin-section" });
  form.appendChild(el("h2", {}, [
    document.createTextNode(section.title + " "),
    el("span", { class: "badge", text: section.badge }),
  ]));
  const grid = el("div", { class: "admin-grid" });
  const inputs = [];
  section.fields.forEach((f) => {
    const savedVal = getNested(SITE_DATA, f.path);
    const val = savedVal !== undefined ? savedVal : getNested(DEFAULT_CONTENT, f.path);
    const { wrap, input } = fieldInput({ ...f, key: f.path }, val);
    grid.appendChild(wrap);
    inputs.push({ path: f.path, input });
  });
  form.appendChild(grid);

  const saveRow = el("div", { class: "save-row" });
  const saveBtn = el("button", { type: "submit", class: "btn btn-outline-dark", text: "حفظ هذا القسم" });
  const status = el("span", { class: "save-status" });
  saveRow.appendChild(saveBtn);
  saveRow.appendChild(status);
  form.appendChild(saveRow);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.textContent = "جارٍ الحفظ...";
    status.className = "save-status";
    const update = {};
    inputs.forEach(({ path, input }) => setNested(update, path, input.value));
    try {
      const { doc, setDoc } = window.firestoreFns;
      await setDoc(doc(window.firebaseDB, ...CONTENT_PATH), update, { merge: true });
      inputs.forEach(({ path, input }) => setNested(SITE_DATA, path, input.value));
      status.textContent = "✓ اتحفظ بنجاح";
      status.className = "save-status ok";
    } catch (err) {
      console.error(err);
      status.textContent = "تعذر الحفظ — تأكد إنك مسجل دخول وقواعد Firestore مضبوطة.";
      status.className = "save-status err";
    }
  });

  return form;
}

// ---------- بناء قسم قائمة (إضافة/تعديل/حذف) ----------
function buildListSection(section) {
  const wrap = el("div", { class: "admin-section" });
  wrap.appendChild(el("h2", {}, [
    document.createTextNode(section.title + " "),
    el("span", { class: "badge", text: section.badge }),
  ]));

  const itemsContainer = el("div", { class: "repeater-list" });
  wrap.appendChild(itemsContainer);

  function addRow(itemData) {
    const row = el("div", { class: "repeater-item" });
    const grid = el("div", { class: "admin-grid" });
    section.itemFields.forEach((f) => {
      const { wrap: fw } = fieldInput(f, itemData ? itemData[f.key] : "");
      grid.appendChild(fw);
    });
    row.appendChild(grid);

    const tools = el("div", { class: "repeater-tools" });
    const upBtn = el("button", { type: "button", class: "icon-btn", title: "تحريك لأعلى", text: "↑" });
    const downBtn = el("button", { type: "button", class: "icon-btn", title: "تحريك لأسفل", text: "↓" });
    const delBtn = el("button", { type: "button", class: "icon-btn danger", title: "حذف", text: "✕" });
    upBtn.addEventListener("click", () => {
      const prev = row.previousElementSibling;
      if (prev) itemsContainer.insertBefore(row, prev);
    });
    downBtn.addEventListener("click", () => {
      const next = row.nextElementSibling;
      if (next) itemsContainer.insertBefore(next, row);
    });
    delBtn.addEventListener("click", () => row.remove());
    tools.appendChild(upBtn);
    tools.appendChild(downBtn);
    tools.appendChild(delBtn);
    row.appendChild(tools);

    itemsContainer.appendChild(row);
  }

  const savedList = getNested(SITE_DATA, section.key);
  const existing = Array.isArray(savedList) ? savedList : getNested(DEFAULT_CONTENT, section.key);
  (Array.isArray(existing) ? existing : []).forEach((item) => addRow(item));

  const addBtn = el("button", { type: "button", class: "add-item-btn", text: "+ إضافة عنصر جديد" });
  addBtn.addEventListener("click", () => addRow(null));
  wrap.appendChild(addBtn);

  const saveRow = el("div", { class: "save-row" });
  const saveBtn = el("button", { type: "button", class: "btn btn-outline-dark", text: "حفظ هذا القسم" });
  const status = el("span", { class: "save-status" });
  saveRow.appendChild(saveBtn);
  saveRow.appendChild(status);
  wrap.appendChild(saveRow);

  saveBtn.addEventListener("click", async () => {
    status.textContent = "جارٍ الحفظ...";
    status.className = "save-status";
    const items = Array.from(itemsContainer.children).map((row) => {
      const obj = {};
      row.querySelectorAll("[data-field-key]").forEach((input) => {
        obj[input.dataset.fieldKey] = input.value;
      });
      return obj;
    });
    const update = {};
    setNested(update, section.key, items);
    try {
      const { doc, setDoc } = window.firestoreFns;
      await setDoc(doc(window.firebaseDB, ...CONTENT_PATH), update, { merge: true });
      setNested(SITE_DATA, section.key, items);
      status.textContent = "✓ اتحفظ بنجاح (" + items.length + " عنصر)";
      status.className = "save-status ok";
    } catch (err) {
      console.error(err);
      status.textContent = "تعذر الحفظ — تأكد إنك مسجل دخول وقواعد Firestore مضبوطة.";
      status.className = "save-status err";
    }
  });

  return wrap;
}

// ---------- بناء التابات والصفحات ----------
function buildDashboard() {
  const tabsEl = document.getElementById("admin-tabs");
  const panelsEl = document.getElementById("admin-panels");
  tabsEl.innerHTML = "";
  panelsEl.innerHTML = "";

  const byTab = {};
  TAB_ORDER.forEach((t) => (byTab[t] = []));
  SCALAR_SECTIONS.forEach((s) => (byTab[s.tab] = byTab[s.tab] || []).push({ type: "scalar", section: s }));
  LIST_SECTIONS.forEach((s) => (byTab[s.tab] = byTab[s.tab] || []).push({ type: "list", section: s }));

  let first = true;
  TAB_ORDER.forEach((tabName) => {
    const items = byTab[tabName] || [];
    if (!items.length) return;

    const btn = el("button", { type: "button", class: "admin-tab-btn" + (first ? " active" : ""), text: tabName });
    const panel = el("div", { class: "admin-panel" + (first ? " active" : "") });

    items.forEach((it) => {
      panel.appendChild(it.type === "scalar" ? buildScalarSection(it.section) : buildListSection(it.section));
    });

    btn.addEventListener("click", () => {
      document.querySelectorAll(".admin-tab-btn").forEach((b) => b.classList.remove("active"));
      document.querySelectorAll(".admin-panel").forEach((p) => p.classList.remove("active"));
      btn.classList.add("active");
      panel.classList.add("active");
    });

    tabsEl.appendChild(btn);
    panelsEl.appendChild(panel);
    first = false;
  });
}

// ---------- تسجيل الدخول وتحميل البيانات ----------
function waitForFirebase() {
  return new Promise((resolve) => {
    if (window.firebaseAuth) return resolve();
    window.addEventListener("firebase-ready", () => resolve(), { once: true });
  });
}

async function loadContent() {
  const { doc, getDoc } = window.firestoreFns;
  const snap = await getDoc(doc(window.firebaseDB, ...CONTENT_PATH));
  SITE_DATA = snap.exists() ? snap.data() : {};
}

async function init() {
  await waitForFirebase();
  const { onAuthStateChanged } = window.authFns;

  onAuthStateChanged(window.firebaseAuth, async (user) => {
    document.getElementById("app-loading").classList.add("hidden");
    if (user) {
      document.getElementById("login-screen").classList.add("hidden");
      document.getElementById("dashboard").classList.remove("hidden");
      await loadContent();
      buildDashboard();
    } else {
      document.getElementById("dashboard").classList.add("hidden");
      document.getElementById("login-screen").classList.remove("hidden");
    }
  });

  document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;
    const msg = document.getElementById("login-msg");
    msg.className = "form-msg";
    try {
      const { signInWithEmailAndPassword } = window.authFns;
      await signInWithEmailAndPassword(window.firebaseAuth, email, password);
    } catch (err) {
      msg.textContent = "بيانات الدخول غير صحيحة، أو الحساب غير موجود في Firebase Authentication.";
      msg.className = "form-msg err";
    }
  });

  document.getElementById("logout-btn").addEventListener("click", async () => {
    const { signOut } = window.authFns;
    await signOut(window.firebaseAuth);
  });
}

init();
