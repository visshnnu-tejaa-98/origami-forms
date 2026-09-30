"use client";

import React from "react";
import { LIBRARY, LIBRARY_SORTS, TEMPLATE_SORTS, TEMPLATE_STATUS_TABS } from "../../constants";
import { TemplateScope, TemplateSortField, TemplateTab, ToolbarProps } from "../../types";
import GlobalToolbar from "../../components/Toolbar";

type Props = ToolbarProps<TemplateTab, TemplateSortField> & {
    onRefresh?: () => void;
    scope: TemplateScope;
};

const Toolbar = ({ scope, ...props }: Props) => {

    const tabs = TEMPLATE_STATUS_TABS.map((t) => ({
        key: t.key,
        label: t.label,
        icon: t.icon,
    }));

    const isLibrary = scope === LIBRARY;

    return (
        <GlobalToolbar
            {...props}
            tabs={tabs}
            sorts={isLibrary ? LIBRARY_SORTS : TEMPLATE_SORTS}
            showTabs={!isLibrary}
            showViewToggle={false}
            classNames={{ toolbar: "tpl-toolbar", tabs: "tpl-tabs", tab: "tpl-tab" }}
            itemsLabel="templates"
        />
    );
};

export default Toolbar;
