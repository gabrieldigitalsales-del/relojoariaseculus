import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Heart, Search, ShoppingBag, Menu, X, Minus, Plus, Trash2, Camera, MessageCircle, ShieldCheck, Truck, Gem, Crown, Upload, Download, RotateCcw, Lock, Cookie, SlidersHorizontal, ImagePlus, ChevronDown, ChevronUp, Save, Sparkles } from 'lucide-react'
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
    <button className="image-btn" onClick={() => details(p)}><img src={ensureImages(p)[0]} alt={p.name}/></button>
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
  return <div className="modal-backdrop" onClick={close}><div className="product-modal" onClick={e=>e.stopPropagation()}><button className="close" onClick={close}><X/></button><div className="modal-gallery"><img src={ensureImages(product)[0]}/><div>{ensureImages(product).slice(0,4).map((img,i)=><img src={img} key={i} />)}</div></div><div><span className="kicker">{product.category}</span><h2>{product.name}</h2><p>{product.description}</p>{hasValue(product.ringSizes) && <p className="stock">Aros disponíveis: {formatList(product.ringSizes)}</p>}{hasValue(product.material) && <p className="stock">Material: {formatList(product.material)}</p>}<strong className="modal-price">{currency(product.salePrice || product.price)}</strong><p className="stock">Estoque disponível: {product.stock}</p><button className="btn primary" onClick={()=>add(product)}>Adicionar ao carrinho</button><a className="btn outline" href={url} target="_blank">Comprar pelo WhatsApp</a></div></div></div>
}

