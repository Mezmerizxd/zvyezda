import clsx from 'clsx';
import { UseFormRegisterReturn } from 'react-hook-form';

import { FieldWrapper, FieldWrapperPassThroughProps } from './FieldWrapper';

type InputFieldProps = FieldWrapperPassThroughProps & {
  type?: 'text' | 'email' | 'password';
  className?: string;
  defaultValue?: string;
  disabled?: boolean;
  registration: Partial<UseFormRegisterReturn>;
};

export const InputField = (props: InputFieldProps) => {
  const { type = 'text', label, className, defaultValue, disabled, registration, error } = props;
  return (
    <FieldWrapper label={label} error={error}>
      <input
        type={type}
        defaultValue={props.defaultValue}
        disabled={props.disabled}
        className={clsx(
          'appearance-none block w-full px-3 py-2 border border-background-light bg-background-dark rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-radiance-light focus:border-radiance-light sm:text-sm',
          className,
        )}
        {...registration}
      />
    </FieldWrapper>
  );
};
