const fs = require("fs");
const puppeteer = require("puppeteer");

async function translateText(text) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Define um User-Agent para simular um navegador de desktop
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36"
  );

  // Vá para a página de tradução (ex: Google Translate)
  await page.goto(
    "https://translate.google.com.br/?hl=pt-BR&sl=en&tl=pt&op=translate",
    { timeout: 120000 }
  );

  // Digite o texto a ser traduzido
  await page.waitForSelector('textarea[aria-label="Texto de origem"]');
  await page.type('textarea[aria-label="Texto de origem"]', text);

  // Aguarde a tradução aparecer
  await page.waitForSelector('.ryNqvb[jsname="W297wb"]', { timeout: 120000 });

  // Pegue o texto traduzido
  const translated = await page.$eval(
    '.ryNqvb[jsname="W297wb"]',
    (el) => el.textContent
  );

  await browser.close();
  return translated;
}

async function translateSRT() {
  const filePath =
    "C:\\Users\\Desenv. 02\\Downloads\\lioness.s02.e02.i.love.my.country.(2024).eng.1cd.(12814046)\\Lioness.2023.S02E02.1080p.WEB.H264-SuccessfulCrab(SDH).srt";

  // Leia o arquivo .srt
  const srtContent = fs.readFileSync(filePath, "utf-8");
  const lines = srtContent.split("\n");
  const translatedLines = [];

  //   // Loop para mostrar a animação de carregamento
  //   const loadingAnimation = setInterval(() => {
  //     process.stdout.write("Carregando");
  //     for (let dots = 1; dots <= 3; dots++) {
  //       setTimeout(() => {
  //         process.stdout.write("."); // Adiciona um ponto
  //       }, dots * 500);
  //     }
  //     setTimeout(() => {
  //       process.stdout.write("\r"); // Limpa a linha
  //     }, 4000); // Limpa após 4 segundos (o tempo total de 3 pontos)
  //   }, 5000); // Atualiza a cada 5 segundos

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Verifica se a linha contém texto
    // Ignora números de sequência, temporizações e linhas vazias
    if (
      line &&
      !line.includes("-->") &&
      !/^\d+$/.test(line) &&
      line.length > 0
    ) {
      const translatedText = await translateText(line); // Traduza normalmente
      translatedLines.push(translatedText.trim()); // Adiciona a tradução à lista
    } else {
      translatedLines.push(line); // Mantém as linhas de tempo, números de sequência ou linhas vazias
    }
  }

  //   clearInterval(loadingAnimation); // Para a animação de carregamento
  process.stdout.write("Tradução concluída.           \n"); // Mensagem final

  // Escreva o resultado no arquivo translated.txt
  fs.writeFileSync("translated.txt", translatedLines.join("\n"));
}

translateSRT()
  .then(() => console.log("Processo finalizado."))
  .catch((err) => console.error("Erro na tradução:", err));