function CartDrawer({ open, setOpen, cart, setCart, store }) {
  const [couponCode, setCouponCode] = useState('')
  const [coupon, setCoupon] = useState(null)
  const [couponMessage, setCouponMessage] = useState('')
  const [customer, setCustomer] = useState({ name:'', phone:'', cep:'', address:'', payment:'Pix', notes:'' })
  const totals = calculateCart(cart, coupon)

  useEffect(() => {
    document.body.classList.toggle('cart-locked', open)
    return () => document.body.classList.remove('cart-locked')
  }, [open])

  const changeQty = (id, delta) => setCart(cart.map(i => i.id === id ? {...i, quantity: Math.max(1, i.quantity + delta)} : i))
  const remove = (id) => setCart(cart.filter(i => i.id !== id))
  const applyCoupon = () => {
    const found = store.coupons.find(c => c.active && c.code.toLowerCase() === couponCode.trim().toLowerCase())
    setCoupon(found || null)
    setCouponMessage(found ? `Cupom ${found.code} aplicado.` : 'Cupom não encontrado ou indisponível.')
  }
  const finish = () => {
    if (!cart.length) {
      setCouponMessage('Adicione uma peça à sacola antes de finalizar.')
      return
    }
    window.open(buildWhatsAppOrder({ cart, coupon, customer, totals, store }), '_blank')
  }

  return <>
    <div className={`cart-backdrop ${open ? 'show' : ''}`} onClick={() => setOpen(false)} />
    <aside className={`cart ${open ? 'open' : ''}`} aria-hidden={!open}>
      <div className="cart-head">
        <div>
          <span>Sacola de compras</span>
          <h2>{cart.length ? `${cart.reduce((s,i)=>s+i.quantity,0)} item(ns)` : 'Sua sacola'}</h2>
        </div>
        <button onClick={()=>setOpen(false)} aria-label="Fechar sacola"><X/></button>
      </div>

      <div className="cart-scroll">
        <div className="cart-items">
          {cart.length === 0 && <p className="empty">Sua seleção aparecerá aqui. Escolha uma peça da vitrine para iniciar o pedido.</p>}
          {cart.map(item => <div className="cart-line" key={item.id}>
            <img src={ensureImages(item)[0]} alt={item.name}/>
            <div>
              <h4>{item.name}</h4>
              <span>{currency(item.salePrice || item.price)}</span>
              <div className="qty">
                <button onClick={()=>changeQty(item.id,-1)} aria-label="Diminuir quantidade"><Minus size={14}/></button>
                <b>{item.quantity}</b>
                <button onClick={()=>changeQty(item.id,1)} aria-label="Aumentar quantidade"><Plus size={14}/></button>
                <button onClick={()=>remove(item.id)} aria-label="Remover produto"><Trash2 size={14}/></button>
              </div>
            </div>
          </div>)}
        </div>

        <div className="coupon">
          <input value={couponCode} onChange={e=>setCouponCode(e.target.value.toUpperCase())} placeholder="Cupom de desconto" />
          <button onClick={applyCoupon}>Aplicar</button>
          {couponMessage && <small className={coupon ? 'success' : 'warning'}>{couponMessage}</small>}
        </div>

        <div className="checkout-fields">
          <input placeholder="Nome" value={customer.name} onChange={e=>setCustomer({...customer,name:e.target.value})}/>
          <input placeholder="Telefone" value={customer.phone} onChange={e=>setCustomer({...customer,phone:e.target.value})}/>
          <div className="field-row">
            <input placeholder="CEP" value={customer.cep} onChange={e=>setCustomer({...customer,cep:e.target.value})}/>
            <select value={customer.payment} onChange={e=>setCustomer({...customer,payment:e.target.value})}>{['Pix','Cartão','Boleto','Pagamento na loja'].map(p=><option key={p}>{p}</option>)}</select>
          </div>
          <input placeholder="Endereço" value={customer.address} onChange={e=>setCustomer({...customer,address:e.target.value})}/>
          <textarea placeholder="Observações" value={customer.notes} onChange={e=>setCustomer({...customer,notes:e.target.value})}/>
        </div>
      </div>

      <div className="totals">
        <p><span>Subtotal</span><b>{currency(totals.subtotal)}</b></p>
        <p><span>Desconto</span><b>- {currency(totals.discount)}</b></p>
        <p><span>Frete</span><b>{totals.shipping === 0 ? 'Grátis' : currency(totals.shipping)}</b></p>
        <p className="grand"><span>Total</span><b>{currency(totals.total)}</b></p>
        <button className="btn primary full" onClick={finish}>Finalizar pelo WhatsApp</button>
        <small>Estrutura preparada para futura conexão com Stripe ou Mercado Pago.</small>
      </div>
    </aside>
  </>
}

function InstagramSection({ store }) { return <section id="instagram" className="section instagram-section"><SectionTitle label="Instagram" title="Acompanhe nossas escolhas" text="Lançamentos, combinações e inspirações selecionadas para o seu momento." /><div className="insta-grid">{store.instagram.map(post => <a href={post.link} target="_blank" className="insta-card" key={post.id}><img src={ensureImages(post)[0]}/><div><Camera size={18}/><p>{post.caption}</p></div></a>)}</div><a className="btn outline center" href={store.settings.instagram} target="_blank">Ver Instagram</a></section> }

function CookieBanner() {
  const [show, setShow] = useState(() => localStorage.getItem(COOKIE_KEY) !== 'accepted')
  const [prefs, setPrefs] = useState(false)
  if (!show) return null
  const accept = () => { localStorage.setItem(COOKIE_KEY, 'accepted'); setShow(false) }
  return <div className="cookie-box"><Cookie/><div><h3>Privacidade e cookies</h3><p>Usamos cookies para melhorar sua experiência, manter preferências e entender a navegação da loja.</p>{prefs && <div className="cookie-prefs"><label><input type="checkbox" checked readOnly/> Necessários</label><label><input type="checkbox"/> Preferências</label><label><input type="checkbox"/> Métricas</label></div>}</div><div className="cookie-actions"><button onClick={()=>setPrefs(!prefs)}>Preferências</button><button onClick={accept}>Aceitar</button></div></div>
}


