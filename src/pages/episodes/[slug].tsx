import Link from 'next/link';
import { useRouter } from 'next/router';
import { GetStaticPaths, GetStaticProps } from 'next';
import { formatarData, secondsToTimeString } from '../../helpers/utils';
import api from '../../services/api';
import styles from './episode.module.scss';
import Image from 'next/image';
import { usePlayer } from '../../contexts/PlayerContext';
import Head from 'next/head';
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
  const { play, isPlaying } = usePlayer();

  if (router.isFallback) {
    return <p>Carregando...</p>;
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>{episode.title} | PodMix</title>
      </Head>
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
        <button onClick={() => play(episode)}>
          {isPlaying ? (
            <img src="/pause.svg" alt="Pausar" />
          ) : (
            <img src="/play.svg" alt="Tocar" />
          )}
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
  // por convenção é bom passar os "episodios" que são mais acessados
  const { data } = await api.get(`episodes`, {
    params: {
      _limit: 2,
      _sort: 'published_at',
      _order: 'desc',
    },
  });
  // No caso estamos passando os ultios 2 episodios lançados
  const paths = data.map((episode: any) => {
    return {
      params: {
        slug: episode.id,
      },
    };
  });

  return {
    paths,
    // --------------------------- FALLBACK TYPES -------------------
    // -> true: para carregamento no client
    // -> 'blocking': pára carregamento no node
    // -> false: para retornar status 400 caso n tenha passado no path
    fallback: 'blocking', // -> incremental static regeneration
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
