import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/metadata";

import { Hero } from "@/components/scenes/Hero";
import { TwoShores } from "@/components/scenes/TwoShores";
import { Pillars } from "@/components/scenes/Pillars";
import { Flywheel } from "@/components/scenes/Flywheel";
import { Programmes } from "@/components/scenes/Programmes";
import { Challenge } from "@/components/scenes/Challenge";
import { Journey } from "@/components/scenes/Journey";
import { KingdomMap } from "@/components/scenes/KingdomMap";
import { FourDoors } from "@/components/scenes/FourDoors";
import { Closing } from "@/components/scenes/Closing";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: "",
    namespace: "meta",
    titleKey: "tagline",
    descriptionKey: "description",
  });
}

/**
 * The Crossing at First Light.
 *
 * One journey that follows the sun from the eastern dawn of the hero to the
 * western dusk of the close. Every scene is a server component: the whole story
 * is HTML and CSS, with no JavaScript needed to read it.
 */
export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <TwoShores />
      <Pillars />
      <Flywheel />
      <Programmes />
      <Challenge />
      <Journey />
      <KingdomMap />
      <FourDoors />
      <Closing />
    </>
  );
}
