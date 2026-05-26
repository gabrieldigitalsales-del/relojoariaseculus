import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Heart, Search, ShoppingBag, Menu, X, Minus, Plus, Trash2, Camera, MessageCircle, ShieldCheck, Truck, Gem, Crown, Upload, Download, RotateCcw, Lock, Cookie, SlidersHorizontal } from 'lucide-react'
import { defaultStore } from './data/defaultStore'
import { buildWhatsAppOrder, calculateCart } from './services/checkoutService'
import './styles.css'

const currency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0)
const STORAGE = 'seculusHyperPremiumStore'
const COOKIE_KEY = 'seculusCookieConsent'

function useStoreData() {
  const [store, setStore] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE)) || defaultStore } catch { return defaultStore }
  })
  useEffect(() => localStorage.setItem(STORAGE, JSON.stringify(store)), [store])
  return [store, setStore]
}

function Header({ store, cartCount, openCart, goAdmin }) {
  const [open, setOpen] = useState(false)
  const nav = ['Início', 'Produtos', 'Coleções', 'Sobre', 'Instagram', 'Contato']
  return <>
    <div className="topbar">{store.settings.topbar}</div>
    <header className="header">
      <a className="brand" href="#inicio" aria-label="Relojoaria Seculus"><span>Seculus</span><small>Relojoaria</small></a>
      <nav className="desktop-nav">{nav.map(n => <a key={n} href={`#${n.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`}>{n}</a>)}</nav>
      <div className="header-actions">
        <a className="whatsapp" href={`https://wa.me/${store.settings.whatsapp}`} target="_blank">WhatsApp</a>
        <button className="icon-btn" onClick={openCart} aria-label="Abrir carrinho"><ShoppingBag size={19}/><b>{cartCount}</b></button>
        <button className="icon-btn mobile-only" onClick={() => setOpen(true)}><Menu/></button>
        <button className="admin-link" onClick={goAdmin}>Admin</button>
      </div>
    </header>
    {open && <div className="mobile-menu"><button onClick={() => setOpen(false)} className="close"><X/></button>{nav.map(n => <a onClick={() => setOpen(false)} key={n} href={`#${n.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`}>{n}</a>)}</div>}
  </>
}

function Hero({ slides }) {
  const [active, setActive] = useState(0)
  useEffect(() => { const id = setInterval(() => setActive(v => (v + 1) % slides.length), 5200); return () => clearInterval(id) }, [slides.length])
  const slide = slides[active]
  return <section id="inicio" className="hero" style={{ backgroundImage: slide.image }}>
    <div className="hero-shine" />
    <div className="hero-content">
      <span className="kicker">{slide.kicker}</span>
      <h1>{slide.title}</h1>
      <p>{slide.text}</p>
      <div className="hero-actions"><a href="#produtos" className="btn primary">{slide.cta}</a><a href="#contato" className="btn ghost">Falar com especialista</a></div>
    </div>
    <div className="hero-dots">{slides.map((s, i) => <button key={s.id} className={i === active ? 'active' : ''} onClick={() => setActive(i)} />)}</div>
  </section>
}

function Benefits({ items }) {
  const icons = [ShieldCheck, MessageCircle, Truck, Gem]
  return <section className="benefits">{items.map((b, i) => { const Icon = icons[i] || Crown; return <article key={b.title}><Icon/><h3>{b.title}</h3><p>{b.text}</p></article> })}</section>
}

function Collections({ collections }) {
  return <section id="colecoes" className="section collections"><SectionTitle label="Coleções" title="Escolhas para cada momento" text="Peças selecionadas para presentear, celebrar e compor uma presença inesquecível." />
    <div className="collection-grid">{collections.map(c => <a href="#produtos" className="collection-card" key={c.name}><img src={c.image}/><div><span>{c.name}</span><p>Conhecer seleção</p></div></a>)}</div>
  </section>
}

function SectionTitle({ label, title, text }) { return <div className="section-title"><span>{label}</span><h2>{title}</h2>{text && <p>{text}</p>}</div> }

function ProductCard({ p, add, toggleFav, fav, details }) {
  const price = p.salePrice || p.price
  return <article className="product-card">
    <button className={`fav ${fav ? 'on' : ''}`} onClick={() => toggleFav(p.id)}><Heart fill={fav ? 'currentColor' : 'none'} size={18}/></button>
    <button className="image-btn" onClick={() => details(p)}><img src={p.image} alt={p.name}/></button>
    <div className="product-meta"><span>{p.category}</span>{p.salePrice && <b>Oferta</b>}{p.stock <= 3 && <b className="low">Últimas peças</b>}</div>
    <h3>{p.name}</h3>
    <p>{p.description}</p>
    <div className="price-row">{p.salePrice && <del>{currency(p.price)}</del>}<strong>{currency(price)}</strong></div>
    <button className="buy" onClick={() => add(p)}>Adicionar ao carrinho</button>
  </article>
}

