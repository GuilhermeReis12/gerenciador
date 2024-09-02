import { useContext, useState, useCallback, ChangeEvent, useRef } from 'react';
import { InputProps } from './InputTypes';
import {
  InputBox,
  InputStyled,
  InputBoxAdornmentLefet,
  InputBoxAdornmentRigth,
  CalendarDivContainer,
  CalendarDivContent
} from './InputStyled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTheme } from '@mui/material/styles';
import { ThemeContext } from 'styled-components';
import Button from '../Button/Button';
import { Label } from '../../Typography/Label';
import { Calendar } from '../Calendar/Calendar';
import classnames from 'classnames';

/**
 * Primary UI component for user interaction
 */
const Input = ({
  className,
  disabled = false,
  onChange,
  label,
  placeholder,
  subLabel,
  required = false,
  type = 'text',
  value,
  inputAdornmentLeft,
  inputAdornmentRigth,
  name,
  errorMessage = [],
  ...props
}: InputProps) => {
  const theme = useTheme();
  const themes = useContext(ThemeContext);

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const colors = (value: string) => {
    switch (value) {
      case 'main':
        return theme.color?.primary.main || themes?.color.primary.main;
      case 'dark':
        return theme.color?.primary.dark || themes?.color.primary.dark;
      case 'light':
        return theme.color?.primary.light || themes?.color.primary.light;
      case 'disabled':
        return theme.color?.primary.disabled || themes?.color.primary.disabled;
      case 'medium':
        return theme.color?.secondary.medium || themes?.color.secondary.medium;
      case 'lighter':
        return (
          theme.color?.secondary.lighter || themes?.color.secondary.lighter
        );
      case 'lightest':
        return (
          theme.color?.secondary.lightest || themes?.color.secondary.lightest
        );
      case 'lightest2':
        return (
          theme.color?.secondary.lightest2 || themes?.color.secondary.lightest2
        );
      case 'greenAlt':
        return (
          theme.color?.secondary.greenAlt || themes?.color.secondary.greenAlt
        );
      case 'ei':
        return (
          theme.color?.indicatorColor.ei || themes?.color.indicatorColor.ei
        );
      case 'ef1':
        return (
          theme.color?.indicatorColor.ef1 || themes?.color.indicatorColor.ef1
        );
      case 'ef2':
        return (
          theme.color?.indicatorColor.ef2 || themes?.color.indicatorColor.ef2
        );
      case 'em':
        return (
          theme.color?.indicatorColor.em || themes?.color.indicatorColor.em
        );
      case 'eja':
        return (
          theme.color?.indicatorColor.eja || themes?.color.indicatorColor.eja
        );
      case 'informative':
        return (
          theme.color?.feedbackColor.informative ||
          themes?.color.feedbackColor.informative
        );
      case 'warning':
        return (
          theme.color?.feedbackColor.warning ||
          themes?.color.feedbackColor.warning
        );
      case 'error':
        return (
          theme.color?.feedbackColor.error || themes?.color.feedbackColor.error
        );
      case 'sucess':
        return (
          theme.color?.feedbackColor.sucess ||
          themes?.color.feedbackColor.sucess
        );
      case 'textColorBlack':
        return theme.color?.textColor.black || themes?.color.textColor.black;
      case 'textColorDarkest':
        return (
          theme.color?.textColor.darkest || themes?.color.textColor.darkest
        );
      case 'textColorDark':
        return theme.color?.textColor.dark || themes?.color.textColor.dark;
      case 'textColorLight':
        return theme.color?.textColor.light || themes?.color.textColor.light;
      case 'textColorLighter':
        return (
          theme.color?.textColor.lighter || themes?.color.textColor.lighter
        );
      case 'textColorWhite':
        return theme.color?.textColor.white || themes?.color.textColor.white;
      default:
        return value;
    }
  };

  //#region controle Style
  const controlLabelColor = () => {
    if (disabled) {
      return 'textColorLight';
    } else {
      return 'main';
    }
  };

  const controlSubLabelColor = () => {
    if (disabled) {
      return 'textColorLight';
    } else {
      return 'medium';
    }
  };

  const controlColorIconLeft = () => {
    if (disabled) {
      return theme.color?.textColor.light || themes?.color.textColor.light;
    } else if (type === 'form-group') {
      return theme.color?.textColor.white || themes?.color.textColor.white;
    } else if (required && !value) {
      return (
        theme.color?.feedbackColor.error || themes?.color.feedbackColor.error
      );
    } else if (inputAdornmentLeft?.iconColor) {
      return colors(inputAdornmentLeft?.iconColor);
    } else {
      return theme.color?.primary.main || themes?.color.primary.main;
    }
  };

  const controlColorIconRigth = () => {
    if (disabled) {
      return theme.color?.textColor.light || themes?.color.textColor.light;
    } else if (type === 'form-group') {
      return theme.color?.textColor.white || themes?.color.textColor.white;
    } else if (required && !value) {
      return (
        theme.color?.feedbackColor.error || themes?.color.feedbackColor.error
      );
    } else if (inputAdornmentRigth?.iconColor) {
      return colors(inputAdornmentRigth?.iconColor);
    } else {
      return theme.color?.primary.main || themes?.color.primary.main;
    }
  };
  //#endregion

  //#region Data
  const [data, setData] = useState<string | number>('');
  const [eventData, seEventData] = useState<React.KeyboardEvent>();

  const setDataCallback = useCallback(setData, [setData]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Backspace') {
      seEventData(event);
    }
  };

  function getDaysInMonth(month: number, year: number) {
    return new Date(year, month, 0).getDate();
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    let { value } = e.target;

    if (value.length > 10) {
      value = value.slice(0, 10);
    }

    value = value.replace(/\D/g, '');
    value = value.replace(/(\d{2})(\d)/, '$1/$2');
    value = value.replace(/(\d{2})(\d)/, '$1/$2');

    const day = parseInt(value.substring(0, 2));
    const month = parseInt(value.substring(3, 5));
    const year = new Date().getFullYear();

    const lastDayOfMonth = getDaysInMonth(month, year);

    if (day > lastDayOfMonth) {
      value = value.replace(
        /(\d{2})/,
        lastDayOfMonth.toString().padStart(2, '0')
      );
    }

    if (month > 12) {
      value = value.replace(/\/(\d{2})/, '/12');
    }

    e.target.value = value;
    setData(value);
  };
  //#endregion

  //#region File
  const fileInputField = useRef<HTMLInputElement>(null);
  const placeholderFieldConst = value ? value : placeholder;
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    // @ts-ignore
    onChange(e);
  };

  //#endregion

  const adornmentLefet = () => {
    if (type === 'form-group' && inputAdornmentLeft?.icon) {
      return (
        <InputBoxAdornmentLefet required={required} value={value}>
          <i
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              margin: '0px'
            }}
          >
            <FontAwesomeIcon
              icon={inputAdornmentLeft?.icon}
              style={{ width: 20, height: 20 }}
              color={controlColorIconLeft()}
            />
          </i>
        </InputBoxAdornmentLefet>
      );
    } else if (inputAdornmentLeft?.icon) {
      return (
        <i style={{ display: 'flex', alignItems: 'center' }}>
          <FontAwesomeIcon
            icon={inputAdornmentLeft?.icon}
            style={{ width: 20, height: 20 }}
            color={controlColorIconLeft()}
          />
        </i>
      );
    } else {
      return <>{inputAdornmentLeft?.custonAdornment}</>;
    }
  };

  const adornmentRigth = () => {
    if (type === 'form-group' && inputAdornmentRigth?.icon) {
      return (
        <InputBoxAdornmentRigth required={required} value={value}>
          <i
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              margin: '0px'
            }}
          >
            <FontAwesomeIcon
              icon={inputAdornmentRigth?.icon}
              style={{ width: 20, height: 20 }}
              color={controlColorIconRigth()}
            />
          </i>
        </InputBoxAdornmentRigth>
      );
    } else if (type === 'input-button' && inputAdornmentRigth?.buttonAdorment) {
      return (
        <Button
          variant="primary"
          disabled={disabled}
          onClick={() => {
            if (fileInputField.current) {
              fileInputField.current.click();
            }
          }}
        >
          {inputAdornmentRigth?.buttonAdorment?.buttonAdormentLabel}
        </Button>
      );
    } else if (type === 'file' && inputAdornmentRigth?.buttonAdorment) {
      return (
        <Button
          variant="primary"
          disabled={disabled}
          onClick={() => {
            if (fileInputField.current) {
              fileInputField.current.click();
            }
          }}
        >
          {inputAdornmentRigth?.buttonAdorment?.buttonAdormentLabel}
        </Button>
      );
    } else if (inputAdornmentRigth?.icon) {
      return (
        <i style={{ display: 'flex', alignItems: 'center' }}>
          <FontAwesomeIcon
            icon={inputAdornmentRigth?.icon}
            style={{ width: 20, height: 20 }}
            color={controlColorIconRigth()}
          />
        </i>
      );
    } else if (type === 'calendar') {
      return (
        <i style={{ display: 'flex', alignItems: 'center' }}>
          <FontAwesomeIcon
            icon="calendar-days"
            style={{ width: 20, height: 20 }}
            onClick={() => {
              setIsOpen(!isOpen);
            }}
            color={controlColorIconRigth()}
          />
        </i>
      );
    } else {
      return (
        <InputBoxAdornmentRigth required={required} value={value}>
          {inputAdornmentRigth?.custonAdornment}
        </InputBoxAdornmentRigth>
      );
    }
  };

  return (
    <>
      <div className={classnames({ required })}>
        {label && (
          <Label
            label={label}
            variant="smallBold"
            style={{ marginTop: '1rem' }}
            color={controlLabelColor()}
          />
        )}
      </div>
      <InputBox
        required={required}
        disabled={disabled}
        type={type}
        value={value}
        name={name}
        placeholder={`${placeholderFieldConst}`}
      >
        {inputAdornmentLeft && adornmentLefet()}

        <InputStyled
          disabled={disabled}
          placeholder={placeholder}
          name={name}
          required={required}
          type={type}
          onChange={
            type === 'calendar'
              ? handleInputChange
              : type === 'file'
                ? handleFileChange
                : onChange
          }
          value={type === 'calendar' ? data : type === 'file' ? '' : value}
          onKeyDown={handleKeyDown}
          ref={fileInputField}
          {...props}
        />
        {inputAdornmentRigth && adornmentRigth()}
        {type === 'calendar' && adornmentRigth()}
      </InputBox>

      {errorMessage &&
        errorMessage.map((data) => (
          <small className={classnames(data ? 'text-danger' : null)}>
            {data}
          </small>
        ))}
      {type === 'calendar' && (
        <CalendarDivContainer isOpen={isOpen}>
          <CalendarDivContent isOpen={isOpen}>
            <Calendar
              introDate={data}
              markedFullDateFunction={setDataCallback}
              getEventKeybord={eventData}
            />
          </CalendarDivContent>
        </CalendarDivContainer>
      )}
      {subLabel && (
        <Label
          label={subLabel}
          variant="captionLight"
          color={controlSubLabelColor()}
        />
      )}
    </>
  );
};

export default Input;
