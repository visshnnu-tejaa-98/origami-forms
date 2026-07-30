"use client";

import { useUser } from '@clerk/nextjs';
import React from 'react'
import { Icon } from '~/components/origami/icon';

const Topbar = () => {
    const { user } = useUser();
    const firstName = user?.firstName ?? "there";
    return (
        <header className="topbar">
            <h1>
                <span className="smaller">Tuesday morning ·</span>
                Good morning, {firstName}.
            </h1>
            <div className="search">
                <Icon name="search" size={16} />
                <input placeholder="Search forms, responses, themes…" />
                <span className="o-kbd">⌘K</span>
            </div>
            <button className="icon-btn" title="Notifications">
                <Icon name="bell" size={18} />
                <span className="badge-dot" />
            </button>
            <button className="icon-btn" title="Help">
                <Icon name="sparkles" size={18} />
            </button>
        </header>
    )
}

export default Topbar