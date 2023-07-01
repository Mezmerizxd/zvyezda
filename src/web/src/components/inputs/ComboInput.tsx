import { Input } from './styled';

export default ({
  placeholder,
  icon,
  options,
  margin,
  padding,
}: {
  placeholder: string;
  icon?: any;
  options: { value: string; text: string }[];
  margin?: string;
  padding?: string;
}) => {
  return (
    <Input icon={icon} style={{ margin: margin, padding: padding }}>
      {icon && <div className="Icon">{icon}</div>}
      <div className="InputField">
        <select name="test" id="test" required>
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
