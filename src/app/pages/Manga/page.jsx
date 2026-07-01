"use client";
import React, { useEffect, useState } from "react";
import { FetchMangaList } from "@/hooks/useApi";
import HomeCarousel from "@/components/Manga/HomeCarousel";
import ReusableCarousel from "@/components/Manga/ReusableCarousel";
import MangaTable from "@/components/Manga/MangaTable";
import ReusableStack from "@/components/Manga/ReusableCardStacks";
import { mangaDataCarousel, mangaData, moreMangaData } from "@/lib/fallbackData";
import { readCache, writeCache } from "@/lib/clientCache";

const CACHE_KEY = "home:manga";

const Manga = () => {
  const [mangaList, setMangaList] = useState(mangaDataCarousel.mangaList);
  const [newestData, setNewestData] = useState(
    moreMangaData.mangaList.slice(11, 23)
  );
  const [latestData, setLatestData] = useState(
    mangaData.mangaList.slice(12, 23)
  );
  const [tableData, setTableData] = useState([
    moreMangaData.mangaList.slice(0, 10),
    moreMangaData.mangaList.slice(11, 21),
    mangaData.mangaList.slice(0, 10),
    mangaData.mangaList.slice(11, 21),
  ]);

  useEffect(() => {
    const apply = (d) => {
      if (!d) return;
      setMangaList(d.mangaList);
      setNewestData(d.newestData);
      setLatestData(d.latestData);
      setTableData(d.tableData);
    };

    const cached = readCache(CACHE_KEY);
    if (cached) apply(cached);

    const loadData = async () => {
      const data = await FetchMangaList(1);
      const NewData = await FetchMangaList(2);
      if (!data?.mangaList?.length) return;
      const payload = {
        mangaList: data.mangaList.slice(0, 11),
        newestData: NewData.mangaList.slice(11, 23),
        latestData: data.mangaList.slice(12, 23),
        tableData: [
          data.mangaList.slice(0, 10),
          data.mangaList.slice(11, 21),
          NewData.mangaList.slice(0, 10),
          NewData.mangaList.slice(11, 21),
        ],
      };
      apply(payload);
      writeCache(CACHE_KEY, payload);
    };
    loadData();
  }, []);

  return (
    <div className="flex flex-col gap-10 px-10 max-md:px-2 bg-custom">
      <HomeCarousel data={mangaList} />
      <ReusableCarousel title={"Trending"} data={newestData} />
      <ReusableCarousel title={"Popular"} data={latestData} />
      <ReusableStack data={tableData} title={"Top Reads"} />
      <MangaTable data={tableData} />
    </div>
  );
};

export default Manga;
