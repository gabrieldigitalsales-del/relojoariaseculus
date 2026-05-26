# Relojoaria Seculus - Hyper Premium Admin Smart

Projeto React + Vite em JSX para loja premium de relojoaria/joalheria.

## Rodar localmente

```bash
npm config set registry https://registry.npmjs.org/
npm install
npm run dev
```

## Painel Admin

Acesse `/admin` ou `#/admin`.

Senha inicial:

```txt
admin123
```

## Novidades desta versão

- Cadastro de produto mais inteligente.
- Tipo de peça com detecção automática por nome/categoria.
- Ao escolher ou digitar anel/aliança, aparece seleção de aros em caixas.
- Aros disponíveis de 08 a 35.
- Materiais e acabamentos de joalheria em caixas selecionáveis.
- Possibilidade de adicionar material/acabamento personalizado.
- Imagens por URL ou upload, com múltiplas imagens por produto.
- Produtos cadastrados ficam em linhas compactas com miniatura.
- Linha pode ser expandida para ver detalhes, aros, materiais e imagens.
- Layout público premium mantido.

## Pagamentos

O checkout finaliza pelo WhatsApp. A estrutura em `src/services/checkoutService.js` está preparada para futura integração com Stripe ou Mercado Pago.
