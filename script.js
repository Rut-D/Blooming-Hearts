/* =========================================================================
   BLOOMING HEARTS — front-end only shop
   Persistence via localStorage. No backend / no network calls.
   ========================================================================= */

/* ---------- SVG BOUQUET GENERATOR ---------- */
function polarPoint(cx,cy,r,angleDeg){
  const a = angleDeg * Math.PI/180;
  return [cx + r*Math.cos(a), cy + r*Math.sin(a)];
}
function flowerHead(cx,cy,r,petals,petalColor,centerColor,rotation){
  let s = `<g transform="rotate(${rotation} ${cx} ${cy})">`;
  for(let i=0;i<petals;i++){
    const ang = (360/petals)*i;
    const [px,py] = polarPoint(cx,cy,r*0.55,ang);
    s += `<ellipse cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" rx="${(r*0.42).toFixed(1)}" ry="${(r*0.62).toFixed(1)}" fill="${petalColor}" opacity="0.96" transform="rotate(${ang+90} ${px.toFixed(1)} ${py.toFixed(1)})"/>`;
  }
  s += `<circle cx="${cx}" cy="${cy}" r="${(r*0.34).toFixed(1)}" fill="${centerColor}"/>`;
  s += `</g>`;
  return s;
}
function sunflowerHead(cx,cy,r,rotation){
  let s = `<g transform="rotate(${rotation} ${cx} ${cy})">`;
  for(let i=0;i<13;i++){
    const ang=(360/13)*i;
    const [px,py]=polarPoint(cx,cy,r*0.62,ang);
    s += `<ellipse cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" rx="${(r*0.3).toFixed(1)}" ry="${(r*0.68).toFixed(1)}" fill="#f5c22e" transform="rotate(${ang+90} ${px.toFixed(1)} ${py.toFixed(1)})"/>`;
  }
  s += `<circle cx="${cx}" cy="${cy}" r="${(r*0.46).toFixed(1)}" fill="#6b4423"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="${(r*0.46).toFixed(1)}" fill="url(#seedPattern)" opacity="0.35"/>`;
  s += `</g>`;
  return s;
}
function tulipHead(cx,cy,r,color,rotation){
  const w=r*0.62,h=r*1.3;
  return `<g transform="rotate(${rotation} ${cx} ${cy})">
    <path d="M ${cx-w} ${cy+h*0.4} Q ${cx-w} ${cy-h} ${cx} ${cy-h*0.55} Q ${cx} ${cy-h*0.85} ${cx-w*0.3} ${cy-h}
             Q ${cx} ${cy-h*0.7} ${cx} ${cy-h*1.05}
             Q ${cx} ${cy-h*0.7} ${cx+w*0.3} ${cy-h}
             Q ${cx} ${cy-h*0.85} ${cx} ${cy-h*0.55}
             Q ${cx+w} ${cy-h} ${cx+w} ${cy+h*0.4} Q ${cx} ${cy+h*0.65} ${cx-w} ${cy+h*0.4} Z"
      fill="${color}"/>
  </g>`;
}
function leafShape(cx,cy,len,angle,color){
  return `<ellipse cx="${cx}" cy="${cy}" rx="${len*0.22}" ry="${len}" fill="${color}" transform="rotate(${angle} ${cx} ${cy})"/>`;
}
function stem(x1,y1,x2,y2,color){
  return `<path d="M${x1},${y1} Q${(x1+x2)/2+8},${(y1+y2)/2} ${x2},${y2}" stroke="${color}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
}
function wrapCone(cx,baseY,wrapColor,ribbonColor){
  return `
    <path d="M ${cx-95} ${baseY+10} L ${cx} ${baseY+150} L ${cx+95} ${baseY+10}
             Q ${cx} ${baseY-14} ${cx-95} ${baseY+10} Z" fill="${wrapColor}" opacity="0.94"/>
    <path d="M ${cx-95} ${baseY+10} L ${cx} ${baseY+150} L ${cx+95} ${baseY+10}"
          fill="none" stroke="${ribbonColor}" stroke-width="2" opacity="0.5"/>
    <rect x="${cx-14}" y="${baseY+55}" width="28" height="16" rx="3" fill="${ribbonColor}"/>
    <path d="M${cx-14},${baseY+63} l-16,-10 M${cx+14},${baseY+63} l16,-10" stroke="${ribbonColor}" stroke-width="5" stroke-linecap="round" fill="none"/>
  `;
}
/* type: rose | sunflower | tulip | mixed | orchid | peony | gift */
function bouquetSVG(type, seed=1, size=300){
  const rand = (n)=> ( (Math.sin(seed*999+n*37)+1)/2 ); // deterministic pseudo-random
  const cx = size/2, baseY = size*0.62;
  let heads='', leaves='', stems='';
  const palette = {
    rose:      {petal:'#c23b5e', petal2:'#e05575', center:'#7a1f39', leaf:'#3f6b4a'},
    blushrose: {petal:'#f3a8b9', petal2:'#f7c2cf', center:'#c23b5e', leaf:'#6f9c78'},
    tulip:     {petal:'#e8749a', petal2:'#f2a5c2', center:'#7a1f39', leaf:'#4a7c56'},
    tuliporange:{petal:'#f0924a', petal2:'#f5b26b', center:'#a8501f', leaf:'#4a7c56'},
    orchid:    {petal:'#9b7fc7', petal2:'#c3aee6', center:'#5a3f8c', leaf:'#4a7c56'},
    peony:     {petal:'#f0b4c8', petal2:'#f7d3e0', center:'#c23b5e', leaf:'#6f9c78'},
    lavender:  {petal:'#a98bd0', petal2:'#c9b3e6', center:'#6b4a99', leaf:'#6f9c78'},
    white:     {petal:'#fdfaf6', petal2:'#f4ede2', center:'#e8c078', leaf:'#4a7c56'}
  };
  const wrapColors = ['#3a1224','#f6e2c8','#f9dfe6','#efe3f6','#2e4a34'];
  const wrapColor = wrapColors[Math.floor(rand(1)*wrapColors.length)];
  const ribbon = '#c9973f';

  const positions = [[cx-58,baseY-40,0.9],[cx,baseY-92,1.05],[cx+58,baseY-40,0.9],[cx-20,baseY-64,0.72],[cx+30,baseY-70,0.72]];

  positions.forEach((p,i)=>{ leaves += leafShape(p[0]+ (i%2?18:-18), p[1]+40, 44, i%2? 35:-35, '#4a7c56'); });
  positions.forEach((p)=>{ stems += stem(p[0], baseY+90, p[0], p[1]+14, '#3f6b4a'); });

  if(type==='sunflower'){
    positions.forEach((p,i)=>{ heads += sunflowerHead(p[0],p[1],38*p[2],rand(i+5)*40-20); });
  } else if(type==='tulip'){
    positions.forEach((p,i)=>{ heads += tulipHead(p[0],p[1],40*p[2], palette.tulip.petal, rand(i+3)*16-8); });
  } else if(type==='tuliporange'){
    positions.forEach((p,i)=>{ heads += tulipHead(p[0],p[1],40*p[2], palette.tuliporange.petal, rand(i+3)*16-8); });
  } else if(type==='orchid'){
    positions.forEach((p,i)=>{ heads += flowerHead(p[0],p[1],34*p[2],6,palette.orchid.petal,palette.orchid.center, rand(i+4)*60); });
  } else if(type==='peony'){
    positions.forEach((p,i)=>{ heads += flowerHead(p[0],p[1],38*p[2],10,palette.peony.petal,palette.peony.center, rand(i+2)*60);
                                heads += flowerHead(p[0],p[1],26*p[2],8,palette.peony.petal2,palette.peony.center, rand(i+6)*60); });
  } else if(type==='gift'){
    positions.slice(0,3).forEach((p,i)=>{ heads += flowerHead(p[0],p[1],34*p[2],7,palette.blushrose.petal,palette.blushrose.center, rand(i+7)*50); });
    heads += `<g transform="translate(${cx+70},${baseY-4})">
      <rect x="-24" y="-24" width="48" height="40" rx="4" fill="#7a1f39"/>
      <rect x="-24" y="-24" width="48" height="10" fill="#c9973f"/>
      <rect x="-4" y="-24" width="8" height="40" fill="#c9973f"/>
    </g>`;
  } else if(type==='mixed'){
    const p = palette.lavender;
    heads += flowerHead(positions[0][0],positions[0][1],36,8,palette.rose.petal,palette.rose.center, rand(1)*40);
    heads += flowerHead(positions[1][0],positions[1][1],40,9,palette.blushrose.petal,palette.blushrose.center, rand(2)*40);
    heads += flowerHead(positions[2][0],positions[2][1],34,8,p.petal,p.center, rand(3)*40);
    heads += tulipHead(positions[3][0],positions[3][1],28,palette.white.petal, rand(4)*16);
    heads += tulipHead(positions[4][0],positions[4][1],28,palette.tuliporange.petal, rand(5)*16);
  } else { // rose default
    positions.forEach((p,i)=>{ heads += flowerHead(p[0],p[1],36*p[2],9,palette.rose.petal,palette.rose.center, rand(i+1)*60); });
  }

  return `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <defs><pattern id="seedPattern" width="4" height="4" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="0.8" fill="#3d2a14"/></pattern></defs>
    ${stems}${leaves}${wrapCone(cx,baseY,wrapColor,ribbon)}${heads}
  </svg>`;
}
function iconSVG(name){
  const icons = {
    rose: `<svg viewBox="0 0 48 48"><g>${flowerHead(24,22,15,9,'#c23b5e','#7a1f39',10)}</g><path d="M24 36 24 46" stroke="#3f6b4a" stroke-width="3" fill="none"/></svg>`,
    sunflower: `<svg viewBox="0 0 48 48">${sunflowerHead(24,22,16,0)}<path d="M24 36 24 46" stroke="#3f6b4a" stroke-width="3" fill="none"/></svg>`,
    tulip: `<svg viewBox="0 0 48 48">${tulipHead(24,26,16,'#e8749a',0)}<path d="M24 36 24 46" stroke="#3f6b4a" stroke-width="3" fill="none"/></svg>`,
    mixed: `<svg viewBox="0 0 48 48">${flowerHead(16,20,10,7,'#c23b5e','#7a1f39',5)}${flowerHead(31,18,11,8,'#9b7fc7','#5a3f8c',20)}<path d="M16 28 16 46M31 27 31 46" stroke="#3f6b4a" stroke-width="2.5" fill="none"/></svg>`,
    gift: `<svg viewBox="0 0 48 48"><rect x="10" y="20" width="28" height="22" rx="3" fill="#7a1f39"/><rect x="10" y="20" width="28" height="6" fill="#c9973f"/><rect x="22" y="20" width="4" height="22" fill="#c9973f"/>${flowerHead(24,10,9,7,'#f3a8b9','#c23b5e',0)}</svg>`
  };
  return icons[name]||icons.rose;
}

/* ---------- PRODUCT DATA ---------- */
const PRODUCTS = [
  {id:1,name:"Rose Rim",category:"Roses",occasion:["Anniversary","Romance"],price:899,oldPrice:null,rating:4.9,reviews:214,tag:"bestseller",svgType:"rose",img:"https://images.pexels.com/photos/30190442/pexels-photo-30190442.jpeg?auto=compress&cs=tinysrgb&w=800",desc:"Twenty velvety red roses wrapped in charcoal paper with baby's breath — a timeless declaration of love."},
  {id:2,name:"Crimson Cascade",category:"Roses",occasion:["Anniversary","Romance"],price:1099,oldPrice:1299,rating:4.8,reviews:132,tag:"sale",svgType:"rose",img:"https://images.pexels.com/photos/8164756/pexels-photo-8164756.jpeg?auto=compress&cs=tinysrgb&w=800",desc:"Long-stemmed crimson roses cascading in a dramatic hand-tied arrangement for grand gestures."},
  {id:3,name:"Blush Whisper",category:"Roses",occasion:["Birthday","Romance"],price:949,oldPrice:null,rating:4.7,reviews:98,tag:"bestseller",svgType:"blushrose",img:"https://images.pexels.com/photos/30190403/pexels-photo-30190403.jpeg?auto=compress&cs=tinysrgb&w=800",desc:"Soft blush roses with delicate greenery — a gentle, romantic whisper of a bouquet."},
  {id:4,name:"Sunshine Bloom",category:"Sunflowers",occasion:["Birthday","Friendship"],price:799,oldPrice:null,rating:4.8,reviews:176,tag:"bestseller",svgType:"sunflower",img:"https://images.pexels.com/photos/27583027/pexels-photo-27583027.jpeg?auto=compress&cs=tinysrgb&w=800",desc:"Five radiant sunflowers wrapped in warm cream paper — pure happiness, hand delivered."},
  {id:5,name:"Golden Meadow",category:"Sunflowers",occasion:["Get Well","Friendship"],price:849,oldPrice:null,rating:4.6,reviews:64,tag:"new",svgType:"sunflower",img:"https://images.pexels.com/photos/37483804/pexels-photo-37483804.jpeg?auto=compress&cs=tinysrgb&w=800",desc:"A cheerful meadow-style mix of sunflowers and wildflower greens to brighten any day."},
  {id:6,name:"Tulip Bliss",category:"Tulips",occasion:["Birthday","Congrats"],price:999,oldPrice:null,rating:4.9,reviews:151,tag:"bestseller",svgType:"tulip",img:"https://images.pexels.com/photos/31391536/pexels-photo-31391536.jpeg?auto=compress&cs=tinysrgb&w=800",desc:"Five perfect pink tulips in soft pastel wrap, elegantly simple and endlessly charming."},
  {id:7,name:"Tulip Dawn",category:"Tulips",occasion:["Congrats","Get Well"],price:1049,oldPrice:null,rating:4.7,reviews:59,tag:"new",svgType:"tuliporange",img:"https://images.pexels.com/photos/33340747/pexels-photo-33340747.jpeg?auto=compress&cs=tinysrgb&w=800",desc:"Sunrise-orange tulips bundled with airy greenery — like the first light of morning."},
  {id:8,name:"Elegant Gold",category:"Mixed Bouquets",occasion:["Wedding","Anniversary"],price:1299,oldPrice:null,rating:5.0,reviews:203,tag:"bestseller",svgType:"blushrose",img:"https://images.pexels.com/photos/19533253/pexels-photo-19533253.jpeg?auto=compress&cs=tinysrgb&w=800",desc:"A lush dome of pink roses and gypsophila finished with gold wrap — refined and romantic."},
  {id:9,name:"Garden Romance",category:"Mixed Bouquets",occasion:["Romance","Wedding"],price:1199,oldPrice:1399,rating:4.8,reviews:87,tag:"sale",svgType:"mixed",img:"https://images.pexels.com/photos/21953359/pexels-photo-21953359.jpeg?auto=compress&cs=tinysrgb&w=800",desc:"A garden-style medley of roses, tulips and seasonal blooms for a romantic, effortless look."},
  {id:10,name:"Lavender Dream",category:"Mixed Bouquets",occasion:["Birthday","Sympathy"],price:1149,oldPrice:null,rating:4.6,reviews:45,tag:"new",svgType:"lavender",img:"https://images.pexels.com/photos/34990290/pexels-photo-34990290.jpeg?auto=compress&cs=tinysrgb&w=800",desc:"Dreamy purple tones with lavender roses and orchids — calming, elegant, unforgettable."},
  {id:11,name:"Sweetheart Combo",category:"Gift Combos",occasion:["Romance","Birthday"],price:1599,oldPrice:1799,rating:4.9,reviews:167,tag:"sale",svgType:"gift",img:"https://images.pexels.com/photos/13831901/pexels-photo-13831901.jpeg?auto=compress&cs=tinysrgb&w=800",desc:"A rose bouquet paired with premium chocolates in a keepsake box — the perfect sweetheart gift."},
  {id:12,name:"Teddy & Tulips",category:"Gift Combos",occasion:["Birthday","Get Well"],price:1499,oldPrice:null,rating:4.7,reviews:74,tag:"bestseller",svgType:"gift",img:"https://images.pexels.com/photos/30592535/pexels-photo-30592535.jpeg?auto=compress&cs=tinysrgb&w=800",desc:"A soft plush teddy bear bundled with fresh tulips — an extra-huggable way to say it."},
  {id:13,name:"Orchid Elegance",category:"Mixed Bouquets",occasion:["Congrats","Wedding"],price:1799,oldPrice:null,rating:4.9,reviews:112,tag:"bestseller",svgType:"orchid",img:"https://images.pexels.com/photos/30755508/pexels-photo-30755508.jpeg?auto=compress&cs=tinysrgb&w=800",desc:"Exotic purple orchids arranged with structural greenery for a sculptural, elegant statement."},
  {id:14,name:"Peony Charm",category:"Mixed Bouquets",occasion:["Anniversary","Birthday"],price:1349,oldPrice:null,rating:4.8,reviews:96,tag:"new",svgType:"peony",img:"https://images.pexels.com/photos/3392982/pexels-photo-3392982.jpeg?auto=compress&cs=tinysrgb&w=800",desc:"Full, ruffled peonies in soft pink layers — romantic, voluminous, and irresistibly pretty."},
];
const HERO_IMG = "https://images.pexels.com/photos/30190442/pexels-photo-30190442.jpeg?auto=compress&cs=tinysrgb&w=1200";
const CATEGORIES = [
  {name:"Roses", icon:"rose", desc:"Classic & romantic"},
  {name:"Sunflowers", icon:"sunflower", desc:"Bright & cheerful"},
  {name:"Tulips", icon:"tulip", desc:"Fresh & elegant"},
  {name:"Mixed Bouquets", icon:"mixed", desc:"Best of everything"},
  {name:"Gift Combos", icon:"gift", desc:"Flowers plus a treat"},
];
const TESTIMONIALS = [
  {name:"Ananya Sharma",role:"Mumbai",text:"The Rose Rim bouquet was even more beautiful in person. Delivered right on time for my anniversary — my husband was so touched.",petal:"rose"},
  {name:"Rahul Mehta",role:"Pune",text:"Ordered the Sunshine Bloom for my mom's birthday. The sunflowers were fresh for over a week! Will definitely order again.",petal:"sunflower"},
  {name:"Divya Iyer",role:"Bengaluru",text:"Elegant Gold is worth every rupee. The packaging alone felt like a gift. Customer service was warm and quick to respond too.",petal:"blushrose"},
  {name:"Karan Verma",role:"Delhi",text:"The Sweetheart Combo made my proposal unforgettable. Easy ordering, gorgeous flowers, and the chocolates were a lovely touch.",petal:"tulip"},
  {name:"Simran Kaur",role:"Chandigarh",text:"Same-day delivery saved me when I forgot my sister's birthday! Teddy & Tulips arrived within the hour looking perfect.",petal:"peony"},
  {name:"Aditya Rao",role:"Hyderabad",text:"Orchid Elegance was the centerpiece at our office inauguration. Everyone asked where we got such a striking arrangement.",petal:"orchid"},
];

/* ---------- STATE / STORAGE ----------
   BEFORE: everything (users, passwords, cart, wishlist, orders) lived only
   in localStorage on one browser, and "login" just checked a plaintext
   password against a local array. That's not real auth and never syncs
   across devices.

   NOW: Supabase Auth handles accounts (it keeps its own session token in
   localStorage automatically). Cart / wishlist / orders / addresses live
   in Supabase tables (see supabase_schema.sql) once someone is logged in,
   so they follow the user to any device.

   Guests (not logged in) still get a working cart/wishlist cached in
   localStorage under LS.cart / LS.wishlist, so browsing works without
   an account. When they log in, that guest cart/wishlist is merged into
   their cloud account (see mergeGuestDataIntoCloud() further down).
------------------------------------------------------------------------- */
const LS = {
  cart:'bh_cart', wishlist:'bh_wishlist', orders:'bh_orders', addresses:'bh_addresses'
};
function loadJSON(key, fallback){ try{ const v = JSON.parse(localStorage.getItem(key)); return v==null?fallback:v; }catch(e){ return fallback; } }
function saveJSON(key, val){ localStorage.setItem(key, JSON.stringify(val)); }

let state = {
  cart: loadJSON(LS.cart, []),           // [{id, qty}]
  wishlist: loadJSON(LS.wishlist, []),   // [id,...]
  currentUser: null,                     // filled in by Supabase auth (see AUTH section)
  orders: loadJSON(LS.orders, []),
  addresses: loadJSON(LS.addresses, []),
  promo: null,
  shopFilters: { categories:new Set(), occasions:new Set(), maxPrice:2000, sort:'featured', query:'' },
  shopVisibleCount: 6,
  testiIndex: 0,
  qvProduct: null,
  qvQty: 1,
};

// Saves cart/wishlist/orders/addresses to localStorage too, so the UI has
// something to show instantly on refresh (and so guests keep their cart).
// When logged in, the *real* source of truth is Supabase — this is just a cache.
function persistAll(){
  saveJSON(LS.cart, state.cart);
  saveJSON(LS.wishlist, state.wishlist);
  saveJSON(LS.orders, state.orders);
  saveJSON(LS.addresses, state.addresses);
}

/* ---------- CLOUD SYNC (Supabase) ----------
   Small helper functions that read/write the Supabase tables. Each one
   only runs when someone is logged in (state.currentUser exists).
   They're written as "fire and forget" with .catch(console.error) so a
   slow/failed network call never freezes the UI — the local state has
   already been updated and rendered by the time these run.
------------------------------------------------------------------------- */

// Pulls this user's cart, wishlist, addresses and orders from Supabase
// and replaces the local state with it. Called right after login.
async function loadCloudDataIntoState(){
  const uid = state.currentUser.id;

  const [cartRes, wishRes, addrRes, orderRes] = await Promise.all([
    supabaseClient.from('cart_items').select('product_id, qty').eq('user_id', uid),
    supabaseClient.from('wishlist_items').select('product_id').eq('user_id', uid),
    supabaseClient.from('addresses').select('*').eq('user_id', uid).order('created_at'),
    supabaseClient.from('orders').select('*').eq('user_id', uid).order('created_at')
  ]);

  if(cartRes.data) state.cart = cartRes.data.map(r=>({id:r.product_id, qty:r.qty}));
  if(wishRes.data) state.wishlist = wishRes.data.map(r=>r.product_id);
  if(addrRes.data) state.addresses = addrRes.data;
  if(orderRes.data) state.orders = orderRes.data.map(o=>({
    id:o.id, email:state.currentUser.email, date:o.date, status:o.status,
    items:o.items, total:o.total, address:o.address, slot:o.slot, payment:o.payment
  }));

  persistAll();
}

// The first time someone logs in on a browser where they'd already added
// guest items to the cart/wishlist, push those into their cloud account
// instead of losing them.
async function mergeGuestDataIntoCloud(guestCart, guestWishlist){
  const uid = state.currentUser.id;
  for(const item of guestCart){
    await supabaseClient.from('cart_items')
      .upsert({user_id:uid, product_id:item.id, qty:item.qty}, {onConflict:'user_id,product_id'});
  }
  for(const productId of guestWishlist){
    await supabaseClient.from('wishlist_items')
      .upsert({user_id:uid, product_id:productId}, {onConflict:'user_id,product_id'});
  }
}

function cloudSaveCartItem(productId, qty){
  if(!state.currentUser) return;
  supabaseClient.from('cart_items')
    .upsert({user_id:state.currentUser.id, product_id:productId, qty}, {onConflict:'user_id,product_id'})
    .then(({error})=>{ if(error) console.error('Cart sync failed:', error); });
}
function cloudRemoveCartItem(productId){
  if(!state.currentUser) return;
  supabaseClient.from('cart_items')
    .delete().eq('user_id', state.currentUser.id).eq('product_id', productId)
    .then(({error})=>{ if(error) console.error('Cart sync failed:', error); });
}
function cloudAddWishlistItem(productId){
  if(!state.currentUser) return;
  supabaseClient.from('wishlist_items')
    .upsert({user_id:state.currentUser.id, product_id:productId}, {onConflict:'user_id,product_id'})
    .then(({error})=>{ if(error) console.error('Wishlist sync failed:', error); });
}
function cloudRemoveWishlistItem(productId){
  if(!state.currentUser) return;
  supabaseClient.from('wishlist_items')
    .delete().eq('user_id', state.currentUser.id).eq('product_id', productId)
    .then(({error})=>{ if(error) console.error('Wishlist sync failed:', error); });
}
function cloudAddAddress(addr){
  if(!state.currentUser) return Promise.resolve();
  return supabaseClient.from('addresses')
    .insert({user_id:state.currentUser.id, label:addr.label, name:addr.name, phone:addr.phone,
             address:addr.address, city:addr.city, pincode:addr.pincode})
    .select().single();
}
function cloudRemoveAddress(id){
  if(!state.currentUser) return;
  supabaseClient.from('addresses').delete().eq('id', id)
    .then(({error})=>{ if(error) console.error('Address sync failed:', error); });
}
function cloudSaveOrder(order){
  if(!state.currentUser) return;
  supabaseClient.from('orders').insert({
    id:order.id, user_id:state.currentUser.id, items:order.items, total:order.total,
    address:order.address, date:order.date, status:order.status, slot:order.slot, payment:order.payment
  }).then(({error})=>{ if(error) console.error('Order sync failed:', error); });
}
function cloudClearCart(){
  if(!state.currentUser) return;
  supabaseClient.from('cart_items').delete().eq('user_id', state.currentUser.id)
    .then(({error})=>{ if(error) console.error('Cart clear failed:', error); });
}
function cloudSaveProfile(){
  if(!state.currentUser) return;
  supabaseClient.from('profiles')
    .update({name:state.currentUser.name, phone:state.currentUser.phone})
    .eq('id', state.currentUser.id)
    .then(({error})=>{ if(error) console.error('Profile sync failed:', error); });
}

/* ---------- TOAST ---------- */
function toast(msg, icon='🌸'){
  const stack = document.getElementById('toast-stack');
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `<span>${icon}</span><span>${msg}</span>`;
  stack.appendChild(el);
  requestAnimationFrame(()=> el.classList.add('show'));
  setTimeout(()=>{ el.classList.remove('show'); setTimeout(()=> el.remove(), 400); }, 2800);
}

/* ---------- NAV / VIEW ROUTING ---------- */
function showView(name){
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  document.getElementById('view-'+name).classList.add('active');
  document.querySelectorAll('.nav-links a').forEach(a=>{
    a.classList.toggle('active', a.dataset.nav===name && !a.dataset.anchor);
  });
  window.scrollTo({top:0, behavior:'instant' in window ? 'instant':'auto'});
  if(name==='profile') renderProfile();
  if(name==='shop') renderShop();
  if(name==='checkout') renderCheckout();
}
document.querySelectorAll('[data-nav]').forEach(el=>{
  el.addEventListener('click', (e)=>{
    e.preventDefault();
    const target = el.dataset.nav;
    closeMobileNav();
    if(target==='shop'){ showView('shop'); }
    else if(target==='home'){
      showView('home');
      if(el.dataset.anchor){
        setTimeout(()=> document.getElementById(el.dataset.anchor)?.scrollIntoView({behavior:'smooth'}), 60);
      }
    }
  });
});
document.getElementById('heroBestSellersBtn').addEventListener('click', ()=>{
  document.getElementById('best-sellers').scrollIntoView({behavior:'smooth'});
});
document.getElementById('promoShopBtn').addEventListener('click', ()=> showView('shop'));

/* ---------- MOBILE NAV ---------- */
const mobileNav = document.getElementById('mobileNav');
function closeMobileNav(){ mobileNav.classList.remove('open'); }
document.getElementById('hamburgerBtn').addEventListener('click', ()=> mobileNav.classList.add('open'));
document.getElementById('mobileNavClose').addEventListener('click', closeMobileNav);
document.getElementById('mobileCartBtn').addEventListener('click', ()=>{ closeMobileNav(); openCart(); });
document.getElementById('mobileAccountBtn').addEventListener('click', ()=>{ closeMobileNav(); openAccount(); });

/* ---------- CATEGORY GRID ---------- */
function renderCategories(){
  const grid = document.getElementById('catGrid');
  grid.innerHTML = CATEGORIES.map(c=>`
    <div class="cat-card" data-cat="${c.name}">
      <div class="icon-wrap">${iconSVG(c.icon)}</div>
      <h4>${c.name}</h4>
      <span>${c.desc}</span>
    </div>
  `).join('');
  grid.querySelectorAll('.cat-card').forEach(card=>{
    card.addEventListener('click', ()=>{
      state.shopFilters.categories = new Set([card.dataset.cat]);
      showView('shop');
    });
  });
}

/* ---------- MARQUEE ---------- */
function renderMarquee(){
  const items = ["Fresh cut daily","Free delivery over ₹1200","Same-day delivery available","Hand-tied by local florists","100% freshness guarantee","Gift wrapping included"];
  const track = document.getElementById('marqueeTrack');
  const heart = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7.5-4.6-10-9.3C.4 8 2 4.5 5.4 4A5 5 0 0 1 12 7a5 5 0 0 1 6.6-3c3.4.5 5 4 3.4 7.7C19.5 16.4 12 21 12 21z"/></svg>`;
  const chunk = items.map(t=>`<span>${heart}${t}</span>`).join('');
  track.innerHTML = chunk + chunk; // doubled for seamless loop
}

