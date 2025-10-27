"use client";

import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { encodeObjectiveToSearch } from "@/lib/urlState";
import { logEvent } from "@/lib/audit";

const objectives = [
  { id: "acquire", title: "Acquire" },
  { id: "grow", title: "Grow" },
  { id: "retain", title: "Retain" }
];

export const ObjectiveEntry = () => {
  const router = useRouter();
  const setObjective = useStore((state) => state.setObjective);
  const handleSelect = (objective: "acquire" | "grow" | "retain") => {
    setObjective(objective);
    logEvent("objective-selected", { objective }, "/start");
    router.push(`/radar?${encodeObjectiveToSearch(objective)}`);
  };

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {objectives.map((obj) => (
        <button
          key={obj.id}
          type="button"
          onClick={() => handleSelect(obj.id as typeof objectives[number]["id"])}
          className="rounded-lg border border-slate-200 bg-white px-4 py-8 text-center text-lg font-semibold text-slate-700 shadow-sm hover:border-brand hover:text-brand"
        >
          {obj.title}
        </button>
      ))}
    </div>
  );
};
