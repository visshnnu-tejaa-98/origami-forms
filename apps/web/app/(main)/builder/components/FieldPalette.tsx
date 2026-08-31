import React from "react";
import { Icon } from "../../components/icons";
import { FIELD_TYPES, LAYOUT_BLOCKS } from "../constants";
import { BlockType, FieldPaletteProps, FieldTypeMeta } from "../types";

const Chip = ({ block, onAdd }: { block: FieldTypeMeta; onAdd: (type: BlockType) => void }) => (
  <button
    type="button"
    className={`field-chip t-${block.tint}`}
    onClick={() => onAdd(block.key)}
    title={`Add ${block.label.toLowerCase()}`}
  >
    <span className="ic">
      <Icon name={block.icon} size={14} />
    </span>
    <span className="nm">{block.label}</span>
  </button>
);

const FieldPalette = ({ addField, openSettings, settingsOpen }: FieldPaletteProps) => {
  return (
    <aside className="b-left">
      <div className="pl-head">
        Add field
      </div>
      <div className="pl-grid">
        {FIELD_TYPES.map((block) => (
          <Chip key={block.key} block={block as FieldTypeMeta} onAdd={addField} />
        ))}
      </div>

      <div className="pl-head pl-head--spaced">Add Layout</div>
      <div className="pl-grid">
        {LAYOUT_BLOCKS.map((block) => (
          <Chip key={block.key} block={block as FieldTypeMeta} onAdd={addField} />
        ))}
      </div>

      <div className="pl-head pl-head--spaced">Form Settings</div>
      <button
        type="button"
        className={`pl-settings-btn${settingsOpen ? " active" : ""}`}
        onClick={openSettings}
        aria-pressed={settingsOpen}
        title="Visibility, submission cap and closing date"
      >
        <span className="ic">
          <Icon name="settings" size={14} />
        </span>
        <span className="nm">Form settings</span>
        <Icon name="chevron" size={13} />
      </button>
    </aside>
  );
};

export default FieldPalette;