function Catalog({ store, add, favorites, toggleFav }) {
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('Todas')
  const [sort, setSort] = useState('Destaques')
  const [detail, setDetail] = useState(null)
  const categories = ['Todas', ...new Set(store.products.map(p => p.category))]
  const products = useMemo(() => {
    let list = store.products.filter(p => (cat === 'Todas' || p.category === cat) && p.name.toLowerCase().includes(q.toLowerCase()))
    if (sort === 'Menor preço') list.sort((a,b)=>(a.salePrice||a.price)-(b.salePrice||b.price))
    if (sort === 'Maior preço') list.sort((a,b)=>(b.salePrice||b.price)-(a.salePrice||a.price))
    if (sort === 'Mais vendidos') list.sort((a,b)=>Number(b.bestSeller)-Number(a.bestSeller))
    if (sort === 'Novidades') list.sort((a,b)=>b.id-a.id)
    return list
  }, [store.products, q, cat, sort])
  return <section id="produtos" className="section catalog"><SectionTitle label="Loja" title="Vitrine selecionada" text="Relógios e joias com curadoria, acabamento elegante e atendimento próximo." />
    <div className="filters"><div className="search"><Search size={18}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar por joias, relógios ou presentes" /></div><select value={cat} onChange={e=>setCat(e.target.value)}>{categories.map(c=><option key={c}>{c}</option>)}</select><select value={sort} onChange={e=>setSort(e.target.value)}>{['Destaques','Novidades','Mais vendidos','Menor preço','Maior preço'].map(s=><option key={s}>{s}</option>)}</select></div>
    <div className="product-grid">{products.map(p => <ProductCard key={p.id} p={p} add={add} fav={favorites.includes(p.id)} toggleFav={toggleFav} details={setDetail}/>)}</div>
    {detail && <ProductModal product={detail} close={()=>setDetail(null)} add={add} store={store}/>} 
  </section>
}

function ProductModal({ product, close, add, store }) {
  const url = `https://wa.me/${store.settings.whatsapp}?text=${encodeURIComponent(`Olá, tenho interesse em ${product.name}.`)}`
  return <div className="modal-backdrop" onClick={close}><div className="product-modal" onClick={e=>e.stopPropagation()}><button className="close" onClick={close}><X/></button><img src={product.image}/><div><span className="kicker">{product.category}</span><h2>{product.name}</h2><p>{product.description}</p><strong className="modal-price">{currency(product.salePrice || product.price)}</strong><p className="stock">Estoque disponível: {product.stock}</p><button className="btn primary" onClick={()=>add(product)}>Adicionar ao carrinho</button><a className="btn outline" href={url} target="_blank">Comprar pelo WhatsApp</a></div></div></div>
}

function CartDrawer({ open, setOpen, cart, setCart, store }) {
  const [couponCode, setCouponCode] = useState('')
  const [coupon, setCoupon] = useState(null)
  const [customer, setCustomer] = useState({ name:'', phone:'', cep:'', address:'', payment:'Pix', notes:'' })
  const totals = calculateCart(cart, coupon)
  const changeQty = (id, delta) => setCart(cart.map(i => i.id === id ? {...i, quantity: Math.max(1, i.quantity + delta)} : i))
  const remove = (id) => setCart(cart.filter(i => i.id !== id))
  const applyCoupon = () => setCoupon(store.coupons.find(c => c.active && c.code.toLowerCase() === couponCode.trim().toLowerCase()) || null)
  const finish = () => { if (!cart.length) return; window.open(buildWhatsAppOrder({ cart, coupon, customer, totals, store }), '_blank') }
  return <aside className={`cart ${open ? 'open' : ''}`}><div className="cart-head"><h2>Sacola</h2><button onClick={()=>setOpen(false)}><X/></button></div>
    <div className="cart-items">{cart.length === 0 && <p className="empty">Sua seleção aparecerá aqui.</p>}{cart.map(item => <div className="cart-line" key={item.id}><img src={item.image}/><div><h4>{item.name}</h4><span>{currency(item.salePrice || item.price)}</span><div className="qty"><button onClick={()=>changeQty(item.id,-1)}><Minus size={14}/></button><b>{item.quantity}</b><button onClick={()=>changeQty(item.id,1)}><Plus size={14}/></button><button onClick={()=>remove(item.id)}><Trash2 size={14}/></button></div></div></div>)}</div>
    <div className="coupon"><input value={couponCode} onChange={e=>setCouponCode(e.target.value.toUpperCase())} placeholder="Cupom de desconto"/><button onClick={applyCoupon}>Aplicar</button>{coupon && <small>Cupom {coupon.code} aplicado.</small>}</div>
    <div className="checkout-fields"><input placeholder="Nome" value={customer.name} onChange={e=>setCustomer({...customer,name:e.target.value})}/><input placeholder="Telefone" value={customer.phone} onChange={e=>setCustomer({...customer,phone:e.target.value})}/><input placeholder="CEP" value={customer.cep} onChange={e=>setCustomer({...customer,cep:e.target.value})}/><input placeholder="Endereço" value={customer.address} onChange={e=>setCustomer({...customer,address:e.target.value})}/><select value={customer.payment} onChange={e=>setCustomer({...customer,payment:e.target.value})}>{['Pix','Cartão','Boleto','Pagamento na loja'].map(p=><option key={p}>{p}</option>)}</select><textarea placeholder="Observações" value={customer.notes} onChange={e=>setCustomer({...customer,notes:e.target.value})}/></div>
    <div className="totals"><p><span>Subtotal</span><b>{currency(totals.subtotal)}</b></p><p><span>Desconto</span><b>- {currency(totals.discount)}</b></p><p><span>Frete</span><b>{totals.shipping === 0 ? 'Grátis' : currency(totals.shipping)}</b></p><p className="grand"><span>Total</span><b>{currency(totals.total)}</b></p><button className="btn primary full" onClick={finish}>Finalizar pelo WhatsApp</button><small>Pagamento online preparado para futura conexão com Stripe ou Mercado Pago.</small></div>
  </aside>
}

