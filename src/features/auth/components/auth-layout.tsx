import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function AuthLayout ({ children }: { children: React.ReactNode }) {
    return (
        <div className="h-screen w-screen flex flex-col items-center gap-2 justify-center">
            <Link className="" href={'/'}>
                <div className="flex gap-2">
                    <Image src={'/logos/logo.svg'} height={30} width={30} alt="h" />
                    <h2>PIOL</h2>
                </div>
            </Link>
            {children}
        </div>
    )
}