/* ---------- PRODUCT CARD ---------- */
function starRow(rating){
  const full = Math.round(rating);
  let s = '';
  for(let i=0;i<5;i++){
    s += `<svg viewBox="0 0 24 24" fill="${i<full?'currentColor':'none'}" stroke="currentColor" stroke-width="1.5"><polygon points="12 2 15 9 22 9.5 17 14.5 18.5 22 12 18 5.5 22 7 14.5 2 9.5 9 9"/></svg>`;
  }
  return s;
}
function productCardHTML(p){
  const inWish = state.wishlist.includes(p.id);
  const tagHTML = p.tag==='sale' ? `<span class="tag-pill sale">Sale</span>` : p.tag==='new' ? `<span class="tag-pill new">New</span>` : p.tag==='bestseller' ? `<span class="tag-pill">Bestseller</span>` : '';
  return `
  <div class="product-card" data-id="${p.id}">
    <div class="product-media">
      ${tagHTML}
      <button class="wish-btn ${inWish?'active':''}" data-wish="${p.id}" aria-label="Add to wishlist">
        <svg viewBox="0 0 24 24" fill="${inWish?'currentColor':'none'}" stroke="currentColor" stroke-width="2"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>
      </button>
      <img src="${p.img}" alt="${p.name} bouquet" loading="lazy">
    </div>
    <div class="product-info">
      <span class="product-cat">${p.category}</span>
      <h3 data-qv="${p.id}">${p.name}</h3>
      <div class="product-stars">${starRow(p.rating)} <span>(${p.reviews})</span></div>
      <div class="price-row">
        <span class="price">₹${p.price}</span>
        ${p.oldPrice?`<span class="price-old">₹${p.oldPrice}</span>`:''}
      </div>
      <div class="add-row">
        <button class="add-cart-btn" data-add="${p.id}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></svg>
          Add to Cart
        </button>
      </div>
    </div>
  </div>`;
}
function bindProductGridEvents(container){
  container.querySelectorAll('[data-add]').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      addToCart(parseInt(btn.dataset.add), 1);
      flyToCart(btn);
    });
  });
  container.querySelectorAll('[data-wish]').forEach(btn=>{
    btn.addEventListener('click', ()=> toggleWishlist(parseInt(btn.dataset.wish)));
  });
  container.querySelectorAll('[data-qv]').forEach(el=>{
    el.addEventListener('click', ()=> openQuickView(parseInt(el.dataset.qv)));
  });
}
function flyToCart(originEl){
  const cartBtn = document.getElementById('cartNavBtn');
  const originRect = originEl.getBoundingClientRect();
  const targetRect = cartBtn.getBoundingClientRect();
  const bubble = document.createElement('div');
  bubble.textContent = '🌸';
  bubble.style.cssText = `position:fixed;left:${originRect.left}px;top:${originRect.top}px;font-size:20px;z-index:9999;pointer-events:none;transition:all .7s cubic-bezier(.2,.8,.3,1);`;
  document.body.appendChild(bubble);
  requestAnimationFrame(()=>{
    bubble.style.left = targetRect.left+10+'px';
    bubble.style.top = targetRect.top+10+'px';
    bubble.style.transform = 'scale(.3)';
    bubble.style.opacity = '0.3';
  });
  setTimeout(()=> bubble.remove(), 750);
  cartBtn.style.transition='transform .3s';
  cartBtn.style.transform='scale(1.15)';
  setTimeout(()=> cartBtn.style.transform='scale(1)', 300);
}

