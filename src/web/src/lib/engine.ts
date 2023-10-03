class Engine {
  protected static instance: Engine;

  static getInstance(): Engine {
    if (!Engine.instance) {
      Engine.instance = new Engine();
    }
    return Engine.instance;
  }

  forceEngine: boolean = false;

  serverUrl: string;
  socketUrl: string | null;

  constructor() {
    this.serverUrl = this.getServerUrl();
  }

  public async start() {
    this.socketUrl = (await this.GetSocketDetails()).data.socketUrl;
  }

  public async GetVersion(): Promise<{
    server: BaseResponse;
    data: ReturnType<GetEvents['/get-version']> | null;
  }> {
    return await this.Get('/get-version', false);
  }

  public async GetSocketDetails(): Promise<{
    server: BaseResponse;
    data: ReturnType<GetEvents['/get-socket-details']> | null;
  }> {
    return await this.Get('/get-socket-details', false);
  }

  public async LoginAccount(data: { username: string; password: string }): Promise<{
    server: BaseResponse;
    data: ReturnType<PostEvents['/account/login']> | null;
  }> {
    return await this.Post('/account/login', false, data);
  }

  public async CreateAccount(data: { email: string; username: string; password: string }): Promise<{
    server: BaseResponse;
    data: ReturnType<PostEvents['/account/create']> | null;
  }> {
    return await this.Post('/account/create', false, data);
  }

  public async DeleteAccount(data: { identifier: 'id' | 'email' | 'username' | 'token'; value: string }): Promise<{
    server: BaseResponse;
    data: ReturnType<PostEvents['/account/delete']> | null;
  }> {
    return await this.Post('/account/delete', true, data);
  }

  public async GetProfile(): Promise<{
    server: BaseResponse;
    data: ReturnType<GetEvents['/account/profile']> | null;
  }> {
    return await this.Get('/account/profile', true);
  }

  public async GetAllAccounts(): Promise<{
    server: BaseResponse;
    data: ReturnType<GetEvents['/account/accounts']> | null;
  }> {
    return await this.Get('/account/accounts', true);
  }

  public async Authorize(): Promise<{
    server: BaseResponse;
    data: ReturnType<GetEvents['/account/authorize']> | null;
  }> {
    return await this.Get('/account/authorize', true);
  }

  private async Post<T extends keyof PostEvents>(
    event: T,
    authorization: boolean,
    body: any,
  ): Promise<{ server: BaseResponse; data: ReturnType<PostEvents[T]> | null }> {
    try {
      const response = await fetch(`${this.serverUrl}${event}`, {
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
        server.error = 'Server response is null';
      }
      return { server, data };
    } catch (e) {
      alert('Something went wrong, try again later.');
      return { server: { success: false, error: 'Something went wrong, try again later.' }, data: null };
    }
  }

  private async Get<T extends keyof GetEvents>(
    event: T,
    authorization: boolean,
  ): Promise<{ server: BaseResponse; data: ReturnType<GetEvents[T]> | null }> {
    try {
      const response = await fetch(`${this.serverUrl}${event}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(authorization ? { Authorization: `${localStorage.getItem('token')}` } : {}),
        },
      });
      console.log(response);
      const json = await response.json();
      const server = json.server;
      const data = json.data;
      if (!server) {
        server.success = false;
        server.error = 'Server response is null';
      }
      return { server, data };
    } catch (e) {
      alert('Something went wrong, try again later.');
      return { server: { success: false, error: 'Something went wrong, try again later.' }, data: null };
    }
  }

  private getServerUrl(): string {
    const { protocol, host, port } = window.location;

    if (port === '8080') {
      return 'http://localhost:4000/api/v1';
    } else {
      return `${protocol}//engine.${host}/api/v1`;
    }
  }
}

export const engine = Engine.getInstance();