const normalizeText = (value = '') => value.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
const PRODUCT_TYPES = ['Anel', 'Aliança', 'Relógio', 'Colar', 'Pulseira', 'Brinco', 'Pingente', 'Kit Presente', 'Acessório']
const RING_SIZES = ['08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35']
const JEWELRY_MATERIALS = [
  'Ouro amarelo 18k', 'Ouro branco 18k', 'Ouro rosé 18k', 'Ouro 10k', 'Prata 925', 'Prata 950',
  'Platina', 'Aço inoxidável', 'Titânio', 'Tungstênio', 'Ródio branco', 'Ródio negro',
  'Folheado a ouro', 'Banho de ouro', 'Banho de ródio', 'Semijoia', 'Zircônia', 'Cristal',
  'Pérola', 'Diamante', 'Couro', 'Silicone premium'
]
const CATEGORY_OPTIONS = ['Anéis', 'Alianças', 'Relógios Femininos', 'Relógios Masculinos', 'Colares', 'Pulseiras', 'Brincos', 'Kits Presenteáveis', 'Acessórios', 'Joias']
const normalizeArray = (value) => Array.isArray(value) ? value : String(value || '').split(',').map(v => v.trim()).filter(Boolean)
const formatList = (value) => normalizeArray(value).join(', ')
const hasValue = (value) => normalizeArray(value).length > 0
const detectProductType = (product = {}) => {
  const haystack = normalizeText(`${product.productType || ''} ${product.name || ''} ${product.category || ''}`)
  if (haystack.includes('alianca')) return 'Aliança'
  if (haystack.includes('anel')) return 'Anel'
  if (haystack.includes('relogio')) return 'Relógio'
  if (haystack.includes('colar')) return 'Colar'
  if (haystack.includes('pulseira')) return 'Pulseira'
  if (haystack.includes('brinco')) return 'Brinco'
  if (haystack.includes('pingente')) return 'Pingente'
  if (haystack.includes('kit') || haystack.includes('presente')) return 'Kit Presente'
  return product.productType || 'Joia'
}
const productNeedsRingSize = (product = {}) => ['Anel','Aliança'].includes(detectProductType(product))
const productNeedsWatchInfo = (product = {}) => detectProductType(product) === 'Relógio'
const productNeedsJewelryMaterial = (product = {}) => ['Anel','Aliança','Colar','Pulseira','Brinco','Pingente','Joia','Kit Presente'].includes(detectProductType(product))
const toBoolean = (value) => value === true || value === 'true' || value === 'on'
const ensureImages = (item) => Array.isArray(item.images) && item.images.length ? item.images : [item.image].filter(Boolean)


function SmartSelect({ label, value, onChange, options }) {
  return <label className="field"><span>{label}</span><select value={value || ''} onChange={e=>onChange(e.target.value)}><option value="">Selecionar</option>{options.map(option => <option key={option} value={option}>{option}</option>)}</select></label>
}

function CheckboxBoxGroup({ label, values = [], options = [], onChange, columns = false }) {
  const selected = normalizeArray(values)
  const toggle = (option) => {
    const exists = selected.includes(option)
    const next = exists ? selected.filter(item => item !== option) : [...selected, option]
    onChange(next)
  }
  return <div className={`choice-box field wide ${columns ? 'columns' : ''}`}>
    <div className="choice-header"><span>{label}</span><small>{selected.length ? `${selected.length} selecionado(s)` : 'Selecione uma ou mais opções'}</small></div>
    <div className="choice-grid">{options.map(option => <button type="button" key={option} className={selected.includes(option) ? 'selected' : ''} onClick={()=>toggle(option)}>{option}</button>)}</div>
  </div>
}

