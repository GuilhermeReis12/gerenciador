import React, { useState, useEffect, useCallback, useContext, ChangeEvent } from 'react';
import { FilterCardProps } from './FilterCardTypes';
import {
  ContainerCardFilter,
  ContainerTitle,
  ContainerInput
} from './FilterCardStyled';
import Select from '../Select/Select';
import { api } from '../../../utils/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ListItem from '../Select/ListItem';
import { Label } from '../../Typography/Label';
import { Input } from '../Input/InputStyled';

export const FilterCard: React.FC<FilterCardProps> = ({
  filterField,
  label,
  apiUrl,
  context,
  inputType
}) => {
  const { setFilters } = useContext(context);
  const [options, setOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [selectedOption, setSelectedOption] = useState<{ value: string; label: string } | null>(null);
  const [inputValue, setInputValue] = useState<string>('');

  const renderOptions = useCallback(() => {
    if (!filterField) return;
    api.get(`${apiUrl}?${filterField}`).then((response) => {
      if (response.data && response.data.results) {
        setOptions(response.data.results.map((result: any) => ({
          value: result.id_cliente,
          label: result.id_pessoa_juridica_fk.tx_razao_social
        })));
      }
    }).catch((error) => {
      console.error('Error fetching data:', error);
    });
  }, [filterField, apiUrl]);

  useEffect(() => {
    if (inputType === 'select') {
      renderOptions();
    }
  }, [renderOptions, filterField, inputType]);

  const handleChange = (name: string, value: string) => {
    setFilters((prevState: any) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setInputValue(value);
    handleChange(filterField, value);
  };

  return (
    <ContainerCardFilter>
      <ContainerTitle>
        <i style={{ display: 'flex', alignItems: 'center' }}>
          <FontAwesomeIcon
            icon="filter"
            style={{ width: 20, height: 20, marginRight: '10px' }}
            color="#4759FF"
          />
        </i>
        <Label
          label={label}
          color="textColorLighter"
          style={{ fontWeight: 700, fontSize: '20px' }}
        />
      </ContainerTitle>
      {filterField && (
        <ContainerInput>
          {inputType === 'text' ? (
            <Input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder={`Digite o ${label.toLowerCase()}`}
              style={{ width: '248px', padding: '10px', marginBottom: '10px', height: '40px' }}
            />
          ) : (
            <Select
              name={filterField}
              value={selectedOption?.label || ''}
              label={label}
              placeholder={`Selecione o ${label.toLowerCase()}`}
            >
              <ListItem
                onClick={() => handleChange(filterField, '')}
                options="Limpar filtro"
              />
              {options &&
                options.map((option, index) => (
                  <ListItem
                    key={index}
                    onClick={() => {
                      setSelectedOption(option);
                      handleChange(filterField, option.value);
                    }}
                    options={option.label}
                  />
                ))}
            </Select>
          )}
        </ContainerInput>
      )}
    </ContainerCardFilter>
  );
};
