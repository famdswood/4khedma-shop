/* ═══════════════════════════════════════════════════════
   main.js — Khedma Bank Product Page
   ═══════════════════════════════════════════════════════ */

/* ── HAMBURGER MENU ── */
function toggleMobileNav() {
  var nav = document.getElementById('mobile-nav');
  var btn = document.getElementById('hamburger-btn');
  if (!nav) return;
  nav.classList.toggle('open');
  btn && btn.classList.toggle('open');
}
function closeMobileNav() {
  var nav = document.getElementById('mobile-nav');
  var btn = document.getElementById('hamburger-btn');
  nav && nav.classList.remove('open');
  btn && btn.classList.remove('open');
}

/* ── HEADER SCROLL SHADOW ── */
(function() {
  var hdr = document.querySelector('.site-header');
  if (!hdr) return;
  window.addEventListener('scroll', function() {
    hdr.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
})();

/* ── FAQ ACCORDION ── */
function toggleFaq(btn) {
  var item = btn.closest('.faq-item');
  var icon = btn.querySelector('.faq-icon');
  var ans  = item.querySelector('.faq-a');
  var open = item.classList.contains('open');
  /* close all */
  document.querySelectorAll('.faq-item.open').forEach(function(i) {
    i.classList.remove('open');
    i.querySelector('.faq-icon').textContent = '+';
    i.querySelector('.faq-a').style.maxHeight = null;
  });
  if (!open) {
    item.classList.add('open');
    icon.textContent = '−';
  }
}

/* ── CURRENCY TOGGLE ── */
var isUSD = false;
function toggleCurrency() {
  isUSD = !isUSD;
  var knob    = document.getElementById('toggle-knob');
  var lblEgp  = document.getElementById('toggle-label-egp');
  var lblUsd  = document.getElementById('toggle-label-usd');
  var blockEgp= document.getElementById('pricing-egp');
  var blockUsd= document.getElementById('pricing-usd');
  if (knob)     knob.style.transform    = isUSD ? 'translateX(-28px)' : '';
  if (lblEgp)   lblEgp.style.color      = isUSD ? 'rgba(255,255,255,0.4)' : 'var(--gold)';
  if (lblUsd)   lblUsd.style.color      = isUSD ? 'var(--gold)' : 'rgba(255,255,255,0.4)';
  if (blockEgp) blockEgp.style.display  = isUSD ? 'none' : '';
  if (blockUsd) blockUsd.style.display  = isUSD ? '' : 'none';
}

/* ── WHATSAPP WIDGET ── */
var waOpen = false;
function toggleWaPanel() {
  waOpen = !waOpen;
  var panel = document.getElementById('waPanel');
  var badge = document.querySelector('.wa-badge');
  if (panel) panel.classList.toggle('open', waOpen);
  if (badge) badge.style.display = waOpen ? 'none' : '';
}
function waShowProducts() {
  var menu = document.getElementById('waMainMenu');
  if (!menu) return;
  menu.innerHTML = [
    {name:'الخادم',  price:'199 جنيه', devices:'جهاز واحد'},
    {name:'الذهبية', price:'449 جنيه', devices:'3 أجهزة'},
    {name:'VIP',     price:'699 جنيه', devices:'3 أجهزة + تخصيص'},
    {name:'مخصص',   price:'تواصل معنا',devices:'أجهزة غير محدودة'}
  ].map(function(p) {
    return '<button class="wa-menu-btn" onclick="buyProduct(\'' + p.name + '\',\'' + p.price + '\',\'' + p.devices + '\'); event.stopPropagation()">' +
      '<span>📦 ' + p.name + ' — ' + p.price + '</span><span class="wa-arrow">←</span></button>';
  }).join('');
}
/* ── ARABIC DATE/TIME HELPERS (for order message) ── */
var AR_MONTHS = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
function toArabicDigits(input) {
  var map = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
  return String(input).replace(/[0-9]/g, function(d) { return map[+d]; });
}
function pad2(n) { return n < 10 ? '0' + n : '' + n; }
function formatArabicDateTime() {
  var now = new Date();
  var dateStr = toArabicDigits(now.getDate()) + ' ' + AR_MONTHS[now.getMonth()] + ' ' + toArabicDigits(now.getFullYear());

  var hours24 = now.getHours();
  var hours12 = hours24 % 12; if (hours12 === 0) hours12 = 12;
  var period = hours24 >= 12 ? 'م' : 'ص';
  var timeStr = toArabicDigits(pad2(hours12)) + ':' + toArabicDigits(pad2(now.getMinutes())) + ' ' + period;

  return { date: dateStr, time: timeStr };
}

function buyProduct(plan, price, devices) {
  var dt = formatArabicDateTime();
  var msg =
    '✦ طلب شراء جديد — 4Khedma ✦\n' +
    '────────────────────\n' +
    'المنتج   :  Khedma Bank\n' +
    'الخطة    :  ' + plan + '\n' +
    'السعر    :  ' + price + '\n' +
    '────────────────────\n' +
    'التاريخ  :  ' + dt.date + '\n' +
    'الوقت    :  ' + dt.time + '\n' +
    '────────────────────\n\n' +
    'أود إتمام عملية الشراء للخطة المذكورة أعلاه. يُرجى التواصل معي لاستكمال إجراءات الدفع والتفعيل.\n\n' +
    'شكراً — 4Khedma';
  window.open('https://wa.me/201207737965?text=' + encodeURIComponent(msg), '_blank');
}
function contactEnterprise() {
  buyProduct('مخصص', 'تواصل معنا', 'أجهزة غير محدودة');
}
document.addEventListener('click', function(e) {
  var panel = document.getElementById('waPanel');
  var fab   = document.getElementById('waFab');
  if (waOpen && panel && !panel.contains(e.target) && fab && !fab.contains(e.target)) {
    waOpen = false;
    panel.classList.remove('open');
    var badge = document.querySelector('.wa-badge');
    if (badge) badge.style.display = '';
  }
});

/* ── TESTIMONIAL SPOTLIGHT (auto-rotating) ── */
(function() {
  var stage = document.getElementById('tspotStage');
  if (!stage) return;
  var dotsWrap  = document.getElementById('tspotDots');
  var progress  = document.getElementById('tspotProgress');

  var DATA = [
    { text:'البرنامج منتهي الروعه بجد والسيستم سلس جدا في التعامل وتعيشوا وتخدموا وتمتعونا اكتر واكتر 🥰🥰♥️', name:'مينا عزت كمال', church:'كنيسة العذراء — عزبة عبده بك ميخائيل — بني سويف', gold:false },
    { text:'السيستم تحفهههههههه و التعامل لطيف اوي اوي و بتساعدوا الواحد لحد ما يدخل و يفعله و بجد يعني قمه السكر بسم الصليب ❤️', name:'مارينا عماد', church:'كنيسة مارجرجس — حدائق حلوان — القاهرة', gold:true },
    { text:'حقيقي عايز اشكر كل القائمين علي هذا العمل ♥️ ربنا يبارك خدمتكم و بجد الشباب اتبسطوا جدا في الاجتماع و السيستم خلق جو من المنافسة جميل جدا و مبهج ♥️♥️', name:'مينا شريف شفيق', church:'كنيسة العذراء القطامية — القاهرة', gold:false },
    { text:'السيستم سهل وسلس جدا مش محتاج مجهود وبيشتغل علطول على أي نظام انت محتاجه في المسابقات ومناسب جدا لكل الأعمار والفئات شكرا جدا❤️', name:'بولا اسكندر', church:'كنيسة مارجرجس — عزبة روفائيل — القوصية — أسيوط', gold:true },
    { text:'الابلكشن حلو جدا و في كذا نوع اسئله و الاولاد انبسطو ربنا يعوضكم', name:'فادي عادل', church:'كنيسة الملاك سوريال ومارمينا — العمرانية', gold:false },
    { text:'التجربة كانت سهلة وخطواتها واضحة وانتم كمان نفسكم طويل معانا والبرنامج فعلا تحفة ومتنوع وشيق', name:'جانو', church:'جمعية خلاص النفوس — الجيزة', gold:true },
    { text:'الابلكيشن جميل جدا وسلس ومسلي جدا جربت النسخه الديمو خدام ومخدومين انبسطو جدا واندمجو فيها شكرا جدا ل فام وحقيقي تسلم ايدك 🫶🏻♥️♥️♥️♥️ جربنا ف اسكندريه وعقبال ما يوصل لكل كنايس الجمهورية', name:'كيرلس سعيد', church:'الإسكندرية', gold:false }
  ];

  var DELAY = 3800; /* ms each card stays visible */
  var TRANSITION_OUT = 400;
  var cur = 0, nextTimerId = null;

  function buildCard(item) {
    var outer = document.createElement('div');
    outer.className = 'tspot-card-outer' + (item.gold ? ' tspot-gold' : '');
    var inner = document.createElement('div');
    inner.className = 'tspot-card';
    inner.innerHTML =
      '<div class="tspot-glow"></div>' +
      '<div class="tspot-quote-wrap">' +
        '<div class="tspot-quote">&ldquo;</div>' +
        '<p class="tspot-text">' + item.text + '</p>' +
      '</div>' +
      '<div class="tspot-hr"></div>' +
      '<div class="tspot-person">' +
        '<div class="tspot-avatar">' + item.name.charAt(0) + '</div>' +
        '<div class="tspot-meta"><div class="tspot-name">' + item.name + '</div><div class="tspot-church">' + item.church + '</div></div>' +
      '</div>';
    outer.appendChild(inner);
    return outer;
  }

  var dots = [];
  DATA.forEach(function(_, i) {
    var d = document.createElement('button');
    d.className = 'tspot-dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', 'رأي رقم ' + (i + 1));
    d.addEventListener('click', function() { goTo(i); });
    dotsWrap && dotsWrap.appendChild(d);
    dots.push(d);
  });

  /* Measure the incoming card's natural height (off-screen, still in flow
     since it's only opacity:0, not display:none) and animate the stage to it,
     so cards of different lengths never overlap or clip each other. The card
     is no longer forced to inset:0, so this reflects its real content size. */
  function setStageHeight(card, instant) {
    var h = card.offsetHeight;
    if (instant) {
      stage.style.transition = 'none';
      stage.style.height = h + 'px';
      void stage.offsetHeight; /* force reflow before re-enabling the transition */
      stage.style.transition = '';
    } else {
      stage.style.height = h + 'px';
    }
  }

  function runProgress() {
    if (!progress) return;
    progress.classList.remove('run');
    progress.style.transition = 'none';
    progress.style.width = '0%';
    void progress.offsetWidth; /* force reflow so the reset registers before animating */
    progress.classList.add('run');
    progress.style.transition = 'width ' + DELAY + 'ms linear';
    progress.style.width = '100%';
  }

  function render(first) {
    var item = DATA[cur];
    var incoming = buildCard(item);
    stage.appendChild(incoming);
    setStageHeight(incoming, first);

    if (first) {
      requestAnimationFrame(function() { incoming.classList.add('tspot-active'); });
    } else {
      var outgoing = null;
      var cards = stage.querySelectorAll('.tspot-card-outer');
      cards.forEach(function(c) { if (c !== incoming) outgoing = c; });
      requestAnimationFrame(function() { incoming.classList.add('tspot-active'); });
      if (outgoing) {
        outgoing.classList.remove('tspot-active');
        outgoing.classList.add('tspot-leaving');
        setTimeout(function() { outgoing.remove(); }, TRANSITION_OUT);
      }
    }
    dots.forEach(function(d, i) { d.classList.toggle('active', i === cur); });
  }

  /* Single self-scheduling timer instead of setInterval: every switch clears
     any pending timer and schedules exactly one fresh one, so pausing,
     resuming, or jumping via the dots can never leave two timers racing
     each other (which was causing random cards to appear "stuck"/delayed). */
  function scheduleNext() {
    clearTimeout(nextTimerId);
    nextTimerId = setTimeout(function() {
      cur = (cur + 1) % DATA.length;
      render(false);
      runProgress();
      scheduleNext();
    }, DELAY);
  }

  function goTo(idx) {
    if (idx === cur) return;
    cur = idx;
    render(false);
    runProgress();
    scheduleNext();
  }

  render(true);
  runProgress();
  scheduleNext();
})();

/* ── GALLERY LIGHTBOX ── */
var LB_IMGS = [
  '../../img/img_04.png',
  '../../img/img_05.png',
  '../../img/img_06.png',
  '../../img/img_07.png',
  '../../img/img_08.png',
  '../../img/img_09.png',
  '../../img/img_10.png',
  '../../img/img_11.png'
];
var lbIdx = 0;
function lbOpen(idx) {
  lbIdx = idx;
  var overlay = document.getElementById('lightbox');
  if (!overlay) return;
  overlay.classList.add('open');
  requestAnimationFrame(function() { overlay.classList.add('visible'); });
  document.body.style.overflow = 'hidden';
  lbRender();
  /* build thumbs once */
  var thumbsBar = document.getElementById('lb-thumbs');
  if (thumbsBar && !thumbsBar.children.length) {
    LB_IMGS.forEach(function(src, i) {
      var img = document.createElement('img');
      img.src = src;
      img.className = 'lb-thumb' + (i === lbIdx ? ' lb-thumb-active' : '');
      img.onclick = function() { lbIdx = i; lbRender(); };
      thumbsBar.appendChild(img);
    });
  }
}
function lbClose() {
  var overlay = document.getElementById('lightbox');
  if (overlay) {
    overlay.classList.remove('visible');
    setTimeout(function() { overlay.classList.remove('open'); }, 300);
  }
  document.body.style.overflow = '';
}
function lbNav(dir) {
  lbIdx = ((lbIdx + dir) + LB_IMGS.length) % LB_IMGS.length;
  lbRender();
}
function lbRender() {
  var img     = document.getElementById('lb-img');
  var counter = document.getElementById('lb-counter');
  if (img) {
    img.style.opacity = '';
    img.src = LB_IMGS[lbIdx];
  }
  if (counter) counter.textContent = (lbIdx + 1) + ' / ' + LB_IMGS.length;
  document.querySelectorAll('.lb-thumb').forEach(function(t, i) {
    t.classList.toggle('lb-thumb-active', i === lbIdx);
  });
}
document.addEventListener('keydown', function(e) {
  var lb = document.getElementById('lightbox');
  if (!lb || !lb.classList.contains('open')) return;
  if (e.key === 'Escape')     lbClose();
  if (e.key === 'ArrowRight') lbNav(-1);
  if (e.key === 'ArrowLeft')  lbNav(1);
});


