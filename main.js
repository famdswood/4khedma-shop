/* ═══════════════════════════════════════════════════════
   main.js — 4Khedma Root (index.html)
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

/* ── PRODUCTS FILTER & SEARCH ── */
function filterProducts() {
  var q = (document.getElementById('productsSearch').value || '').toLowerCase();
  var activeFilter = (document.querySelector('.filter-tab.active') || {}).dataset.filter || 'all';
  document.querySelectorAll('#productsGrid .product-card').forEach(function(card) {
    var name   = (card.dataset.name   || '').toLowerCase();
    var status = (card.dataset.status || '');
    var matchQ = !q || name.includes(q);
    var matchF = activeFilter === 'all' || status === activeFilter;
    card.style.display = (matchQ && matchF) ? '' : 'none';
  });
}
function setFilter(btn, filter) {
  document.querySelectorAll('.filter-tab').forEach(function(b) { b.classList.remove('active'); });
  btn.classList.add('active');
  filterProducts();
}

/* ── SCROLL REVEAL ── */
(function() {
  var els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  var io = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.15 });
  els.forEach(function(el) { io.observe(el); });
})();

/* ── HEADER SCROLL SHADOW ── */
(function() {
  var hdr = document.querySelector('.site-header');
  if (!hdr) return;
  window.addEventListener('scroll', function() {
    hdr.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
})();

/* ── STATS COUNTER ── */
(function() {
  var nums = document.querySelectorAll('.about-stat-num[data-count]');
  if (!nums.length) return;
  var io = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (!e.isIntersecting) return;
      var el  = e.target;
      var end = parseInt(el.dataset.count, 10);
      var dur = 1800, step = 16;
      var inc = end / (dur / step);
      var cur = 0;
      var t = setInterval(function() {
        cur = Math.min(cur + inc, end);
        el.textContent = Math.floor(cur).toLocaleString('ar-EG') + '+';
        if (cur >= end) clearInterval(t);
      }, step);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });
  nums.forEach(function(n) { io.observe(n); });
})();

/* ── TYPEWRITER EFFECT (about page) ── */
(function() {
  var blocks = document.querySelectorAll('[data-tw-id]');
  if (!blocks.length) return;

  /* Recursively wraps every character in its own span.tw-char while keeping
     nested formatting elements (like <span class="t-gold">) intact, so only
     the letters fade in/out, not the whole colored phrase at once. */
  function wrapChars(node) {
    var frag = document.createDocumentFragment();
    node.childNodes.forEach(function(child) {
      if (child.nodeType === Node.TEXT_NODE) {
        var text = child.textContent;
        for (var i = 0; i < text.length; i++) {
          var ch = text[i];
          if (ch.trim() === '') {
            frag.appendChild(document.createTextNode(ch));
          } else {
            var span = document.createElement('span');
            span.className = 'tw-char';
            span.textContent = ch;
            frag.appendChild(span);
          }
        }
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        var clone = child.cloneNode(false);
        clone.appendChild(wrapChars(child));
        frag.appendChild(clone);
      }
    });
    return frag;
  }

  blocks.forEach(function(el) {
    var id     = el.dataset.twId;
    var cursor = document.getElementById('cursor-' + id);
    var wrapped = wrapChars(el);
    el.innerHTML = '';
    el.appendChild(wrapped);
    /* move the cursor to be the last node inside the text itself so it
       flows inline right after the last letter instead of dropping to a
       new line after the block */
    if (cursor) el.appendChild(cursor);
  });

  function typeBlock(el) {
    var id     = el.dataset.twId;
    var cursor = document.getElementById('cursor-' + id);
    var chars  = el.querySelectorAll('.tw-char');
    var speed  = 16; /* ms per character */
    if (!chars.length) return;
    if (cursor) {
      cursor.classList.add('active');
      /* start right before the first letter */
      chars[0].parentNode.insertBefore(cursor, chars[0]);
    }
    var i = 0;
    (function step() {
      if (i < chars.length) {
        chars[i].classList.add('visible');
        if (cursor) chars[i].parentNode.insertBefore(cursor, chars[i].nextSibling);
        i++;
        setTimeout(step, speed);
      } else if (cursor) {
        /* let it blink a little after finishing, then fade out */
        setTimeout(function() { cursor.classList.remove('active'); }, 1400);
      }
    })();
  }

  var twIO = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        typeBlock(entry.target);
        twIO.unobserve(entry.target);
      }
    });
  }, { threshold: 0.35 });

  blocks.forEach(function(el) { twIO.observe(el); });
})();

