import { useState } from 'react';
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
  const [inputValue, setValue] = useState(null);

  return (
    <Input
      icon={icon}
      dateEmpty={type === 'date' && inputValue === null ? true : false}
      style={{ margin: margin, padding: padding }}
    >
      {icon && <div className="Icon">{icon}</div>}
      <div className="InputField">
        <input
          type={type}
          placeholder={placeholder}
          onChange={(e) => {
            setValue(e.target.value);
            onChange && onChange(e);
          }}
          value={value}
          disabled={disabled}
        />
      </div>
    </Input>
  );
};
