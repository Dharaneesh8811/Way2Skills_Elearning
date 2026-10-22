
"use client";

import "./AbstractSculpture.css";

export default function AbstractSculpture() {
  return (
    <div className="abstract-sculpture" aria-hidden="true">
      <div className="core-light core-light-blue" />
      <div className="core-light core-light-red" />

      <div className="core-platform">
        <div className="core-platform-top" />
      </div>

      <div className="core-orbit core-orbit-one">
        <div className="core-orbit-highlight" />
      </div>

      <div className="core-orbit core-orbit-two">
        <div className="core-orbit-highlight" />
      </div>

      <div className="core-orbit core-orbit-three">
        <div className="core-orbit-highlight" />
      </div>

      <div className="core-sphere">
        <div className="core-sphere-reflection" />
        <div className="core-sphere-shine" />
        <div className="core-sphere-red-glint" />
      </div>

      <div className="core-floating-dot core-dot-one" />
      <div className="core-floating-dot core-dot-two" />
      <div className="core-floating-dot core-dot-three" />
    </div>
  );
}
