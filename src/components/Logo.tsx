import Image from "next/image";
import Link from "next/link";

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2.5">
      <Image src="/ear-logo.png" alt="" width={28} height={28} className="h-7 w-7" />
      <span className="font-serif text-xl font-semibold tracking-tight">LinguaEar</span>
    </Link>
  );
}
