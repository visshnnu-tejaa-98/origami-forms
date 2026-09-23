"use client"

import React from 'react'
import '../../components/stats.css'
import { useFormStore } from '~/app/store/form-store'
import { formatCompletionTime, formatIndianNumber } from '~/app/utils'
import { StatsSkeleton } from '../skeletons'
import FormStats from '../../components/FormStats'

const Stats = () => {

    const formsStats = useFormStore(state => state.formsStats)

    if (!formsStats) {
        return <StatsSkeleton />
    }

    const { totalResponses: rawTotalResponses, completionRate, totalViews: rawTotalViews, avgTimeCompletion } = formsStats

    const totalResponses = formatIndianNumber(rawTotalResponses)
    const totalViews = formatIndianNumber(rawTotalViews)
    return (
        <FormStats totalResponses={totalResponses} completionRate={completionRate} formatCompletionTime={formatCompletionTime} avgTimeCompletion={avgTimeCompletion} totalViews={totalViews} />
    )
}

export default Stats