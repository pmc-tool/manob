"use client";
import { Divider, Input, Switch } from "antd";

const LinkPanel = ({ editor, inspector }: any) => {
  return (
    <>
      <section>
        <div className="text-[14px] font-semibold mb-2">Link</div>
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 12, color: "#444" }}>Href</div>
          <Input
            variant="filled"
            value={editor.linkProps.href}
            disabled={!editor.selectedSummary}
            onChange={(e) => {
              editor.setLinkProps({
                ...editor.linkProps,
                href: e.target.value,
              });
              inspector.setLinkProps({
                ...editor.linkProps,
                href: e.target.value,
              });
            }}
          />
        </div>
        <div className="flex gap-2 items-center">
          <div style={{ fontSize: 12, color: "#444" }}>Open in new tab</div>
          <Switch
            disabled={!editor.selectedSummary}
            checked={editor.linkProps.targetBlank}
            onChange={(v) => {
              editor.setLinkProps({ ...editor.linkProps, targetBlank: v });
              inspector.setLinkProps({
                ...editor.linkProps,
                targetBlank: v,
              });
            }}
          />
        </div>
      </section>
      <Divider />
    </>
  );
};

export default LinkPanel;
