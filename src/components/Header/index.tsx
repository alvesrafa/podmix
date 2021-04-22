import { formatarData } from '../../helpers/utils';
import styles from './styles.module.scss';
interface HeaderProps {}

export function Header({}: HeaderProps) {
  const currentDate = formatarData(new Date(), 'EEEEEE, d MMMM');

  return (
    <header className={styles.headerContainer}>
      <img src="/logo.svg" alt="Logo PodMix" />

      <p>O melhor para você ouvir, sempre.</p>
      <span>{currentDate}</span>
    </header>
  );
}
