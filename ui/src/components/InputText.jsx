import { useContext } from 'react';
import { useField } from 'informed';
import classnames from 'classnames';
import { Input } from './StoryBook/Input/InputStyled';
import { Label } from './Typography/Label';
import { ThemeContext } from 'styled-components';
import { useTheme } from '@mui/material/styles';

const InputText = ({
  field,
  label,
  required,
  onChange,
  placeholder,
  errorMessage = [],
  ...props
}) => {
  const { fieldState, fieldApi, render } = useField({ field });
  const theme = useTheme();
  const themes = useContext(ThemeContext);

  return render(
    <div
      style={{
        width: '100%',
        marginTop: '1rem'
      }}
    >
      {label && (
        <Label
          className={classnames({ required, 'has-error': fieldState.error })}
          htmlFor={field}
          label={label}
          variant="smallBold"
          color={theme.color?.primary.main}
        />
      )}
      <Input
        id={field}
        name={field}
        className={classnames('form-control', {
          'has-error': fieldState.error
        })}
        value={fieldState.value || ''}
        onChange={(e) => {
          fieldApi.setValue(e.target.value);
          fieldApi.setError(null);
          if (onChange) {
            onChange(e.target.value);
          }
        }}
        {...props}
      />
      {errorMessage &&
        errorMessage.map((data) => (
          <small className={data ? 'text-danger' : null}>{data}</small>
        ))}
    </div>
  );
};

export default InputText;