/* ── WHATSAPP WIDGET ── */
var waOpen = false;
function toggleWaPanel() {
  waOpen = !waOpen;
  var panel = document.getElementById('waPanel');
  var badge = document.querySelector('.wa-badge');
  if (panel) panel.classList.toggle('open', waOpen);
  if (badge) badge.style.display = waOpen ? 'none' : '';
}
/* ── بيانات باقات عرض صيف 2026 (مصدر واحد يُستخدم في قائمة الواتساب وصفحة العرض) ── */
var SUMMER26_PLANS = {
  basic:   { name: 'الخادم',            tierEn: 'Basic',    price: 149, oldPrice: 199, discount: 50,  features: 'جهاز واحد · ترخيص مدى الحياة · خصم 50 جنيه · كود: SUMMER26-BASIC' },
  gold:    { name: 'الذهبية',           tierEn: 'Gold',     price: 349, oldPrice: 449, discount: 100, features: '3 أجهزة · ترخيص مدى الحياة · خصم 100 جنيه · كود: SUMMER26-GOLD' },
  vip:     { name: 'VIP',               tierEn: 'VIP',      price: 599, oldPrice: 699, discount: 100, features: '3 أجهزة + تخصيص باسم الكنيسة · ترخيص مدى الحياة · خصم 100 جنيه · كود: SUMMER26-VIP' },
  vipplus: { name: 'VIP Plus المخصصة', tierEn: 'VIP Plus', price: 699, oldPrice: 799, discount: 100, features: 'جهاز واحد + أسئلة مخصصة (200-500 سؤال) · خصم 100 جنيه · كود: SUMMER26-VIPPLUS' }
};

function waShowProducts() {
  var menu = document.getElementById('waMainMenu');
  if (!menu) return;
  menu.innerHTML = Object.keys(SUMMER26_PLANS).map(function(key) {
    var p = SUMMER26_PLANS[key];
    return '<button class="wa-menu-btn" onclick="buyOfferProduct(\'' + key + '\'); event.stopPropagation()">' +
      '<span>📦 ' + p.name + ' — ' + p.price + ' جنيه <s style="opacity:.55;font-weight:400">' + p.oldPrice + ' جنيه</s></span><span class="wa-arrow">←</span></button>';
  }).join('');
}

/* رسالة واتساب عامة (بدون عرض) — تُستخدم للبيع بالسعر الرسمي العادي */
function buyProduct(plan, price, devices) {
  var msg = 'أهلاً 👋 أنا مهتم بـ Khedma Bank\n\nالخطة: ' + plan + '\nالسعر: ' + price + (devices ? '\nالتفاصيل: ' + devices : '') + '\n\nممكن تساعدني في إتمام الطلب؟';
  window.open('https://wa.me/201207737965?text=' + encodeURIComponent(msg), '_blank');
}

/* تاريخ ووقت الطلب بالأرقام العربية وبالتقويم الميلادي، مثال: ٢٠ يونيو ٢٠٢٦ — ١٢:١٥ م */
function formatArabicOrderDateTime() {
  var now = new Date();
  var date = now.toLocaleDateString('ar-EG-u-nu-arab-ca-gregory', { day: 'numeric', month: 'long', year: 'numeric' });
  var time = now.toLocaleTimeString('ar-EG-u-nu-arab', { hour: '2-digit', minute: '2-digit', hour12: true });
  return { date: date, time: time };
}

/* رسالة واتساب رسمية لعرض صيف 2026 — بالفورمات المعتمد */
function buyOfferProduct(planKey) {
  var p = SUMMER26_PLANS[planKey];
  if (!p) return;
  var dt = formatArabicOrderDateTime();
  var msg =
    '✦ طلب شراء جديد — 4Khedma ✦\n' +
    '────────────────────\n' +
    'المنتج   :  Khedma Bank\n' +
    'الخطة    :  ' + p.name + ' — ' + p.tierEn + ' (عرض صيف 2026)\n' +
    'السعر    :  ' + p.price + ' جنيه — بدلاً من ' + p.oldPrice + ' جنيه\n' +
    'المميزات  :  ' + p.features + '\n' +
    '────────────────────\n' +
    'التاريخ  :  ' + dt.date + '\n' +
    'الوقت    :  ' + dt.time + '\n' +
    '────────────────────\n' +
    'أود إتمام عملية الشراء للخطة المذكورة أعلاه.\n' +
    'يُرجى التواصل معي لاستكمال إجراءات الدفع والتفعيل.\n' +
    'شكراً — 4Khedma';
  window.open('https://wa.me/201207737965?text=' + encodeURIComponent(msg), '_blank');
}

function contactEnterprise() {
  buyOfferProduct('vipplus');
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

/* ── FAM PHOTO LIGHTBOX ── */
(function() {
  var overlay = document.getElementById('famPhotoOverlay');
  if (!overlay) return;

  /* spawn particles */
  var COLORS = ['#D4AF37','rgba(212,175,55,0.6)','rgba(255,255,255,0.4)','rgba(26,99,153,0.7)'];
  for (var p = 0; p < 14; p++) {
    var el   = document.createElement('div');
    el.className = 'fpo-particle';
    var size = 3 + Math.random() * 6;
    el.style.cssText = [
      'width:'+size+'px','height:'+size+'px',
      'left:'+(20+Math.random()*60)+'%',
      'bottom:'+(5+Math.random()*15)+'%',
      'background:'+COLORS[Math.floor(Math.random()*COLORS.length)],
      'animation-duration:'+(3+Math.random()*4)+'s',
      'animation-delay:'+(Math.random()*3)+'s'
    ].join(';');
    overlay.appendChild(el);
  }

  overlay.addEventListener('click', function(e) {
    var inner = overlay.querySelector('.fpo-card');
    var glow  = overlay.querySelector('.fpo-glow');
    var hint  = overlay.querySelector('.fpo-hint');
    if (e.target === overlay || e.target === glow || e.target === hint || e.target.classList.contains('fpo-particle')) {
      closeFamPhoto();
    }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && overlay.classList.contains('fpo-open')) closeFamPhoto();
  });
})();

