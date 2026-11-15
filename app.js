(() => {
  'use strict';

  const PRODUCTS = [
    {id:'bougie-lavande',name:'Bougie Lavande',category:'bougies',categoryLabel:'Bougie parfumée',price:32,subtitle:'Pour tes soirées cocon',image:'assets/products/bougie-lavande.svg',badge:'Coup de cœur',description:'Une senteur florale et apaisante pour créer une ambiance douce à la maison.'},
    {id:'bougie-rose',name:'Bougie Rose Poudrée',category:'bougies',categoryLabel:'Bougie parfumée',price:32,subtitle:'Une touche romantique',image:'assets/products/bougie-rose.svg',badge:'Tout doux',description:'Une fragrance délicate et enveloppante, comme un bouquet posé dans la maison.'},
    {id:'bougie-vanille',name:'Bougie Vanille',category:'bougies',categoryLabel:'Bougie parfumée',price:32,subtitle:'Un parfum réconfortant',image:'assets/products/bougie-vanille.svg',badge:'Gourmand',description:'Une senteur chaleureuse et douce pour tes moments de calme.'},
    {id:'plateau-coquillage',name:'Plateau Coquillage',category:'decoration',categoryLabel:'Décoration en plâtre',price:28,subtitle:'Pour tes petits trésors',image:'assets/products/plateau-coquillage.svg',badge:'Fait main',description:'Un petit plateau décoratif pour déposer tes bijoux et tes objets préférés.'},
    {id:'vase-fleur',name:'Vase Fleur',category:'decoration',categoryLabel:'Décoration en plâtre',price:39,subtitle:'Une jolie touche déco',image:'assets/products/vase-fleur.svg',badge:'Petite série',description:'Un objet décoratif aux lignes douces, imaginé pour accueillir tes petits bouquets.'},
    {id:'coffret-cocon',name:'Coffret Cocon',category:'coffrets',categoryLabel:'Coffret cadeau',price:68,subtitle:'Une attention prête à offrir',image:'assets/products/coffret-cocon.svg',badge:'Prêt à offrir',description:'Une sélection de petites créations réunies dans un joli coffret cadeau.'}
  ];

  const STORAGE = {cart:'seraya_cart_v1',favorites:'seraya_favorites_v1'};
  const read = (key, fallback) => {
    try { const value = JSON.parse(localStorage.getItem(key)); return value ?? fallback; }
    catch { return fallback; }
  };
  const write = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* Storage may be disabled. */ } };
  let cart = read(STORAGE.cart, []);
  let favorites = read(STORAGE.favorites, []);
  let toastTimer;

  const iconHeart = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/></svg>';
  const formatPrice = amount => `${amount.toFixed(0)} DT`;
  const getProduct = id => PRODUCTS.find(product => product.id === id) || PRODUCTS[0];
  const cartCount = () => cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  function showToast(message) {
    const toast = document.querySelector('[data-toast]');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
  }

  function saveState() {
    write(STORAGE.cart, cart);
    write(STORAGE.favorites, favorites);
    updateCounts();
  }

  function updateCounts() {
    document.querySelectorAll('[data-cart-count]').forEach(el => el.textContent = cartCount());
    document.querySelectorAll('[data-favorite-count]').forEach(el => el.textContent = favorites.length);
    document.querySelectorAll('[data-favorite]').forEach(button => {
      const isFavorite = favorites.includes(button.dataset.favorite);
      button.classList.toggle('is-favorite', isFavorite);
      button.setAttribute('aria-pressed', String(isFavorite));
      if (button.classList.contains('favorite-btn')) button.setAttribute('aria-label', isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris');
    });
  }

  function addToCart(id, quantity = 1, details = {}) {
    let productId = id;
    if (details.scent && getProduct(id).category === 'bougies') {
      const scentId = `bougie-${details.scent.toLowerCase()}`;
      if (PRODUCTS.some(product => product.id === scentId)) productId = scentId;
    }
    const product = getProduct(productId);
    const key = [productId, details.scent || '', details.size || ''].join('|');
    const price = product.price + (details.size === 'Grande' ? 12 : 0);
    const existing = cart.find(item => item.key === key);
    if (existing) existing.quantity += quantity;
    else cart.push({key, id:productId, quantity, price, scent:details.scent || '', size:details.size || '', gift:details.gift || ''});
    saveState();
    showToast(`${product.name} ajouté au panier ♡`);
  }

  function toggleFavorite(id) {
    if (favorites.includes(id)) {
      favorites = favorites.filter(item => item !== id);
      showToast('Retiré de tes favoris');
    } else {
      favorites.push(id);
      showToast('Ajouté à tes petits coups de cœur ♡');
    }
    saveState();
    if (document.body.dataset.page === 'favorites') renderFavorites();
  }

  function productCard(product) {
    const favorite = favorites.includes(product.id);
    return `<article class="product-card" data-product-card data-category="${product.category}">
      <a class="product-image" href="produit.html?id=${encodeURIComponent(product.id)}">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <span class="product-badge">${product.badge}</span>
      </a>
      <button class="favorite-btn ${favorite ? 'is-favorite' : ''}" type="button" data-favorite="${product.id}" aria-label="${favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}" aria-pressed="${favorite}">${iconHeart}</button>
      <div class="product-meta"><div><h3 class="product-title"><a href="produit.html?id=${encodeURIComponent(product.id)}">${product.name}</a></h3><p class="product-sub">${product.subtitle}</p></div><div class="product-price">${formatPrice(product.price)}<small>prix indicatif</small></div></div>
      <div class="product-actions"><a class="btn btn-secondary btn-small" href="produit.html?id=${encodeURIComponent(product.id)}">Découvrir</a><button class="icon-link" type="button" data-add-to-cart="${product.id}" aria-label="Ajouter ${product.name} au panier"><svg viewBox="0 0 24 24"><path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 2-1.6L22 8H6"/><circle cx="10" cy="21" r="1"/><circle cx="18" cy="21" r="1"/></svg></button></div>
    </article>`;
  }

  function renderProductGrids() {
    document.querySelectorAll('[data-products]').forEach(grid => {
      const type = grid.dataset.products;
      let products = type === 'featured' ? PRODUCTS.slice(0, 3) : type === 'related' ? PRODUCTS.slice(1, 4) : PRODUCTS;
      grid.innerHTML = products.map(productCard).join('');
    });
    updateCounts();
  }

  function renderFavorites() {
    const host = document.getElementById('favorites-content');
    if (!host) return;
    const chosen = PRODUCTS.filter(product => favorites.includes(product.id));
    if (!chosen.length) {
      host.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><img src="assets/products/bougie-rose.svg" alt="Bougie rose"><h2>Pas encore de coup de cœur ?</h2><p>Garde ici les créations que tu aimerais retrouver plus tard.</p><a class="btn" href="boutique.html">Explorer la boutique ♡</a></div>`;
      return;
    }
    host.innerHTML = chosen.map(productCard).join('');
    updateCounts();
  }

  function renderCart() {
    const host = document.getElementById('cart-content');
    if (!host) return;
    if (!cart.length) {
      host.innerHTML = `<div class="empty-state"><img src="assets/products/coffret-cocon.svg" alt="Petit coffret cadeau"><h2>Ton panier est tout léger.</h2><p>Il est temps de trouver une création qui te plaît.</p><a class="btn" href="boutique.html">Je découvre la boutique ♡</a></div>`;
    } else {
      host.innerHTML = `<h2 style="font:400 29px var(--serif);margin:0 0 8px">Tes petites trouvailles (${cartCount()})</h2>${cart.map(item => {
        const product = getProduct(item.id);
        const details = [item.scent, item.size, item.gift ? `Mot cadeau : ${item.gift}` : ''].filter(Boolean).join(' · ');
        return `<article class="cart-item"><img src="${product.image}" alt="${product.name}"><div><h3>${product.name}</h3><p>${details || product.categoryLabel}</p><div class="quantity"><button type="button" data-cart-change="${encodeURIComponent(item.key)}" data-delta="-1" aria-label="Diminuer">−</button><span>${item.quantity}</span><button type="button" data-cart-change="${encodeURIComponent(item.key)}" data-delta="1" aria-label="Augmenter">+</button></div><br><button class="remove-link" type="button" data-cart-remove="${encodeURIComponent(item.key)}">Retirer</button></div><strong class="cart-item-price">${formatPrice(item.price * item.quantity)}</strong></article>`;
      }).join('')}`;
    }
    const subtotal = document.getElementById('cart-subtotal');
    const total = document.getElementById('cart-total');
    if (subtotal) subtotal.textContent = formatPrice(cartTotal());
    if (total) total.textContent = formatPrice(cartTotal());
    const checkout = document.getElementById('checkout-link');
    if (checkout) { checkout.style.opacity = cart.length ? '1' : '.55'; checkout.setAttribute('aria-disabled', String(!cart.length)); }
  }

  function renderCheckoutSummary() {
    const host = document.getElementById('checkout-summary');
    if (!host) return;
    if (!cart.length) {
      host.innerHTML = '<p class="muted small">Ton panier est vide pour le moment.</p><a href="boutique.html" class="btn btn-secondary btn-block">Voir la boutique</a>';
    } else {
      host.innerHTML = cart.map(item => {
        const product = getProduct(item.id);
        return `<div class="summary-line"><span>${product.name} × ${item.quantity}</span><strong>${formatPrice(item.price * item.quantity)}</strong></div>`;
      }).join('');
    }
    const total = document.getElementById('checkout-total');
    if (total) total.textContent = formatPrice(cartTotal());
  }

  function initProductPage() {
    if (document.body.dataset.page !== 'product') return;
    const params = new URLSearchParams(location.search);
    const id = params.get('id') || 'bougie-lavande';
    const product = getProduct(id);
    const title = document.querySelector('.product-info h1');
    const kicker = document.querySelector('.product-kicker .tag');
    const tagline = document.querySelector('.product-tagline');
    const price = document.querySelector('.price-large');
    const description = document.querySelector('.product-description');
    const image = document.getElementById('main-product-image');
    const addButton = document.querySelector('[data-add-to-cart]');
    if (title) title.textContent = product.name;
    if (kicker) kicker.textContent = product.categoryLabel;
    if (tagline) tagline.textContent = product.subtitle;
    if (price) price.textContent = formatPrice(product.price);
    if (description) description.textContent = product.description;
    if (image) { image.src = product.image; image.alt = product.name; }
    document.querySelectorAll('[data-gallery]').forEach(button => {
      const thumbImg = button.querySelector('img');
      if (thumbImg) thumbImg.src = button.dataset.gallery;
    });
    document.querySelectorAll('[data-scent-options], [data-size-options]').forEach(el => {
      if (product.category === 'decoration') el.hidden = true;
    });
    if (product.category === 'decoration') {
      const labels = document.querySelectorAll('.option-label');
      labels.forEach(el => { if (el.textContent.includes('parfum') || el.textContent.includes('taille')) el.hidden = true; });
    }
    if (addButton) addButton.dataset.addToCart = product.id;
    const favButton = document.querySelector('[data-favorite]');
    if (favButton) favButton.dataset.favorite = product.id;
    document.title = `${product.name} | Seraya Creations`;
    let quantity = 1;
    let selectedScent = product.category === 'bougies' && product.name.startsWith('Bougie ')
      ? product.name.slice('Bougie '.length) : 'Lavande';
    let selectedSize = 'Petite';
    document.querySelectorAll('[data-scent]').forEach(button => button.classList.toggle('selected', button.dataset.scent === selectedScent));
    const qty = document.querySelector('[data-qty]');
    document.querySelector('[data-qty-minus]')?.addEventListener('click', () => { quantity = Math.max(1, quantity - 1); if (qty) qty.textContent = quantity; });
    document.querySelector('[data-qty-plus]')?.addEventListener('click', () => { quantity = Math.min(20, quantity + 1); if (qty) qty.textContent = quantity; });
    document.querySelectorAll('[data-scent]').forEach(button => button.addEventListener('click', () => {
      selectedScent = button.dataset.scent;
      document.querySelectorAll('[data-scent]').forEach(item => item.classList.toggle('selected', item === button));
      if (title && product.category === 'bougies') title.textContent = `Bougie ${selectedScent}`;
      const scentProduct = PRODUCTS.find(item => item.id === `bougie-${selectedScent.toLowerCase()}`);
      if (image && scentProduct && product.category === 'bougies') { image.src = scentProduct.image; image.alt = scentProduct.name; }
    }));
    document.querySelectorAll('[data-size]').forEach(button => button.addEventListener('click', () => {
      selectedSize = button.dataset.size;
      document.querySelectorAll('[data-size]').forEach(item => item.classList.toggle('selected', item === button));
      if (price && product.category !== 'decoration') price.textContent = formatPrice(product.price + (selectedSize === 'Grande' ? 12 : 0));
    }));
    addButton?.addEventListener('click', () => addToCart(product.id, quantity, {
      scent: product.category !== 'decoration' ? selectedScent : '',
      size: product.category !== 'decoration' ? selectedSize : '',
      gift: document.getElementById('gift-message')?.value.trim() || ''
    }));
    document.querySelectorAll('[data-gallery]').forEach(button => button.addEventListener('click', () => {
      if (image) { image.src = button.dataset.gallery; image.alt = `Détail de ${product.name}`; }
    }));
  }

  function initShopFilters() {
    const filters = document.querySelectorAll('[data-filter]');
    if (!filters.length) return;
    let activeFilter = new URLSearchParams(location.search).get('cat') || 'all';
    function applyFilter() {
      filters.forEach(button => button.classList.toggle('active', button.dataset.filter === activeFilter));
      document.querySelectorAll('[data-product-card]').forEach(card => {
        card.hidden = activeFilter !== 'all' && card.dataset.category !== activeFilter;
      });
    }
    filters.forEach(button => button.addEventListener('click', () => { activeFilter = button.dataset.filter; applyFilter(); }));
    applyFilter();
    document.getElementById('sort-products')?.addEventListener('change', event => {
      const grid = document.querySelector('[data-products="all"]');
      if (!grid) return;
      const cards = [...grid.querySelectorAll('[data-product-card]')];
      const mode = event.target.value;
      cards.sort((a, b) => {
        const pa = PRODUCTS.find(p => a.querySelector('[data-add-to-cart]')?.dataset.addToCart === p.id);
        const pb = PRODUCTS.find(p => b.querySelector('[data-add-to-cart]')?.dataset.addToCart === p.id);
        if (mode === 'price-asc') return (pa?.price || 0) - (pb?.price || 0);
        if (mode === 'price-desc') return (pb?.price || 0) - (pa?.price || 0);
        return PRODUCTS.indexOf(pa) - PRODUCTS.indexOf(pb);
      });
      cards.forEach(card => grid.appendChild(card));
      applyFilter();
    });
  }

  function initGlobalEvents() {
    document.addEventListener('click', event => {
      const add = event.target.closest('[data-add-to-cart]');
      if (add && !add.closest('.product-info')) addToCart(add.dataset.addToCart, 1);
      const favorite = event.target.closest('[data-favorite]');
      if (favorite) { event.preventDefault(); toggleFavorite(favorite.dataset.favorite); }
      const change = event.target.closest('[data-cart-change]');
      if (change) {
        const key = decodeURIComponent(change.dataset.cartChange);
        const item = cart.find(entry => entry.key === key);
        if (item) item.quantity += Number(change.dataset.delta || 0);
        cart = cart.filter(entry => entry.quantity > 0);
        saveState(); renderCart(); renderCheckoutSummary();
      }
      const remove = event.target.closest('[data-cart-remove]');
      if (remove) {
        const key = decodeURIComponent(remove.dataset.cartRemove);
        cart = cart.filter(entry => entry.key !== key);
        saveState(); renderCart(); renderCheckoutSummary(); showToast('Article retiré du panier');
      }
      const toastButton = event.target.closest('[data-toast]');
      if (toastButton && toastButton.tagName !== 'DIV') showToast(toastButton.dataset.toast);
    });

    document.querySelectorAll('[data-demo-form]').forEach(form => form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      showToast('Merci ♡ Cette maquette ne transmet pas encore les informations.');
      form.reset();
    }));

    const menuButton = document.querySelector('[data-menu-toggle]');
    const mobileNav = document.querySelector('[data-mobile-nav]');
    menuButton?.addEventListener('click', () => {
      const isOpen = mobileNav?.classList.toggle('open') || false;
      menuButton.setAttribute('aria-expanded', String(isOpen));
    });
  }

  function init() {
    document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
    const page = document.body.dataset.page;
    document.querySelectorAll('[data-nav]').forEach(link => link.classList.toggle('active', link.dataset.nav === page));
    document.getElementById('checkout-link')?.addEventListener('click', event => {
      if (!cart.length) { event.preventDefault(); showToast('Ton panier est encore vide ♡'); }
    });
    renderProductGrids();
    renderFavorites();
    renderCart();
    renderCheckoutSummary();
    initProductPage();
    initShopFilters();
    initGlobalEvents();
    updateCounts();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

/* ===== v2: finishing touches ===== */
(()=>{
const rm=matchMedia('(prefers-reduced-motion:reduce)').matches,$=(s)=>[...document.querySelectorAll(s)];
const SEL='.section-title,.collection-card,[data-product-card],.value-card,.info-card,.benefit,.feature-copy,.feature-art,.faq-item,.step,.detail-card,.summary-panel,.form-panel';
let io;
const scan=()=>{if(rm||!io)return;$(SEL).forEach((el,i)=>{if(el.classList.contains('rv'))return;el.classList.add('rv');el.style.setProperty('--d',(i%4)*90+'ms');io.observe(el)})};
const init=()=>{
 if('IntersectionObserver' in window&&!rm){io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.1});scan();$('[data-products]').forEach(g=>new MutationObserver(()=>setTimeout(scan,30)).observe(g,{childList:true}))}
 const ps=document.querySelector('.promise-strip');if(ps&&!rm){const h=ps.innerHTML;ps.innerHTML='<div class="mq"><span>'+h+'</span><span aria-hidden="true">'+h+'</span></div>'}
 const hero=document.querySelector('.hero');if(hero&&!rm){const g=['✿','✦','♡','✧'];for(let i=0;i<10;i++){const p=document.createElement('span');p.className='petal';p.textContent=g[i%4];p.style.cssText='left:'+(Math.random()*96)+'%;font-size:'+(12+Math.random()*10)+'px;--t:'+(9+Math.random()*8)+'s;--dl:-'+(Math.random()*12)+'s';p.setAttribute('aria-hidden','true');hero.appendChild(p)}}
 const hd=document.querySelector('.site-header');if(hd)addEventListener('scroll',()=>hd.classList.toggle('scrolled',scrollY>30),{passive:true});
 const cb=document.createElement('button');cb.type='button';cb.className='candle-btn';cb.setAttribute('aria-pressed','false');cb.setAttribute('aria-label','Mode bougie : tamiser la lumière');cb.innerHTML='<i class="flame"></i><span>mode bougie</span>';document.body.appendChild(cb);
 const R=document.documentElement;let raf=0;
 addEventListener('pointermove',e=>{if(raf)return;raf=requestAnimationFrame(()=>{raf=0;R.style.setProperty('--mx',e.clientX+'px');R.style.setProperty('--my',e.clientY+'px')})});
 const set=on=>{R.classList.toggle('candle',on);cb.setAttribute('aria-pressed',on)};
 cb.onclick=()=>set(!R.classList.contains('candle'));addEventListener('keydown',e=>{if(e.key==='Escape')set(false)});
};
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
const heart=(cls,x,y,dx,dy,d)=>{const h=document.createElement('span');h.className=cls;h.textContent='♡';h.style.left=x+'px';h.style.top=y+'px';document.body.appendChild(h);h.animate([{transform:'translate(-50%,-50%) scale(1)',opacity:1},{transform:`translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px)) scale(.5)`,opacity:0}],{duration:d,easing:'cubic-bezier(.4,0,.6,1)'}).onfinish=()=>h.remove()};
document.addEventListener('click',e=>{if(rm)return;
 const a=e.target.closest('[data-add-to-cart]');
 if(a){const c=document.querySelector('a[href="panier.html"].icon-link'),r=a.getBoundingClientRect();if(c){const t=c.getBoundingClientRect();heart('fly',r.left+r.width/2,r.top+r.height/2,t.left+t.width/2-r.left-r.width/2,t.top+t.height/2-r.top-r.height/2,850);setTimeout(()=>{c.classList.add('bump');setTimeout(()=>c.classList.remove('bump'),500)},780)}}
 const f=e.target.closest('[data-favorite]');
 if(f){f.classList.add('pop');setTimeout(()=>f.classList.remove('pop'),450);const r=f.getBoundingClientRect();for(let i=0;i<5;i++)heart('burst',r.left+r.width/2,r.top+r.height/2,(i-2)*16,-34-Math.random()*26,700)}
});
})();

/* ===== v3: glow & secrets ===== */
(()=>{
const rm=matchMedia('(prefers-reduced-motion:reduce)').matches,R=document.documentElement;
const init=()=>{
 const main=document.querySelector('main');
 if(main){main.id=main.id||'contenu';const s=document.createElement('a');s.className='skip-link';s.href='#'+main.id;s.textContent='Aller au contenu';document.body.prepend(s)}
 const w=document.createElement('div');w.className='wick';w.setAttribute('aria-hidden','true');w.innerHTML='<i></i>';document.body.appendChild(w);
 const bar=w.firstChild;
 const up=document.createElement('button');up.type='button';up.className='to-top';up.setAttribute('aria-label','Remonter en haut de la page');up.innerHTML='<svg viewBox="0 0 24 24"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';document.body.appendChild(up);
 up.onclick=()=>scrollTo({top:0,behavior:rm?'auto':'smooth'});
 const upd=()=>{const h=R.scrollHeight-innerHeight,p=h>0?scrollY/h*100:0;bar.style.setProperty('--p',p.toFixed(1)+'%');w.style.opacity=p>1?1:0;up.classList.toggle('show',scrollY>700)};
 addEventListener('scroll',upd,{passive:true});addEventListener('resize',upd);upd();
 // hero art drifts gently with the pointer
 const art=document.querySelector('.hero-art');let pr=0;
 if(art&&!rm&&matchMedia('(hover:hover)').matches)addEventListener('pointermove',e=>{if(pr||scrollY>innerHeight)return;pr=requestAnimationFrame(()=>{pr=0;art.style.transform=`translate(${(e.clientX/innerWidth-.5)*-14}px,${(e.clientY/innerHeight-.5)*-10}px)`})});
 // candle mode: the light flickers like a real flame
 let fl=0;
 new MutationObserver(()=>{clearInterval(fl);if(R.classList.contains('candle')&&!rm)fl=setInterval(()=>R.style.setProperty('--cr',(282+Math.random()*44).toFixed(0)+'px'),130);else R.style.removeProperty('--cr')}).observe(R,{attributes:true,attributeFilter:['class']});
 // secret: click a sticker or the footer signature for a shower of petals
 const t=document.querySelector('[data-toast]');let tm;
 const say=m=>{if(!t)return;t.textContent=m;t.classList.add('show');clearTimeout(tm);tm=setTimeout(()=>t.classList.remove('show'),3200)};
 const shower=()=>{say("Tu as trouvé le petit secret de l'atelier ♡");if(rm)return;const g=['✿','♡','✦','✧','❀'],c=['#B04A5A','#F7B267','#BEB0D5','#EBC3B8'];
  for(let i=0;i<26;i++){const p=document.createElement('span');p.textContent=g[i%5];p.setAttribute('aria-hidden','true');p.style.cssText=`position:fixed;left:${Math.random()*100}vw;top:-30px;z-index:220;pointer-events:none;font-size:${14+Math.random()*16}px;color:${c[i%4]}`;document.body.appendChild(p);
   p.animate([{transform:'translate(0,0) rotate(0)',opacity:1},{transform:`translate(${(Math.random()-.5)*160}px,${innerHeight+60}px) rotate(${Math.random()*540-270}deg)`,opacity:.2}],{duration:2600+Math.random()*2200,delay:Math.random()*700,easing:'cubic-bezier(.3,.1,.5,1)',fill:'backwards'}).onfinish=()=>p.remove()}};
 document.querySelectorAll('.floating-note,.feature-sticker,.footer-script').forEach(el=>el.addEventListener('click',shower));
};
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();

/* ===== v4: app-style mobile ===== */
(()=>{
const R=document.documentElement,rm=matchMedia('(prefers-reduced-motion:reduce)').matches;
const I={house:'<path d="M4 11.5 12 4l8 7.5V19a2 2 0 0 1-2 2h-3v-5.5H9V21H6a2 2 0 0 1-2-2z"/>',candle:'<path d="M7 11h10v8a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2zM12 3c1.7 2 2.3 3.3 0 5.3-2.3-2-1.7-3.3 0-5.3zM12 8.3V11"/>',flame:'<path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 .3 1.2 1 2 2 2 0-3-1-5 1-8z"/>',heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/>',gift:'<path d="M20 12v9H4v-9M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>',cart:'<path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 2-1.6L22 8H6"/><circle cx="10" cy="21" r="1"/><circle cx="18" cy="21" r="1"/>',user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4.5 4-6 8-6s7 1.5 8 6"/>',phone:'<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M11 18h2"/>',search:''};
const svg=p=>`<svg viewBox="0 0 24 24" aria-hidden="true">${p}</svg>`;
const init=()=>{
 if(top!==self)R.classList.add('in-app');
 const f=location.pathname.split('/').pop()||'index.html',gift=new URLSearchParams(location.search).get('cat')==='coffrets';
 const act=f==='favoris.html'?'fav':/^(panier|commande)/.test(f)?'cart':/^(boutique|produit)/.test(f)?'shop':/^index/.test(f)||f===''?'home':'';
 const T=[['home','index.html','Accueil','house',''],['shop','boutique.html','Boutique','candle',''],['fav','favoris.html','Mes favoris','heart','data-favorite-count'],['cart','panier.html','Mon panier','cart','data-cart-count']];
 const nav=document.createElement('nav');nav.className='tabbar';nav.setAttribute('aria-label','Navigation de l\'application');
 nav.innerHTML=T.map(t=>`<a href="${t[1]}" aria-label="${t[2]}"${t[0]===act?' class="on" aria-current="page"':''}><span class="ic">${svg(I[t[3]])}${t[4]?`<span class="count" ${t[4]}>0</span>`:''}</span></a>`).join('');
 document.body.appendChild(nav);
 nav.insertAdjacentHTML('afterbegin','<svg class="bg" aria-hidden="true"><path/></svg>');
 const bg=nav.querySelector('path');let ax=-200,raf=0;
 const draw=x=>{ax=x;const w=nav.clientWidth,h=nav.clientHeight,r=24,l=x-56,e=x+56;
  let d=l>r?`M0 ${h}L0 ${r}Q0 0 ${r} 0`:`M0 ${h}L0 0`;
  d+=`L${l} 0C${x-42} 0 ${x-37.3} 19.4 ${x-30.3} 31.5A35 35 0 0 0 ${x+30.3} 31.5C${x+37.3} 19.4 ${x+42} 0 ${e} 0`;
  d+=e<w-r?`L${w-r} 0Q${w} 0 ${w} ${r}`:`L${w} 0`;
  bg.setAttribute('d',d+`L${w} ${h}Z`)};
 const go=(x,ms)=>{cancelAnimationFrame(raf);const a=ax<0?x:ax,t0=performance.now();if(!ms){draw(x);return}const st=t=>{const p=Math.min((t-t0)/ms,1);draw(a+(x-a)*(1-Math.pow(1-p,3)));if(p<1)raf=requestAnimationFrame(st)};raf=requestAnimationFrame(st)};
 const ctr=a=>{const b=nav.getBoundingClientRect(),r=a.getBoundingClientRect();return r.left-b.left+r.width/2};
 const fit=()=>{const a=nav.querySelector('.on');go(a?ctr(a):-200,0)};
 fit();addEventListener('resize',fit);
 nav.querySelectorAll('.count').forEach(b=>{const s=()=>b.style.display=b.textContent.trim()==='0'?'none':'';new MutationObserver(s).observe(b,{childList:true,characterData:true,subtree:true});s()});
 nav.addEventListener('click',e=>{const a=e.target.closest('a');if(!a||a.classList.contains('on')||e.metaKey||e.ctrlKey||e.shiftKey)return;e.preventDefault();nav.querySelectorAll('a').forEach(x=>x.classList.toggle('on',x===a));go(ctr(a),rm?0:300);R.classList.add('leaving');setTimeout(()=>location.href=a.href,rm?0:300)});
 const ha=document.querySelector('.nav-actions');
 if(ha)ha.insertAdjacentHTML('afterbegin',`<a class="icon-link nav-account" href="compte.html" aria-label="Mon compte">${svg(I.user)}</a>`);
 const mn=document.querySelector('.mobile-nav');if(mn)mn.insertAdjacentHTML('beforeend','<a href="compte.html">Mon compte</a>');
 // shop search
 const grid=document.querySelector('[data-products="all"]'),bar=document.querySelector('.shop-toolbar');
 if(grid&&bar){
  const s=document.createElement('label');s.className='shop-search';s.innerHTML=svg('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>')+'<input type="search" placeholder="Rechercher une création…" aria-label="Rechercher une création">';bar.before(s);
  const e=document.createElement('p');e.className='shop-empty';e.hidden=true;e.textContent='Aucune création ne correspond… essaie un autre mot ♡';grid.after(e);
  const q=s.querySelector('input'),run=()=>{const v=q.value.trim().toLowerCase();let n=0;grid.querySelectorAll('[data-product-card]').forEach(c=>{const ok=!v||c.textContent.toLowerCase().includes(v);c.classList.toggle('no-match',!ok);if(ok&&!c.hidden)n++});e.hidden=n>0};
  q.addEventListener('input',run);document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>setTimeout(run,0)));
 }
 // phone preview (desktop only)
 if(top===self){
  const b=document.createElement('button');b.type='button';b.className='emu-btn';b.innerHTML=svg(I.phone)+'<span>aperçu mobile</span>';document.body.appendChild(b);
  b.onclick=()=>{const o=document.createElement('div');o.className='emu';o.innerHTML=`<div class="phone"><div class="phone-bar"><b>9:41</b><i></i></div><iframe src="${location.href.split('#')[0]}" title="Aperçu mobile du site"></iframe></div><button class="emu-x" type="button" aria-label="Fermer l'aperçu">×</button><p>aperçu mobile · Échap pour fermer</p>`;document.body.appendChild(o);o.addEventListener('click',ev=>{if(ev.target===o||ev.target.closest('.emu-x'))o.remove()})};
  addEventListener('keydown',ev=>{if(ev.key==='Escape')document.querySelector('.emu')?.remove()});
 }
};
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();

/* ===== v6: smooth page transitions ===== */
(()=>{
const R=document.documentElement,rm=matchMedia('(prefers-reduced-motion:reduce)').matches;
addEventListener('pageshow',()=>R.classList.remove('leaving'));
document.addEventListener('click',e=>{
 if(e.defaultPrevented||e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
 const a=e.target.closest('a[href]');if(!a||a.target||a.hasAttribute('download'))return;
 const u=new URL(a.href,location.href);
 if(u.protocol!==location.protocol||u.host!==location.host||(u.pathname===location.pathname&&u.search===location.search))return;
 e.preventDefault();R.classList.add('leaving');setTimeout(()=>location.href=a.href,rm?0:240);
});
})();
