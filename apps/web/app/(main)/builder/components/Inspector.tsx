import React from "react";
import { Icon } from "../../components/icons";
import { BLOCK_META, hasOptions, isFieldBlock } from "../constants";
import { FieldOption, InspectorProps } from "../types";
import LayoutBlock from "./LayoutBlock";
import Validations from "./Validations";
import OptionFields from "./OptionFields";
import InspectorActions from "./InspectorActions";
import FormFieldConfiguration from "./FormFieldConfiguration";
import InspectorHeader from "./InspectorHeader";

const Inspector = (props: InspectorProps) => {
  const { field, index, updateField, removeField, duplicateField } = props;

  if (!field) {
    return (
      <aside className="b-right">
        <div className="insp-empty">
          <Icon name="clip" size={30} />
          <p>Pick a question on the canvas to fold its settings open.</p>
        </div>
      </aside>
    );
  }


  if (!isFieldBlock(field)) {
    return (
      <LayoutBlock
        field={field}
        updateField={updateField}
        removeField={removeField}
        duplicateField={duplicateField}
      />
    );
  }

  return (
    <aside className="b-right">
      <InspectorHeader field={field} index={index} />

      <FormFieldConfiguration field={field} updateField={updateField} />

      <OptionFields field={field} updateField={updateField} />

      <Validations field={field} updateField={updateField} />

      <InspectorActions field={field} removeField={removeField} duplicateField={duplicateField} />
    </aside>
  );
};

export default Inspector;
