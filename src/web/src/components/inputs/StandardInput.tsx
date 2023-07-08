import { useState } from 'react';
import { Input } from './styled';

export default ({
  id,
  type,
  placeholder,
  icon,
  margin,
  padding,
  onChange,
  onKeyDown,
  value,
  disabled,
}: Zvyezda.Client.Inputs.InputProps) => {
  const [inputValue, setValue] = useState(value);

  return (
    <Input
      id={id}
      icon={icon}
      dateEmpty={
        type === 'date' && (inputValue === null || inputValue === '' || inputValue === undefined ? true : false)
      }
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
          onKeyDown={(e) => {
            onKeyDown && onKeyDown(e);
          }}
          value={type === 'date' ? inputValue : value}
          disabled={disabled}
        />
      </div>
    </Input>
  );
};
