"use client";

import { ChevronDown, ChevronRight, FileText, Search } from "lucide-react";
import { useMemo, useState } from "react";
import sampleTree, { FileNode } from "./sampleTree";

type Props = {
  onOpen: (path: string) => void;
  activePath?: string;
};

export function FileExplorer({ onOpen, activePath }: Props) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    "1": true,
    "2": true,
  });
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const toggleFolder = (id: string) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const filterTree = (nodes: FileNode[]): FileNode[] => {
    return nodes
      .map((node) => {
        if (node.type === "folder") {
          const filteredChildren = node.children
            ? filterTree(node.children)
            : [];
          if (
            node.name.toLowerCase().includes(search.toLowerCase()) ||
            filteredChildren.length > 0
          ) {
            return { ...node, children: filteredChildren };
          }
          return null;
        }
        if (node.name.toLowerCase().includes(search.toLowerCase())) {
          return node;
        }
        return null;
      })
      .filter(Boolean) as FileNode[];
  };

  const filteredTree = useMemo(() => filterTree(sampleTree), [search]);

  const renderNode = (node: FileNode, level = 0) => {
    const isActive = activePath === node.path;

    if (node.type === "folder") {
      const isOpen = expanded[node.id];

      return (
        <div key={node.id}>
          <div
            onClick={() => toggleFolder(node.id)}
            className="flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-gray-100 rounded"
            style={{ paddingLeft: `${level * 16 + 8}px` }}
          >
            {isOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
            <span className="text-sm font-medium">{node.name}</span>
          </div>

          {isOpen &&
            node.children?.map((child) => renderNode(child, level + 1))}
        </div>
      );
    }

    return (
      <button
        key={node.id}
        onClick={() => onOpen(node.path)}
        className={`flex w-full items-center gap-2 px-2 py-1 text-left text-sm ${
          isActive ? "bg-[#ebe4e2] font-medium" : "hover:bg-[#dfd4d1]"
        }`}
        style={{ paddingLeft: `${level * 16 + 28}px` }}
      >
        <FileText
          className={`w-4 h-4 ${
            node.name.endsWith(".ts")
              ? "text-blue-500"
              : node.name.endsWith(".json")
              ? "text-purple-500"
              : "text-gray-400"
          }`}
        />
        {node.name}
      </button>
    );
  };

  return (
    <div className="h-full flex flex-col text-sm">
      {/* Header */}
      <div className="p-3">
        <div className="flex items-center justify-between">
          <div className="uppercase text-[13px] font-semibold">
            File Explorer
          </div>
          <Search
            size={16}
            className="cursor-pointer"
            onClick={() => setShowSearch((prev) => !prev)}
          />
        </div>

        {/* Search (toggleable) */}
        {showSearch && (
          <div className="relative mt-3">
            <Search className="absolute w-4 h-4 left-2 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search files..."
              className="w-full pl-8 pr-2 py-1 text-sm rounded border border-gray-300 focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
        )}
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-auto">
        {filteredTree.map((node) => renderNode(node))}
      </div>

      {/* Footer */}
      <div className="px-3 py-2 text-xs text-gray-500 border-t border-gray-200">
        <div className="truncate">Workspace: demo</div>
      </div>
    </div>
  );
}