function InstagramSection({ store }) { return <section id="instagram" className="section instagram-section"><SectionTitle label="Instagram" title="Acompanhe nossas escolhas" text="Lançamentos, combinações e inspirações selecionadas para o seu momento." /><div className="insta-grid">{store.instagram.map(post => <a href={post.link} target="_blank" className="insta-card" key={post.id}><img src={post.image}/><div><Camera size={18}/><p>{post.caption}</p></div></a>)}</div><a className="btn outline center" href={store.settings.instagram} target="_blank">Ver Instagram</a></section> }

function CookieBanner() {
  const [show, setShow] = useState(() => localStorage.getItem(COOKIE_KEY) !== 'accepted')
  const [prefs, setPrefs] = useState(false)
  if (!show) return null
  const accept = () => { localStorage.setItem(COOKIE_KEY, 'accepted'); setShow(false) }
  return <div className="cookie-box"><Cookie/><div><h3>Privacidade e cookies</h3><p>Usamos cookies para melhorar sua experiência, manter preferências e entender a navegação da loja.</p>{prefs && <div className="cookie-prefs"><label><input type="checkbox" checked readOnly/> Necessários</label><label><input type="checkbox"/> Preferências</label><label><input type="checkbox"/> Métricas</label></div>}</div><div className="cookie-actions"><button onClick={()=>setPrefs(!prefs)}>Preferências</button><button onClick={accept}>Aceitar</button></div></div>
}