function renderBestSellers(){
  const grid = document.getElementById('bestSellerGrid');
  const items = PRODUCTS.filter(p=>p.tag==='bestseller').slice(0,4);
  grid.innerHTML = items.map(productCardHTML).join('');
  bindProductGridEvents(grid);
}
function renderNewArrivals(){
  const grid = document.getElementById('newArrivalsGrid');
  const items = PRODUCTS.filter(p=>p.tag==='new' || p.tag==='sale').slice(0,4);
  grid.innerHTML = items.map(productCardHTML).join('');
  bindProductGridEvents(grid);
}

/* ---------- HERO BOUQUET ---------- */
function renderHeroBouquet(){
  document.getElementById('heroBouquet').innerHTML = `<img src="${HERO_IMG}" alt="Fresh red rose bouquet with baby's breath" loading="lazy" style="width:100%;height:100%;object-fit:cover;border-radius:28px;box-shadow:var(--shadow-strong);">`;
}

/* ---------- CART ---------- */
function cartQty(){ return state.cart.reduce((a,c)=>a+c.qty,0); }
function cartSubtotal(){
  return state.cart.reduce((sum,c)=>{
    const p = PRODUCTS.find(x=>x.id===c.id);
    return sum + (p? p.price*c.qty : 0);
  },0);
}
function updateCartBadge(){
  const badge = document.getElementById('cartBadge');
  const q = cartQty();
  badge.textContent = q;
  badge.style.display = q>0 ? 'flex':'none';
  const wbadge = document.getElementById('wishBadge');
  wbadge.textContent = state.wishlist.length;
  wbadge.style.display = state.wishlist.length>0 ? 'flex':'none';
}
function addToCart(id, qty=1){
  const existing = state.cart.find(c=>c.id===id);
  if(existing) existing.qty += qty; else state.cart.push({id, qty});
  persistAll(); updateCartBadge(); renderCartDrawer();
  cloudSaveCartItem(id, state.cart.find(c=>c.id===id).qty); // push to Supabase if logged in
  const p = PRODUCTS.find(x=>x.id===id);
  toast(`${p.name} added to cart`, '🛒');
}
function setQty(id, qty){
  const existing = state.cart.find(c=>c.id===id);
  if(!existing) return;
  existing.qty = qty;
  if(existing.qty<=0){ state.cart = state.cart.filter(c=>c.id!==id); cloudRemoveCartItem(id); }
  else{ cloudSaveCartItem(id, existing.qty); }
  persistAll(); updateCartBadge(); renderCartDrawer();
}
function removeFromCart(id){
  state.cart = state.cart.filter(c=>c.id!==id);
  cloudRemoveCartItem(id);
  persistAll(); updateCartBadge(); renderCartDrawer();
  toast('Item removed from cart', '🗑️');
}
function renderCartDrawer(){
  const body = document.getElementById('cartBody');
  const foot = document.getElementById('cartFoot');
  if(state.cart.length===0){
    body.innerHTML = `<div class="empty-state">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></svg>
      <h3>Your cart is empty</h3>
      <p>Time to pick a bouquet that says it best.</p>
      <button class="btn btn-primary btn-sm" style="margin-top:16px;" data-nav="shop" id="cartEmptyShopBtn">Browse Bouquets</button>
    </div>`;
    document.getElementById('cartEmptyShopBtn').addEventListener('click', ()=>{ closeCart(); showView('shop'); });
    foot.innerHTML = '';
    return;
  }
  body.innerHTML = state.cart.map(c=>{
    const p = PRODUCTS.find(x=>x.id===c.id);
    return `<div class="cart-item">
      <div class="thumb"><img src="${p.img}" alt="${p.name}" loading="lazy"></div>
      <div class="info">
        <span class="cat">${p.category}</span>
        <h5>${p.name}</h5>
        <div class="qty-stepper">
          <button data-dec="${p.id}">−</button>
          <span>${c.qty}</span>
          <button data-inc="${p.id}">+</button>
        </div>
      </div>
      <div class="right">
        <span class="item-price">₹${p.price*c.qty}</span>
        <button class="remove-x" data-remove="${p.id}">Remove</button>
      </div>
    </div>`;
  }).join('');
  body.querySelectorAll('[data-inc]').forEach(b=> b.addEventListener('click', ()=>{
    const c = state.cart.find(x=>x.id===parseInt(b.dataset.inc)); setQty(c.id, c.qty+1);
  }));
  body.querySelectorAll('[data-dec]').forEach(b=> b.addEventListener('click', ()=>{
    const c = state.cart.find(x=>x.id===parseInt(b.dataset.dec)); setQty(c.id, c.qty-1);
  }));
  body.querySelectorAll('[data-remove]').forEach(b=> b.addEventListener('click', ()=> removeFromCart(parseInt(b.dataset.remove))));

  const subtotal = cartSubtotal();
  const delivery = subtotal>1200 || subtotal===0 ? 0 : 60;
  const discount = state.promo ? Math.round(subtotal*state.promo.pct) : 0;
  const total = subtotal + delivery - discount;
  foot.innerHTML = `
    <div class="promo-row">
      <input type="text" id="promoInput" placeholder="Promo code (try BLOOM15)" value="${state.promo?state.promo.code:''}">
      <button class="btn btn-ghost btn-sm" id="applyPromoBtn">Apply</button>
    </div>
    <div class="summary-row"><span>Subtotal</span><span>₹${subtotal}</span></div>
    <div class="summary-row"><span>Delivery</span><span>${delivery===0?'Free':'₹'+delivery}</span></div>
    ${state.promo?`<div class="summary-row" style="color:var(--leaf);"><span>Discount (${state.promo.code})</span><span>−₹${discount}</span></div>`:''}
    <div class="summary-row total"><span>Total</span><span>₹${total}</span></div>
    <button class="btn btn-primary btn-block" id="goCheckoutBtn" style="margin-top:14px;">Proceed to Checkout</button>
  `;
  document.getElementById('applyPromoBtn').addEventListener('click', ()=>{
    const val = document.getElementById('promoInput').value.trim().toUpperCase();
    if(val==='BLOOM15'){ state.promo={code:'BLOOM15',pct:0.15}; toast('Promo applied — 15% off!','🎉'); }
    else if(val==='BLOOM10'){ state.promo={code:'BLOOM10',pct:0.10}; toast('Promo applied — 10% off!','🎉'); }
    else { state.promo=null; toast('Invalid promo code','⚠️'); }
    renderCartDrawer();
  });
  document.getElementById('goCheckoutBtn').addEventListener('click', ()=>{
    closeCart(); showView('checkout');
  });
}
function openCart(){ document.getElementById('cartDrawer').classList.add('open'); document.getElementById('overlay').classList.add('show'); renderCartDrawer(); }
function closeCart(){ document.getElementById('cartDrawer').classList.remove('open'); document.getElementById('overlay').classList.remove('show'); }
document.getElementById('cartNavBtn').addEventListener('click', openCart);
document.getElementById('closeCart').addEventListener('click', closeCart);
document.getElementById('overlay').addEventListener('click', ()=>{ closeCart(); closeAuth(); closeQV(); });

