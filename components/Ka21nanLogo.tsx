"use client";

import React from "react";
import Image from "next/image";

export function Ka21nanLogo() {
  return (
    <div className="flex flex-col items-center select-none">
      <Image
        src="/Ka21nanLogo.png"
        alt="ka21nan series"
        width={200}
        height={80}
        className="drop-shadow-md"
        priority={false}
      />
    </div>
  );
}