function MaterialSelector({ value, onChange }) {
  const [custom, setCustom] = useState('')
  const selected = normalizeArray(value)
  const addCustom = () => {
    const clean = custom.trim()
    if (!clean) return
    onChange([...new Set([...selected, clean])])
    setCustom('')
  }
  return <div className="material-smart field wide">
    <CheckboxBoxGroup label="Material usado" values={selected} options={JEWELRY_MATERIALS} onChange={onChange} columns />
    <div className="custom-add"><input value={custom} onChange={e=>setCustom(e.target.value)} placeholder="Adicionar outro material, pedra ou acabamento" /><button type="button" onClick={addCustom}>Adicionar</button></div>
  </div>
}

function SmartProductAssistant({ current, changeCurrent }) {
  const detected = detectProductType(current)
  const applyType = (type) => {
    const categoryMap = { 'Anel':'Anéis', 'Aliança':'Alianças', 'Relógio':'Relógios Femininos', 'Colar':'Colares', 'Pulseira':'Pulseiras', 'Brinco':'Brincos', 'Kit Presente':'Kits Presenteáveis', 'Acessório':'Acessórios' }
    changeCurrent({ productType: type, category: categoryMap[type] || current.category })
  }
  return <div className="smart-assistant">
    <div><Sparkles size={18}/><strong>Assistente inteligente de cadastro</strong><p>Identifique o tipo da peça para abrir campos específicos, como aro, material, composição e medidas.</p></div>
    <div className="type-pills">{PRODUCT_TYPES.map(type => <button type="button" key={type} className={(current.productType || detected) === type ? 'active' : ''} onClick={()=>applyType(type)}>{type}</button>)}</div>
    <small>Tipo detectado: <b>{detected}</b></small>
  </div>
}

function ImageManager({ label = 'Imagens', images = [], onChange }) {
  const list = Array.isArray(images) ? images : []
  const [url, setUrl] = useState('')
  const addUrl = () => {
    const clean = url.trim()
    if (!clean) return
    onChange([...list, clean])
    setUrl('')
  }
  const upload = (files) => {
    Array.from(files || []).forEach(file => {
      if (!file.type.startsWith('image/')) return
      const reader = new FileReader()
      reader.onload = () => onChange([...(Array.isArray(images) ? images : []), reader.result])
      reader.readAsDataURL(file)
    })
  }
  const setMain = (index) => {
    const next = [...list]
    const [chosen] = next.splice(index, 1)
    onChange([chosen, ...next])
  }
  return <div className="image-manager">
    <div className="mini-title"><ImagePlus size={16}/><span>{label}</span></div>
    <div className="image-tools">
      <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="Colar URL da imagem" />
      <button type="button" onClick={addUrl}>Adicionar URL</button>
      <label className="upload-mini">Upload<input type="file" accept="image/*" multiple onChange={e=>upload(e.target.files)}/></label>
    </div>
    <div className="image-strip">
      {list.map((src, index) => <div className="image-chip" key={`${src}-${index}`}>
        <img src={src} alt="Imagem cadastrada" />
        <div>
          <button type="button" onClick={()=>setMain(index)}>{index === 0 ? 'Principal' : 'Tornar principal'}</button>
          <button type="button" onClick={()=>onChange(list.filter((_,i)=>i!==index))}>Remover</button>
        </div>
      </div>)}
      {!list.length && <p className="empty-inline">Nenhuma imagem cadastrada.</p>}
    </div>
  </div>
}

