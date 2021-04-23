import { createContext, ReactNode, useContext, useState } from 'react';

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
  play: (episode: any) => any;
  togglePlay: () => any;
  setPlayingState: (value: boolean) => any;
}
interface PlayerContextProviderProps {
  children: ReactNode;
}

const PlayerContext = createContext({} as PlayerContextProps);

export function PlayerProvider({ children }: PlayerContextProviderProps) {
  const [episodeList, setEpisodeList] = useState<any>([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

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

  return (
    <PlayerContext.Provider
      value={{
        currentEpisodeIndex,
        episodeList,
        play,
        isPlaying,
        togglePlay,
        setPlayingState,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => useContext(PlayerContext);
