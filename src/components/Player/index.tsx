import Image from 'next/image';
import { usePlayer } from '../../contexts/PlayerContext';
import styles from './styles.module.scss';
import Slider from 'rc-slider';

import 'rc-slider/assets/index.css';
import { useEffect, useRef } from 'react';

export function Player() {
  const {
    currentEpisodeIndex,
    episodeList,
    isPlaying,
    togglePlay,
    setPlayingState,
  } = usePlayer();

  const audioRef = useRef<HTMLAudioElement>(null);

  const episode = episodeList[currentEpisodeIndex];

  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="Tocando agora" />
        <strong>Tocando agora {episode?.title}</strong>
      </header>

      {episode ? (
        <div className={styles.currentEpisode}>
          <Image
            width={592}
            height={592}
            src={episode.thumbnail}
            objectFit="cover"
          />
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>
      )}

      <footer className={!episode ? styles.empty : ''}>
        {episode && (
          <audio
            ref={audioRef}
            src={episode.url}
            autoPlay
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
          />
        )}

        <div className={styles.progress}>
          <span>00:00</span>
          <div className={styles.slider}>
            {episode ? (
              <Slider
                trackStyle={{ backgroundColor: '#04d361' }}
                railStyle={{ backgroundColor: '#5E67C4' }}
                handleStyle={{ borderWidth: 4, borderColor: '#5E67C4' }}
              />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>
          <span>00:00</span>
        </div>
        <div className={styles.buttons}>
          <button type="button" disabled={!episode}>
            <img src="/shuffle.svg" alt="Embaralhar" />
          </button>
          <button type="button" disabled={!episode}>
            <img src="/play-previous.svg" alt="Tocar anterior" />
          </button>

          <button
            type="button"
            className={styles.playButton}
            onClick={togglePlay}
            disabled={!episode}
          >
            {isPlaying ? (
              <img src="/pause.svg" alt="Pausar" />
            ) : (
              <img src="/play.svg" alt="Tocar" />
            )}
          </button>

          <button type="button" disabled={!episode}>
            <img src="/play-next.svg" alt="Tocar próxima" />
          </button>
          <button type="button" disabled={!episode}>
            <img src="/repeat.svg" alt="Repetir" />
          </button>
        </div>
      </footer>
    </div>
  );
}
