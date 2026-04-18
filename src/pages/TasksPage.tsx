import { useTalentFlow } from "@/store/useTalentFlow";
import { PageHeader } from "@/components/common/PageHeader";
import { TaskCard } from "@/components/tasks/TaskCard";
import { useRole } from "@/contexts/RoleContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

/** Lists battle tasks. Same page used by both roles; differs in framing. */
const TasksPage = () => {
  const tasks = useTalentFlow((s) => s.tasks);
  const submissions = useTalentFlow((s) => s.submissions);
  const { role } = useRole();

  const renderList = (filterFn: (t: typeof tasks[number]) => boolean) => {
    const list = tasks.filter(filterFn);
    if (list.length === 0) {
      return <div className="text-center py-12 text-muted-foreground">Brak zadań w tej kategorii.</div>;
    }
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
        {list.map((t) => (
          <TaskCard
            key={t.id}
            task={t}
            submissionCount={submissions.filter((s) => s.taskId === t.id).length}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto">
      <PageHeader
        eyebrow="Battle Tasks"
        title={role === "talent" ? "Pokaż co potrafisz" : "Twoje zadania i ranking"}
        description={
          role === "talent"
            ? "Realne mini-zadania od firm. Top 3 dostaje odznakę Verified by Mentor. Zero wymagań wstępnych."
            : "Publikuj wyzwania, oceniaj zgłoszenia, wybieraj Top 3. Ranking automatycznie nadaje odznaki."
        }
      />

      <Tabs defaultValue="open">
        <TabsList>
          <TabsTrigger value="open">Otwarte</TabsTrigger>
          <TabsTrigger value="judging">Ocenianie</TabsTrigger>
          <TabsTrigger value="closed">Zamknięte</TabsTrigger>
          <TabsTrigger value="all">Wszystkie</TabsTrigger>
        </TabsList>
        <TabsContent value="open">{renderList((t) => t.status === "open")}</TabsContent>
        <TabsContent value="judging">{renderList((t) => t.status === "judging")}</TabsContent>
        <TabsContent value="closed">{renderList((t) => t.status === "closed")}</TabsContent>
        <TabsContent value="all">{renderList(() => true)}</TabsContent>
      </Tabs>
    </div>
  );
};

export default TasksPage;
