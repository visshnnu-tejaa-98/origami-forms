import React from "react";
import { Crane, Leaf, Pencil, Plane, Sakura } from "~/components/origami/deco";

const PreviewCanvas = () => (
  <div className="pv-canvas" aria-hidden>
    <span className="pv-wash pv-wash--accent" />
    <span className="pv-wash pv-wash--matcha" />
    <span className="pv-wash pv-wash--lavender" />

    <span className="pv-grain" />
    <span className="pv-fiber" />
    <span className="pv-crease" />

    <span className="pv-deco d-crane">
      <Crane size={150} />
    </span>
    <span className="pv-deco d-crane-2">
      <Crane size={78} />
    </span>
    <span className="pv-deco d-plane">
      <Plane size={92} />
    </span>
    <span className="pv-deco d-pencil">
      <Pencil size={140} />
    </span>
    <span className="pv-deco d-sakura-1">
      <Sakura size={44} />
    </span>
    <span className="pv-deco d-sakura-2">
      <Sakura size={26} />
    </span>
    <span className="pv-deco d-sakura-3">
      <Sakura size={34} />
    </span>
    <span className="pv-deco d-leaf-1">
      <Leaf size={38} />
    </span>
    <span className="pv-deco d-leaf-2">
      <Leaf size={28} />
    </span>
  </div>
);

export default PreviewCanvas;
