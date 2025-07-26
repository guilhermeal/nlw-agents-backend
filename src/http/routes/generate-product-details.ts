import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import z from "zod/v4";
import { generateProductLink } from "../../services/gemini.ts";
import { client, startWhatsapp } from "../../services/whatsapp.ts";
import puppeteer from "puppeteer";

function messageToJson(rawMessage: string) {
  const escapedMessage = rawMessage.replace(/\n/g, "\\n");
  return {
    message: escapedMessage,
  };
}

export const createProductLink: FastifyPluginCallbackZod = async (app) => {
  app.post(
    "/product",
    {
      schema: {
        body: z.object({
          message: z.string().min(1),
        }),
      },
    },
    async (request, reply) => {
      const { message } = request.body;

      if (!message) {
        return reply.status(401);
      }

      const parsedMessage = JSON.stringify(messageToJson(message), null, 2);
      const answer = await generateProductLink(parsedMessage);

      if (!answer) {
        return false;
      }

      const marketplace = answer.marketplace;

      const parsedUrlLink = async (url: string) => {
        if (marketplace === "amazon") {
          return await generateAmazonLink(url);
        }
        
        if (marketplace === "mercado-livre") {
          return await generateMercadoLivreLinkWithPuppeteer(url);
        }

        return url;
      };

      const parsedResult = {
        ...answer,
        url: await parsedUrlLink(answer.url),
      };

      // const result = await db
      //   .insert(schema.questions)
      //   .values({
      //     roomId,
      //     question,
      //     answer,
      //   })
      //   .returning();

      // const insertedQuestion = result[0];

      // if (!insertedQuestion) {
      //   throw new Error("Failed to create new question.");
      // }

      return reply.status(201).send(parsedResult);
    }
  );
};

export const generateAmazonLink = async (shortLink: string) => {
  const newTag = "comunidadeofertasbrasil-20";

  try {
    const response = await fetch(shortLink, { redirect: "manual" });

    if (response.status >= 300 && response.status < 400) {
      let finalUrl = response.headers.get("Location");

      // Substitui ou adiciona o tag
      if (finalUrl) {
        if (finalUrl.includes("tag=")) {
          finalUrl = finalUrl.replace(/tag=[^&]+/, `tag=${newTag}`);
        } else {
          finalUrl += `&tag=${newTag}`;
        }
      }

      return finalUrl;
    } else {
      return "Não foi possível extrair o link de destino.";
    }
  } catch (error) {
    console.error("\n\n Erro ao seguir o link curto:", error);
    return "Erro ao seguir o link curto.";
  }
};

