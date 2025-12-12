"use client";
import { Button, Input, Space } from "antd";
import { Crown, Globe } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Domains() {
  const [subdomain, setSubdomain] = useState("");
  return (
    <div className="max-w-3xl m-auto">
      <div className="border-b border-gray-200 pb-4 mb-8">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Globe size={21} className="shrink-0" />
          <span>Domains</span>
        </h3>
        <div className="text-gray-600">Domain configuration goes here...</div>
      </div>
      <div className="space-y-5">
        <div className="p-4 border border-gray-200 rounded-xl">
          <div className="border-b pb-2 mb-3 border-gray-200">
            <div className="text-sm font-semibold">Default Domain</div>
            <div className="mb-0 text-[13px] text-gray-700">
              The URL your generation will always be available at.
            </div>
          </div>
          <div className="flex gap-2">
            <Space.Compact block>
              <Space.Addon className="bg-gray-100!">pmc-</Space.Addon>

              <Input
                placeholder="Add your-domain (empty to auto-generate)"
                value={subdomain}
                onChange={(e) => setSubdomain(e.target.value)}
                className="flex-1"
              />

              <Space.Addon className="bg-gray-100!">.engine.app</Space.Addon>
            </Space.Compact>
            <Button
              type="primary"
              onClick={() => console.log("Saved:", subdomain)}
              disabled={!subdomain.trim()}
            >
              Save
            </Button>
          </div>
        </div>
        <div className="p-4 bg-[#f8f4f3] rounded-xl">
          <div className="border-b pb-2 mb-3 border-gray-200">
            <div className="text-sm font-semibold">Oveview</div>
            <div className="mb-0 text-[13px] text-gray-700">
              Summary of your domains and their statuses.
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-sm font-medium text-v0-gray-1000 flex items-center gap-1.5">
              <Link
                href="https://packmycode.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline! text-black! flex items-center gap-1"
              >
                <Globe size={14} className="shrink-0" />
                <span>pmc-pointer-ai-landing-page-ps-one.engine.app</span>
              </Link>
              <span className="inline-flex items-center text-center py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 [a&]:cursor-pointer border-transparent bg-green-200 text-green-700 [a&]:hover:bg-success/80 w-fit shrink-0 rounded-full px-3">
                Live
              </span>
            </div>
            <div className="text-xs text-gray-600">Added Dec 09, 2025</div>
          </div>
        </div>
        <div className="p-4 bg-[#f8f4f3] rounded-xl">
          <div className="border-b pb-2 mb-3 border-gray-200">
            <div className="text-sm font-semibold">Connected Domains </div>
            <div className="mb-0 text-[13px] text-gray-700">
              Purchase and manage custom domains directly through PackMyCode.
            </div>
          </div>
          <div className="flex justify-between items-center gap-2">
            <div className="flex flex-col gap-1">
              <div className="text-sm font-medium text-v0-gray-1000 flex items-center gap-1.5">
                <div className="text-black! flex items-center gap-1">
                  <Globe size={14} className="shrink-0" />
                  <span>Purchase New Domain</span>
                </div>
                <span className="inline-flex gap-0.5 items-center text-center py-0.5 text-xs font-medium bg-purple-200 text-purple-700 shrink-0 rounded-full px-3">
                  <Crown size={14} />
                  Pro
                </span>
              </div>
              <div className="text-xs text-gray-600 underline">
                Upgrade your plan
              </div>
            </div>
            <Button size="small">Buy New Domain</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