function AdminProducts({ items, setItems }) {
  const blank = () => ({ id: Date.now(), productType: '', name: '', category: 'Joias', price: 0, salePrice: '', stock: 1, featured: false, bestSeller: false, image: '', images: [], description: '', ringSizes: [], material: [], warranty: 'Garantia de fábrica', measurements: '', sku: '' })
  const [draft, setDraft] = useState(blank())
  const [editingId, setEditingId] = useState(null)
  const [query, setQuery] = useState('')
  const [openRows, setOpenRows] = useState({})
  const editing = editingId !== null
  const current = editing ? items.find(p => p.id === editingId) || draft : draft
  const changeCurrent = (patch) => {
    const next = { ...current, ...patch }
    if (patch.images) next.image = patch.images[0] || ''
    if (editing) setItems(items.map(p => p.id === editingId ? next : p))
    else setDraft(next)
  }
  const saveDraft = () => {
    const cleanImages = ensureImages(draft)
    const product = { ...draft, productType: draft.productType || detectProductType(draft), id: Date.now(), image: cleanImages[0] || draft.image || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80', images: cleanImages.length ? cleanImages : ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80'], price: Number(draft.price || 0), salePrice: draft.salePrice === '' ? null : Number(draft.salePrice || 0), stock: Number(draft.stock || 0), featured: toBoolean(draft.featured), bestSeller: toBoolean(draft.bestSeller) }
    setItems([product, ...items])
    setDraft(blank())
  }
  const startEdit = (item) => {
    setEditingId(item.id)
    setOpenRows({ ...openRows, [item.id]: true })
  }
  const remove = (id) => setItems(items.filter(p => p.id !== id))
  const filtered = items.filter(p => `${p.name} ${p.category}`.toLowerCase().includes(query.toLowerCase()))
  return <div className="smart-admin">
    <div className="admin-builder">
      <div className="builder-head"><div><span>Cadastro inteligente</span><h2>{editing ? 'Editar peça selecionada' : 'Adicionar nova peça'}</h2></div>{editing && <button className="btn outline" onClick={()=>setEditingId(null)}>Novo cadastro</button>}</div>
      <SmartProductAssistant current={current} changeCurrent={changeCurrent}/>
      <div className="form-grid admin-form-premium">
        <Input label="Nome do produto" value={current.name} onChange={v=>changeCurrent({name:v})}/>
        <SmartSelect label="Tipo da peça" value={current.productType || detectProductType(current)} onChange={v=>changeCurrent({productType:v})} options={PRODUCT_TYPES}/>
        <SmartSelect label="Categoria da loja" value={current.category} onChange={v=>changeCurrent({category:v})} options={CATEGORY_OPTIONS}/>
        <Input label="Código/SKU" value={current.sku || ''} onChange={v=>changeCurrent({sku:v})}/>
        <Input label="Preço" value={current.price} onChange={v=>changeCurrent({price:v})}/>
        <Input label="Preço promocional" value={current.salePrice ?? ''} onChange={v=>changeCurrent({salePrice:v})}/>
        <Input label="Estoque" value={current.stock} onChange={v=>changeCurrent({stock:v})}/>
        {productNeedsWatchInfo(current) && <Input label="Pulseira / caixa" value={current.measurements || ''} onChange={v=>changeCurrent({measurements:v})}/>} 
        <label className="field toggle-field"><span>Destaque</span><input type="checkbox" checked={toBoolean(current.featured)} onChange={e=>changeCurrent({featured:e.target.checked})}/></label>
        <label className="field toggle-field"><span>Mais vendido</span><input type="checkbox" checked={toBoolean(current.bestSeller)} onChange={e=>changeCurrent({bestSeller:e.target.checked})}/></label>
        <Textarea label="Descrição comercial" value={current.description} onChange={v=>changeCurrent({description:v})}/>
      </div>
      {productNeedsRingSize(current) && <CheckboxBoxGroup label="Aros disponíveis" values={current.ringSizes} options={RING_SIZES} onChange={values=>changeCurrent({ringSizes:values})}/>} 
      {productNeedsJewelryMaterial(current) && <MaterialSelector value={current.material} onChange={values=>changeCurrent({material:values})}/>} 
      <ImageManager images={ensureImages(current)} onChange={imgs=>changeCurrent({images:imgs})}/>
      <div className="smart-hint"><Sparkles size={16}/><p>O cadastro se adapta ao produto: ao identificar anel ou aliança, abre seleção de aros em caixas; em joias, mostra materiais e acabamentos; em relógios, libera informações de pulseira e caixa.</p></div>
      {!editing && <button className="btn primary" onClick={saveDraft}><Save size={16}/> Salvar produto</button>}
    </div>
    <div className="admin-list-toolbar"><h2>Produtos cadastrados</h2><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar produto cadastrado"/></div>
    <div className="compact-list">
      {filtered.map(item => {
        const expanded = !!openRows[item.id]
        return <div className={`compact-row ${expanded ? 'expanded' : ''}`} key={item.id}>
          <div className="row-summary">
            <img src={(ensureImages(item)[0])} alt={item.name}/>
            <div><strong>{item.name || 'Produto sem nome'}</strong><span>{item.category} • {detectProductType(item)} • {currency(item.salePrice || item.price)} • Estoque {item.stock}</span></div>
            <button onClick={()=>setOpenRows({...openRows,[item.id]:!expanded})}>{expanded ? <ChevronUp/> : <ChevronDown/>}</button>
            <button onClick={()=>startEdit(item)}>Alterar</button>
            <button className="danger" onClick={()=>remove(item.id)}>Remover</button>
          </div>
          {expanded && <div className="row-details"><p>{item.description}</p>{hasValue(item.ringSizes) && <small>Aros: {formatList(item.ringSizes)}</small>}{hasValue(item.material) && <small>Material: {formatList(item.material)}</small>}<div className="thumbs">{ensureImages(item).map((img,i)=><img src={img} key={i} alt="miniatura" />)}</div></div>}
        </div>
      })}
    </div>
  </div>
}

