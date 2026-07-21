"use client"

import Link from "next/link"
import Logo from "./Logo"
import { Show, SignInButton, UserButton, useUser } from "@clerk/nextjs"
import { useCurrentUser } from "~/hooks/use-user"
import { setRole } from "../admin/actions"


const Navbar = () => {
  const { user } = useCurrentUser()
  console.log({ user })

  // if (user.role !== "admin") {
  //   setRole(user.clerkId, "admin")
  // }

  return (
    <nav className="lp-nav">
      <div className="lp-nav-inner">
        <Logo />
        <div className="lp-nav-links">
          <Link href="/templates">Templates</Link>
          <a href="#features">Features</a>
          <Link href="/pricing">Pricing</Link>
          <a href="#explore">Explore</a>
          <Link href="/studio">Studio</Link>
        </div>
        <div className="lp-nav-cta">
          <Show when="signed-out">
            <SignInButton>
              <button
                type="button"
                className="o-btn o-btn--ghost o-btn--sm lp-hide-sm"
              >
                Sign In
              </button>
            </SignInButton>
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