export const generateMercadoLivreLink = async (shortLink: string) => {
  const newTag = "comunidadeofertasbrasil";

  /*

  https://mercadolivre.com/sec/2JCk6sx

  https://www.mercadolivre.com.br/social/achadosdovitrine?matt_word=rr20250502210016
  &matt_tool=55678914&forceInApp=true&ref=BPZnGK7nwDrMWN4FFhmbQmUPmwPDWMG6gFI0TYTP%2BgIQHRRNXovLLGmTp5PmCtymfb%2BAUw3GuDgn53Z6jLjK7BrexdWIZJC2POXyt%2BDLozlo6ZLqi8%2F0ExZv8ScKAHFf3%2FYyocuirS3PqTlcwAubz8JF20Zpi1bdY5SyOas9DE0AZ9OHUDjYOJTGi8%2Bw41vbMdAhsw%3D%3D


  https://www.mercadolivre.com.br/social/achadosdovitrine?matt_word=rr20250502210016
  &matt_tool=55678914
  &forceInApp=true
  &ref=BPZnGK7nwDrMWN4FFhmbQmUPmwPDWMG6gFI0TYTP%2BgIQHRRNXovLLGmTp5PmCtymfb%2BAUw3GuDgn53Z6jLjK7BrexdWIZJC2POXyt%2BDLozlo6ZLqi8%2F0ExZv8ScKAHFf3%2FYyocuirS3PqTlcwAubz8JF20Zpi1bdY5SyOas9DE0AZ9OHUDjYOJTGi8%2Bw41vbMdAhsw%3D%3D

  https://www.mercadolivre.com.br/social/xgira?matt_word=comunidadeofertasbrasil&matt_tool=80071902&forceInApp=true&ref=BPZnGK7nwDrMWN4FFhmbQmUPmwPDWMG6gFI0TYTP%2BgIQHRRNXovLLGmTp5PmCtymfb%2BAUw3GuDgn53Z6jLjK7BrexdWIZJC2POXyt%2BDLozlo6ZLqi8%2F0ExZv8ScKAHFf3%2FYyocuirS3PqTlcwAubz8JF20Zpi1bdY5SyOas9DE0AZ9OHUDjYOJTGi8%2Bw41vbMdAhsw%3D%3D




  &ref=BKC5d4YtLnVK7j%2Fhri7SlijOMUJLd%2B1bR49cbUTo6unalKH7gj%2Ffkqytq2Gd0NjSBMyULTncRa0dlIKD5Ip8JO%2BgAL7xaUtHJ9Il7vYU0E6ylZrYggHkRK6Vw8ieO%2FHuyGoVdpBHs6R7dnNaa%2BRVRv%2BRZQeE5aOTwy1Bp7AJtFXjUuMO%2B%2BN4Dan55iYbgdqTy8RJ4Q%3D%3D

  */

  try {
    // 1. Faz requisição com redirect: manual para capturar o Location
    const response = await fetch(shortLink, { redirect: 'manual' });

    console.log('\n\n #### RESPONSE #### \n\n', response, '\n\n\n');

    if (response.status >= 300 && response.status < 400) {
      let finalUrl = response.headers.get('Location');

      if (!finalUrl) {
        return 'Erro: Não foi possível extrair o link de destino.';
      }

      // 2. Garantir que é um link absoluto
      if (!finalUrl.startsWith('http')) {
        finalUrl = new URL(finalUrl, shortLink).href;
      }

      // 3. Criar objeto URL para manipulação
      const url = new URL(finalUrl);

      // 4. Substituir ou adicionar os parâmetros de afiliado
      url.searchParams.set('SOURCESITE', 'AFILIADOS');
      url.searchParams.set('SOURCEID', newTag);

      // 5. Remover parâmetros de afiliado antigos (opcional, para limpeza)
      // Ex: remove utm_source, utm_medium, etc.
      for (const key of url.searchParams.keys()) {
        if (key.startsWith('utm_')) {
          url.searchParams.delete(key);
        }
      }

      return url.toString();
    } else {
      return 'Não foi possível extrair o link de destino.';
    }
  } catch (error) {
    console.error('Erro ao processar link do Mercado Livre:', error);
    return 'Erro ao seguir o link curto.';
  }
};

export const generateMercadoLivreLinkWithPuppeteer = async (shortLink, meuSourceId='comunidadeofertasbrasil') => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
    );

    await page.goto(shortLink, { waitUntil: 'networkidle0', timeout: 30000 });

    // Extrair o link do produto
    const productUrl = await page.evaluate(() => {
      const link = document.querySelector('a.ui-vip-link, a.poly-component__title');
      return link ? link.href : null;
    });

    await browser.close();

    if (!productUrl) {
      return 'Nenhum produto encontrado.';
    }

    // Extrair o ASIN (MLBXXXXXXXXX)
    const match = productUrl.match(/MLB\d+/);
    const asin = match ? match[0] : null;

    if (!asin) {
      return 'Não foi possível extrair o ASIN do produto.';
    }

    // Montar o link limpo
    const cleanUrl = new URL(`https://www.mercadolivre.com.br/${asin}`);
    cleanUrl.searchParams.set('SOURCESITE', 'AFILIADOS');
    cleanUrl.searchParams.set('SOURCEID', meuSourceId);

    return cleanUrl.toString();

  } catch (error) {
    await browser.close();
    console.error('Erro:', error);
    return 'Erro ao processar o link.';
  }
};

