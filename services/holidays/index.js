/**
 * Tabela da lua cheia de Páscoa, valida entre 1900 e 2199 inclusive
 */
function getPascalFullMoonDates() {
  return [
    [3, 14],
    [3, 3],
    [2, 23],
    [3, 11],
    [2, 31],
    [3, 18],
    [3, 8],
    [2, 28],
    [3, 16],
    [3, 5],
    [2, 25],
    [3, 13],
    [3, 2],
    [2, 22],
    [3, 10],
    [2, 30],
    [3, 17],
    [3, 7],
    [2, 27],
  ];
}

/**
 * Cálculo de feriados móveis baseados na Páscoa
 *
 * @see https://en.wikipedia.org/wiki/Computus
 */
function computus(year) {
  const pascalFullMoonMonthDay = getPascalFullMoonDates();
  const goldenNumber = year % 19;
  const [refMonth, refDay] = pascalFullMoonMonthDay[goldenNumber];
  const refDate = new Date(year, refMonth, refDay);
  const holidays = Array(12)
    .fill('')
    .map(() => []);
  refDate.setDate(refDate.getDate() + 7 - refDate.getDay());
  holidays[refDate.getMonth()][refDate.getDate()] = ['Páscoa'];
  refDate.setDate(refDate.getDate() - 2);
  holidays[refDate.getMonth()][refDate.getDate()] = ['Paixão de Cristo'];
  refDate.setDate(refDate.getDate() - 45);
  holidays[refDate.getMonth()][refDate.getDate()] = ['Carnaval'];
  refDate.setDate(refDate.getDate() + 107);
  holidays[refDate.getMonth()][refDate.getDate()] = ['Corpus Christi'];
  return holidays;
}

/**
 * Combina feriados móveis e fixos.
 *
 * Referência de https://github.com/pagarme/business-calendar/tree/master/src/brazil
 */
function getNacionalHolidaysByMonth(year) {
  if (year < 1900 || year > 2199) {
    throw new Error('Cannot calculate holidays.');
  }
  const holidays = computus(year);
  holidays[0][1] = ['Confraternização mundial'];
  holidays[3][21] = ['Tiradentes'];
  holidays[4][1] = ['Dia do trabalho'];
  holidays[8][7] = ['Independência do Brasil'];
  holidays[9][12] = ['Nossa Senhora Aparecida'];
  holidays[10][2] = ['Finados'];
  holidays[10][15] = ['Proclamação da República'];
  holidays[11][25] = ['Natal'];
  return holidays;
}

export default function getNacionalHolidays(year) {
  return getNacionalHolidaysByMonth(year).reduce(
    (holidays, monthData, month) =>
      holidays.concat(
        monthData.reduce((monthHolidays, names, day) => {
          return monthHolidays.concat(
            names.map((name) => {
              const formatedDay = `0${day}`.substr(-2);
              const formatedMonth = `0${month + 1}`.substr(-2);
              return {
                date: `${year}-${formatedMonth}-${formatedDay} 00:00:00`,
                name,
              };
            })
          );
        }, [])
      ),
    []
  );
}
