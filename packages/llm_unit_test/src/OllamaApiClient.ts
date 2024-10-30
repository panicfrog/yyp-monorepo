// apiClient.ts

// 类型定义

// 通用的模型详情类型
type ModelDetails = {
  parent_model?: string;
  format?: string;
  family?: string;
  families?: string[] | null;
  parameter_size?: string;
  quantization_level?: string;
};

// 通用的请求参数类型
type GenerateCompletionParams = {
  model: string;
  prompt?: string;
  suffix?: string;
  images?: string[];
  format?: string;
  options?: Record<string, any>;
  system?: string;
  template?: string;
  context?: number[];
  stream?: boolean;
  raw?: boolean;
  keep_alive?: string;
};

type GenerateCompletionResponse = {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
  done_reason?: string;
};

type Message = {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  images?: string[];
  tool_calls?: ToolCall[];
};

type Tool = {
  type: string;
  function: Record<string, any>;
};

type ToolCall = {
  function: {
    name: string;
    arguments: Record<string, any>;
  };
};

type GenerateChatCompletionParams = {
  model: string;
  messages: Message[];
  tools?: Tool[];
  format?: string;
  options?: Record<string, any>;
  stream?: boolean;
  keep_alive?: string;
};

type GenerateChatCompletionResponse = {
  model: string;
  created_at: string;
  message: Message;
  done: boolean;
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
  done_reason?: string;
};

type GenerateEmbeddingsParams = {
  model: string;
  input: string | string[];
  truncate?: boolean;
  options?: Record<string, any>;
  keep_alive?: string;
};

type GenerateEmbeddingsResponse = {
  model: string;
  embeddings: number[][];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
};

type ListLocalModelsResponse = {
  models: {
    name: string;
    modified_at: string;
    size: number;
    digest: string;
    details: ModelDetails;
  }[];
};

type ListRunningModelsResponse = {
  models: {
    name: string;
    model: string;
    size: number;
    digest: string;
    details: ModelDetails;
    expires_at: string;
    size_vram: number;
  }[];
};

type ShowModelInfoResponse = {
  modelfile: string;
  parameters: string;
  template: string;
  details: ModelDetails;
  model_info: Record<string, any>;
};

class OllamaApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://172.22.78.147:11434') {
    this.baseUrl = baseUrl;
  }

  async generateCompletion(
    params: GenerateCompletionParams
  ): Promise<GenerateCompletionResponse> {
    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...params,
        stream: false, // 确保设置 stream 为 false
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP 错误！状态码：${response.status}，信息：${errorText}`
      );
    }

    const data: GenerateCompletionResponse = await response.json();
    return data;
  }

  async generateChatCompletion(
    params: GenerateChatCompletionParams
  ): Promise<GenerateChatCompletionResponse> {
    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...params,
        stream: false, // 确保设置 stream 为 false
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP 错误！状态码：${response.status}，信息：${errorText}`
      );
    }

    const data: GenerateChatCompletionResponse = await response.json();
    return data;
  }

  async generateEmbeddings(
    params: GenerateEmbeddingsParams
  ): Promise<GenerateEmbeddingsResponse> {
    const response = await fetch(`${this.baseUrl}/api/embed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP 错误！状态码：${response.status}，信息：${errorText}`
      );
    }

    const data: GenerateEmbeddingsResponse = await response.json();
    return data;
  }

  async listLocalModels(): Promise<ListLocalModelsResponse> {
    const response = await fetch(`${this.baseUrl}/api/tags`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP 错误！状态码：${response.status}，信息：${errorText}`
      );
    }

    const data: ListLocalModelsResponse = await response.json();
    return data;
  }

  async listRunningModels(): Promise<ListRunningModelsResponse> {
    const response = await fetch(`${this.baseUrl}/api/ps`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP 错误！状态码：${response.status}，信息：${errorText}`
      );
    }

    const data: ListRunningModelsResponse = await response.json();
    return data;
  }

  async showModelInfo(
    name: string,
    verbose?: boolean
  ): Promise<ShowModelInfoResponse> {
    const params = {
      name,
      ...(verbose && { verbose: true }),
    };
    const response = await fetch(`${this.baseUrl}/api/show`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP 错误！状态码：${response.status}，信息：${errorText}`
      );
    }

    const data: ShowModelInfoResponse = await response.json();
    return data;
  }
}

export default OllamaApiClient;