"use client";

import React from "react";
import Image from "next/image";

export function Ka21nanLogo() {
  return (
    <a
      href="https://www.facebook.com/ka21nanseries"
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center select-none hover:scale-105 transition-transform"
    >
      <Image
        src="/Ka21nanLogo.png"
        alt="ka21nan series"
        width={200}
        height={80}
        className="drop-shadow-md"
        priority={false}
      />
    </a>
  );
}
