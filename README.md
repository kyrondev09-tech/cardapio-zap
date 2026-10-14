# cardapio-zap

Cardápio digital para lanchonete. O cliente monta o pedido no site e envia tudo pronto pelo WhatsApp da loja — sem cadastro, sem backend e sem pagamento online.

Feito com SvelteKit, Svelte 5 e TypeScript.

## O que o site faz

- **Cardápio** organizado por categorias, com busca no cabeçalho.
- **Personalização** de itens: tamanhos, sabores, adicionais (com mínimo e máximo por grupo) e observação.
- **Carrinho** que fica salvo no navegador: lateral no desktop, barra e gaveta no celular.
- **Entrega ou retirada**, com taxa de entrega e pedido mínimo para entrega.
- **Checkout em três etapas**: recebimento, dados do cliente e revisão.
- **Envio pelo WhatsApp**: abre a conversa com a loja já com a mensagem do pedido escrita. Também dá para copiar a mensagem.
- **Aberto / fechado** calculado pelo horário de funcionamento. Com a loja fechada o pedido ainda pode ser enviado, com um aviso de que será confirmado quando ela abrir.

## Como rodar

Requer Node.js 22 ou mais recente.

```sh
npm install
npm run dev
```

O site abre em `http://localhost:5173`.

| Comando           | O que faz                               |
| ----------------- | --------------------------------------- |
| `npm run dev`     | Servidor de desenvolvimento             |
| `npm run build`   | Build de produção                       |
| `npm run preview` | Serve o build de produção localmente    |
| `npm run check`   | Checagem de tipos (`svelte-check`)      |
| `npm run lint`    | Verifica formatação (Prettier) e ESLint |
| `npm run format`  | Formata o código com Prettier           |

## Antes de publicar

Três coisas ainda estão com valores de demonstração:

1. **WhatsApp da loja.** Em `src/lib/config/index.ts`, `whatsapp` está como `5500000000000`. Enquanto estiver assim, o site se recusa a enviar pedidos e mostra um erro no checkout. Troque pelo número real, só dígitos, com DDI e DDD (ex.: `5511999990000`).
2. **Instagram.** O link em `instagram` aponta para um perfil de exemplo. Troque ou deixe vazio (`''`) para esconder o ícone.
3. **Fotos dos produtos.** `src/lib/data/products.ts` usa fotos genéricas do Unsplash, que não correspondem aos produtos, e algumas estão fora do ar (nesse caso aparece um quadro neutro). Substitua pelas fotos reais.

## Configuração da loja

Tudo fica em `src/lib/config/index.ts`:

| Campo              | Para que serve                                               |
| ------------------ | ------------------------------------------------------------ |
| `companyName`      | Nome exibido no cabeçalho, no rodapé e na mensagem do pedido |
| `description`      | Texto do card principal e descrição da página                |
| `whatsapp`         | Número que recebe os pedidos                                 |
| `address`          | Endereço exibido no topo, no rodapé e na opção de retirada   |
| `instagram`        | Link do perfil                                               |
| `deliveryFee`      | Taxa de entrega                                              |
| `minDeliveryValue` | Pedido mínimo para entrega                                   |
| `prepTime`         | Tempo de preparo, em minutos                                 |
| `openingHours`     | Horário de cada dia da semana (`0` = domingo)                |
| `timezone`         | Fuso usado para calcular se a loja está aberta               |
| `paymentMethods`   | Formas de pagamento oferecidas no checkout                   |
| `maxItemQty`       | Quantidade máxima de um mesmo item no carrinho               |

Dois detalhes:

- **Valores em centavos.** `deliveryFee: 500` é R$ 5,00.
- **Dia fechado.** Use o mesmo horário em `open` e `close` (ex.: `{ open: '00:00', close: '00:00' }`).

As categorias, na ordem em que aparecem, ficam na lista `categories` do mesmo arquivo.

## Cardápio

Os produtos ficam em `src/lib/data/products.ts`. Exemplo:

```ts
{
	id: '14',
	categoryId: 'Sobremesas', // precisa ser igual a um nome em `categories`
	name: 'Milkshake',
	description: 'Cremoso, feito com sorvete de verdade.',
	imageUrl: imgMilkshake,
	basePrice: 1600, // centavos
	available: true, // false mostra o item como "Esgotado"
	optionGroups: [
		{
			id: 'm1',
			name: 'Tamanho (Obrigatório)',
			min: 1, // quantas opções o cliente precisa escolher
			max: 1, // quantas pode escolher
			options: [
				{ id: 't300', name: '300ml', priceAddition: 0 },
				{ id: 't500', name: '500ml', priceAddition: 400 }
			]
		}
	]
}
```

Produtos sem `optionGroups` vão direto para o carrinho; os que têm abrem a tela de personalização. Cada `id` (de produto, grupo e opção) precisa ser único.

## Aparência

- **Cores e tipografia**: variáveis CSS no início de `src/routes/layout.css`. A cor de marca inteira sai das variáveis `--accent*`.
- **Foto do card principal**: `src/lib/assets/hero-cheeseburger.jpg`.
- **Fonte dos títulos**: Oswald, carregada do Google Fonts em `src/app.html`.

## Estrutura

```
src/
├── app.html                 Documento base (idioma, fonte)
├── routes/
│   ├── +page.svelte         Página única: estado do carrinho e fluxo do pedido
│   └── layout.css           Tema, botões, campos, modais e animações
└── lib/
    ├── config/              Dados da loja e categorias
    ├── data/products.ts     Cardápio
    ├── components/          Header, Hero, Catalog, ProductCard, ProductModal,
    │                        Cart, Checkout, Toast, Footer
    ├── actions/             Foco/Esc dos modais e aparição das seções
    ├── utils/               Preços, validação, horário, armazenamento, WhatsApp
    └── types/               Tipos TypeScript
```

O carrinho é guardado no `localStorage` do navegador do cliente. Nenhum dado do pedido passa por servidor: ele só sai do aparelho quando o cliente envia a mensagem no WhatsApp.

## Publicação

O projeto usa `@sveltejs/adapter-auto`, que detecta sozinho plataformas como Vercel, Netlify e Cloudflare Pages. Para outros ambientes (servidor Node, site estático), troque o adapter em `vite.config.ts` — veja a [documentação de adapters](https://svelte.dev/docs/kit/adapters).
