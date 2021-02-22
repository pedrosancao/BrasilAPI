/**
 * Tabela da lua cheia de Páscoa, valida entre 1900 e 2199, inclusive
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
 * Formata a data para meia noite, houveram alguns problemas com fuso
 * horário e toLocaleString() causando a exibição da data anterior.
 *
 * @param Date date
 * @return string
 */
function formatDateToMidnight(date) {
  const formatedDay = `0${date.getDate()}`.substr(-2);
  const formatedMonth = `0${date.getMonth() + 1}`.substr(-2);
  return `${date.getFullYear()}-${formatedMonth}-${formatedDay} 00:00:00`;
}

/**
 * Cálculo de feriados móveis baseados na Páscoa
 *
 * @see https://en.wikipedia.org/wiki/Computus
 */
function computus(year) {
  if (year < 1900 || year > 2199) {
    throw new Error('Cannot calculate holidays.');
  }
  const pascalFullMoonMonthDay = getPascalFullMoonDates();
  const [refMonth, refDay] = pascalFullMoonMonthDay[year % 19];
  const refDate = new Date(year, refMonth, refDay);
  const holidays = [];
  refDate.setDate(refDate.getDate() + 7 - refDate.getDay());
  holidays.push({
    date: formatDateToMidnight(refDate),
    name: 'Páscoa',
  });
  refDate.setDate(refDate.getDate() - 2);
  // Sexta feira Santa / Paixão de Cristo não é feriado nacional
  refDate.setDate(refDate.getDate() - 45);
  holidays.push({
    date: formatDateToMidnight(refDate),
    name: 'Carnaval',
  });
  refDate.setDate(refDate.getDate() + 107);
  holidays.push({
    date: formatDateToMidnight(refDate),
    name: 'Corpus Christi',
  });
  return holidays;
}

/**
 * Combina feriados móveis e fixos.
 *
 * Lei n° 6.802 de 30/06/1980
 * - Nossa Senhora Aparecida
 * Lei n° 662 de 06/04/1949
 * - Confraternização mundial
 * - Tiradentes
 * - Dia do trabalho
 * - Independência do Brasil
 * - Finados
 * - Proclamação da República
 * - Natal
 *
 * Referência de https://github.com/pagarme/business-calendar/tree/master/src/brazil
 */
function getNacionalHolidaysUnordered(year) {
  const holidays = computus(year);
  holidays.push(
    {
      date: `${year}-01-01 00:00:00`,
      name: 'Confraternização mundial',
    },
    {
      date: `${year}-04-21 00:00:00`,
      name: 'Tiradentes',
    },
    {
      date: `${year}-05-01 00:00:00`,
      name: 'Dia do trabalho',
    },
    {
      date: `${year}-09-07 00:00:00`,
      name: 'Independência do Brasil',
    },
    {
      date: `${year}-10-12 00:00:00`,
      name: 'Nossa Senhora Aparecida',
    },
    {
      date: `${year}-11-02 00:00:00`,
      name: 'Finados',
    },
    {
      date: `${year}-11-15 00:00:00`,
      name: 'Proclamação da República',
    },
    {
      date: `${year}-12-25 00:00:00`,
      name: 'Natal',
    }
  );
  return holidays;
}

function sortByDate(holidays) {
  return holidays.sort((a, b) => {
    if (a.date > b.date) {
      return 1;
    }
    if (a.date < b.date) {
      return -1;
    }
    return 0;
  });
}

export default function getNacionalHolidays(year) {
  const holidays = getNacionalHolidaysUnordered(year);
  return sortByDate(holidays);
}
