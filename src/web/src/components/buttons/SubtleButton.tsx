import { SubtleButton } from './styled';

export default ({ text, margin, padding, onClick }: Zvyezda.Client.Buttons.StandardButtonProps) => {
  return (
    <SubtleButton onClick={onClick} style={{ margin: margin, padding: padding }}>
      {text}
    </SubtleButton>
  );
};
