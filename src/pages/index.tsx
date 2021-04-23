import { GetStaticProps } from 'next';
import Image from 'next/image';
import api from '../services/api';
import { formatarData, secondsToTimeString } from '../helpers/utils';
import styles from './home.module.scss';

import Link from 'next/link';
import { usePlayer } from '../contexts/PlayerContext';

interface EpisodeProps {
  id: string;
  title: string;
  members: string;
  publishedAt: string;
  duration: string;
  durationAsString: string;
  url: string;
  thumbnail: string;
}
interface HomeProps {
  latestEpisodes: EpisodeProps[];
  episodes: EpisodeProps[];
}
const Home = (props: HomeProps) => {
  const { episodes, latestEpisodes } = props;
  const { play } = usePlayer();
  return (
    <div className={styles.container}>
      <section className={styles.latestEpisodes}>
        <h2>Ultimos lançamentos</h2>
        <ul>
          {latestEpisodes.map((episode) => (
            <li key={episode.id}>
              <Image
                width={192}
                height={192}
                src={episode.thumbnail}
                alt={episode.title}
                objectFit="cover"
              />
              <div className={styles.episodeDetails}>
                <Link href={`/episodes/${episode.id}`}>
                  <a>{episode.title}</a>
                </Link>

                <p>{episode.members}</p>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
              </div>
              <button
                type="button"
                title="Tocar episódio"
                onClick={() => play(episode)}
              >
                <img src="/play-green.svg" alt="Tocar episódio" />
              </button>
            </li>
          ))}
        </ul>
      </section>
      <section className={styles.allEpisodes}>
        <h2>Todos os episódios</h2>
        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {episodes.map((episode) => (
              <tr key={episode.id}>
                <td
                  style={{
                    width: 72,
                  }}
                >
                  <Image
                    width={120}
                    height={120}
                    src={episode.thumbnail}
                    alt={episode.title}
                    objectFit="cover"
                  />
                </td>
                <td>
                  <Link href={`/episodes/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>
                </td>
                <td>{episode.members}</td>
                <td
                  style={{
                    width: 120,
                  }}
                >
                  {episode.publishedAt}
                </td>
                <td>{episode.durationAsString}</td>
                <td>
                  <button
                    type="button"
                    title="Tocar episódio"
                    onClick={() => play(episode)}
                  >
                    <img src="/play-green.svg" alt="Tocar episódio" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get(`episodes`, {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc',
    },
  });

  const episodes = data.map((episode: any) => {
    return {
      id: episode.id,
      title: episode.title,
      members: episode.members,
      publishedAt: formatarData(episode.published_at, 'd MMM y'),
      duration: Number(episode.file.duration),
      durationAsString: secondsToTimeString(episode.file.duration),
      url: episode.file.url,
      thumbnail: episode.thumbnail,
    };
  });
  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.lenght);
  return {
    props: {
      latestEpisodes,
      episodes: allEpisodes,
    },
    revalidate: 60 * 60 * 8,
    // revalidate:
  };
};
