import clsx from 'clsx';
import { UseFormRegisterReturn } from 'react-hook-form';

import { FieldWrapper, FieldWrapperPassThroughProps } from './FieldWrapper';

type TextAreaFieldProps = FieldWrapperPassThroughProps & {
  className?: string;
  registration: Partial<UseFormRegisterReturn>;
};

export const TextAreaField = (props: TextAreaFieldProps) => {
  const { label, className, registration, error } = props;
  return (
    <FieldWrapper label={label} error={error}>
      <textarea
        className={clsx(
          'appearance-none block w-full px-3 py-2 border border-background-light bg-background-dark rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-zvyezda-light focus:border-zvyezda-light sm:text-sm',
          className,
        )}
        {...registration}
      />
    </FieldWrapper>
  );
};
