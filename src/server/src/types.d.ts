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

  type PublicHackedConsole = {
    id?: string;
    title: string;
    description: string;
    serialNumber: string;
    xboxType: string;
    xboxColour: string;
    motherboardType: string;
    nandSize: string;
    mfrDate: Date;
    model: string;
    rghVersion: string;
    rghGlitchType: string;
    images?: string[];
  };

  type Apis = {
    /* INDEX */
    ['/test']: () => {
      name: string;
    };
    ['/get-version']: () => {
      server: string;
      client: string;
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

    /* XBOX HACKING */
    ['/xbox-hacking/create']: () => {};
    ['/xbox-hacking/delete']: () => {};
    ['/xbox-hacking/edit']: () => {};
    ['/xbox-hacking/get-consoles']: () => {
      consoles: Zvyezda.Client.HackedConsole[];
    };
    ['/xbox-hacking/get-public-consoles']: () => {
      consoles: Zvyezda.Server.PublicHackedConsole[];
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
  type Active = {
    id: string;
    username: string;
    token: string;
    expires: Date;
  };
}
