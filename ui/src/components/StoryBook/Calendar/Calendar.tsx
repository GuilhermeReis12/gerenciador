import { useState, useEffect, useCallback, useMemo } from 'react';
import { CalendarProps } from './CalendarTypes';
import {
  CalendarBoddy,
  CalendarHeader,
  CalendarButton,
  CalendarWeekDays,
  CalendarWeekLabel,
  CalendarWeek,
  CalendarEmptyDay,
  CalendarDayButton,
  ToDayDiv,
  DivMonthYear,
  DivButton,
  ButtonToDay,
  MonthContariner,
  MonthGrid,
  MonthElement,
  MonthButton,
  MarkedDay
} from './CalendarStyled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Label } from '../../Typography/Label';

export const Calendar = ({
  introDate,
  markedFullDateFunction,
  markedDayFunction,
  markedMonthFunction,
  markedYearFunction,
  getLoadToDay = false,
  getEventKeybord,
  ...props
}: CalendarProps) => {
  const padZero = (num: number) => (num < 10 ? `0${num}` : `${num}`);

  const currentDateNoFormat = new Date();

  const currentDay = currentDateNoFormat.getDate();
  const currentMonth = currentDateNoFormat.getMonth() + 1;
  const currentYear = currentDateNoFormat.getFullYear();
  const currentDate = `${padZero(currentDay)}/${padZero(
    currentMonth
  )}/${currentYear}`;

  const [day, setDay] = useState(padZero(currentDay));
  const [month, setMonth] = useState(currentMonth);
  const [monthString, setMonthString] = useState(padZero(currentMonth));
  const [year, setYear] = useState(currentYear);
  const [listYear, setListYear] = useState(currentYear);

  const [markedDay, setMarkedDay] = useState<string | Date>();
  const [emptyDays, setEmptyDays] = useState<any>([]);

  const [typeCalendarBody, setTypeCalendarBody] = useState<string>('day');

  useEffect(() => {
    const primeiroDiaSemana = new Date(year, month - 1, 1).getDay();
    setEmptyDays(Array(primeiroDiaSemana).fill(null));
  }, [year, month]);

  useEffect(() => {
    if (markedFullDateFunction) {
      markedFullDateFunction(markedDay);
    }
    if (markedDayFunction) {
      markedDayFunction(day);
    }
    if (markedMonthFunction) {
      markedMonthFunction({ name: monthToYear[month], numberMonth: month });
    }
    if (markedYearFunction) {
      markedYearFunction(year);
    }
  });

  useEffect(() => {
    if (getLoadToDay) {
      setMarkedDay(`${day}/${monthString}/${year}`);
    }
  }, [getLoadToDay, day, monthString, year]);

  const monthToYear = useMemo(
    () => [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro'
    ],
    []
  );

  const daysWeek = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  const daysMonth = () => {
    const days = [];
    const lastDay = new Date(year, month, 0).getDate();

    for (let dia = 1; dia <= lastDay; dia++) {
      days.push(dia);
    }

    return days;
  };

  const convertToDate = useCallback(
    (value: string | number) => {
      let date = new Date();

      if (typeof value === 'string') {
        const splitChar = value.includes('-') ? '-' : '/';
        const [day, month, year] = value.split(splitChar);
        date = new Date(`${month}/${day}/${year}`);
      } else if (value) {
        date = new Date(value);
      }

      const convetDay = String(date.getDate()).padStart(2, '0');
      const convetMonth = String(date.getMonth() + 1).padStart(2, '0'); // Os meses são indexados a partir de 0
      const convetYear = date.getFullYear();

      const formattedDate = `${convetDay}/${convetMonth}/${convetYear}`;

      setDay(convetDay);

      setMonthString(convetMonth);
      setMonth(date.getMonth() + 1);

      setYear(convetYear);
      setMarkedDay(formattedDate);

      markedFullDateFunction && markedFullDateFunction(formattedDate);
      markedDayFunction && markedDayFunction(date.getDate());
      markedMonthFunction &&
        markedMonthFunction({
          name: monthToYear[date.getMonth()],
          numberMonth: date.getMonth() + 1
        });
      markedYearFunction && markedYearFunction(convetYear);
    },
    [
      setDay,
      setMonthString,
      setMonth,
      setYear,
      setMarkedDay,
      markedFullDateFunction,
      markedDayFunction,
      markedMonthFunction,
      markedYearFunction,
      monthToYear
    ]
  );

  useEffect(() => {
    if (!introDate) {
      return;
    }

    const introDateLength = introDate.toString().length;
    const isBackspace = getEventKeybord?.key === 'Backspace';
    const canMarkFullDate = typeof markedFullDateFunction === 'function';

    if (introDateLength >= 10) {
      if (isBackspace && canMarkFullDate) {
        markedFullDateFunction(introDate);
        setMarkedDay('');
      } else {
        convertToDate(introDate);
      }
    } else if (canMarkFullDate) {
      markedFullDateFunction(introDate);

      if (introDateLength === 1 && isBackspace) {
        setMarkedDay('');
      }
    }
  }, [introDate, convertToDate, getEventKeybord?.key, markedFullDateFunction]);

  const marcarDia = (valueDay: number) => {
    const convertDay = valueDay < 10 ? `0${valueDay}` : `${valueDay}`;
    const fullDate = `${convertDay}/${monthString}/${year}`;

    if (fullDate === markedDay) {
      setMarkedDay('');
      markedFullDateFunction && markedFullDateFunction('');
    } else {
      setMarkedDay(fullDate);
      markedFullDateFunction && markedFullDateFunction(fullDate);
      setDay(convertDay);
      markedDayFunction && markedDayFunction(convertDay);
    }
  };

  const manipulateMonth = (action: string, value?: number) => {
    let newMonth = month;
    let newYear = year;

    if (action === 'next') {
      if (month < 12) {
        newMonth = month + 1;
      } else {
        newMonth = 1;
        newYear = year + 1;
      }
    } else if (action === 'prev') {
      if (month > 1) {
        newMonth = month - 1;
      } else {
        newMonth = 12;
        newYear = year - 1;
      }
    } else if (action === 'chageMonth' && value) {
      newMonth = value;
    } else if (value && action === 'chageYear') {
      newYear = value;
    }

    const paddedMonth = newMonth < 10 ? '0' + newMonth : '' + newMonth;
    setMonth(newMonth);
    setYear(newYear);
    setMonthString(paddedMonth);

    if (markedMonthFunction) {
      markedMonthFunction({
        name: monthToYear[newMonth],
        numberMonth: newMonth
      });
    }
    if (markedYearFunction) {
      markedYearFunction(newYear);
    }
    if (markedFullDateFunction) {
      markedFullDateFunction(`${day}/${paddedMonth}/${newYear}`);
    }
  };

  const changeListYear = (value: string) => {
    if (value === 'prev') {
      var yearList = listYear - 28;
      setListYear(yearList < 1 ? 1 : yearList);
    } else if (value === 'next') {
      setListYear(listYear + 28);
    }
  };

  const getYears = () => {
    var startYear = year !== listYear ? listYear : year;
    var years = [];
    for (let index = 0; index < 28; index++) {
      years.push(startYear++);
    }

    return years;
  };

  const toDay = () => {
    var equality = true;
    if (currentDate !== markedDay) {
      equality = false;
    }

    return equality;
  };

  const setCurrentDate = () => {
    const convertDay = currentDay < 10 ? `0${currentDay}` : `${currentDay}`;
    const convertMonth =
      currentMonth < 10 ? `0${currentMonth}` : `${currentMonth}`;

    setMarkedDay(currentDate);
    setDay(convertDay);

    setMonth(currentMonth);
    setMonthString(convertMonth);

    setYear(currentYear);
    setListYear(currentYear);

    if (markedFullDateFunction) {
      markedFullDateFunction(`${convertDay}/${convertMonth}/${currentYear}`);
    }
    if (markedDayFunction) {
      markedDayFunction(convertDay);
    }
    if (markedMonthFunction) {
      markedMonthFunction({
        name: monthToYear[new Date().getMonth()],
        numberMonth: currentMonth
      });
    }
    if (markedYearFunction) {
      markedYearFunction(currentYear);
    }
  };

  const bodyCalendar = () => {
    switch (typeCalendarBody) {
      case 'month': {
        return (
          <MonthContariner>
            <MonthGrid>
              {monthToYear?.map((value, index) => (
                <MonthElement key={`Month/${index}`}>
                  <MonthButton
                    onClick={() => {
                      setTypeCalendarBody('day');
                      manipulateMonth('chageMonth', index + 1);
                    }}
                    clicked={month === index + 1}
                  >
                    <div style={{}}>{value}</div>
                  </MonthButton>
                </MonthElement>
              ))}
            </MonthGrid>
          </MonthContariner>
        );
      }
      case 'year': {
        return (
          <MonthContariner>
            <MonthGrid>
              {getYears()?.map((value) => (
                <MonthElement key={`year/${value}`}>
                  <MonthButton
                    onClick={() => {
                      setYear(value);
                      setTypeCalendarBody('day');
                      manipulateMonth('chageYear', value);
                    }}
                    clicked={year === value}
                  >
                    <div style={{}}>{value}</div>
                  </MonthButton>
                </MonthElement>
              ))}
            </MonthGrid>
          </MonthContariner>
        );
      }
      default: {
        return (
          <div role="grid">
            <CalendarWeekDays>
              {daysWeek.map((dia, index) => (
                <CalendarWeekLabel key={`DaysWewk-${index}`}>
                  <Label label={dia} variant="body1" color="#A2A2A2" />
                </CalendarWeekLabel>
              ))}
            </CalendarWeekDays>

            <CalendarWeek>
              {emptyDays.map((_: any, index: number) => (
                <CalendarEmptyDay key={`empty/${index}`} />
              ))}
              {daysMonth().map((dia) => (
                <CalendarDayButton
                  key={`Day/${dia}`}
                  onClick={() => marcarDia(dia)}
                >
                  <MarkedDay
                    markedDayVerify={
                      `${dia < 10 ? '0' + dia : dia}/${monthString}/${year}` ===
                      `${markedDay}`
                    }
                  >
                    {dia}
                  </MarkedDay>
                </CalendarDayButton>
              ))}
            </CalendarWeek>
          </div>
        );
      }
    }
  };

  const headerBody = () => {
    if (typeCalendarBody === 'year') {
      return (
        <>
          <CalendarButton onClick={() => changeListYear('prev')}>
            <FontAwesomeIcon icon="chevron-left" size="xs" />
          </CalendarButton>

          <ToDayDiv>
            <DivMonthYear toDay={toDay()}>
              <DivButton
                onClick={() => {
                  setTypeCalendarBody(
                    typeCalendarBody === 'year' ? 'day' : 'year'
                  );
                  setListYear(year);
                }}
              >
                <Label label={`${listYear}`} variant="smallBold" color="main" />
              </DivButton>
              <div>
                <Label label={'/'} variant="smallBold" color="main" />
              </div>
              <DivButton
                onClick={() => {
                  setTypeCalendarBody(
                    typeCalendarBody === 'year' ? 'day' : 'year'
                  );
                  setListYear(year);
                }}
              >
                <Label
                  label={`${listYear + 27}`}
                  variant="smallBold"
                  color="main"
                />
              </DivButton>
            </DivMonthYear>
            {!toDay() && (
              <div>
                <ButtonToDay
                  onClick={() => {
                    setCurrentDate();
                  }}
                >
                  <Label
                    label={'Hoje'}
                    variant="smallBold"
                    color="textColorWhite"
                  />
                </ButtonToDay>
              </div>
            )}
          </ToDayDiv>

          <CalendarButton onClick={() => changeListYear('next')}>
            <FontAwesomeIcon icon="chevron-right" size="xs" />
          </CalendarButton>
        </>
      );
    } else {
      return (
        <>
          <CalendarButton onClick={() => manipulateMonth('prev')}>
            <FontAwesomeIcon icon="chevron-left" size="xs" />
          </CalendarButton>

          <ToDayDiv>
            <DivMonthYear toDay={toDay()}>
              <DivButton
                onClick={() => {
                  setTypeCalendarBody(
                    typeCalendarBody === 'month' ? 'day' : 'month'
                  );
                }}
              >
                <Label
                  label={`${monthToYear[month - 1]}`}
                  variant="smallBold"
                  color="main"
                />
              </DivButton>
              <div>
                <Label label={'/'} variant="smallBold" color="main" />
              </div>
              <DivButton
                onClick={() => {
                  setTypeCalendarBody(
                    typeCalendarBody === 'year' ? 'day' : 'year'
                  );
                  setListYear(year);
                }}
              >
                <Label label={`${year}`} variant="smallBold" color="main" />
              </DivButton>
            </DivMonthYear>
            {!toDay() && (
              <div>
                <ButtonToDay
                  onClick={() => {
                    setCurrentDate();
                  }}
                >
                  <Label
                    label={'Hoje'}
                    variant="smallBold"
                    color="textColorWhite"
                  />
                </ButtonToDay>
              </div>
            )}
          </ToDayDiv>

          <CalendarButton onClick={() => manipulateMonth('next')}>
            <FontAwesomeIcon icon="chevron-right" size="xs" />
          </CalendarButton>
        </>
      );
    }
  };

  return (
    <CalendarBoddy>
      <CalendarHeader>{headerBody()}</CalendarHeader>

      <div style={{ width: '100%', paddingRight: '24px' }}>
        <hr style={{ color: '#A2A2A2', height: '1px' }} />
      </div>

      {bodyCalendar()}
    </CalendarBoddy>
  );
};
