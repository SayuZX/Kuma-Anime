import React, { useState } from "react";
import Image from "next/image";
import Selector from "@/components/Select";
import { Skeleton } from "../ui/skeleton";

const CharacterData = ({ data }) => {
  const [currentLang, setCurrentLang] = useState("Japanese");
  const availableLangs = ["Japanese", "English", "German", "Spanish"];

  const filteredData =
    data &&
    data.filter((anime) =>
      anime.voiceActors?.some((actor) => actor.language === currentLang)
    );

  const handleLanguage = (event) => {
    setCurrentLang(event);
  };

  if (!data || data.length < 1) {
    return (
      <div className="flex flex-col gap-5 w-full bg-neutral-700/10 p-5 box-shadow rounded-md animated">
        <div className="flex flex-row items-center w-full justify-between">
          <h1 className="text-2xl">Characters</h1>
          <Selector onClick={handleLanguage} />
        </div>
        <div className="grid grid-cols-3 grid-rows-auto max-md:grid-cols-1 justify-between gap-5 w-full">
          {Array.from({ length: 20 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-row animated justify-between bg-neutral-700/20 p-2 rounded-md box-shadow"
            >
              <Skeleton className="h-[100px] w-[67px] rounded-md" />
              <div className="flex flex-col justify-center gap-2 items-center max-md:text-[13px]">
                <Skeleton className="w-[120px] h-[20px]" />
                <Skeleton className="w-[100px] h-[20px]" />
              </div>
              <Skeleton className="h-[100px] w-[67px] rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 w-full bg-neutral-700/10 p-5 box-shadow rounded-md animated">
      <div className="flex flex-row items-center w-full justify-between">
        <h1 className="text-2xl">Characters</h1>
        <Selector onClick={handleLanguage} />
      </div>
      <div className="grid grid-cols-3 grid-rows-auto max-md:grid-cols-1 justify-between gap-5 w-full">
        {filteredData ? (
          filteredData.map((item) => {
            const voiceActor = item?.voiceActors?.find(
              (data) => data.language === currentLang
            );
            return (
              <div
                className="flex flex-row animated justify-between bg-neutral-700/20 p-2 rounded-md box-shadow"
                key={item.name.full}
              >
                <Image
                  className="object-cover h-[100px] w-[67px] rounded-md"
                  src={item.image || "/icon.png"}
                  alt={item.name?.full || "character"}
                  width={67}
                  height={100}
                />
                <div className="flex flex-col justify-center gap-2 items-center max-md:text-[13px]">
                  <h1>{item.name.full}</h1>
                  <p className="italic text-gray-400">
                    ~ {" " + (voiceActor?.name.full || "??")}
                  </p>
                </div>
                <Image
                  className="object-cover h-[100px] w-[67px] rounded-lg"
                  src={voiceActor?.image || "/icon.png"}
                  alt="voice actor"
                  width={67}
                  height={100}
                />
              </div>
            );
          })
        ) : (
          <h1>Characters Data Not Found {":)"} </h1>
        )}
      </div>
    </div>
  );
};

export default CharacterData;