/* Smoothly ramps the fam-photo overlay's backdrop blur/darkness via
   requestAnimationFrame, instead of relying on the browser to animate
   `backdrop-filter` itself (support for that is inconsistent -- some
   Chrome builds just jump straight to the end value with no interpolation). */
function fpoAnimateBackdrop(el, fromBlur, toBlur, fromAlpha, toAlpha, duration, onDone) {
  var start = null;
  function ease(t) { return 1 - Math.pow(1 - t, 3); } /* ease-out cubic */
  function frame(ts) {
    if (start === null) start = ts;
    var p = Math.min((ts - start) / duration, 1);
    var e = ease(p);
    var blur  = fromBlur  + (toBlur  - fromBlur)  * e;
    var alpha = fromAlpha + (toAlpha - fromAlpha) * e;
    el.style.setProperty('--fpo-blur', blur.toFixed(2) + 'px');
    el.style.setProperty('--fpo-bg-alpha', alpha.toFixed(3));
    if (p < 1) {
      requestAnimationFrame(frame);
    } else if (onDone) {
      onDone();
    }
  }
  requestAnimationFrame(frame);
}

window.openFamPhoto = function() {
  var o = document.getElementById('famPhotoOverlay');
  if (o) {
    o.classList.add('fpo-open');
    document.body.style.overflow = 'hidden';
    fpoAnimateBackdrop(o, 0, 18, 0, 0.75, 550);
  }
};
window.closeFamPhoto = function() {
  var o = document.getElementById('famPhotoOverlay');
  if (o) {
    o.classList.remove('fpo-open');
    fpoAnimateBackdrop(o, 18, 0, 0.75, 0, 400);
    document.body.style.overflow = '';
  }
};

/* ── لوحة إعلان عرض الصيف (لوحة إعلان) ──
   بتظهر لأول مرة لكل زائر عند فتح المنصة، وتفضل مقفولة لمدة يوم
   لو المستخدم قفلها بنفسه، عشان متبقاش مزعجة. */
(function() {
  var overlay = document.getElementById('khedmaAnnounceOverlay');
  if (!overlay) return; /* الصفحة دي معندهاش لوحة إعلان (زي صفحة العرض نفسها) */

  var STORAGE_KEY = '4khedma_announce_dismissed_until';

  /* تبني صفوف الباقات جوه اللوحة من نفس مصدر بيانات الأسعار (SUMMER26_PLANS) */
  function renderAnnouncePlans() {
    var box = document.getElementById('khedmaAnnouncePlans');
    if (!box || typeof SUMMER26_PLANS === 'undefined') return;
    box.innerHTML = Object.keys(SUMMER26_PLANS).map(function(key) {
      var p = SUMMER26_PLANS[key];
      return (
        '<div class="khedma-plan-row">' +
          '<div class="khedma-plan-info">' +
            '<span class="khedma-plan-name">' + p.name + '</span>' +
            '<span class="khedma-plan-price"><s>' + p.oldPrice + ' ج</s><strong>' + p.price + ' ج</strong></span>' +
          '</div>' +
          '<button class="khedma-plan-buy" onclick="buyOfferProduct(\'' + key + '\'); event.stopPropagation()">اطلب</button>' +
        '</div>'
      );
    }).join('');
  }

  function isSnoozed() {
    try {
      var until = localStorage.getItem(STORAGE_KEY);
      return until && Date.now() < parseInt(until, 10);
    } catch (e) {
      return false; /* لو التخزين مش متاح، نعتبرها مش متأجلة وتظهر عادي */
    }
  }

  function snooze() {
    try {
      /* تفضل مقفولة 24 ساعة بعد ما المستخدم يقفلها بنفسه */
      localStorage.setItem(STORAGE_KEY, String(Date.now() + 24 * 60 * 60 * 1000));
    } catch (e) { /* تجاهل لو التخزين ممنوع */ }
  }

  window.openKhedmaAnnounce = function() {
    renderAnnouncePlans();
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };
  window.closeKhedmaAnnounce = function(remember) {
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
    if (remember) snooze();
  };

  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) window.closeKhedmaAnnounce(true);
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) window.closeKhedmaAnnounce(true);
  });

  if (!isSnoozed()) {
    /* تأخير بسيط عشان الصفحة تحمّل الأول وتبقى تجربة أنعم */
    setTimeout(function() { window.openKhedmaAnnounce(); }, 900);
  }
})();
