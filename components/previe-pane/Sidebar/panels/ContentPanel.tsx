"use client";
import { Input } from "antd";
const { TextArea } = Input;

const ContentPanel = ({ editor, inspector }: any) => {
  // always render but disable when no selection (keeps layout simpler)
  return (
    <>
      <section style={{ marginBottom: 12 }}>
        <div className="text-[14px] font-semibold mb-2">Content</div>
        <TextArea
          rows={4}
          variant="filled"
          value={editor.contentHTML}
          onChange={(e) => {
            editor.setContentHTML(e.target.value);
            inspector.setContentOfSelected(e.target.value);
          }}
          disabled={!editor.selectedSummary}
        />
      </section>
      <div className="border-t border-gray-200 my-6" />
    </>
  );
};

export default ContentPanel;
