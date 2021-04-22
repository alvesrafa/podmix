import { parseISO, format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

export const formatarData = (date: any, formatDate: string) => {
  if (typeof date === 'string')
    return format(parseISO(date), formatDate, {
      locale: ptBR,
    });
  return format(date, formatDate, {
    locale: ptBR,
  });
};

export const secondsToTimeString = (time: any) => {
  if (!time) return '00:00:00';

  let duration = 0;

  if (typeof time === 'string') duration = Number(time);
  else duration = time;

  const hours = Math.floor(duration / (60 * 60));
  const minutes = Math.floor((duration % (60 * 60)) / 60);
  const seconds = duration % 60;

  const finalResult = [hours, minutes, seconds]
    .map((unit) => String(unit).padStart(2, '0'))
    .join(':');

  return finalResult;
};
