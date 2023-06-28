class Emitter {
  protected static instance: Emitter;

  static getInstance(): Emitter {
    if (!Emitter.instance) {
      Emitter.instance = new Emitter();
    }
    return Emitter.instance;
  }

  apiUrl: string;
  socketUrl: string;

  constructor() {
    this.apiUrl = this._getApiUrl();
  }

  async start() {
    this.socketUrl = await this._getSocketUrl();
  }

  async api<T extends keyof Zvyezda.Server.Apis>(
    event: T,
    authorization: boolean,
    body: any,
  ): Promise<{ server: Zvyezda.Server.BaseResponse; data?: ReturnType<Zvyezda.Server.Apis[T]> }> {
    const response = await fetch(`${this.apiUrl}${event}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authorization ? { Authorization: `${localStorage.getItem('token')}` } : {}),
      },
      body: JSON.stringify(body || {}),
    });
    const json = await response.json();
    const server = json.server;
    const data = json.data;
    if (!server) {
      server.success = false;
      server.error = 'Api response is null';
    }
    return { server, data };
  }

  async validateToken(): Promise<boolean> {
    const token = localStorage.getItem('token');

    if (!token) {
      return false;
    }

    const r = await this.api('/account/check-token', false, {
      token,
    });

    if (r?.data?.valid === true) {
      return true;
    } else {
      localStorage.removeItem('token');
    }

    return false;
  }

  _getApiUrl(): string {
    const { protocol, host, port } = window.location;

    if (port === '8080') {
      return 'http://localhost:3000/api/v1';
    } else {
      return `${protocol}//${host}/api/v1`;
    }
  }

  async _getSocketUrl(): Promise<string> {
    const r = await this.api('/get-socket-details', false, {});
    if (r.server.success === false) {
      return;
    }
    return r.data.socketUrl;
  }
}

export const emitter = Emitter.getInstance();
