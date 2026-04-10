"use client";

import { useCallback } from "react";
import { FallingShardData } from "@/lib/types";
import FallingShard from "./FallingShard";

export default function FallingShardLayer({
  shards,
  setShards,
}: {
  shards: FallingShardData[];
  setShards: React.Dispatch<React.SetStateAction<FallingShardData[]>>;
}) {
  const removeShard = useCallback(
    (id: string) => {
      setShards((prev) => prev.filter((s) => s.id !== id));
    },
    [setShards]
  );

  return (
    <>
      {shards.map((shard) => (
        <FallingShard key={shard.id} shard={shard} onDone={removeShard} />
      ))}
    </>
  );
}
