import { SelectListItem } from './ListItemStyle';
import { ListItemProps } from './SelectTypes';

const ListItem = ({ options, onClick, value }: ListItemProps) => {
  return (
    <SelectListItem value={value} onClick={onClick}>
      {options}
    </SelectListItem>
  );
};

export default ListItem;
