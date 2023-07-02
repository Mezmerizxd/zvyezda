declare namespace Zvyezda {}

declare namespace Zvyezda.Client {
  type RootState = ReturnType<typeof store.getState>;
  type AppDispatch = typeof store.dispatch;

  type CreateHackedXbox = {
    title: string;
    description: string;
    serialNumber: string;
    xboxType: string;
    xboxColour: string;
    motherboardType: string;
    nandSize: string;
    mfrDate: string;
    model: string;
    rghVersion: string;
    rghGlitchType: string;
  };
}

declare namespace Zvyezda.Client.Reducers {
  type GlobalState = {
    session: {
      connected: boolean;
      token: string;
    };
    home: {
      page: number;
    };
    dashboard: {
      sidebar: boolean;
      context: number;
      serverVersion: string;
      clientVersion: string;
    };
  };
}

declare namespace Zvyezda.Client.Styled {
  interface ColorData {
    hex: string;
    rgb?: string;
    rawRgb?: [r: number, g: number, b: number];
  }

  interface Theme {
    colors: Record<string, ColorData>;
    text: Record<string, ColorData>;
  }
}

declare namespace Zvyezda.Client.Buttons {
  type StandardButtonProps = {
    text: string;
    margin?: string;
    padding?: string;
    onClick?: () => void;
  };

  type IconButtonProps = {
    text: string;
    icon: any;
    margin?: string;
    padding?: string;
    onClick?: () => void;
  };
}

declare namespace Zvyezda.Client.Inputs {
  type InputProps = {
    type: string;
    placeholder?: string;
    icon?: any;
    margin?: string;
    padding?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value?: string;
    disabled?: boolean;
  };
}

declare namespace Zvyezda.Client.Models {
  interface NavigationProductsProps {
    name: string;
    description: string;
    href: () => void;
    icon: any;
  }
  interface NavigationCallsToActionProps {
    name: string;
    href: () => void;
    icon: any;
  }

  interface SidebarItemActionProps {
    id: number;
    title: string;
    icon: React.ReactNode;
  }
  interface SidebarItemProps {
    id: string;
    title: string;
    actions: SidebarItemActionProps[];
  }
  interface SidebarProps {
    items: SidebarItemProps[];
  }

  type ProjectProps = Zvyezda.Client.Data.GithubProjects;
}

declare namespace Zvyezda.Client.Data {
  interface GithubProjects {
    project: string;
    title: string;
    description: string | string[];
    image: string;
    links: IconType[];
  }
}
