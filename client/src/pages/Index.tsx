import { useRole } from "@/contexts/RoleContext";
import { TalentDashboard } from "@/components/dashboards/TalentDashboard";
import { MentorDashboard } from "@/components/dashboards/MentorDashboard";

const Index = () => {
  const { role } = useRole();
  return role === "talent" ? <TalentDashboard /> : <MentorDashboard />;
};

export default Index;
