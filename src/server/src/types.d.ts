declare namespace Zvyezda {}

declare namespace Zvyezda.Socket {
  type ClientToServer = {
    sendMessage: (data: {}) => void;
  };
  type ServerToClient = {
    message: (data: {}) => void;
  };
}

declare namespace Zvyezda.Server {
  type BaseResponse = {
    success: boolean;
    error?: string;
  };

  type Apis = {
    /* INDEX */
    ['/test']: () => {
      name: string;
    };
    ['/get-socket-details']: () => {
      socketUrl: string;
    };

    /* ACCOUNT */
    ['/account/login']: () => {
      token: string;
    };
    ['/account/check-token']: () => {
      valid: boolean;
    };
  };
}

declare namespace Zvyezda.Server.Helpers {
  type Log = {
    id: number;
    date: string;
    logs: string[];
  };
}

declare namespace Zvyezda.Server.Managers {}

declare namespace Zvyezda.Server.Managers.Access {
  // type Active = {
  //   id: string;
  //   username: string;
  //   token: string;
  //   expires: Date;
  // };

  type Active = {
    id: string;
    username: string;
    token: string;
    expires: Date;
  };
}