function AdminCoupons({ items, setItems }) {
  const add = () => setItems([{ code:'NOVO10', type:'percent', value:10, active:true }, ...items])
  const update = (idx, patch) => setItems(items.map((it,i)=>i===idx?{...it,...patch}:it))
  return <div><button className="btn primary" onClick={add}>Adicionar cupom</button><div className="compact-list spaced">{items.map((c,idx)=><div className="coupon-row" key={c.code + idx}><input value={c.code} onChange={e=>update(idx,{code:e.target.value.toUpperCase()})}/><select value={c.type} onChange={e=>update(idx,{type:e.target.value})}><option value="percent">Porcentagem</option><option value="fixed">Valor fixo</option><option value="shipping">Frete grátis</option></select><input value={c.value} onChange={e=>update(idx,{value:Number(e.target.value)})}/><label><input type="checkbox" checked={toBoolean(c.active)} onChange={e=>update(idx,{active:e.target.checked})}/> Ativo</label><button className="danger" onClick={()=>setItems(items.filter((_,i)=>i!==idx))}>Remover</button></div>)}</div></div>
}

function AdminInstagram({ items, setItems }) {
  const blank = { id: Date.now(), caption:'', image:'', images:[], link:'https://www.instagram.com/relojoariaseculus/' }
  const add = () => setItems([blank, ...items])
  const update = (idx, patch) => setItems(items.map((it,i)=>i===idx?{...it,...patch, image: patch.images ? patch.images[0] || it.image : (patch.image ?? it.image)}:it))
  return <div><button className="btn primary" onClick={add}>Adicionar post</button><div className="compact-list spaced">{items.map((post,idx)=><div className="instagram-admin-row" key={post.id || idx}><img src={post.image || (post.images && post.images[0])} alt="Instagram"/><div><Input label="Legenda" value={post.caption} onChange={v=>update(idx,{caption:v})}/><Input label="Link" value={post.link} onChange={v=>update(idx,{link:v})}/><ImageManager label="Imagem do post" images={ensureImages(post)} onChange={imgs=>update(idx,{images:imgs})}/></div><button className="danger" onClick={()=>setItems(items.filter((_,i)=>i!==idx))}>Remover</button></div>)}</div></div>
}

