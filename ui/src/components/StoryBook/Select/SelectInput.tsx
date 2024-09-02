import { SelectInput } from './SelectStyle';
import { SelectInputProps } from './SelectTypes';

const InputSelect = ({
  onClick,
  disabled,
  required,
  placeholder,
  value
}: SelectInputProps) => {
  return (
    <SelectInput
      type="text"
      placeholder={placeholder}
      onClick={onClick}
      value={value}
      disabled={disabled}
      required={required}
    />
  );
};

export default InputSelect;
