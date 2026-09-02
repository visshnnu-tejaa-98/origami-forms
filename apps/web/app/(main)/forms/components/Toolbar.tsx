import React, { useMemo } from 'react'
import { STATUS_TABS, SORTS } from '../../constants';
import { IconName } from '../../components/icons';
import { SelectionAll, Status, ToolbarProps } from '../../types';
import { useFormStore } from '~/app/store/form-store';
import GlobalToolar, { type ToolbarTab } from '../../components/Toolbar';

const Toolbar = (props: ToolbarProps) => {
    const { published, draft, archived, expired, total } = useFormStore((state) => state.formsStats)

    const tabs = useMemo<ToolbarTab<Status | SelectionAll>[]>(
        () => {
            const counts: Record<string, number> = { published, draft, archived, expired, all: total }
            return STATUS_TABS.map((t) => ({
                key: t.key as Status | SelectionAll,
                label: t.label,
                icon: t.icon as IconName,
                count: counts[t.key] ?? t.count,
            }))
        },
        [published, draft, archived, total],
    )

    return (
        <GlobalToolar
            {...props}
            tabs={tabs}
            sorts={SORTS}
            itemsLabel="forms"
        />
    )
}

export default Toolbar
