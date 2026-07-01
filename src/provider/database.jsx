"use client";
import React, { createContext, useState, useContext, useEffect } from "react";

const UserDataContext = createContext();

export const useUserData = () => useContext(UserDataContext);

export default function DataProvider({ children }) {
  const [currentlyWatching, setCurrentlyWatching] = useState([]);
  const [currentlyReading, setCurrentlyReading] = useState([]);

  useEffect(() => {
    try {
      setCurrentlyWatching(
        JSON.parse(localStorage.getItem("currentlyWatching")) || []
      );
      setCurrentlyReading(
        JSON.parse(localStorage.getItem("currentlyReading")) || []
      );
    } catch {
      setCurrentlyWatching([]);
      setCurrentlyReading([]);
    }
  }, []);

  const persist = (key, value, setter) => {
    setter(value);
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      return;
    }
  };

  const addAnimeEpisode = (
    animeId,
    animeTitle,
    episodeTitle,
    episodeImage,
    currentEpisode,
    totalEpisodes,
    currentProgress,
    totalProgress
  ) => {
    const entry = {
      animeId,
      animeTitle,
      episodeTitle,
      episodeImage,
      currentEpisode,
      totalEpisodes,
      currentProgress,
      totalProgress,
    };
    const rest = currentlyWatching.filter((a) => a.animeId !== animeId);
    persist("currentlyWatching", [entry, ...rest], setCurrentlyWatching);
  };

  const addMangaChapter = (
    mangaId,
    mangaTitle,
    mangaImage,
    chapterId,
    chapterName,
    currentChapter,
    totalChapters
  ) => {
    const entry = {
      mangaId,
      mangaTitle,
      mangaImage,
      chapterId,
      chapterName,
      currentChapter,
      totalChapters,
    };
    const rest = currentlyReading.filter((m) => m.mangaId !== mangaId);
    persist("currentlyReading", [entry, ...rest], setCurrentlyReading);
  };

  const removeAnime = (animeId) =>
    persist(
      "currentlyWatching",
      currentlyWatching.filter((a) => a.animeId !== animeId),
      setCurrentlyWatching
    );

  const removeManga = (mangaId) =>
    persist(
      "currentlyReading",
      currentlyReading.filter((m) => m.mangaId !== mangaId),
      setCurrentlyReading
    );

  const contextValue = {
    currentlyWatching,
    currentlyReading,
    addAnimeEpisode,
    addMangaChapter,
    removeAnime,
    removeManga,
  };

  return (
    <UserDataContext.Provider value={contextValue}>
      {children}
    </UserDataContext.Provider>
  );
}
