import { IconInput } from './styled';

export default ({
  type,
  placeholder,
  icon,
  margin,
  padding,
  onChange,
  value,
  disabled,
}: Zvyezda.Client.Inputs.IconInputProps) => {
  return (
    <IconInput style={{ margin: margin, padding: padding }}>
      <div className="Icon">{icon}</div>
      <div className="InputField">
        <input type={type} placeholder={placeholder} onChange={onChange} value={value} disabled={disabled} />
      </div>
    </IconInput>
  );
};
