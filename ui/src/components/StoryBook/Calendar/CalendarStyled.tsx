import styled from '@emotion/styled/macro';
import { ButtonCalendarPropsKey } from './CalendarTypes';

export const CalendarBoddy = styled('div')`
  background: #f3f8f9;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10.74px;
  display: flex;
  flex-direction: column;
  font-family: Arial, sans-serif;
  height: 405.45px;
  margin: 0px auto;
  min-width: 357px;
`;

export const CalendarHeader = styled('div')`
  display: flex;
  justify-content: space-between;
  -webkit-box-align: center;
  align-items: center;
  margin-top: 16px;
  margin-bottom: 8px;
  padding-left: 24px;
  padding-right: 24px;
  max-height: 30px;
  min-height: 30px;
`;

export const ToDayDiv = styled('div')<ButtonCalendarPropsKey>((props) => {
  return {
    display: 'flex ',
    alignItems: 'center',
    justifyContent: 'center'
  };
});
export const DivMonthYear = styled('div')<ButtonCalendarPropsKey>((props) => {
  return {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: `${props.toDay ? '' : '1rem'}`
  };
});

export const CalendarButton = styled('button')`
  cursor: pointer;
  display: inline-flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  position: relative;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
  background-color: transparent;
  outline: 0px;
  border: 0px;
  cursor: pointer;
  user-select: none;
  vertical-align: middle;
  appearance: none;
  text-decoration: none;
  text-align: center;
  flex: 0 0 auto;
  font-size: 1rem;
  padding: 8px;
  border-radius: 50%;
  overflow: visible;
  color: #1e984f;
`;

export const CalendarButtonLabel = styled('span')`
  width: 11px;
  height: 6.33px;
  font-size: 20px;
  top: 2.37px;
  left: 10.83px;
`;

export const CalendarWeekLabel = styled('span')`
  width: 36px;
  height: 40px;
  margin: 0px 2px;
  text-align: center;
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
`;

export const CalendarWeekDays = styled('div')`
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
  width: 100%;
  gap: 10px;
`;

export const CalendarDays = styled('div')`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  padding: 10px;
`;

export const CalendarWeek = styled('div')`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
  padding: 10px;
  font-size: 20px;
`;

export const CalendarEmptyDay = styled('div')`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  padding: 0px;
  background-color: transparent;
  transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  color: rgb(255, 255, 255);
  margin: 0px 2px;
  opacity: 0;
  pointer-events: none;
`;

export const CalendarDayButton = styled('button')`
  display: inline-flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  position: relative;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
  outline: 0px;
  border: 0px;
  cursor: pointer;
  user-select: none;
  vertical-align: middle;
  appearance: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  padding: 0px;
  background-color: transparent;
  margin: 0px 2px;
`;

export const DivButton = styled('div')`
  cursor: pointer;
`;

export const ButtonToDay = styled('button')`
  background: ${(props) => '#1E984F'};
  border: none;
  border-radius: 0.5rem;
  padding: 0.25rem 0.5rem;
  cursor: pointer;

  &:hover {
    background: ${(props) => '#4CC170'};
  }

  &:focus:focus-visible {
    outline: 2px solid #f673ad;
  }
`;

export const MonthContariner = styled('div')`
  display: flex;
  position: relative;
  opacity: 1;
  transition: opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  width: 100%;
  height: 100%;
  justify-content: center;
`;

export const MonthGrid = styled('div')`
  display: flex;
  flex-flow: wrap;
  overflow-y: auto;
  height: 100%;
  padding: 0px 4px;
  width: 320px;
  max-height: 280px;
  box-sizing: border-box;
  position: relative;
`;

export const MonthElement = styled('div')`
  flex-basis: 25%;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
`;

export const MonthButton = styled('button')<ButtonCalendarPropsKey>((props) => {
  return {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: `${props.clicked ? '#1E984F' : 'none'}`,
    border: '0',
    borderRadius: '4px',
    width: '72px',
    height: '36px',
    cursor: 'pointer',
    color: `${props.clicked ? 'white' : '#1E984F'}`,

    '&:hover': {
      background: `${!props.clicked ? '#0F6D47' : '#A0D3A6'} fixed`,
      color: 'white'
    }
  };
});

export const MarkedDay = styled('div')<ButtonCalendarPropsKey>((props) => {
  if (props.markedDayVerify) {
    return {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '21.512px',
      width: '35px',
      height: '35px',
      border: `0.896px solid #D4EBD1`,
      background: `#D4EBD1`
    };
  } else {
    return {
      color: `#262626`,
      textAlign: 'center',
      fontFamily: 'Inter',
      fontSize: '14.341px',
      fontStyle: 'normal',
      fontWeight: 400,
      lineHeight: '21.512px'
    };
  }
});
