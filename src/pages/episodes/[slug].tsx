import Link from 'next/link';
import { GetStaticPaths, GetStaticProps } from 'next';
import { formatarData, secondsToTimeString } from '../../helpers/utils';
import api from '../../services/api';
import styles from './episode.module.scss';
import Image from 'next/image';
import { useRouter } from 'next/dist/client/router';

interface EpisodeProps {
  id: string;
  title: string;
  members: string;
  publishedAt: string;
  duration: string;
  durationAsString: string;
  description: string;
  url: string;
  thumbnail: string;
}
interface EpisodePageProps {
  episode: EpisodeProps;
}

export default function Episode(props: EpisodePageProps) {
  const { episode } = props;
  const router = useRouter();

  return (
    <div className={styles.container}>
      <div className={styles.thumbContainer}>
        <Link href="/">
          <button>
            <img src="/arrow-left.svg" alt="Voltar" />
          </button>
        </Link>
        <Image
          width={700}
          height={160}
          src={episode.thumbnail}
          objectFit="cover"
        />
        <button>
          <img src="/play.svg" alt="Tocar episódio" />
        </button>
      </div>
      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.durationAsString}</span>
      </header>
      <div
        className={styles.description}
        dangerouslySetInnerHTML={{ __html: episode.description }}
      />
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { slug } = ctx.params as any;

  const { data } = await api.get(`episodes/${slug}`);

  const episode = {
    id: data.id,
    title: data.title,
    members: data.members,
    publishedAt: formatarData(data.published_at, 'd MMM y'),
    duration: Number(data.file.duration),
    durationAsString: secondsToTimeString(data.file.duration),
    description: data.description,
    url: data.file.url,
    thumbnail: data.thumbnail,
  };

  return {
    props: {
      episode,
    },
    revalidate: 60 * 60 * 24, // 24 horas
    // revalidate:
  };
};
