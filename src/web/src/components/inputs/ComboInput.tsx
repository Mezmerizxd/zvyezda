import { Input } from './styled';

export default ({
  placeholder,
  icon,
  options,
  onChange,
  margin,
  padding,
}: {
  placeholder: string;
  icon?: any;
  options: { value: string; text: string }[];
  onChange?: (e: any) => void;
  margin?: string;
  padding?: string;
}) => {
  return (
    <Input icon={icon} style={{ margin: margin, padding: padding }}>
      {icon && <div className="Icon">{icon}</div>}
      <div className="InputField">
        <select
          name={placeholder}
          id={placeholder}
          required
          onChange={(e) => {
            onChange && onChange(e);
          }}
        >
          <option id="placeholder" value="" disabled selected hidden>
            {placeholder}
          </option>
          {options.map((option) => {
            return <option value={option.value}>{option.text}</option>;
          })}
        </select>
      </div>
    </Input>
  );
};
