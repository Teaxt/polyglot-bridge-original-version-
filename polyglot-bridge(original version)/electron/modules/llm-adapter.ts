import { ipcMain } from 'electron';
import https from 'https';
import http from 'http';

// 各提供商的API端点和默认模型
const PROVIDERS: Record<string, { baseUrl: string; defaultModel: string }> = {
  openai:    { baseUrl: 'https://api.openai.com/v1/chat/completions', defaultModel: 'gpt-4o' },
  anthropic: { baseUrl: 'https://api.anthropic.com/v1/messages', defaultModel: 'claude-3-5-sonnet-20241022' },
  deepseek:  { baseUrl: 'https://api.deepseek.com/v1/chat/completions', defaultModel: 'deepseek-chat' },
  gemini:    { baseUrl: 'https://generativelanguage.googleapis.com/v1beta/chat/completions', defaultModel: 'gemini-pro' },
  moonshot:  { baseUrl: 'https://api.moonshot.cn/v1/chat/completions', defaultModel: 'moonshot-v1-8k' },
};

function getProviderConfig(apiProvider: string) {
  return PROVIDERS[apiProvider] || PROVIDERS.openai;
}

// 构建请求体
function buildRequestBody(apiProvider: string, model: string, prompt: string, text: string, stream: boolean) {
  const messages = [
    { role: 'system', content: prompt },
    { role: 'user', content: text },
  ];

  if (apiProvider === 'anthropic') {
    return JSON.stringify({
      model,
      max_tokens: 4096,
      system: prompt,
      messages: [{ role: 'user', content: text }],
      stream,
    });
  }

  return JSON.stringify({ model, messages, stream });
}

// 构建请求头
function buildHeaders(apiProvider: string, apiKey: string) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };

  if (apiProvider === 'anthropic') {
    headers['x-api-key'] = apiKey;
    headers['anthropic-version'] = '2023-06-01';
  } else {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  return headers;
}

// 解析流式chunk
function parseStreamChunk(apiProvider: string, chunk: string): string | null {
  const lines = chunk.split('\n').filter(l => l.startsWith('data: '));
  let result = '';

  for (const line of lines) {
    const data = line.slice(6).trim();
    if (data === '[DONE]') return null;

    try {
      const parsed = JSON.parse(data);
      if (apiProvider === 'anthropic') {
        if (parsed.type === 'content_block_delta') {
          result += parsed.delta?.text || '';
        }
      } else {
        result += parsed.choices?.[0]?.delta?.content || '';
      }
    } catch { /* 忽略不完整的chunk */ }
  }

  return result || null;
}

// 非流式请求
function doRequest(apiProvider: string, apiKey: string, model: string, prompt: string, text: string): Promise<string> {
  const { baseUrl } = getProviderConfig(apiProvider);
  const url = new URL(baseUrl);
  const isHttps = url.protocol === 'https:';
  const transport = isHttps ? https : http;

  return new Promise((resolve, reject) => {
    const body = buildRequestBody(apiProvider, model, prompt, text, false);
    const req = transport.request({
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: url.pathname,
      method: 'POST',
      headers: buildHeaders(apiProvider, apiKey),
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (res.statusCode && res.statusCode >= 400) {
            reject(new Error(json.error?.message || `HTTP ${res.statusCode}`));
            return;
          }
          if (apiProvider === 'anthropic') {
            resolve(json.content?.[0]?.text || '');
          } else {
            resolve(json.choices?.[0]?.message?.content || '');
          }
        } catch (e) {
          reject(new Error(`解析响应失败: ${data.slice(0, 200)}`));
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// 流式请求
function doStreamRequest(apiProvider: string, apiKey: string, model: string, prompt: string, text: string, onChunk: (chunk: string) => void, onDone: () => void, onError: (err: Error) => void) {
  const { baseUrl } = getProviderConfig(apiProvider);
  const url = new URL(baseUrl);
  const isHttps = url.protocol === 'https:';
  const transport = isHttps ? https : http;

  const body = buildRequestBody(apiProvider, model, prompt, text, true);
  const req = transport.request({
    hostname: url.hostname,
    port: url.port || (isHttps ? 443 : 80),
    path: url.pathname,
    method: 'POST',
    headers: buildHeaders(apiProvider, apiKey),
  }, (res) => {
    let buffer = '';
    res.on('data', (chunk: Buffer) => {
      buffer += chunk.toString();
      const result = parseStreamChunk(apiProvider, buffer);
      if (result !== null) onChunk(result);
      // 保留未处理完的部分
      const lastNewline = buffer.lastIndexOf('\n');
      if (lastNewline >= 0) buffer = buffer.slice(lastNewline + 1);
    });
    res.on('end', onDone);
    res.on('error', onError);
  });

  req.on('error', onError);
  req.write(body);
  req.end();
}

// 测试连接
async function testConnection(config: any): Promise<{ success: boolean; message: string }> {
  try {
    const model = config.modelTag || getProviderConfig(config.apiProvider).defaultModel;
    const result = await doRequest(config.apiProvider, config.apiKey, model, 'Say "OK"', 'Hello');
    return { success: true, message: `连接成功 (${model}): ${result.slice(0, 50)}` };
  } catch (e: any) {
    return { success: false, message: `连接失败: ${e.message}` };
  }
}

export function registerLLMHandlers() {
  ipcMain.handle('llm:test-connection', (_, config) => testConnection(config));

  ipcMain.handle('llm:translate', async (_, config, text, prompt) => {
    const model = config.modelTag || getProviderConfig(config.apiProvider).defaultModel;
    return doRequest(config.apiProvider, config.apiKey, model, prompt, text);
  });

  ipcMain.on('llm:translate-stream', (event, { config, text, prompt, channel }) => {
    const model = config.modelTag || getProviderConfig(config.apiProvider).defaultModel;
    doStreamRequest(
      config.apiProvider, config.apiKey, model, prompt, text,
      (chunk) => event.sender.send(channel, chunk),
      () => event.sender.send(channel, '[DONE]'),
      (err) => event.sender.send(channel, `[ERROR] ${err.message}`),
    );
  });
}
