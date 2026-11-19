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
        'Hola WoodGool, quiero pedir mi juego (precio de lanzamiento $75 USD):',
        '',
        '- Cantidad: ' + qty + (qty === 1 ? ' unidad' : ' unidades'),
        '- Total: $' + total + ' USD',
        '- Nombre: ' + name,
        '- Zona: ' + hubName,
        '- Dirección / Sector: ' + city,
        '- Pago: ' + payment,
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
  // 7. VARIACIONES DE COPY HUMANO (PARA PREVIEW.HTML Y ?v=directo|retador|minimalista)
  const copyVariants = {
    directo: {
      'hero-eyebrow': '<span class="dot"></span> JUEGO DE MESA 1V1 EN MADERA · HECHO EN ECUADOR',
      'hero-h1': 'Fútbol de mesa en madera, rápido y sin complicaciones<span class="accent">.</span>',
      'hero-intro': 'Dos jugadores, dos varas libres y una pelota. Se entiende en 10 segundos y no necesita pilas ni pantallas.',
      'offer-tag': '● PRECIO DE LANZAMIENTO',
      'offer-status': 'DISPONIBLE PARA ENTREGA',
      'hero-cta': 'Pedir por WhatsApp ($75) <span>↗</span>',
      'hero-subcta': 'Ver cómo se juega <span>↓</span>',
      'ch0-h2': 'Se saca en cualquier reunión.',
      'ch0-p': 'Lo pones sobre la mesa y en un minuto ya hay fila esperando jugar. Funciona en casa, en la oficina o en una tarde entre amigos.',
      'ch1-h2': 'Una vara por persona.',
      'ch1-p': 'Cada jugador controla un solo bloque de madera con las dos manos por fuera del tablero. Nada de piezas plásticas ni barras trabadas.',
      'ch2-h2': 'Movimiento libre en la ranura.',
      'ch2-p': 'Las varas corren por dos ranuras laterales: puedes avanzar, retroceder, cruzar en ángulo y rematar con muñeca.',
      'ch3-h2': 'Madera sellada, listo para usar.',
      'ch3-p': 'Tablero resistente con paredes de buen rebote, arcos con triángulo interno y bandejas donde cae la pelota después de cada gol.',
      'ch4-h2': 'Fácil de guardar y llevar.',
      'ch4-p': 'Las varas se sacan en segundos para guardarlo plano o llevarlo en el carro a cualquier reunión, sin ocupar el espacio de un futbolín grande.',
      'ch5-h2': 'Qué viene en la caja.',
      'ch5-p': 'Tablero armado, 2 varas de 90 cm con bloques fijados, 3 pelotas de madera y topes antideslizantes en la base.',
      'videos-h2': 'Míralo en movimiento.',
      'videos-p': 'Tres tomas reales de partida para ver la velocidad del juego, el movimiento de las varas y cómo entra el gol.',
      'checkout-h2': 'Pide tu WoodGool hoy.',
      'checkout-p': 'Precio de lanzamiento <strong>$75 USD</strong> (precio regular $89 USD). Reservas directo por WhatsApp y <strong>pagas por transferencia bancaria o efectivo al momento de recibirlo</strong>.'
    },
    retador: {
      'hero-eyebrow': '<span class="dot"></span> 1 CONTRA 1 · CERO PANTALLAS',
      'hero-h1': 'El que pierde paga la siguiente<span class="accent">.</span>',
      'hero-intro': 'Un juego de mesa en madera que se explica en 10 segundos y termina siempre en revancha. Dos varas libres, una pelota y reflejos puros.',
      'offer-tag': '● PRECIO DE LANZAMIENTO',
      'offer-status': 'ENTREGAS QUITO, IBARRA Y ENVÍOS',
      'hero-cta': 'Quiero el mío ($75) <span>↗</span>',
      'hero-subcta': 'Ver cómo se juega <span>↓</span>',
      'ch0-h2': '«Una más y nos vamos».',
      'ch0-p': 'Lo sacas después de comer y nadie vuelve a ver el celular. Partidos cortos, rápidos y con pique garantizado.',
      'ch1-h2': 'Sin excusas: uno contra uno.',
      'ch1-p': 'Solo tu vara, tu bloque de madera y tus reflejos. Si entra el gol, fue buena jugada; si te lo tapan, toca defender.',
      'ch2-h2': 'Muévete como quieras.',
      'ch2-p': 'La vara corre libre por las ranuras laterales: defiende pegado al arco, sal a presionar o cruza el remate en diagonal.',
      'ch3-h2': 'Hecho para aguantar partidos fuertes.',
      'ch3-p': 'Madera firme, buena acústica al golpear la pelota y bandejas laterales para recoger rápido y volver a sacar.',
      'ch4-h2': 'Cabe en cualquier mesa.',
      'ch4-p': 'Mesa del comedor, terraza, sala o bar. No necesita cables ni espacio gigante como un futbolín tradicional.',
      'ch5-h2': 'Listo para jugar apenas llega.',
      'ch5-p': 'Viene armado con sus 2 varas desmontables, 3 pelotas de madera y base antideslizante.',
      'videos-h2': 'Así se viven los partidos.',
      'videos-p': 'Sin edición ni trucos: mira qué tan rápido es el ida y vuelta con las dos varas libres.',
      'checkout-h2': '¿Quién pide la revancha?',
      'checkout-p': 'Llévatelo a precio de lanzamiento por <strong>$75 USD</strong> (antes $89). Escríbenos por WhatsApp y <strong>pagas al momento de la entrega</strong>.'
    },
    minimalista: {
      'hero-eyebrow': '<span class="dot"></span> WOODGOOL · SOCCER TABLE GAME',
      'hero-h1': 'Dos varas. Una pelota. Tu mesa<span class="accent">.</span>',
      'hero-intro': 'Fútbol de mesa 1v1 en madera maciza. Sin plásticos, sin baterías, sin reglas largas. Hecho en Ecuador.',
      'offer-tag': '● PRECIO DE LANZAMIENTO',
      'offer-status': 'ENTREGA INMEDIATA',
      'hero-cta': 'Reservar ($75 USD) <span>↗</span>',
      'hero-subcta': 'Ver videos <span>↓</span>',
      'ch0-h2': 'Un juego que se queda en la mesa.',
      'ch0-p': 'Diseño limpio en madera natural que acompaña tu espacio y se convierte en partido en diez segundos.',
      'ch1-h2': 'Dos bloques. Control directo.',
      'ch1-p': 'Un jugador por lado fijado a su vara. Todo depende del ángulo, la velocidad de muñeca y el tiempo de reacción.',
      'ch2-h2': 'Ranuras laterales abiertas.',
      'ch2-p': 'Desplazamiento libre en dos ejes: profundidad, lateralidad e inclinación en un solo movimiento natural.',
      'ch3-h2': 'Construcción sólida.',
      'ch3-p': 'Superficie lisa para un rodado rápido, bordes rígidos para pases con banda y arcos con triángulo de rebote.',
      'ch4-h2': 'Sin cables ni pantallas.',
      'ch4-p': 'Un formato compacto que reemplaza el futbolín grande y se guarda fácilmente cuando termina la partida.',
      'ch5-h2': 'Contenido del set.',
      'ch5-p': 'Tablero de madera sellada, 2 varas de 90 cm extraíbles, 3 pelotas de 20 mm y topes de goma.',
      'videos-h2': 'En acción.',
      'videos-p': 'Tres ángulos reales de juego en mesa.',
      'checkout-h2': 'Reserva el tuyo.',
      'checkout-p': '<strong>$75 USD</strong> por lanzamiento (regular $89 USD). Coordina la entrega por WhatsApp y <strong>paga por transferencia al recibir</strong>.'
    }
  };

  function applyCopyVariant(name) {
    const dict = copyVariants[name];
    if (!dict) return;
    document.querySelectorAll('[data-copy]').forEach(el => {
      const key = el.dataset.copy;
      if (dict[key]) el.innerHTML = dict[key];
    });
  }

  const urlVariant = new URLSearchParams(window.location.search).get('v');
  if (urlVariant && copyVariants[urlVariant]) {
    applyCopyVariant(urlVariant);
  }

  window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'setCopyVariant') {
      applyCopyVariant(event.data.variant);
    }
  });
})();
