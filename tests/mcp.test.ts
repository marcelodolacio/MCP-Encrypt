import { describe, it, after, before } from "node:test";
import assert from "node:assert";
import { Client } from "@modelcontextprotocol/sdk/client";
import { createTestClient } from "./helpers.ts";

async function encryptMessage(client: Client, message: string, encryptionKey: string) {
    const result = await client.callTool({
        name: "encrypt-message",
        arguments: {
            message,
            encryptionKey
        }
    }) as unknown as {
        structuredContent: {
            encryptedMessage: string;
        }
    }
    return result;
}

async function decryptMessage(client: Client, encryptedMessage: string, encryptionKey: string) {
    const result = await client.callTool({
        name: "decrypt-message",
        arguments: {
            encryptedMessage,
            encryptionKey
        }
    }) as unknown as {
        structuredContent: {
            decryptedMessage: string;
        }
    }
    return result;
}

describe('MCP Tool Test', () => {
    let cliente: Client
    let encryptionKey = "mysecretkey"
    before(async () => {
        cliente = await createTestClient();

    })
    after(async () => {
        await cliente.close();
    })
    it('Shold encrypt the message with correct key', async () => {
        const message = "Hello MCP"
        const result = await encryptMessage(cliente, message, encryptionKey);
        assert.ok(result.structuredContent?.encryptedMessage.length > 60, 'Encrypted message is too short')
    })
    it('Shold decrypt the message with correct key', async () => {
        const message = "Hello MCP"
        const { structuredContent: { encryptedMessage } } = await encryptMessage(cliente, message, encryptionKey);
        const result = await decryptMessage(cliente, encryptedMessage, encryptionKey)
        assert.deepStrictEqual(result.structuredContent?.decryptedMessage, message, 'Decrypted message does not match original')

    })
    it('should list the encryption://info resource', async () => {
        const { resources } = await cliente.listResources()
        const info = resources.find(item => item.uri === 'encryption://info')
        assert.ok(info, 'encryption://info resource should be listed!')
    })
    it('should return the encrypt_message_prompt', async () => {
        const result = await cliente.getPrompt({
            name: 'encrypt_message_prompt',
            arguments: {
                message: 'Secret text',
                encryptionKey,
            }
        })

        const item = result.messages.at(0)?.content as unknown as { text: string }
        const expected = `Please encrypt the following message using the encrypt_message tool.
Message: Secret text
Encryption key: my-super-passphrase`
        assert.deepStrictEqual(
            item.text,
            expected,
            'Prompt should be in the correct format'
        )
    })
})