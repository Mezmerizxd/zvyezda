import { IconButton } from './styled';

export default ({ text, margin, padding, onClick, icon }: Zvyezda.Client.Buttons.IconButtonProps) => {
  return (
    <IconButton onClick={onClick} style={{ margin: margin, padding: padding }}>
      {icon}
      {text}
    </IconButton>
  );
};
