declare namespace Zvyezda {}

declare namespace Zvyezda.Client {
  type RootState = ReturnType<typeof store.getState>;
  type AppDispatch = typeof store.dispatch;
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
  type IconInputProps = {
    type: string;
    placeholder?: string;
    icon: any;
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
