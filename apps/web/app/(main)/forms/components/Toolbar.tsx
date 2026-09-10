import React, { useMemo } from 'react'
import { STATUS_TABS, SORTS } from '../../constants';
import { IconName } from '../../components/icons';
import { SelectionAll, Status, ToolbarProps } from '../../types';
import { useFormStore } from '~/app/store/form-store';
import GlobalToolar, { type ToolbarTab } from '../../components/Toolbar';

const Toolbar = (props: ToolbarProps) => {
    const formStats = useFormStore((state) => state.formsStats)

    const tabs = useMemo<ToolbarTab<Status | SelectionAll>[]>(
        () => {
            const counts: Record<string, number> = {
                published: formStats?.published ?? 0,
                draft: formStats?.draft ?? 0,
                archived: formStats?.archived ?? 0,
                expired: formStats?.expired ?? 0,
                all: formStats?.total ?? 0,
            }
            return STATUS_TABS.map((t) => ({
                key: t.key as Status | SelectionAll,
                label: t.label,
                icon: t.icon as IconName,
                count: counts[t.key] ?? t.count,
            }))
        },
        [formStats],
    )

    if (!formStats) {
        return <div>Loading state...</div>;
    }

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
