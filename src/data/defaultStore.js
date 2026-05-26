export const defaultStore = {
  settings: {
    storeName: 'Relojoaria Seculus',
    topbar: 'Atendimento personalizado para joias, relógios e presentes especiais',
    slogan: 'Joias e relógios para momentos que merecem presença.',
    whatsapp: '5599999999999',
    instagram: 'https://www.instagram.com/relojoariaseculus/',
    colors: { red: '#8f1118', deepRed: '#5d080d', gold: '#b8924f', black: '#151111', cream: '#fbf8f2' },
    sections: { hero: true, benefits: true, collections: true, products: true, instagram: true, about: true }
  },
  heroSlides: [
    { id: 1, kicker: 'Nova coleção', title: 'Relógios e joias com presença impecável', text: 'Uma seleção refinada para transformar ocasiões em lembranças permanentes.', cta: 'Conhecer coleção', image: 'linear-gradient(120deg, rgba(93,8,13,.95), rgba(143,17,24,.72)), url(https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=1600&q=80)' },
    { id: 2, kicker: 'Presentes especiais', title: 'Escolhas elegantes para surpreender com significado', text: 'Relógios, alianças, colares e pulseiras em uma experiência de compra premium.', cta: 'Ver presentes', image: 'linear-gradient(120deg, rgba(21,17,17,.9), rgba(143,17,24,.55)), url(https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1600&q=80)' },
    { id: 3, kicker: 'Atendimento exclusivo', title: 'Curadoria, confiança e acabamento de alto padrão', text: 'Fale com uma especialista e encontre a peça ideal para cada momento.', cta: 'Falar no WhatsApp', image: 'linear-gradient(120deg, rgba(93,8,13,.88), rgba(184,146,79,.28)), url(https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=1600&q=80)' }
  ],
  benefits: [
    { title: 'Garantia e procedência', text: 'Peças selecionadas com cuidado e orientação personalizada.' },
    { title: 'Envio seguro', text: 'Embalagem refinada e preparo cuidadoso para cada pedido.' },
    { title: 'Atendimento premium', text: 'Compra assistida pelo WhatsApp com suporte antes e depois.' },
    { title: 'Seleção especial', text: 'Relógios, joias e presentes com curadoria para ocasiões marcantes.' }
  ],
  collections: [
    { name: 'Relógios femininos', image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=900&q=80' },
    { name: 'Relógios masculinos', image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=900&q=80' },
    { name: 'Joias', image: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=900&q=80' },
    { name: 'Alianças', image: 'https://images.unsplash.com/photo-1589674781759-c21c37956a44?auto=format&fit=crop&w=900&q=80' }
  ],
  products: [
    { id: 101, name: 'Relógio Feminino Dourado Lumière', category: 'Relógios femininos', price: 649, salePrice: 579, stock: 8, featured: true, bestSeller: true, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80', description: 'Acabamento dourado e presença delicada para composições elegantes.' },
    { id: 102, name: 'Relógio Masculino Classic Noir', category: 'Relógios masculinos', price: 799, salePrice: 699, stock: 5, featured: true, bestSeller: true, image: 'https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?auto=format&fit=crop&w=900&q=80', description: 'Design marcante com leitura sofisticada e pulseira de acabamento premium.' },
    { id: 103, name: 'Colar Ponto de Luz Cristal', category: 'Colares', price: 289, salePrice: null, stock: 14, featured: true, bestSeller: false, image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=900&q=80', description: 'Brilho discreto para usar todos os dias ou presentear com elegância.' },
    { id: 104, name: 'Pulseira Riviera Prata', category: 'Pulseiras', price: 349, salePrice: 319, stock: 3, featured: true, bestSeller: false, image: 'https://images.unsplash.com/photo-1620656798579-1984d9e87df9?auto=format&fit=crop&w=900&q=80', description: 'Peça refinada com brilho contínuo e acabamento clássico.' },
    { id: 105, name: 'Aliança Slim Gold', category: 'Alianças', price: 1190, salePrice: null, stock: 2, featured: false, bestSeller: true, image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80', description: 'Traço minimalista, elegante e simbólico para momentos eternos.' },
    { id: 106, name: 'Kit Presente Imperial', category: 'Presentes', price: 899, salePrice: 819, stock: 6, featured: true, bestSeller: false, image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=900&q=80', description: 'Combinação sofisticada para ocasiões que pedem presença.' },
    { id: 107, name: 'Brinco Clássico Pérola', category: 'Brincos', price: 249, salePrice: null, stock: 11, featured: false, bestSeller: false, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80', description: 'Um clássico delicado para iluminar o visual com sutileza.' },
    { id: 108, name: 'Relógio Feminino Rose Étoile', category: 'Relógios femininos', price: 729, salePrice: 659, stock: 7, featured: true, bestSeller: false, image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=900&q=80', description: 'Tom rosé elegante com design versátil para looks sofisticados.' }
  ],
  coupons: [
    { code: 'SECULUS10', type: 'percent', value: 10, active: true },
    { code: 'PRIMEIRA15', type: 'percent', value: 15, active: true },
    { code: 'FRETEGRATIS', type: 'shipping', value: 0, active: true }
  ],
  instagram: [
    { id: 1, caption: 'Novidades que valorizam cada detalhe.', image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=900&q=80', link: 'https://www.instagram.com/relojoariaseculus/' },
    { id: 2, caption: 'Relógios para marcar grandes momentos.', image: 'https://images.unsplash.com/photo-1594576722512-582bcd46fba3?auto=format&fit=crop&w=900&q=80', link: 'https://www.instagram.com/relojoariaseculus/' },
    { id: 3, caption: 'Presentes com beleza e significado.', image: 'https://images.unsplash.com/photo-1512163143273-bde0e3cc7407?auto=format&fit=crop&w=900&q=80', link: 'https://www.instagram.com/relojoariaseculus/' },
    { id: 4, caption: 'Joias que acompanham histórias.', image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=900&q=80', link: 'https://www.instagram.com/relojoariaseculus/' }
  ],
  about: 'A Relojoaria Seculus reúne relógios, joias e presentes escolhidos com cuidado para quem valoriza beleza, confiança e atendimento próximo. Cada peça é apresentada com atenção aos detalhes para tornar a compra simples, elegante e segura.'
}
