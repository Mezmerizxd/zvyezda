declare namespace Zvyezda {}

declare namespace Zvyezda.Socket {
  type ClientToServer = {
    sendMessage: (data: {}) => void;
    joinDiscussion: (data: { authorization: string }) => void;
    leaveDiscussion: () => void;
    sendDiscussionMessage: (data: { message: string; authorization: string; replyTo?: string }) => void;
  };
  type ServerToClient = {
    socketError: (data: { error: string }) => void;
    discussionMessage: (data: Zvyezda.Client.DiscussionMessage) => void;
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
    ['/account/get-profile']: () => {
      id: string;
      username: string;
      email: string;
      avatar?: string | null;
      role: string;
    };
    ['/account/get-accounts']: () => {
      accounts: {
        id: string;
        username: string;
        email: string;
        role: string;
        createdAt: string;
      }[];
    };
    ['/account/delete-account']: () => {};
    ['/account/edit-account']: () => {};

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

    /* DISCUSSION */
    ['/discussion/get-messages']: () => {
      messages: Zvyezda.Client.DiscussionMessage[];
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
