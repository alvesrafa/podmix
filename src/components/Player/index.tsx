import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Slider from 'rc-slider';

import { usePlayer } from '../../contexts/PlayerContext';
import { secondsToTimeString } from '../../helpers/utils';

import styles from './styles.module.scss';
import 'rc-slider/assets/index.css';

export function Player() {
  const {
    currentEpisodeIndex,
    episodeList,
    isPlaying,
    togglePlay,
    setPlayingState,
    playNext,
    playPrevious,
    isLooping,
    toggleLooping,
    isShuffling,
    toggleShuffling,
  } = usePlayer();
  const audioRef = useRef<HTMLAudioElement>(null);

  const [progress, setProgress] = useState(0);

  const episode = episodeList[currentEpisodeIndex];

  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const setupProgress = () => {
    if (!audioRef?.current) return;

    audioRef.current.currentTime = 0;

    audioRef.current.addEventListener('timeupdate', () => {
      const time = Math.floor(audioRef.current?.currentTime ?? 0);
      setProgress(time);
    });
  };
  const handleSeek = (amount: number) => {
    if (!audioRef?.current) return;

    audioRef.current.currentTime = amount;
    setProgress(amount);
  };
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
            onEnded={playNext}
            loop={isLooping}
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
            onLoadedMetadataCapture={setupProgress}
          />
        )}

        <div className={styles.progress}>
          <span>{secondsToTimeString(progress)}</span>
          <div className={styles.slider}>
            {episode ? (
              <Slider
                trackStyle={{ backgroundColor: '#04d361' }}
                railStyle={{ backgroundColor: '#5E67C4' }}
                handleStyle={{ borderWidth: 4, borderColor: '#5E67C4' }}
                max={episode.duration}
                value={progress}
                onChange={handleSeek}
              />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>
          <span>{secondsToTimeString(episode?.duration ?? 0)}</span>
        </div>
        <div className={styles.buttons}>
          <button
            type="button"
            disabled={!episode || episodeList.length === 1}
            className={isShuffling ? styles.isActive : ''}
            onClick={toggleShuffling}
          >
            <img src="/shuffle.svg" alt="Embaralhar" />
          </button>
          <button
            type="button"
            disabled={!episode || episodeList.length === 1}
            onClick={playPrevious}
          >
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

          <button
            type="button"
            disabled={!episode || episodeList.length === 1}
            onClick={playNext}
          >
            <img src="/play-next.svg" alt="Tocar próxima" />
          </button>

          <button
            type="button"
            disabled={!episode}
            className={isLooping ? styles.isActive : ''}
            onClick={toggleLooping}
          >
            <img src="/repeat.svg" alt="Repetir" />
          </button>
        </div>
      </footer>
    </div>
  );
}
