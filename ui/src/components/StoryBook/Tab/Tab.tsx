import React, { useEffect, useState, useContext } from 'react';
import { Container, Tabs } from './TabStyled';

export type TabProps = {
  borderColor?: string;
  color?: string;
  tabs?: any[];
  setValue?: React.Dispatch<React.SetStateAction<any>>;
  defaultValue?: number;
  disabled?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

const Tab = ({
  borderColor,
  color,
  tabs,
  setValue,
  defaultValue,
  disabled,
  ...props
}: TabProps) => {
  const [value, setValor] = useState<number | undefined>(defaultValue);

  const handleTab = (i: number) => {
    setValue && setValue(i);
    setValor(i);
  };

  useEffect(() => {
    if (disabled) {
      setValor(undefined);
    }
  }, [disabled]);

  return (
    <Container disabled={disabled}>
      {tabs &&
        tabs.map((res: any, i) => (
          <Tabs
            key={`tab-${res.title}`}
            active={i === value}
            onClick={() => {
              handleTab(i);
            }}
          >
            {res.title}
          </Tabs>
        ))}
    </Container>
  );
};

export default Tab;