function Admin({ store, setStore, goHome }) {
  const [auth, setAuth] = useState(sessionStorage.getItem('adminAuth') === 'ok')
  const [pass, setPass] = useState('')
  const [tab, setTab] = useState('Conteúdo')
  const update = (patch) => setStore({ ...store, ...patch })
  const updateSettings = (patch) => setStore({ ...store, settings: { ...store.settings, ...patch } })
  const login = () => { if (pass === 'admin123') { sessionStorage.setItem('adminAuth','ok'); setAuth(true) } }
  const exportJson = () => { const blob = new Blob([JSON.stringify(store,null,2)], {type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='seculus-conteudo.json'; a.click() }
  const importJson = (file) => { const r = new FileReader(); r.onload = () => setStore(JSON.parse(r.result)); r.readAsText(file) }
  if (!auth) return <main className="admin-login"><div><Lock/><h1>Acesso administrativo</h1><p>Área reservada para gestão da loja.</p><input type="password" placeholder="Senha" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==='Enter'&&login()}/><button className="btn primary full" onClick={login}>Entrar</button><button onClick={goHome} className="admin-back">Voltar para loja</button></div></main>
  return <main className="admin"><aside><h2>Seculus Admin</h2>{['Conteúdo','Produtos','Cupons','Instagram','Aparência'].map(t => <button className={tab===t?'active':''} onClick={()=>setTab(t)} key={t}>{t}</button>)}<button onClick={exportJson}><Download size={16}/> Exportar JSON</button><label className="import"><Upload size={16}/> Importar JSON<input type="file" accept="application/json" onChange={e=>importJson(e.target.files[0])}/></label><button onClick={()=>setStore(defaultStore)}><RotateCcw size={16}/> Restaurar</button><button onClick={goHome}>Ver loja</button></aside><section className="admin-panel"><h1>{tab}</h1>{tab==='Conteúdo' && <div className="form-grid"><Input label="Nome da loja" value={store.settings.storeName} onChange={v=>updateSettings({storeName:v})}/><Input label="Aviso superior" value={store.settings.topbar} onChange={v=>updateSettings({topbar:v})}/><Input label="Slogan" value={store.settings.slogan} onChange={v=>updateSettings({slogan:v})}/><Input label="WhatsApp" value={store.settings.whatsapp} onChange={v=>updateSettings({whatsapp:v})}/><Input label="Instagram" value={store.settings.instagram} onChange={v=>updateSettings({instagram:v})}/><Textarea label="Sobre" value={store.about} onChange={v=>update({about:v})}/></div>}{tab==='Produtos' && <AdminList items={store.products} setItems={items=>update({products:items})} type="product"/>}{tab==='Cupons' && <AdminList items={store.coupons} setItems={items=>update({coupons:items})} type="coupon"/>}{tab==='Instagram' && <AdminList items={store.instagram} setItems={items=>update({instagram:items})} type="instagram"/>}{tab==='Aparência' && <div className="form-grid">{Object.entries(store.settings.colors).map(([k,v])=><Input key={k} label={k} value={v} onChange={val=>updateSettings({colors:{...store.settings.colors,[k]:val}})}/>)}</div>}</section></main>
}
function Input({ label, value, onChange }) { return <label className="field"><span>{label}</span><input value={value ?? ''} onChange={e=>onChange(e.target.value)}/></label> }
function Textarea({ label, value, onChange }) { return <label className="field wide"><span>{label}</span><textarea value={value ?? ''} onChange={e=>onChange(e.target.value)}/></label> }
function AdminList({ items, setItems, type }) {
  const add = () => setItems([...items, type==='product' ? {id:Date.now(),name:'Nova peça',category:'Joias',price:0,salePrice:null,stock:1,featured:false,bestSeller:false,image:'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80',description:'Peça selecionada com acabamento elegante.'} : type==='coupon' ? {code:'NOVO10',type:'percent',value:10,active:true} : {id:Date.now(),caption:'Nova inspiração da loja.',image:'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80',link:'#'}])
  const updateItem = (idx, key, value) => setItems(items.map((it,i)=> i===idx ? {...it,[key]: key==='price'||key==='salePrice'||key==='stock'||key==='value' ? Number(value) : value} : it))
  return <div><button className="btn primary" onClick={add}>Adicionar</button><div className="admin-items">{items.map((it,idx)=><div className="admin-item" key={it.id || it.code || idx}>{Object.keys(it).map(k => <label key={k}><span>{k}</span><input value={it[k] ?? ''} onChange={e=>updateItem(idx,k,e.target.value)}/></label>)}<button onClick={()=>setItems(items.filter((_,i)=>i!==idx))}>Remover</button></div>)}</div></div>
}

function App() {
  const [store, setStore] = useStoreData()
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [favorites, setFavorites] = useState([])
  const isAdmin = location.hash === '#/admin' || location.pathname === '/admin'
  const add = (p) => { setCart(prev => prev.some(i=>i.id===p.id) ? prev.map(i=>i.id===p.id?{...i,quantity:i.quantity+1}:i) : [...prev,{...p,quantity:1}]); setCartOpen(true) }
  const toggleFav = id => setFavorites(f => f.includes(id) ? f.filter(x=>x!==id) : [...f,id])
  if (isAdmin) return <Admin store={store} setStore={setStore} goHome={()=>{history.pushState(null,'','/'); location.reload()}} />
  return <><Header store={store} cartCount={cart.reduce((s,i)=>s+i.quantity,0)} openCart={()=>setCartOpen(true)} goAdmin={()=>{location.hash='/admin'; location.reload()}} />{store.settings.sections.hero && <Hero slides={store.heroSlides}/>} {store.settings.sections.benefits && <Benefits items={store.benefits}/>} {store.settings.sections.collections && <Collections collections={store.collections}/>} {store.settings.sections.products && <Catalog store={store} add={add} favorites={favorites} toggleFav={toggleFav}/>} {store.settings.sections.about && <section id="sobre" className="about"><div><span className="kicker">Nossa história</span><h2>Elegância escolhida com cuidado</h2><p>{store.about}</p></div></section>} {store.settings.sections.instagram && <InstagramSection store={store}/>}<footer id="contato"><div><h2>Seculus</h2><p>{store.settings.slogan}</p></div><nav><a href="#produtos">Produtos</a><a href={store.settings.instagram} target="_blank">Instagram</a><a href={`https://wa.me/${store.settings.whatsapp}`} target="_blank">WhatsApp</a></nav></footer><CartDrawer open={cartOpen} setOpen={setCartOpen} cart={cart} setCart={setCart} store={store}/><CookieBanner/></>
}

createRoot(document.getElementById('root')).render(<App />)
