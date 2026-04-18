import Slide01Cover from "./Slide01Cover";
import Slide02Problem from "./Slide02Problem";
import Slide03Solution from "./Slide03Solution";
import Slide04TalentScout from "./Slide04TalentScout";
import Slide05BattleTasks from "./Slide05BattleTasks";
import Slide06AntiGhosting from "./Slide06AntiGhosting";
import Slide07Philosophy from "./Slide07Philosophy";
import Slide08Audience from "./Slide08Audience";
import Slide09Roadmap from "./Slide09Roadmap";
import Slide10Closing from "./Slide10Closing";

export interface SlideMeta {
  id: string;
  title: string;
  Component: React.ComponentType;
}

export const SLIDES: SlideMeta[] = [
  { id: "cover", title: "TalentFlow", Component: Slide01Cover },
  { id: "problem", title: "Problem", Component: Slide02Problem },
  { id: "solution", title: "Rozwiązanie", Component: Slide03Solution },
  { id: "talent-scout", title: "Talent Scout", Component: Slide04TalentScout },
  { id: "battle-tasks", title: "Battle Tasks", Component: Slide05BattleTasks },
  { id: "anti-ghosting", title: "Anti-Ghosting Bridge", Component: Slide06AntiGhosting },
  { id: "philosophy", title: "Filozofia", Component: Slide07Philosophy },
  { id: "audience", title: "Grupa celowa", Component: Slide08Audience },
  { id: "roadmap", title: "Roadmap", Component: Slide09Roadmap },
  { id: "closing", title: "Zakończenie", Component: Slide10Closing },
];