/* ---------- WISHLIST ---------- */
function toggleWishlist(id){
  if(state.wishlist.includes(id)){
    state.wishlist = state.wishlist.filter(x=>x!==id);
    cloudRemoveWishlistItem(id);
    toast('Removed from wishlist','💔');
  } else {
    state.wishlist.push(id);
    cloudAddWishlistItem(id);
    toast('Added to wishlist','💗');
  }
  persistAll(); updateCartBadge();
  document.querySelectorAll(`[data-wish="${id}"]`).forEach(btn=>{
    const active = state.wishlist.includes(id);
    btn.classList.toggle('active', active);
    btn.querySelector('svg').setAttribute('fill', active?'currentColor':'none');
  });
  if(document.getElementById('view-profile').classList.contains('active')) renderWishlistPanel();
}
document.getElementById('wishNavBtn').addEventListener('click', ()=>{
  if(!requireAuth()) return;
  showView('profile'); switchProfileTab('wishlist');
});

/* ---------- QUICK VIEW ---------- */
function openQuickView(id){
  const p = PRODUCTS.find(x=>x.id===id);
  state.qvProduct = p; state.qvQty = 1;
  document.getElementById('qvMedia').innerHTML = `<img src="${p.img.replace('w=800','w=1000')}" alt="${p.name} bouquet" loading="lazy" style="width:100%;border-radius:20px;box-shadow:var(--shadow-soft);">`;
  document.getElementById('qvCat').textContent = p.category;
  document.getElementById('qvName').textContent = p.name;
  document.getElementById('qvStars').innerHTML = starRow(p.rating) + ` <span>(${p.reviews} reviews)</span>`;
  document.getElementById('qvPrice').textContent = '₹'+p.price;
  document.getElementById('qvOldPrice').textContent = p.oldPrice? '₹'+p.oldPrice : '';
  document.getElementById('qvDesc').textContent = p.desc;
  document.getElementById('qvQtyVal').textContent = 1;
  const wishBtn = document.getElementById('qvWishBtn');
  const inWish = state.wishlist.includes(p.id);
  wishBtn.querySelector('svg').setAttribute('fill', inWish?'currentColor':'none');
  document.getElementById('qvModal').classList.add('show');
  document.getElementById('overlay').classList.add('show');
}
function closeQV(){ document.getElementById('qvModal').classList.remove('show'); if(!document.getElementById('authModal').classList.contains('show')) document.getElementById('overlay').classList.remove('show'); }
document.getElementById('qvClose').addEventListener('click', closeQV);
document.getElementById('qvMinus').addEventListener('click', ()=>{ state.qvQty=Math.max(1,state.qvQty-1); document.getElementById('qvQtyVal').textContent=state.qvQty; });
document.getElementById('qvPlus').addEventListener('click', ()=>{ state.qvQty++; document.getElementById('qvQtyVal').textContent=state.qvQty; });
document.getElementById('qvAddBtn').addEventListener('click', ()=>{
  addToCart(state.qvProduct.id, state.qvQty);
  closeQV();
  openCart();
});
document.getElementById('qvWishBtn').addEventListener('click', ()=> toggleWishlist(state.qvProduct.id));

