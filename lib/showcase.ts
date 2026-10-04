import type { StaticImageData } from "next/image";

import card01 from "@/public/showcase/cards/01.jpg";
import card02 from "@/public/showcase/cards/02.jpg";
import card03 from "@/public/showcase/cards/03.jpg";
import card04 from "@/public/showcase/cards/04.jpg";
import card05 from "@/public/showcase/cards/05.jpg";
import card06 from "@/public/showcase/cards/06.jpg";

import wide01 from "@/public/showcase/wide/01.jpg";
import wide02 from "@/public/showcase/wide/02.jpg";
import wide03 from "@/public/showcase/wide/03.jpg";
import wide04 from "@/public/showcase/wide/04.jpg";
import wide05 from "@/public/showcase/wide/05.jpg";

import tall01 from "@/public/showcase/tall/01.jpg";
import tall02 from "@/public/showcase/tall/02.jpg";
import tall03 from "@/public/showcase/tall/03.jpg";

import panel01 from "@/public/showcase/panels/01.jpg";
import panel02 from "@/public/showcase/panels/02.jpg";
import panel03 from "@/public/showcase/panels/03.jpg";
import panel04 from "@/public/showcase/panels/04.jpg";

import plate01 from "@/public/showcase/plates/01.jpg";
import plate02 from "@/public/showcase/plates/02.jpg";
import plate03 from "@/public/showcase/plates/03.jpg";
import plate04 from "@/public/showcase/plates/04.jpg";
import plate05 from "@/public/showcase/plates/05.jpg";
import plate06 from "@/public/showcase/plates/06.jpg";
import plate07 from "@/public/showcase/plates/07.jpg";
import plate08 from "@/public/showcase/plates/08.jpg";
import plate09 from "@/public/showcase/plates/09.jpg";
import plate10 from "@/public/showcase/plates/10.jpg";

import trailArrow from "@/public/showcase/trail/arrow.webp";
import trailBadminton from "@/public/showcase/trail/badminton.webp";
import trailBasketball from "@/public/showcase/trail/basketball.webp";
import trailBoxing from "@/public/showcase/trail/boxing.webp";
import trailCricket from "@/public/showcase/trail/cricket.webp";
import trailCycle from "@/public/showcase/trail/cycle.webp";
import trailFootball from "@/public/showcase/trail/football.webp";
import trailGolf from "@/public/showcase/trail/golf.webp";
import trailGym from "@/public/showcase/trail/gym.webp";
import trailHiking from "@/public/showcase/trail/hiking.webp";
import trailRun from "@/public/showcase/trail/run.webp";
import trailSkate from "@/public/showcase/trail/skete.webp";

/**
 * Static imports, not string paths.
 *
 * Importing the file hands Next the intrinsic width/height (so no layout
 * shift) and a generated blurDataURL (so no empty box while decoding) for
 * free. Every asset here was resized to its real display size by
 * `scripts/optimize-assets.mjs` — the source set was 37MB of up-to-11,708px
 * screenshots, which is now 1.9MB.
 */

export const CARDS: StaticImageData[] = [
  card01, card02, card03, card04, card05, card06,
];

export const WIDE: StaticImageData[] = [wide01, wide02, wide03, wide04, wide05];

export const TALL: StaticImageData[] = [tall01, tall02, tall03];

export const PANELS: StaticImageData[] = [panel01, panel02, panel03, panel04];

export const PLATES: StaticImageData[] = [
  plate01, plate02, plate03, plate04, plate05,
  plate06, plate07, plate08, plate09, plate10,
];

export const TRAIL: StaticImageData[] = [
  trailArrow, trailBadminton, trailBasketball, trailBoxing,
  trailCricket, trailCycle, trailFootball, trailGolf,
  trailGym, trailHiking, trailRun, trailSkate,
];
