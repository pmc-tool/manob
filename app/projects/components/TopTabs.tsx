"use client";

type Tab = { path: string; name: string };

type Props = {
  tabs: Tab[];
  active: string | null;
  onSelect: (path: string) => void;
  onClose: (path: string) => void;
};

export function TopTabs({ tabs, active, onSelect, onClose }: Props) {
  return (
    <div className="flex items-center select-none">
      <div className="flex items-end">
        {tabs.map((t) => {
          const isActive = active === t.path;
          return (
            <div
              key={t.path}
              className={`flex items-center gap-3 px-3 py-2 ${
                isActive
                  ? "bg-[#ebe4e2] border-l border-r border-[#e5e7eb] border-t-2 border-t-[#ea2725] italic"
                  : "bg-gray-100 hover:bg-[#f6f6f6]"
              }`}
            >
              <button
                onClick={() => onSelect(t.path)}
                className="text-sm leading-none"
              >
                {t.name}
              </button>

              <button
                onClick={() => onClose(t.path)}
                className="leading-none hover:text-[#111827]"
                aria-label={`Close ${t.name}`}
              >
                ×
              </button>
            </div>
          );
        })}
      </div>

      <div className="ml-auto text-xs text-[#6b7280] pr-3">Editor</div>
    </div>
  );
}
