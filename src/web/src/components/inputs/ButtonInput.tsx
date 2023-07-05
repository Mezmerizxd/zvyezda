import { useState } from 'react';
import { TripleInput } from './styled';

export default ({
  id,
  type,
  placeholder,
  icon,
  margin,
  padding,
  onChange,
  value,
  disabled,
  buttons,
}: {
  id?: string;
  type: string;
  placeholder: string;
  icon: any;
  margin?: string;
  padding?: string;
  onChange?: any;
  value?: string;
  disabled?: boolean;
  buttons?: {
    icon: any;
    onClick: any;
  }[];
}) => {
  const [inputValue, setValue] = useState(value);

  return (
    <TripleInput id={id} icon={icon} style={{ margin: margin, padding: padding }}>
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
      {buttons &&
        buttons.map((button, index) => {
          return (
            <div key={index} className="Button" onClick={button.onClick}>
              {button.icon}
            </div>
          );
        })}
    </TripleInput>
  );
};