export const getFinalAmazonProductLink: FastifyPluginCallbackZod = async (
  app
) => {
  app.post(
    "/product/amazon",
    {
      schema: {
        body: z.object({
          url: z.string().min(1),
        }),
      },
    },
    async (request) => {
      const { url } = request.body;

      return generateAmazonLink(url);
    }
  );
};

export const checkGroupWhatsAppInfoByInviteCode: FastifyPluginCallbackZod =
  async (app) => {
    app.get(
      "/product/whatsapp/invite/:inviteCode",
      {
        schema: {
          params: z.object({
            inviteCode: z
              .string()
              .transform((code) => code.replace(/@g\.us$/, "")) // ✅ Limpar automaticamente
              .refine((code) => code.length > 0, "Código não pode estar vazio"),
          }),
        },
      },
      async (request, reply) => {
        const { inviteCode } = request.params;

        const startTime = Date.now();
        const TIMEOUT_MS = 60000;
        let attempt = 0;

        try {
          const waitForWhatsAppWithBackoff = async (): Promise<any> => {
            while (Date.now() - startTime < TIMEOUT_MS) {
              attempt++;
              const elapsedTime = Date.now() - startTime;
              const retryDelay = Math.min(2000 + attempt * 1000, 5000);

              console.log(
                `🔄 Tentativa ${attempt} (${Math.round(elapsedTime / 1000)}s)`
              );

              try {
                if (!client) {
                  throw new Error("Cliente não inicializado");
                }

                const clientState = await client.getState();
                if (clientState !== "CONNECTED") {
                  throw new Error(`Cliente não conectado: ${clientState}`);
                }

                // ✅ Usar código limpo na busca
                const result = await Promise.race([
                  client.getInviteInfo(inviteCode), // ✅ Código sem @g.us
                  new Promise((_, reject) =>
                    setTimeout(
                      () => reject(new Error("Timeout na tentativa")),
                      10000
                    )
                  ),
                ]);

                if (result) {
                  console.log(`✅ Sucesso na tentativa ${attempt}!`);
                  return result;
                }

                throw new Error("Resultado vazio");
              } catch (error) {
                console.log(`❌ Tentativa ${attempt} falhou: ${error.message}`);

                const permanentErrors = [
                  "not found",
                  "invalid",
                  "expired",
                  "Invite link not found",
                  "Invalid invite code",
                ];

                if (
                  permanentErrors.some((err) =>
                    error.message?.toLowerCase().includes(err.toLowerCase())
                  )
                ) {
                  throw new Error(`Erro permanente: ${error.message}`);
                }

                const remainingTime = TIMEOUT_MS - (Date.now() - startTime);
                if (remainingTime > retryDelay) {
                  console.log(`⏳ Aguardando ${retryDelay}ms...`);
                  await new Promise((resolve) =>
                    setTimeout(resolve, retryDelay)
                  );
                } else {
                  throw new Error("Tempo esgotado");
                }
              }
            }

            throw new Error("Timeout global alcançado");
          };

          const result = await waitForWhatsAppWithBackoff();
          const totalTime = Date.now() - startTime;

          console.log(
            "\n\n ************************************************ \n"
          );
          console.log("ANALISANDO CODIGO DE INVITE DO WHATSAPP \n");
          console.log(`📱 Código original: "${inviteCode}" \n\n`);
          console.log(`📱 RESULTADO: \n`, result, "\n\n");

          console.log(
            "\n\n ************************************************ \n\n"
          );

          return reply.status(201).send({
            success: true,
            cleanedCode: inviteCode,
            groupInfo: result,
          });
        } catch (error) {
          return reply.status(401).send({
            success: false,
            cleanedCode: inviteCode,
            groupInfo: undefined,
          });
        }

        return null;
      }
    );
  };
