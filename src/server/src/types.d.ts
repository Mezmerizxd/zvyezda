declare namespace Zvyezda {
  
}

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
  };
}

declare namespace Zvyezda.Server.Helpers {
  type Log = {
    id: number;
    date: string;
    logs: string[];
  };
}
