import { Badge } from "@/components/ui/badge";
import {
  faClosedCaptioning,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const ServerSelector = ({ currentEpisode, servers = [], activeServerId, onSelect }) => {
  return (
    <div className="flex flex-row max-md:flex-col justify-between max-md:gap-3 w-full h-[90px] max-md:h-auto animated">
      <div className="flex flex-col justify-center max-md:p-3 gap-3 pl-5 h-full w-[55%] max-md:text-sm max-md:w-full bg-neutral-700/30 rounded-md">
        <p className="max-md:text-[13px]">
          Kamu Sedang Menonton <span>Episode {currentEpisode}</span>{" "}
          <Badge className="ml-2">
            <FontAwesomeIcon className="mr-1" icon={faDownload} />
            Download
          </Badge>
        </p>
        <p>Pilih resolusi/server lain jika video tidak berfungsi.</p>
      </div>
      <div className="flex flex-row items-center gap-3 w-[43%] max-md:w-full max-md:p-3 px-4 bg-neutral-700/30 rounded-md">
        <span className="text-nowrap flex flex-row items-center gap-2">
          <FontAwesomeIcon icon={faClosedCaptioning} /> Sub Indo
        </span>
        <select
          value={activeServerId || ""}
          onChange={(event) => onSelect(event.target.value)}
          className="w-full bg-neutral-700/40 rounded-md px-3 py-2 text-sm outline-none cursor-pointer"
        >
          <option value="">Default</option>
          {servers.map((server) => (
            <option key={server.serverId} value={server.serverId}>
              {server.quality} — {server.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ServerSelector;
