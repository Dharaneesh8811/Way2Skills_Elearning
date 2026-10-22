
"use client";

import "./portal.css"

export default function LearningPortal() {
  return (
    <div
      className="learning-portal"
      aria-hidden="true"
    >
      <div className="portal-aura" />

      <div className="portal-ring portal-ring-outer">
        <span className="portal-node portal-node-one" />
        <span className="portal-node portal-node-two" />
      </div>

      <div className="portal-ring portal-ring-middle" />

      <div className="portal-ring portal-ring-inner">
        <span className="portal-orbit-dot" />
      </div>

      <div className="portal-core">
        <div className="portal-core-light" />
        <div className="portal-core-circle" />
      </div>

      <div className="portal-particle portal-particle-one" />
      <div className="portal-particle portal-particle-two" />
      <div className="portal-particle portal-particle-three" />
      <div className="portal-particle portal-particle-four" />
    </div>
  );
}
