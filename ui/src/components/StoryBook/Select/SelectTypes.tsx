export interface SelectProps {
  label?: string;
  subLabel?: string;
  options?: { value: string; label: string; }[]; 
  onClick?: () => void; 
  key?: number;
  value?: string | number | undefined; 
  children?:any;
  header?: any;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  filterOnchange?: any; 
  setValue?: (value: string) => void; 
}

export interface SelectInputProps {
  onClick?: () => void;
  value?: string | number | undefined; 
  name?: string;
  disabled?: boolean;
  required?: boolean;
  hasError?: boolean;
  placeholder?: string;
}

export interface ListItemProps {
  options?: { value: string; label: string; }[]; 
  onClick: (value: string) => void; 
  value?: string | number | undefined;
  children?: any;
  onSelect?: any; 
  id?: any;
}

export interface FilterProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isVisible: boolean;
}

export interface SelectStyleProps {
  test?: string;
  isOpen?: boolean;
  name?: string;
  value?: string | number | undefined; 
  disabled?: boolean;
  required?: boolean;
  label?: string;
  isVisible?: boolean;
}

export type SelectPropsKey = SelectProps;
export type SelectStylePropsKey = SelectStyleProps;