/* ---------- SHOP VIEW ---------- */
function renderShopFilters(){
  const catGroup = document.getElementById('filterCategoryGroup');
  catGroup.innerHTML = CATEGORIES.map(c=>`
    <label><input type="checkbox" value="${c.name}" class="cat-filter"> ${c.name}</label>
  `).join('');
  catGroup.querySelectorAll('.cat-filter').forEach(cb=>{
    cb.checked = state.shopFilters.categories.has(cb.value);
    cb.addEventListener('change', ()=>{
      if(cb.checked) state.shopFilters.categories.add(cb.value); else state.shopFilters.categories.delete(cb.value);
      state.shopVisibleCount=6; renderShop();
    });
  });
  const occSet = new Set(PRODUCTS.flatMap(p=>p.occasion));
  const occGroup = document.getElementById('filterOccasionGroup');
  occGroup.innerHTML = [...occSet].map(o=>`<label><input type="checkbox" value="${o}" class="occ-filter"> ${o}</label>`).join('');
  occGroup.querySelectorAll('.occ-filter').forEach(cb=>{
    cb.checked = state.shopFilters.occasions.has(cb.value);
    cb.addEventListener('change', ()=>{
      if(cb.checked) state.shopFilters.occasions.add(cb.value); else state.shopFilters.occasions.delete(cb.value);
      state.shopVisibleCount=6; renderShop();
    });
  });
  document.getElementById('priceRange').value = state.shopFilters.maxPrice;
  document.getElementById('priceRangeVal').textContent = 'up to ₹'+state.shopFilters.maxPrice;
}
document.getElementById('priceRange').addEventListener('input', (e)=>{
  state.shopFilters.maxPrice = parseInt(e.target.value);
  document.getElementById('priceRangeVal').textContent = 'up to ₹'+state.shopFilters.maxPrice;
  state.shopVisibleCount=6; renderShop();
});
document.getElementById('sortSelect').addEventListener('change', (e)=>{ state.shopFilters.sort=e.target.value; renderShop(); });
document.getElementById('clearFiltersBtn').addEventListener('click', ()=>{
  state.shopFilters = { categories:new Set(), occasions:new Set(), maxPrice:2000, sort:'featured', query:state.shopFilters.query };
  state.shopVisibleCount=6;
  renderShopFilters(); renderShop();
});
document.getElementById('loadMoreBtn').addEventListener('click', ()=>{
  state.shopVisibleCount += 6; renderShop(false);
});