function Admin({ store, setStore, goHome }) {
  const [auth, setAuth] = useState(sessionStorage.getItem('adminAuth') === 'ok')
  const [pass, setPass] = useState('')
  const [tab, setTab] = useState('Conteúdo')
  const update = (patch) => setStore({ ...store, ...patch })
  const updateSettings = (patch) => setStore({ ...store, settings: { ...store.settings, ...patch } })
  const updateSection = (key, value) => updateSettings({ sections: { ...store.settings.sections, [key]: value } })
  const login = () => { if (pass === 'admin123') { sessionStorage.setItem('adminAuth','ok'); setAuth(true) } }
  const exportJson = () => { const blob = new Blob([JSON.stringify(store,null,2)], {type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='seculus-conteudo.json'; a.click() }
  const importJson = (file) => { const r = new FileReader(); r.onload = () => setStore(JSON.parse(r.result)); r.readAsText(file) }
  if (!auth) return <main className="admin-login"><div><Lock/><h1>Acesso administrativo</h1><p>Área reservada para gestão da loja.</p><input type="password" placeholder="Senha" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==='Enter'&&login()}/><button className="btn primary full" onClick={login}>Entrar</button><button onClick={goHome} className="admin-back">Voltar para loja</button></div></main>
  const tabs = ['Conteúdo','Produtos','Cupons','Instagram','Aparência']
  return <main className="admin smart-shell"><aside><h2>Seculus Admin</h2>{tabs.map(t => <button className={tab===t?'active':''} onClick={()=>setTab(t)} key={t}>{t}</button>)}<button onClick={exportJson}><Download size={16}/> Exportar JSON</button><label className="import"><Upload size={16}/> Importar JSON<input type="file" accept="application/json" onChange={e=>importJson(e.target.files[0])}/></label><button onClick={()=>setStore(defaultStore)}><RotateCcw size={16}/> Restaurar</button><button onClick={goHome}>Ver loja</button></aside><section className="admin-panel"><div className="admin-title"><div><span>Gestão da loja</span><h1>{tab}</h1></div><p>Conteúdo salvo automaticamente neste navegador.</p></div>{tab==='Conteúdo' && <div className="form-grid"><Input label="Nome da loja" value={store.settings.storeName} onChange={v=>updateSettings({storeName:v})}/><Input label="Aviso superior" value={store.settings.topbar} onChange={v=>updateSettings({topbar:v})}/><Input label="Slogan" value={store.settings.slogan} onChange={v=>updateSettings({slogan:v})}/><Input label="WhatsApp" value={store.settings.whatsapp} onChange={v=>updateSettings({whatsapp:v})}/><Input label="Instagram" value={store.settings.instagram} onChange={v=>updateSettings({instagram:v})}/><Textarea label="Sobre" value={store.about} onChange={v=>update({about:v})}/><div className="section-switches field wide"><span>Seções ativas</span>{Object.entries(store.settings.sections).map(([key,value])=><label key={key}><input type="checkbox" checked={value} onChange={e=>updateSection(key,e.target.checked)}/> {key}</label>)}</div></div>}{tab==='Produtos' && <AdminProducts items={store.products} setItems={items=>update({products:items})}/>} {tab==='Cupons' && <AdminCoupons items={store.coupons} setItems={items=>update({coupons:items})}/>} {tab==='Instagram' && <AdminInstagram items={store.instagram} setItems={items=>update({instagram:items})}/>} {tab==='Aparência' && <div className="form-grid">{Object.entries(store.settings.colors).map(([k,v])=><Input key={k} label={k} value={v} onChange={val=>updateSettings({colors:{...store.settings.colors,[k]:val}})}/>)}</div>}</section></main>
}
function Input({ label, value, onChange }) { return <label className="field"><span>{label}</span><input value={value ?? ''} onChange={e=>onChange(e.target.value)}/></label> }
function Textarea({ label, value, onChange }) { return <label className="field wide"><span>{label}</span><textarea value={value ?? ''} onChange={e=>onChange(e.target.value)}/></label> }


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
