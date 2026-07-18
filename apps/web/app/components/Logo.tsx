import Link from "next/link";
import { Crane } from "~/components/origami/deco";

function Logo() {
  return (
    <Link className="lp-logo" href="/">
      <span className="mark">
        <Crane size={30} />
      </span>
      <span>origami</span>
    </Link>
  );
}

export default Logo