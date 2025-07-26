import pkg from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
// import { sendToWebhook } from "./webhook";

const { Client, LocalAuth } = pkg;

export const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: ["--no-sandbox"],
  },
});

export function startWhatsapp() {
  client.on("qr", (qr) => {
    console.log("📱 Escaneie este QR Code para conectar o WhatsApp:");
    qrcode.generate(qr, { small: true });
  });

  // client.on("message", async (message: Message) => {
  //   const allowedGroupsId = ["120363418755807673"];
  //   const chat = await message.getChat();

  //   console.log(`\n\n ## FULL MESSAGE ##`, message, `\n\n`);

  //   const isGroup = chat.isGroup;

  //   if (isGroup) {
  //     console.log(`\n\n ## last MESSAGE ID ##`, chat.lastMessage.id.id, `\n\n`);
  //     if (allowedGroupsId.includes(chat.id.user)) {
  //       console.log(
  //         `\n 📨 Nova mensagem recebida no grupo "${chat.name}": \n ${message.body} \n\n`
  //       );
  //       await sendToWebhook(message.body, message.from, chat.name);
  //     } else {
  //       console.log();
  //       `\n 💥 Mensagem descartada! Não faz parte de um grupo válido! ID Grupo: ${chat.id.user} \n`;
  //     }
  //   } else {
  //     console.log(`\n 💥 Mensagem descartada! Não é um grupo! \n`);
  //   }

  //   console.log(`\n\n ## DATA MESSAGE ##`, chat, `\n\n`);

  //   console.warn(
  //     `\n⚪⚪ FIM ⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪ \n`
  //   );
  // });

  client.initialize();
}

export const getWhatsappStatus = async () => await client.getState();

// Outros itens: 120363420702331766