function filteredSortedProducts(){
  let list = PRODUCTS.filter(p=>{
    if(state.shopFilters.categories.size && !state.shopFilters.categories.has(p.category)) return false;
    if(state.shopFilters.occasions.size && !p.occasion.some(o=>state.shopFilters.occasions.has(o))) return false;
    if(p.price > state.shopFilters.maxPrice) return false;
    if(state.shopFilters.query && !p.name.toLowerCase().includes(state.shopFilters.query.toLowerCase()) && !p.category.toLowerCase().includes(state.shopFilters.query.toLowerCase())) return false;
    return true;
  });
  switch(state.shopFilters.sort){
    case 'price-asc': list.sort((a,b)=>a.price-b.price); break;
    case 'price-desc': list.sort((a,b)=>b.price-a.price); break;
    case 'rating': list.sort((a,b)=>b.rating-a.rating); break;
    case 'name': list.sort((a,b)=>a.name.localeCompare(b.name)); break;
    default: list.sort((a,b)=> (b.tag==='bestseller')-(a.tag==='bestseller'));
  }
  return list;
}
function renderShop(resetFilters=true){
  if(resetFilters) renderShopFilters();
  const list = filteredSortedProducts();
  const visible = list.slice(0, state.shopVisibleCount);
  const grid = document.getElementById('shopGrid');
  document.getElementById('resultCount').textContent = list.length ? `Showing ${visible.length} of ${list.length} products` : 'No products found';
  document.getElementById('loadMoreBtn').style.display = state.shopVisibleCount < list.length ? 'inline-flex':'none';
  if(list.length===0){
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
      <h3>No blooms match your filters</h3>
      <p>Try widening your price range or clearing a filter.</p>
    </div>`;
    return;
  }
  grid.innerHTML = visible.map(productCardHTML).join('');
  bindProductGridEvents(grid);
}

/* ---------- SEARCH ---------- */
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', (e)=>{
  state.shopFilters.query = e.target.value;
  state.shopVisibleCount = 6;
  showView('shop');
});

/* ---------- COUNTDOWN ---------- */
function startCountdown(){
  const end = Date.now() + (1000*60*60*7) + (1000*60*42); // ~7h42m demo countdown
  function tick(){
    const diff = Math.max(0, end - Date.now());
    const h = Math.floor(diff/3600000);
    const m = Math.floor((diff%3600000)/60000);
    const s = Math.floor((diff%60000)/1000);
    document.getElementById('cd-h').textContent = String(h).padStart(2,'0');
    document.getElementById('cd-m').textContent = String(m).padStart(2,'0');
    document.getElementById('cd-s').textContent = String(s).padStart(2,'0');
  }
  tick(); setInterval(tick,1000);
}

/* ---------- TESTIMONIALS ---------- */
function renderTestimonials(){
  const track = document.getElementById('testiTrack');
  track.innerHTML = TESTIMONIALS.map(t=>`
    <div class="testi-card">
      <div class="testi-stars">${starRow(5)}</div>
      <p>"${t.text}"</p>
      <div class="testi-person">
        <div class="avatar-flower">${bouquetHeadIcon(t.petal)}</div>
        <div><strong>${t.name}</strong><span>${t.role}</span></div>
      </div>
    </div>
  `).join('');
  updateTestiPosition();
}
function bouquetHeadIcon(type){
  const colorMap = {rose:'#c23b5e',sunflower:'#f5c22e',blushrose:'#f3a8b9',tulip:'#e8749a',orchid:'#9b7fc7',peony:'#f0b4c8'};
  const c = colorMap[type]||'#c23b5e';
  return `<svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="22" fill="${c}22"/>${flowerHead(22,22,13,8,c,'#7a1f39',10)}</svg>`;
}
function updateTestiPosition(){
  const perView = window.innerWidth<800?1:window.innerWidth<1080?2:3;
  const max = Math.max(0, TESTIMONIALS.length - perView);
  state.testiIndex = Math.min(state.testiIndex, max);
  const track = document.getElementById('testiTrack');
  const cardWidth = track.children[0] ? track.children[0].getBoundingClientRect().width + 24 : 0;
  track.style.transform = `translateX(-${state.testiIndex*cardWidth}px)`;
}
document.getElementById('testiPrev').addEventListener('click', ()=>{ state.testiIndex=Math.max(0,state.testiIndex-1); updateTestiPosition(); });
document.getElementById('testiNext').addEventListener('click', ()=>{ state.testiIndex++; updateTestiPosition(); });
window.addEventListener('resize', updateTestiPosition);

/* ---------- NEWSLETTER ---------- */
document.getElementById('newsletterForm').addEventListener('submit', (e)=>{
  e.preventDefault();
  toast('Subscribed! Check your inbox for 10% off 💌','✅');
  document.getElementById('newsletterEmail').value='';
});

/* ---------- AUTH ----------
   BEFORE: signup pushed {email, plaintext password} into a localStorage
   array, and login compared the typed password against it in the
   browser. Anyone could open devtools and read every password.

   NOW: supabaseClient.auth.signUp / signInWithPassword / signOut do the
   real work — Supabase hashes passwords, issues secure session tokens,
   and keeps you logged in across refreshes automatically.
------------------------------------------------------------------------- */
const authModal = document.getElementById('authModal');
function openAuth(mode='login'){
  authModal.classList.add('show'); document.getElementById('overlay').classList.add('show');
  switchAuthTab(mode);
}
function closeAuth(){ authModal.classList.remove('show'); if(!document.getElementById('qvModal').classList.contains('show')) document.getElementById('overlay').classList.remove('show'); }
document.getElementById('authClose').addEventListener('click', closeAuth);
function switchAuthTab(mode){
  const isLogin = mode==='login';
  document.getElementById('tabLogin').classList.toggle('active', isLogin);
  document.getElementById('tabSignup').classList.toggle('active', !isLogin);
  document.getElementById('loginForm').style.display = isLogin?'block':'none';
  document.getElementById('signupForm').style.display = isLogin?'none':'block';
}
document.getElementById('tabLogin').addEventListener('click', ()=>switchAuthTab('login'));
document.getElementById('tabSignup').addEventListener('click', ()=>switchAuthTab('signup'));
document.getElementById('goSignup').addEventListener('click', (e)=>{ e.preventDefault(); switchAuthTab('signup'); });
document.getElementById('goLogin').addEventListener('click', (e)=>{ e.preventDefault(); switchAuthTab('login'); });

document.getElementById('loginForm').addEventListener('submit', async (e)=>{
  e.preventDefault();
  const fd = new FormData(e.target);
  const email = fd.get('email').trim().toLowerCase();
  const pass = fd.get('password');
  const emailField = document.getElementById('loginEmailField');
  const passField = document.getElementById('loginPassField');
  emailField.classList.remove('error'); passField.classList.remove('error');

  const submitBtn = e.target.querySelector('button[type=submit]');
  submitBtn.disabled = true; submitBtn.textContent = 'Logging in...';

  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password: pass });

  submitBtn.disabled = false; submitBtn.textContent = 'Login';

  if(error){
    // Supabase doesn't tell us *which* field is wrong (for security), so
    // we just flag the password field with the message it gives us.
    passField.classList.add('error');
    passField.querySelector('.hint').textContent = error.message;
    return;
  }

  await onLoggedIn(data.user);
  closeAuth();
  toast(`Welcome back, ${state.currentUser.name.split(' ')[0]}!`, '🌷');
  e.target.reset();
});

document.getElementById('signupForm').addEventListener('submit', async (e)=>{
  e.preventDefault();
  const fd = new FormData(e.target);
  const name = fd.get('name').trim();
  const email = fd.get('email').trim().toLowerCase();
  const pass = fd.get('password');
  const emailField = document.getElementById('signupEmailField');
  const passField = document.getElementById('signupPassField');
  emailField.classList.remove('error'); passField.classList.remove('error');

  const submitBtn = e.target.querySelector('button[type=submit]');
  submitBtn.disabled = true; submitBtn.textContent = 'Signing up...';

  // `options.data.name` is saved as user metadata, which our database
  // trigger (handle_new_user in supabase_schema.sql) copies into the
  // profiles table automatically.
  const { data, error } = await supabaseClient.auth.signUp({
    email, password: pass, options: { data: { name } }
  });

  submitBtn.disabled = false; submitBtn.textContent = 'Sign Up';

  if(error){
    if(error.message.toLowerCase().includes('already')) emailField.classList.add('error');
    else passField.classList.add('error');
    passField.querySelector('.hint').textContent = error.message;
    return;
  }

  if(!data.session){
    // Supabase project has "confirm email" turned on — there's no
    // session yet until they click the link in their inbox.
    closeAuth();
    toast(`Check ${email} to confirm your account 📩`, '✅');
    e.target.reset();
    return;
  }

  await onLoggedIn(data.user, name);
  closeAuth();
  toast(`Welcome to Blooming Hearts, ${name.split(' ')[0]}! 🎉`);
  e.target.reset();
});

// Runs once, right after a successful login or signup.
async function onLoggedIn(user, nameOverride){
  const guestCart = state.cart, guestWishlist = state.wishlist;

  // Fetch (or, right after signup, wait a beat for) the profile row
  // created by the database trigger.
  let { data: profile } = await supabaseClient.from('profiles').select('*').eq('id', user.id).single();
  state.currentUser = {
    id: user.id,
    email: user.email,
    name: nameOverride || profile?.name || user.email.split('@')[0],
    phone: profile?.phone || ''
  };

  if(guestCart.length || guestWishlist.length){
    await mergeGuestDataIntoCloud(guestCart, guestWishlist);
  }
  await loadCloudDataIntoState();
  updateCartBadge(); updateAuthUI();
}

function requireAuth(){
  if(!state.currentUser){ openAuth('login'); toast('Please log in to continue','🔒'); return false; }
  return true;
}
function openAccount(){
  if(state.currentUser) showView('profile'); else openAuth('login');
}
document.getElementById('profileNavBtn').addEventListener('click', openAccount);
document.getElementById('logoutBtn').addEventListener('click', async ()=>{
  await supabaseClient.auth.signOut();
  state.currentUser = null;
  // Back to a clean guest cart/wishlist rather than showing the last
  // logged-in user's data.
  state.cart = []; state.wishlist = []; state.orders = []; state.addresses = [];
  persistAll(); updateCartBadge(); updateAuthUI();
  toast('You have been logged out','👋');
  showView('home');
});
function updateAuthUI(){
  const btn = document.getElementById('profileNavBtn');
  btn.title = state.currentUser ? state.currentUser.name : 'Account';
}

// Restores the session on page load/refresh, so people stay logged in.
async function initAuth(){
  const { data: { session } } = await supabaseClient.auth.getSession();
  if(session){
    await onLoggedIn(session.user);
  }
  renderShop(); // re-render anything that depends on wishlist/cart state
  updateCartBadge();
}

/* ---------- PROFILE ---------- */
function renderProfile(){
  if(!state.currentUser){ openAuth('login'); showView('home'); return; }
  document.getElementById('profileGreetName').textContent = `Welcome back, ${state.currentUser.name.split(' ')[0]}!`;
  document.getElementById('profileGreetEmail').textContent = state.currentUser.email;
  document.getElementById('profileAvatarInitial').textContent = state.currentUser.name.charAt(0).toUpperCase();
  document.getElementById('accName').value = state.currentUser.name;
  document.getElementById('accEmail').value = state.currentUser.email;
  document.getElementById('accPhone').value = state.currentUser.phone || '';
  renderOrdersPanel();
  renderWishlistPanel();
  renderAddressPanel();
}
function renderOrdersPanel(){
  const list = document.getElementById('ordersList');
  const myOrders = state.orders.filter(o=>o.email===state.currentUser.email).slice().reverse();
  if(myOrders.length===0){
    list.innerHTML = `<div class="empty-state">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 7 12 3 4 7v10l8 4 8-4V7z"/></svg>
      <h3>No orders yet</h3><p>Your delivered bouquets and their stories will show up here.</p>
      <button class="btn btn-primary btn-sm" style="margin-top:16px;" id="ordersEmptyShopBtn">Start Shopping</button>
    </div>`;
    document.getElementById('ordersEmptyShopBtn').addEventListener('click', ()=> showView('shop'));
    return;
  }
  list.innerHTML = myOrders.map(o=>`
    <div class="order-card">
      <div class="oc-top"><strong>#${o.id}</strong><span class="status-pill">${o.status}</span></div>
      <div class="oc-items">${o.items.map(it=>`${it.qty}× ${it.name}`).join(' · ')}</div>
      <div class="oc-bottom"><span>${o.date}</span><strong>₹${o.total}</strong></div>
    </div>
  `).join('');
}
function renderWishlistPanel(){
  const grid = document.getElementById('wishlistGrid');
  const items = PRODUCTS.filter(p=>state.wishlist.includes(p.id));
  if(items.length===0){
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>
      <h3>Your wishlist is empty</h3><p>Tap the heart on any bouquet to save it here.</p>
    </div>`;
    return;
  }
  grid.innerHTML = items.map(productCardHTML).join('');
  bindProductGridEvents(grid);
}
function renderAddressPanel(){
  const list = document.getElementById('addressList');
  if(state.addresses.length===0){
    list.innerHTML = `<div class="empty-state" style="padding:30px 20px;">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/></svg>
      <h3>No saved addresses</h3><p>Add one so checkout is even faster next time.</p>
    </div>`;
    return;
  }
  list.innerHTML = state.addresses.map((a,i)=>`
    <div class="addr-card">
      <div><h5>${a.label}</h5><p>${a.name} · ${a.phone}<br>${a.address}, ${a.city} - ${a.pincode}</p></div>
      <button class="remove-x" data-del-addr="${a.id!=null ? a.id : i}">Remove</button>
    </div>
  `).join('');
  list.querySelectorAll('[data-del-addr]').forEach(b=> b.addEventListener('click', ()=>{
    const key = b.dataset.delAddr;
    state.addresses = state.addresses.filter((a,i)=> String(a.id!=null?a.id:i) !== key);
    cloudRemoveAddress(key);
    persistAll(); renderAddressPanel();
    toast('Address removed');
  }));
}
document.getElementById('addAddressBtn').addEventListener('click', async ()=>{
  const name = prompt('Full name for this address:'); if(!name) return;
  const phone = prompt('Phone number:')||'';
  const address = prompt('Address line:')||'';
  const city = prompt('City:')||'';
  const pincode = prompt('Pincode:')||'';
  const newAddr = {label:'Home', name, phone, address, city, pincode};
  if(state.currentUser){
    // Insert into Supabase first so we get back a real database id.
    const {data, error} = await cloudAddAddress(newAddr);
    if(!error && data) newAddr.id = data.id;
  } else {
    newAddr.id = 'local-' + Date.now(); // guests just get a local id
  }
  state.addresses.push(newAddr);
  persistAll(); renderAddressPanel();
  toast('Address saved','📍');
});
document.getElementById('accountForm').addEventListener('submit', (e)=>{
  e.preventDefault();
  state.currentUser.name = document.getElementById('accName').value.trim() || state.currentUser.name;
  state.currentUser.phone = document.getElementById('accPhone').value.trim();
  cloudSaveProfile(); // writes name/phone to the profiles table
  renderProfile();
  toast('Account details updated','✅');
});
document.querySelectorAll('.profile-tabs button[data-tab]').forEach(btn=>{
  btn.addEventListener('click', ()=> switchProfileTab(btn.dataset.tab));
});
function switchProfileTab(tab){
  document.querySelectorAll('.profile-tabs button[data-tab]').forEach(b=> b.classList.toggle('active', b.dataset.tab===tab));
  document.querySelectorAll('.profile-panel').forEach(p=> p.classList.toggle('active', p.id==='panel-'+tab));
}

