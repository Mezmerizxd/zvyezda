import { Input } from './styled';

export default ({
  type,
  placeholder,
  icon,
  margin,
  padding,
  onChange,
  value,
  disabled,
}: Zvyezda.Client.Inputs.InputProps) => {
  return (
    <Input icon={icon} style={{ margin: margin, padding: padding }}>
      {icon && <div className="Icon">{icon}</div>}
      <div className="InputField">
        <input type={type} placeholder={placeholder} onChange={onChange} value={value} disabled={disabled} />
      </div>
    </Input>
  );
};
