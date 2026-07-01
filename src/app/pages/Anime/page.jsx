"use client";
import React, { useEffect, useState } from "react";
import BigCarousel from "@/components/BigCarousel";
import ReusableCarousel from "@/components/ReusableCarousel";
import ReusableStack from "@/components/ReusableStack";
import ReusableCardStacks from "@/components/ReusableCardStacks";
import EstimatedSchedule from "@/components/EstimatedSchedule.jsx";
import TopAnimesTable from "@/components/TopAnimesTable.jsx";
import ContinueWatching from "@/components/continue-watching-section.jsx";
import { fetchHomePage } from "@/hooks/ApiMapper.jsx";
import { animeData } from "../../../lib/fallbackData.jsx";
import { readCache, writeCache } from "@/lib/clientCache";

const CACHE_KEY = "home:anime";

const page = () => {
  const [data, setData] = useState(null);
  const [TrendingData, setTrendingData] = useState(null);
  const [popularData, setPopularData] = useState(null);
  const [top10AnimesData, setTop10AnimesData] = useState(null);
  const [upcomingAnimesData, setUpcomingAnimesData] = useState(null);
  const [tableData, setTableData] = useState(null);
  const [cardStackData, setCardStackData] = useState(null);
  const [genreData, setGenreData] = useState(null);

  useEffect(() => {
    const apply = (d) => {
      if (!d) return;
      setData(d.spotlightAnimes);
      setTop10AnimesData(d.top10Animes);
      setTrendingData(d.top10Animes?.today);
      setPopularData(d.top10Animes?.month);
      setTableData(d.topAiringAnimes);
      setCardStackData(d.latestEpisodeAnimes);
      setGenreData(d.genres);
      setUpcomingAnimesData(d.topUpcomingAnimes);
    };

    const cached = readCache(CACHE_KEY);
    if (cached) apply(cached);

    const loadData = async () => {
      const fresh = await fetchHomePage();
      if (fresh && fresh.spotlightAnimes?.length) {
        apply(fresh);
        writeCache(CACHE_KEY, fresh);
      }
    };
    loadData();
  }, []);

  const isLoading = (value) => !value || value.length === 0;

  return (
    <div className="flex flex-col px-10 gap-10 max-md:px-2 bg-custom">
      <BigCarousel
        data={isLoading(data) ? animeData.spotlightAnimes : data}
        isLoading={isLoading(data)}
      />
      <ContinueWatching />
      <ReusableCarousel
        title={"Trending"}
        data={
          isLoading(TrendingData) ? animeData.top10Animes.today : TrendingData
        }
        isLoading={isLoading(TrendingData)}
      />
      <ReusableCarousel
        title={"Popular"}
        data={
          isLoading(popularData) ? animeData.top10Animes.month : popularData
        }
        isLoading={isLoading(popularData)}
      />
      <TopAnimesTable
        data={
          isLoading(top10AnimesData) ? animeData.top10Animes : top10AnimesData
        }
        isLoading={isLoading(top10AnimesData)}
      />
      <ReusableStack
        data={isLoading(tableData) ? animeData.topAiringAnimes : tableData}
        isLoading={isLoading(tableData)}
      />
      <ReusableCardStacks
        title={"Upcoming Animes"}
        data={
          isLoading(upcomingAnimesData)
            ? animeData.topUpcomingAnimes
            : upcomingAnimesData
        }
        isLoading={isLoading(upcomingAnimesData)}
        withGenres={false}
      />
      <ReusableCardStacks
        withGenres={true}
        genresData={isLoading(genreData) ? animeData.genres : genreData}
        title={"Latest Episodes"}
        data={
          isLoading(cardStackData)
            ? animeData.latestEpisodeAnimes
            : cardStackData
        }
        isLoading={isLoading(cardStackData) || isLoading(genreData)}
      />
      <EstimatedSchedule />
    </div>
  );
};

export default page;
