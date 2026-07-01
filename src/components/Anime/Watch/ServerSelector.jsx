import { Badge } from "@/components/ui/badge";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const ServerSelector = ({
  currentEpisode,
  qualities = [],
  selectedResolution,
  onResolution,
  activeServerId,
  onServer,
}) => {
  const currentServers =
    qualities.find((q) => q.resolution === selectedResolution)?.servers || [];

  return (
    <div className="flex flex-row max-md:flex-col justify-between max-md:gap-3 w-full h-[90px] max-md:h-auto animated">
      <div className="flex flex-col justify-center max-md:p-3 gap-3 pl-5 h-full w-[52%] max-md:text-sm max-md:w-full bg-neutral-700/30 rounded-md">
        <p className="max-md:text-[13px]">
          Kamu Sedang Menonton <span>Episode {currentEpisode || "-"}</span>{" "}
          <Badge className="ml-2">
            <FontAwesomeIcon className="mr-1" icon={faDownload} />
            Download
          </Badge>
        </p>
        <p>Pilih resolusi lalu link stream jika video tidak berfungsi.</p>
      </div>
      <div className="flex flex-row items-center gap-2 w-[46%] max-md:w-full max-md:p-3 px-4 bg-neutral-700/30 rounded-md">
        <select
          value={selectedResolution || ""}
          onChange={(event) => onResolution(event.target.value)}
          className="w-[40%] bg-neutral-700/40 rounded-md px-2 py-2 text-sm outline-none cursor-pointer"
        >
          <option value="">Resolusi</option>
          {qualities.map((q) => (
            <option key={q.resolution} value={q.resolution}>
              {q.resolution}
            </option>
          ))}
        </select>
        <select
          value={activeServerId || ""}
          onChange={(event) => onServer(event.target.value)}
          disabled={!currentServers.length}
          className="w-full bg-neutral-700/40 rounded-md px-2 py-2 text-sm outline-none cursor-pointer disabled:opacity-50"
        >
          <option value="">Link Stream</option>
          {currentServers.map((server) => (
            <option key={server.serverId} value={server.serverId}>
              {server.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ServerSelector;
