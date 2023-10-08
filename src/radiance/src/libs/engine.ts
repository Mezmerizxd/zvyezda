import storage from './storage';

class Engine {
  protected static instance: Engine;

  static getInstance(): Engine {
    if (!Engine.instance) {
      Engine.instance = new Engine();
    }
    return Engine.instance;
  }

  serverUrl: string;
  socketUrl: string | null;

  profile: Profile | null;

  constructor() {
    this.serverUrl = this.getServerUrl();
  }

  public async start() {
    this.socketUrl = (await this.GetSocketDetails()).data.socketUrl;

    const token = storage.getToken();
    if (token !== null) {
      this.profile = (await this.GetProfile()).data || null;
    }
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
    const account = await this.Post('/account/login', false, data);
    if (account.data) {
      this.profile = {
        ...account.data,
      };
    }
    return account;
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
    const profile = await this.Get('/account/profile', true);
    if (profile.data) this.profile = profile.data;
    return profile;
  }

  public async UpdateProfile(data: Profile): Promise<{
    server: BaseResponse;
    data: ReturnType<PatchEvents['/account/profile/update']> | null;
  }> {
    const profile = await this.Patch('/account/profile/update', true, data);
    if (profile.data) this.profile = profile.data;
    return profile;
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

  public async GetAllBookings(): Promise<{
    server: BaseResponse;
    data: ReturnType<GetEvents['/bookings/get-all']> | null;
  }> {
    return await this.Get('/bookings/get-all', true);
  }

  public async GetBooking(data: { bookingId: string }): Promise<{
    server: BaseResponse;
    data: ReturnType<GetEvents['/bookings/get']> | null;
  }> {
    return await this.Get('/bookings/get', true);
  }

  public async CancelBooking(data: { bookingId: string }): Promise<{
    server: BaseResponse;
    data: ReturnType<PostEvents['/bookings/cancel']> | null;
  }> {
    return await this.Post('/bookings/cancel', true, data);
  }

  public async IsDateBooked(data: { date: Date }): Promise<{
    server: BaseResponse;
    data: ReturnType<PostEvents['/bookings/is-date-booked']> | null;
  }> {
    return await this.Post('/bookings/is-date-booked', true, data);
  }

  public async ConfirmBooking(data: { bookingId: string }): Promise<{
    server: BaseResponse;
    data: ReturnType<PatchEvents['/bookings/confirm']> | null;
  }> {
    return await this.Patch('/bookings/confirm', true, data);
  }

  public async ConfirmBookingPayment(data: { bookingId: string }): Promise<{
    server: BaseResponse;
    data: ReturnType<PatchEvents['/bookings/confirm-payment']> | null;
  }> {
    return await this.Patch('/bookings/confirm-payment', true, data);
  }

  public async GetAddresses(): Promise<{
    server: BaseResponse;
    data: ReturnType<GetEvents['/account/addresses']> | null;
  }> {
    return await this.Get('/account/addresses', true);
  }

  public async UpdateAddress(data: Address): Promise<{
    server: BaseResponse;
    data: ReturnType<PatchEvents['/account/addresses/update']> | null;
  }> {
    return await this.Patch('/account/addresses/update', true, data);
  }

  public async DeleteAddress(data: Address): Promise<{
    server: BaseResponse;
    data: ReturnType<PostEvents['/account/addresses/delete']> | null;
  }> {
    return await this.Post('/account/addresses/delete', true, data);
  }

  public async CreateAddress(data: Address): Promise<{
    server: BaseResponse;
    data: ReturnType<PostEvents['/account/addresses/create']> | null;
  }> {
    return await this.Post('/account/addresses/create', true, data);
  }

  public async RescheduleBooking(data: { bookingId: string; date: Date }): Promise<{
    server: BaseResponse;
    data: ReturnType<PatchEvents['/bookings/reschedule']> | null;
  }> {
    return await this.Patch('/bookings/reschedule', true, data);
  }

  public async RescheduleConfirmedBooking(data: { bookingId: string }): Promise<{
    server: BaseResponse;
    data: ReturnType<PatchEvents['/bookings/reschedule-confirmed']> | null;
  }> {
    return await this.Patch('/bookings/reschedule-confirmed', true, data);
  }

  public async CreateBooking(data: { date: Date; serviceType: string; addressId: string }): Promise<{
    server: BaseResponse;
    data: ReturnType<PostEvents['/bookings/create']> | null;
  }> {
    return await this.Post('/bookings/create', true, data);
  }

  private async Patch<T extends keyof PatchEvents>(
    event: T,
    authorization: boolean,
    body: any,
  ): Promise<{ server: BaseResponse; data: ReturnType<PatchEvents[T]> | null }> {
    try {
      const response = await fetch(`${this.serverUrl}${event}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(authorization ? { Authorization: `${storage.getToken()}` } : {}),
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
      return { server: { success: false, error: 'Something went wrong, try again later.' }, data: null };
    }
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
          ...(authorization ? { Authorization: `${storage.getToken()}` } : {}),
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
          ...(authorization ? { Authorization: `${storage.getToken()}` } : {}),
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
      return { server: { success: false, error: 'Something went wrong, try again later.' }, data: null };
    }
  }

  private getServerUrl(): string {
    const { protocol, host, port } = window.location;

    if (port === '8081') {
      return 'http://localhost:4000/api/v1';
    } else {
      return `${protocol}//${host}/api/v1`;
    }
  }
}

export const engine = Engine.getInstance();
