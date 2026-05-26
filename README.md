# Relojoaria Seculus - Hyper Premium

Projeto React + Vite em JSX, com visual premium inspirado em joalherias de alto padrão, sem copiar marcas, imagens ou layout proprietário.

## Rodar localmente

```bash
npm config set registry https://registry.npmjs.org/
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Admin

Acesse `/admin` ou clique discretamente em Admin no cabeçalho.

Senha inicial:

```txt
admin123
```

## Recursos incluídos

- Hero carrossel
- Catálogo com busca, filtros e ordenação
- Favoritos
- Carrinho lateral
- Cupons em React
- Checkout visual
- Finalização pelo WhatsApp
- Cookies com preferências
- Instagram manual editável
- Painel admin com edição de conteúdo
- Exportação/importação JSON
- Serviço separado para futura integração com Stripe ou Mercado Pago

## Pagamentos futuros

A lógica base está em `src/services/checkoutService.js`. A função `createPaymentSession` pode ser conectada futuramente a um back-end seguro com Stripe, Mercado Pago ou outro gateway.