/* ---------- CHECKOUT ---------- */
document.getElementById('paymentOptions').innerHTML = `
  <label><input type="radio" name="payment" value="cod" checked> Cash on Delivery</label>
  <label><input type="radio" name="payment" value="card"> Credit / Debit Card</label>
  <label><input type="radio" name="payment" value="upi"> UPI</label>
`;
function renderCheckout(){
  if(state.cart.length===0){ showView('shop'); toast('Your cart is empty','🛒'); return; }
  const itemsWrap = document.getElementById('checkoutItems');
  itemsWrap.innerHTML = state.cart.map(c=>{
    const p = PRODUCTS.find(x=>x.id===c.id);
    return `<div class="mini-cart-item">
      <div class="thumb"><img src="${p.img}" alt="${p.name}" loading="lazy"></div>
      <div><div class="name">${p.name}</div><div class="qty">Qty ${c.qty}</div></div>
      <div class="p">₹${p.price*c.qty}</div>
    </div>`;
  }).join('');
  const subtotal = cartSubtotal();
  const delivery = subtotal>1200?0:60;
  const discount = state.promo ? Math.round(subtotal*state.promo.pct) : 0;
  const total = subtotal+delivery-discount;
  document.getElementById('co-subtotal').textContent = '₹'+subtotal;
  document.getElementById('co-delivery').textContent = delivery===0?'Free':'₹'+delivery;
  document.getElementById('co-discount').textContent = '−₹'+discount;
  document.getElementById('co-promo-tag').textContent = state.promo?`(${state.promo.code})`:'';
  document.getElementById('co-total').textContent = '₹'+total;
  if(state.currentUser){
    const f = document.getElementById('checkoutForm');
    f.elements['name'].value = state.currentUser.name;
    f.elements['phone'].value = state.currentUser.phone||'';
  }
  const dateInput = document.querySelector('#checkoutForm input[name=date]');
  dateInput.min = new Date().toISOString().split('T')[0];
}
document.getElementById('checkoutForm').addEventListener('submit', (e)=>{
  e.preventDefault();
  if(!requireAuth()){ toast('Please log in to place your order','🔒'); return; }
  const fd = new FormData(e.target);
  const subtotal = cartSubtotal();
  const delivery = subtotal>1200?0:60;
  const discount = state.promo ? Math.round(subtotal*state.promo.pct) : 0;
  const total = subtotal+delivery-discount;
  const order = {
    id: 'BH-' + Math.floor(100000+Math.random()*900000),
    email: state.currentUser.email,
    date: new Date().toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}),
    status: 'Confirmed',
    items: state.cart.map(c=>{ const p=PRODUCTS.find(x=>x.id===c.id); return {name:p.name, qty:c.qty, price:p.price}; }),
    total, address: fd.get('address')+', '+fd.get('city')+' - '+fd.get('pincode'),
    slot: fd.get('slot'), payment: fd.get('payment')
  };
  state.orders.push(order);
  cloudSaveOrder(order); // save to the orders table
  state.cart = []; state.promo = null;
  cloudClearCart(); // empty the cloud cart now that the order is placed
  persistAll(); updateCartBadge();
  document.getElementById('orderIdBox').textContent = '#'+order.id;
  showView('success');
  e.target.reset();
});
document.getElementById('viewOrdersBtn').addEventListener('click', ()=>{ showView('profile'); switchProfileTab('orders'); });

/* ---------- KEYBOARD / ESC ---------- */
document.addEventListener('keydown', (e)=>{
  if(e.key==='Escape'){ closeCart(); closeAuth(); closeQV(); closeMobileNav(); }
});

/* ---------- INIT ---------- */
function init(){
  renderCategories();
  renderMarquee();
  renderBestSellers();
  renderNewArrivals();
  renderHeroBouquet();
  renderTestimonials();
  startCountdown();
  updateCartBadge();
  updateAuthUI();
  renderShopFilters();
  initAuth(); // check if there's already a logged-in Supabase session
}
init();