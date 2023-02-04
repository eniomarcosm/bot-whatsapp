const {
  createBot,
  createProvider,
  createFlow,
  addKeyword,
} = require("@bot-whatsapp/bot");

const QRPortalWeb = require("@bot-whatsapp/portal");
const WebWhatsappProvider = require("@bot-whatsapp/provider/web-whatsapp");
const MockAdapter = require("@bot-whatsapp/database/mock");

const flowPromocao = addKeyword(["1", "2", "4", "5"]).addAnswer([
  "Obrigado por Participar da Promocao!",
]);

const flowPromossoes = addKeyword([
  "1",
  "promocoes",
  "promoções",
  "promoção",
  "promocao",
]).addAnswer(
  [
    "👉 1 - *Parmalat*",
    "👉 2 - *Santal*",
    "👉 3 - *Melrose*",
    "👉 4 - *Steri Stumpie*",
  ],
  { capture: true },
  (ctx, { fallBack }) => {
    if (
      ![
        "1",
        "2",
        "3",
        "4",
        "Parmalat",
        "Santal",
        "Melrose",
        "Steri Stumpie",
      ].includes(ctx.body)
    )
      return fallBack();
  },
  [flowPromocao]
);

const flowContacto = addKeyword([
  "2",
  "contacto",
  "contactos",
  "contato",
  "contatos",
]).addAnswer("*Lactalis Mocambique*, ☎️ Tel: 21 021 345 ");

const flowProdutos = addKeyword(["3", "marcas", "marca"]).addAnswer([
  "✅ *Parmalat*",
  "✅ *Santal*",
  "✅ *Melrose*",
  "✅ *Steri Stumpie*",
  "✅ *President*",
  "✅ *Galbani*",
  "✅ *Bonitta*",
]);

const flowServicos = addKeyword([
  "1",
  "servicos",
  "serviços",
  "services",
]).addAnswer(
  [
    "👉 1 - *Participe de Promoções*",
    "👉 2 - *Entre em Contacto*",
    "👉 3 - *Nossas Marcas*",
  ],
  null,
  null,
  [flowProdutos, flowContacto, flowPromossoes]
);

const flowEndereço = addKeyword(["2", "endereço", "endereco"]).addAnswer(
  "🚩 Estamos na Av. Uniao Africana No 7915 Matola- Mocambique"
);

const flowDescricao = addKeyword([
  "3",
  "breve descrição",
  "descricao",
  "descrição",
]).addAnswer(
  "🔖 A Lactalis comprou a fabrica da Parmalat que opera a mais de 30 anos no mercado mocambicano. Hoje somos uma empresa com um catalogo vasto e de alta qualidade, juntando o melhor da Parmalat e Lactalis"
);

const flowPrincipal = addKeyword([
  "ola",
  "olá",
  "boa tarde",
  "bom dia",
  "boa noite",
  "saudações",
  "saudacoes",
  "inicio",
  "início",
  "menu",
  "menú",
])
  .addAnswer("🤝 Bem vindo a *Lactalis Moçambique*")
  .addAnswer(
    [
      "Como podemos ajudar?",
      "👉 1 - *Lista de serviços*",
      "👉 2 - *Endereço* ",
      "👉 3 - *Breve Descrição* ",
      "Selecione uma opção (digite *início* para voltar a este Menú)",
    ],
    { capture: true },
    (ctx, { fallBack }) => {
      if (
        !["1", "2", "3", "descrição", "serviços", "endereço"].includes(ctx.body)
      )
        return fallBack();
    },
    [flowServicos, flowEndereço, flowDescricao]
  );

const flowAgradecimento = addKeyword(["obrigado", "grato", "thanks"]).addAnswer(
  ["Agradecemos pela sua disponibilidade. Volte sempre! 🫂"]
);

const main = async () => {
  const adapterDB = new MockAdapter();
  const adapterFlow = createFlow([flowPrincipal, flowAgradecimento]);
  const adapterProvider = createProvider(WebWhatsappProvider);
  createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });
  QRPortalWeb({ port: 4002 });
};

main();
