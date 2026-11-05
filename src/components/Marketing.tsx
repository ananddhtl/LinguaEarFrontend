import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

/** Header and footer around the public pages. */
export function Marketing({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}
