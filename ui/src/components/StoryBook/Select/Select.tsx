import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SelectProps } from './SelectTypes';
import {
  ArrowIcon,
  SelectWrapper,
  SelectListDivContainer
} from './SelectStyle';
import Filter from './SearchInput';
import InputSelect from './SelectInput';
import { Label } from '../../Typography/Label';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import classnames from 'classnames';

const Select: React.FC<SelectProps> = ({
  label,
  subLabel,
  options = [],
  value,
  disabled = false,
  required = false,
  placeholder,
  setValue,
  children,
  filterOnchange,
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [cleanValue, setCleanValue] = useState<boolean>(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const selectListRef = useRef<HTMLDivElement>(null);
  const isVisible = true;

  const controlLabelColor = () => (disabled ? 'textColorLight' : 'main');
  const controlSubLabelColor = () => (disabled ? 'textColorLight' : 'medium');

  const toggleDropdown = useCallback(() => {
    if (!disabled) {
      setIsOpen(prevIsOpen => !prevIsOpen);
    }
  }, [disabled]);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        isOpen &&
        selectListRef.current &&
        !selectListRef.current.contains(event.target as Node) &&
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    },
    [isOpen]
  );

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [handleClickOutside]);

  useEffect(() => {
    if (value || value === '') {
      toggleDropdown();
    }
  }, [value, toggleDropdown]);


  useEffect(() => {
    if (cleanValue === true && value) {
      setCleanValue(false);
    }
  }, [cleanValue, value]);

  const handleSelectOption = (selectedValue: string) => {
    if (setValue) {
      setValue(selectedValue);
    }
    setIsOpen(false);
  };

  return (
    <>
      <div className={classnames({ required })}>
        {label && (
          <Label
            style={{ textAlign: 'left', marginTop: '1rem' }}
            label={label}
            color={controlLabelColor()}
            variant="smallBold"
          />
        )}
      </div>
      <div style={{ width: '100%' }}>
        <SelectWrapper
          disabled={disabled}
          required={required}
          value={value}
          onClick={toggleDropdown}
          ref={selectRef}
        >
          <InputSelect
            value={cleanValue ? '' : value}
            disabled={disabled}
            required={required}
            placeholder={placeholder}
          />
          <ArrowIcon disabled={disabled} required={required}>
            <i
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                margin: '0px',
              }}
            >
              <FontAwesomeIcon icon={faCaretDown} style={{ width: 16, height: 16 }} />
            </i>
          </ArrowIcon>
        </SelectWrapper>
        {subLabel && (
          <Label
            label={subLabel}
            variant="captionLight"
            color={controlSubLabelColor()}
          />
        )}
        {isOpen && (
          <SelectListDivContainer isOpen={isOpen} ref={selectListRef}>
            {filterOnchange && (
              <Filter onChange={filterOnchange.onChange} isVisible={isVisible} />
            )}
            {options.map(option => (
              <div
                key={option.value}
                onClick={() => handleSelectOption(option.value)}
              >
                {option.label}
              </div>
            ))}
            {children}
          </SelectListDivContainer>
        )}
      </div>
    </>
  );
};

export default Select;
