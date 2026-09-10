"use client";

import { useUser } from "@clerk/nextjs";
import React from "react";
import { useUserStore } from "~/app/store/user-store";
import { currentDate, getGreeting, getNameFromEmail } from "~/app/utils";
import { Icon } from "~/components/origami/icon";

const Topbar = () => {
    const { user } = useUser();
    const userFirstNameFromRedux = useUserStore((state) => state.user?.firstName);
    const email = user?.emailAddresses?.[0]?.emailAddress ?? "";
    const firstName = userFirstNameFromRedux
        ? userFirstNameFromRedux
        : (user?.firstName ?? getNameFromEmail(email));
    const greetingMessage = getGreeting();
    return (
        <header className="topbar">
            <h1>
                {greetingMessage}, {firstName}.<span className="smaller">{currentDate}.</span>
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
    );
};

export default Topbar;
