import Link from 'next/link';
import React from 'react'
import { Crane } from './deco';

const BrandCreditsLogo = () => {
    return (
        <Link className="pf-brand" href="/">
            <Crane size={22} />
            <span>made with origami</span>
        </Link>
    )
}

export default BrandCreditsLogo