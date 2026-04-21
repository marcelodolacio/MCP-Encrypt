# Ciphersuite MCP - Criptografia sem frescura no VS Code

Fiz esse servidor [MCP (Model Context Protocol)](https://modelcontextprotocol.io) pra testar a criacao de um mcp que trabalha com criptografia AES-256-CBC. A ideia é simples: encriptar e decriptar coisas direto pelo Copilot Chat do VS Code, sem precisar de site externo ou ficar caçando comando no terminal.

---

## O que tem de bom aqui?

| Funcionalidade | Nome | Pra que serve? |
|---|---|---|
| 🔧 Ferramenta | `encrypt_message` | Encripta qualquer texto usando uma senha. |
| 🔧 Ferramenta | `decrypt_message` | Decripta o que você encriptou (se não esquecer a senha, claro). |
| 📄 Recurso | `encryption://info` | Um "quem somos" do algoritmo e do formato de saída. |
| 💬 Prompt | `encrypt_message_prompt` | Atalho pra pedir pro Copilot encriptar algo pra você. |
| 💬 Prompt | `decrypt_message_prompt` | Atalho pra pedir pro Copilot decriptar algo pra você. |

### Papo reto sobre a segurança

- **Algoritmo**: AES-256-CBC (padrão ouro).
- **Chave**: Uso `scrypt` por baixo dos panos. Você escolhe uma senha qualquer e o servidor se vira pra gerar uma chave de 32 bytes de verdade.
- **Formato**: O resultado sai como `IV:TextoCifrado`. Copie tudo pra conseguir decriptar depois!
- **Diferencial**: Cada vez que você encripta a mesma coisa, o resultado muda (graças ao IV aleatório). Segurança em primeiro lugar.

---

## O que você precisa ter aí

- **Node.js v24+** (sim, o mais recente pra não ter dor de cabeça).

---

## Instalação rápida

```bash
npm install
```

Não precisa compilar nada. É baixar, instalar e rodar. O Node.js já entende o TypeScript direto aqui.

---

## Como configurar no seu VS Code

### 1. Avisa o VS Code que eu existo

Crie (ou abra) o arquivo `.vscode/mcp.json` na pasta do seu projeto e joga isso aqui lá dentro:

```json
{
  "servers": {
    "ciphersuite-mcp": {
      "command": "node",
      "args": ["--experimental-strip-types", "CAMINHO_ABSOLUTO_DA_PASTA/src/index.ts"]
    }
  }
}
```

Ou, se quiser usar a versão que já tá no npm:
```json
{
  "servers": {
    "ciphersuite-mcp": {
      "command": "npx",
      "args": ["-y", "@erickwendel/ciphersuite-mcp"]
    }
  }
}
```

> **Dica de ouro:** Se colocar isso no seu config global (`~/.vscode/mcp.json`), vai funcionar em qualquer projeto que você abrir.

### 2. Dá um "refresh" no VS Code

Dá um `Ctrl+Shift+P` (ou `Cmd+Shift+P`) e digita **Developer: Reload Window**. É o jeito mais fácil de fazer o VS Code ler as configurações novas.

### 3. Brincando no Copilot Chat

Abre o chat (modo Agente) e testa esses comandos:

```
Encripte "Segredo de estado" com a senha "123456"
```

```
Decripte "a3f1...:texto" com a senha "123456"
```

```
O que você sabe sobre encryption://info?
```

O Copilot vai entender o recado e chamar as ferramentas automaticamente.

---

## Quer ver as ferramentas funcionando?

Se quiser testar a interface visual e ver todos os recursos, roda o inspector:

```bash
npm run mcp:inspect
```

Vai abrir uma página no seu navegador (geralmente no `localhost:5173`) pra você testar tudo na mão.

---

## Testes (pra não dizer que não funciona)

```bash
# Pra rodar tudo de uma vez
npm test

# Pra quem gosta de ver os testes rodando enquanto coda
npm run test:dev
```

Os testes cobrem tudo: encriptar, decriptar, erro de senha, texto corrompido... tá tudo lá.

---

## Como o projeto tá organizado

```
src/
  index.ts   # Onde tudo começa (conexão via stdio)
  mcp.ts     # A lógica das ferramentas, recursos e prompts
tests/
  mcp.test.ts # A prova de que funciona
```

---

## Comandos que você vai usar

| Comando | O que ele faz? |
|---|---|
| `npm start` | Roda o servidor (pro VS Code usar) |
| `npm run dev` | Pra quando você estiver mexendo no código |
| `npm test` | Roda os testes e pronto |
| `npm run test:dev` | Testes em modo watch |
| `npm run mcp:inspect` | Abre a interface visual pra testes |


