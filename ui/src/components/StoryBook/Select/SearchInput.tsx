import { SearchInput } from './SearchInputStyle';
import { FilterProps } from './SelectTypes';

const Filter = ({ onChange, isVisible }: FilterProps) => {
  return (
    <SearchInput
      type="text"
      placeholder="Placeholder"
      onChange={onChange}
      isVisible={isVisible}
    />
  );
};

export default Filter;
