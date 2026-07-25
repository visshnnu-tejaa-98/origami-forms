"use client"

import Link from "next/link"
import Logo from "./Logo"
import { Show, UserButton } from "@clerk/nextjs"
import "./Navbar.css"


const Navbar = () => {
  return (
    <nav className="lp-nav">
      <div className="lp-nav-inner">
        <Logo />
        <div className="lp-nav-links">
          <Link href="/templates">Templates</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <a href="#features">Features</a>
          <Link href="/studio">Studio</Link>
        </div>
        <div className="lp-nav-cta">
          <Show when="signed-out">
            <Link href="/sign-in">
              <button
                type="button"
                className="o-btn o-btn--ghost o-btn--sm lp-hide-sm"
              >
                Sign In
              </button>
            </Link>
          </Show>
          <Show when="signed-in">
            <Link className="o-btn o-btn--accent o-btn--sm" href="/dashboard">
              Dashboard
            </Link>
            <UserButton />
          </Show>
        </div>
      </div>
    </nav>
  )
}

export default Navbar;