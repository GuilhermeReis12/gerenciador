import React, { useContext } from 'react';
import { useField } from 'informed';
import Select from 'react-select';
import classnames from 'classnames';
import { get } from 'lodash';
import { Label } from './Typography/Label';
import { ThemeContext } from 'styled-components';
import { useTheme } from '@mui/material/styles';

const InputSelect = ({
  field,
  label,
  onChange,
  required,
  options,
  ...props
}) => {
  const { fieldState, fieldApi, render } = useField({ field });
  const { value } = fieldState;
  const { setValue, setError, setTouched } = fieldApi;
  const theme = useTheme();
  const error = get(fieldState, 'error', []);
  const hasError = Array.isArray(error) && error.length > 0;

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      height: '56px'
    })
  };

  return render(
    <div style={{ width: '100%' }}>
      <Label
        style={{ textAlign: 'left' }}
        label={label}
        variant="smallBold"
        className={classnames({ required, 'has-error': hasError })}
        color={theme.color?.primary.main}
      />
      <Select
        onChange={(value) => {
          if (value) {
            setValue(value.value);
          } else {
            setValue([]);
          }
          setError(null);
          setTouched();

          if (onChange) onChange(value);
        }}
        styles={customStyles}
        value={options.filter((option) => option.value === value)}
        noOptionsMessage={() => 'Nenhum resultado encontrado.'}
        placeholder="Selecione"
        options={options}
        {...props}
      />
      {error.map((e) => (
        <p key={e} className="text-danger">
          {e}
        </p>
      ))}
    </div>
  );
};

InputSelect.defaultProps = {
  placeholder: 'Selecione',
  loadingMessage: () => 'Carregando...'
};

export default InputSelect;
