(function () {
  const config = window.WOODGOOL || {};
  const PRICE_REGULAR = Number(config.priceRegular) || 89;
  const PRICE_LAUNCH = Number(config.priceLaunch) || 75;

  // 1. GESTIÓN DE NÚMERO DE WHATSAPP
  function getWhatsappNumber() {
    const saved = localStorage.getItem('woodgool_wa') || config.whatsapp || '';
    return String(saved).replace(/\D/g, '');
  }

  let pendingMessage = '';
  const modal = document.querySelector('#contact-pending');
  const waInput = document.querySelector('#quick-wa-number');
  const saveWaBtn = document.querySelector('#save-wa-btn');

  function openWhatsappWithText(messageText) {
    const num = getWhatsappNumber();
    if (/^[1-9]\d{7,14}$/.test(num)) {
      const url = 'https://wa.me/' + num + '?text=' + encodeURIComponent(messageText);
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      pendingMessage = messageText;
      if (modal) {
        waInput.value = num;
        modal.showModal();
      }
    }
  }

  if (saveWaBtn) {
    saveWaBtn.addEventListener('click', () => {
      const raw = String(waInput.value || '').replace(/\D/g, '');
      if (!/^[1-9]\d{7,14}$/.test(raw)) {
        waInput.style.borderColor = '#D96B43';
        waInput.focus();
        return;
      }
      localStorage.setItem('woodgool_wa', raw);
      modal.close();
      openWhatsappWithText(pendingMessage || config.message || '¡Hola! Quiero reservar mi WoodGool ($75 USD).');
    });
  }

  document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', () => modal && modal.close());
  });

  // Botón flotante de WhatsApp
  const floating = document.createElement('a');
  floating.className = 'whatsapp-float';
  floating.href = '#pedir';
  floating.innerHTML = '<span>●</span> Reservar $75 USD · WhatsApp ↗';
  document.body.append(floating);

  // 2. CONECTOR DE FORMULARIO DE PEDIDO RÁPIDO ($75 vs $89)
  const qtySelect = document.querySelector('#order-qty');
  const sumQtyLabel = document.querySelector('#sum-qty-label');
  const sumRegular = document.querySelector('#sum-regular');
  const sumDiscount = document.querySelector('#sum-discount');
  const sumTotal = document.querySelector('#sum-total');
  const orderForm = document.querySelector('#quick-order-form');

  function updateOrderSummary() {
    if (!qtySelect) return;
    const qty = Number(qtySelect.value) || 1;
    const reg = qty * PRICE_REGULAR;
    const tot = qty * PRICE_LAUNCH;
    const disc = reg - tot;
    sumQtyLabel.textContent = qty + (qty === 1 ? ' unidad' : ' unidades');
    sumRegular.textContent = '$' + reg + ' USD';
    sumDiscount.textContent = '-$' + disc + ' USD';
    sumTotal.textContent = '$' + tot + ' USD';
  }

  if (qtySelect) {
    qtySelect.addEventListener('change', updateOrderSummary);
    updateOrderSummary();
  }

  if (orderForm) {
    const hubSelect = document.querySelector('#order-hub');
    const cityInput = document.querySelector('#order-city');
    if (cityInput && hubSelect) {
      cityInput.addEventListener('input', () => {
        const val = cityInput.value.toLowerCase();
        if (/(ibarra|imbabura|otavalo|atuntaqui|cotacachi|tulcan|carchi)/.test(val)) {
          hubSelect.value = '593989347024';
        } else if (/(quito|tumbaco|cumbaya|chillos|sangolqui|pifo|puembo)/.test(val)) {
          hubSelect.value = '593980873462';
        }
      });
    }

    orderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const qty = Number(qtySelect.value) || 1;
      const total = qty * PRICE_LAUNCH;
      const saved = qty * (PRICE_REGULAR - PRICE_LAUNCH);
      const name = document.querySelector('#order-name').value.trim();
      const city = document.querySelector('#order-city').value.trim();
      const targetPhone = (hubSelect && hubSelect.value) ? hubSelect.value : '593980873462';
      const hubName = targetPhone === '593989347024' ? 'Zona Norte / Ibarra' : 'Quito / Tumbaco';
      const payEl = document.querySelector('input[name="paymentMethod"]:checked');
      const payment = payEl ? payEl.value : 'Transferencia al momento de la entrega';

      const msg = [
        '¡Hola WoodGool! 🪵⚽ Quiero reservar mi juego con la *Oferta de Lanzamiento Navidad ($75 USD)*:',
        '',
        '• *Cantidad:* ' + qty + (qty === 1 ? ' unidad' : ' unidades'),
        '• *Total a pagar:* $' + total + ' USD (Ahorro $' + saved + ' USD sobre precio normal de $' + (qty * PRICE_REGULAR) + ')',
        '• *Nombre:* ' + name,
        '• *Punto de despacho:* ' + hubName,
        '• *Sector / Dirección:* ' + city,
        '• *Forma de pago:* ' + payment,
        '',
        '¿Me confirman disponibilidad para coordinar la entrega?'
      ].join('\n');

      const url = 'https://wa.me/' + targetPhone + '?text=' + encodeURIComponent(msg);
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  }

  // 3. SCROLL-DRIVEN INFINITE TRANSITIONS (CAPÍTULOS 01 A 05)
  const chapters = document.querySelectorAll('.chapter-card');
  const slides = document.querySelectorAll('.stage-slide');
  const dots = document.querySelectorAll('.stage-dot');
  const stageCaption = document.querySelector('#stage-caption');

  function activateSlide(index, title) {
    slides.forEach((s, i) => s.classList.toggle('active', i === index));
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
    chapters.forEach((c, i) => c.classList.toggle('active', i === index));
    if (stageCaption && title) stageCaption.textContent = title;
  }

  if ('IntersectionObserver' in window && chapters.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = Number(entry.target.dataset.chapter) || 0;
          const title = entry.target.dataset.title || '';
          activateSlide(idx, title);
        }
      });
    }, {
      rootMargin: '-32% 0px -38% 0px',
      threshold: 0.1
    });

    chapters.forEach(ch => observer.observe(ch));
  }

  // 4. SIMULADOR ANIMADO DE LA CANCHA (DINÁMICA REAL 1V1)
  const rod1 = document.querySelector('#sim-rod-1');
  const rod2 = document.querySelector('#sim-rod-2');
  const ball = document.querySelector('#sim-ball');
  const simStatus = document.querySelector('#sim-status');
  const simBtns = document.querySelectorAll('[data-sim]');
  let simMode = 'goal';
  let startTime = performance.now();

  simBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      simBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      simMode = btn.dataset.sim;
      startTime = performance.now();
      if (simMode === 'goal') {
        simStatus.textContent = 'Jugada de Gol: Pase cruzado y remate angulado que entra y queda dentro del arco.';
      } else if (simMode === 'triangle') {
        simStatus.textContent = 'Regla del Triángulo (1954): El tiro golpea el triángulo central del arco y sale; ¡NO es gol y sigue el juego!';
      } else {
        simStatus.textContent = 'Libertad Total en Ranuras: Las varas se deslizan en X, en Y y se inclinan en diagonal.';
      }
    });
  });

  function animateCourt(now) {
    if (!rod1 || !rod2 || !ball) return;
    const t = ((now - startTime) / 1000) % 4.0; // Ciclo de 4 segundos

    if (simMode === 'goal') {
      // Jugador 1 prepara y dispara al rincón del arco derecho evitando el triángulo central
      const r1x = 175 + Math.sin(t * 2.2) * 45;
      const r1y = 190 + Math.cos(t * 2.2) * 35;
      const r2x = 420 + Math.cos(t * 1.8) * 35;
      const r2y = 225 + Math.sin(t * 2.5) * 42;
      rod1.setAttribute('transform', `translate(${r1x}, ${r1y})`);
      rod2.setAttribute('transform', `translate(${r2x}, ${r2y})`);

      let bx = 300, by = 190;
      if (t < 1.2) {
        const p = t / 1.2;
        bx = 290 - p * 85;
        by = 190 + p * 20;
      } else if (t < 2.6) {
        const p = (t - 1.2) / 1.4;
        bx = 205 + p * 342; // Entra al arco derecho (x=547) por arriba del triángulo
        by = 210 - p * 52;  // y=158 (esquina superior del arco)
      } else {
        bx = 547;
        by = 158;
      }
      ball.setAttribute('cx', bx);
      ball.setAttribute('cy', by);
    } else if (simMode === 'triangle') {
      // Disparo recto al centro del arco derecho -> golpea el triángulo (x=540, y=190) y rebota a la cancha
      const r1x = 200 + Math.sin(t * 2) * 30;
      rod1.setAttribute('transform', `translate(${r1x}, 190)`);
      rod2.setAttribute('transform', `translate(430, 130)`);

      let bx = 220, by = 190;
      if (t < 1.5) {
        const p = t / 1.5;
        bx = 220 + p * 316; // Llega al vértice del triángulo en 536
        by = 190;
      } else {
        const p = (t - 1.5) / 2.5;
        bx = 536 - p * 260; // Rebota de vuelta a la cancha
        by = 190 + p * 75;
      }
      ball.setAttribute('cx', bx);
      ball.setAttribute('cy', by);
    } else {
      // Demostración de libertad en ranuras laterales (avance, retroceso, desplazamiento vertical e inclinación)
      const r1x = 185 + Math.sin(t * Math.PI) * 75;
      const r1y = 190 + Math.cos(t * Math.PI) * 50;
      const r1rot = Math.sin(t * Math.PI * 2) * 11;

      const r2x = 415 - Math.sin(t * Math.PI) * 75;
      const r2y = 190 - Math.cos(t * Math.PI) * 50;
      const r2rot = -Math.sin(t * Math.PI * 2) * 11;

      rod1.setAttribute('transform', `translate(${r1x}, ${r1y}) rotate(${r1rot})`);
      rod2.setAttribute('transform', `translate(${r2x}, ${r2y}) rotate(${r2rot})`);
      ball.setAttribute('cx', 300 + Math.sin(t * Math.PI * 2) * 95);
      ball.setAttribute('cy', 190 + Math.cos(t * Math.PI * 2) * 55);
    }

    requestAnimationFrame(animateCourt);
  }
  requestAnimationFrame(animateCourt);

  // 5. PROBADOR DE LAS 8 OPCIONES DE LOGO EN VIVO EN EL HEADER
  const logoFiles = [
    { file: 'assets/logos/01-encuentro.svg', name: '01 / Encuentro Pro' },
    { file: 'assets/logos/03-taller.svg', name: '03 / Encuentro Horizontal' },
    { file: 'assets/logos/06-monograma-bauhaus.svg', name: '06 / Impacto Diagonal WOOD/GOOL' },
    { file: 'assets/logos/09-fusion-favoritos.svg', name: '09 / Fusión Encuentro + WOOD/GOOL' },
    { file: 'assets/logos/02-linea.svg', name: '02 / Encuentro Cancha' },
    { file: 'assets/logos/04-sello.svg', name: '04 / Encuentro Sello Taller' },
    { file: 'assets/logos/05-monograma-wg.svg', name: '05 / Monograma WG Männchen' },
    { file: 'assets/logos/07-monograma-simetria.svg', name: '07 / Monograma WG Simetría' },
    { file: 'assets/logos/08-wordmark-pro.svg', name: '08 / Wordmark + Micro WG' }
  ];
  let currentLogoIdx = 0;
  const cycleBtn = document.querySelector('#cycle-logo-btn');
  const headerLogo = document.querySelector('#header-logo');
  const footerLogo = document.querySelector('#footer-logo');
  const logoToast = document.querySelector('#logo-toast');

  if (cycleBtn && headerLogo) {
    cycleBtn.addEventListener('click', () => {
      currentLogoIdx = (currentLogoIdx + 1) % logoFiles.length;
      const chosen = logoFiles[currentLogoIdx];
      headerLogo.src = chosen.file;
      if (footerLogo) footerLogo.src = chosen.file;
      cycleBtn.textContent = `Probar Logo (${currentLogoIdx + 1}/8) ↻`;
      if (logoToast) {
        logoToast.textContent = 'Logo activo en web: ' + chosen.name;
        logoToast.classList.add('visible');
        clearTimeout(window._toastTimer);
        window._toastTimer = setTimeout(() => logoToast.classList.remove('visible'), 2800);
      }
    });
  }

  // 6. MENÚ MÓVIL
  const menu = document.querySelector('.menu');
  const nav = document.querySelector('nav');
  if (menu && nav) {
    menu.addEventListener('click', () => {
      const opened = nav.classList.toggle('open');
      menu.setAttribute('aria-expanded', String(opened));
    });
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => nav.classList.remove('open'));
    });
  }
})();
