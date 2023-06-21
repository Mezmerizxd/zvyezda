import { StandardButton } from './styled';

export default ({ text, margin, padding, onClick }: Zvyezda.Client.Buttons.StandardButtonProps) => {
  return (
    <StandardButton onClick={onClick} style={{ margin: margin, padding: padding }}>
      {text}
    </StandardButton>
  );
};
