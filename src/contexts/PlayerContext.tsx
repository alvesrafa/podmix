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
  play: (episode: any) => any;
}
interface PlayerContextProviderProps {
  children: ReactNode;
}

const PlayerContext = createContext({} as PlayerContextProps);

export function PlayerProvider({ children }: PlayerContextProviderProps) {
  const [episodeList, setEpisodeList] = useState<any>([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);

  const play = (episode: any) => {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
  };

  return (
    <PlayerContext.Provider value={{ currentEpisodeIndex, episodeList, play }}>
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => useContext(PlayerContext);
