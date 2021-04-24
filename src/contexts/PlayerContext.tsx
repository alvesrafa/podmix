import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

interface Episode {
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
}
interface PlayerContextProps {
  episodeList: Episode[];
  currentEpisodeIndex: number;
  isPlaying: boolean;
  play: (episode: any) => void;
  playList: (list: any, index: number) => void;
  togglePlay: () => void;
  setPlayingState: (value: boolean) => void;

  playNext: () => void;
  playPrevious: () => void;
  toggleLooping: () => void;
  isLooping: boolean;
  toggleShuffling: () => void;
  isShuffling: boolean;
}
interface PlayerContextProviderProps {
  children: ReactNode;
}

const PlayerContext = createContext({} as PlayerContextProps);

export function PlayerProvider({ children }: PlayerContextProviderProps) {
  const [episodeList, setEpisodeList] = useState<any>([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const play = (episode: any) => {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  };
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };
  const setPlayingState = (state: boolean) => {
    setIsPlaying(state);
  };

  const playList = (list: Episode[], index: number) => {
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  };
  const playNext = () => {
    let nextEpisodeIndex = currentEpisodeIndex + 1;
    if (nextEpisodeIndex >= episodeList.length) setCurrentEpisodeIndex(0);

    nextEpisodeIndex = isShuffling
      ? Math.floor(Math.random() * episodeList.length)
      : nextEpisodeIndex;

    setCurrentEpisodeIndex(nextEpisodeIndex);
  };
  const playPrevious = () => {
    if (currentEpisodeIndex >= 0)
      setCurrentEpisodeIndex(currentEpisodeIndex + 1);
    else setCurrentEpisodeIndex(episodeList.lenght - 1);
  };

  const toggleLooping = () => {
    setIsLooping(!isLooping);
  };
  const toggleShuffling = () => {
    setIsShuffling(!isShuffling);
  };
  return (
    <PlayerContext.Provider
      value={{
        currentEpisodeIndex,
        episodeList,
        play,
        isPlaying,
        togglePlay,
        setPlayingState,
        playList,
        playNext,
        playPrevious,
        toggleLooping,
        isLooping,
        isShuffling,
        toggleShuffling,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => useContext(PlayerContext);
