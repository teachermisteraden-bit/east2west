import { getTranslations } from "next-intl/server";
import { count } from "@/lib/messages";
import { site, pick } from "@/config/site";
import { Section } from "./Section";
import { Faq } from "./Faq";

/**
 * The society's honest FAQ, shared by About and the audience pages.
 *
 * The cost answer carries a {membershipCost} placeholder, so each item is read
 * by index through `t()` rather than raw — raw would return the placeholder
 * unfilled. Until the owner sets MEMBERSHIP_COST_*, the configured default says
 * fees will be announced, which is true and not a number we invented.
 */
export async function SiteFaq({ locale }: { locale: string }) {
  const t = await getTranslations("faq");
  const total = count(t, "items");

  const items = Array.from({ length: total }, (_, i) => ({
    q: t(`items.${i}.q`),
    a: t(`items.${i}.a`, { membershipCost: pick(site.membershipCost, locale) }),
  }));

  return (
    <Section tone="quiet" rule={false}>
      <Faq items={items} title={t("title")} />
    </Section>
  );
}
