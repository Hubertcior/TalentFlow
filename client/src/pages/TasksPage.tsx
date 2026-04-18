import { useMemo, useState } from "react";
import { useTalentFlow } from "@/store/useTalentFlow";
import { PageHeader } from "@/components/common/PageHeader";
import { TaskCard } from "@/components/tasks/TaskCard";
import { useRole } from "@/contexts/RoleContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateTaskDialog } from "@/components/tasks/CreateTaskDialog";
import { cn } from "@/lib/utils";

const INDUSTRIES = ["IT & Technologie", "Marketing", "Prawo", "Hotelarstwo", "Rachunkowość", "Budownictwo", "Finanse", "E-commerce", "Inne"];

/** Lists battle tasks. Same page used by both roles; differs in framing. */
const TasksPage = () => {
  const tasks = useTalentFlow((s) => s.tasks);
  const submissions = useTalentFlow((s) => s.submissions);
  const { role } = useRole();
  const [createOpen, setCreateOpen] = useState(false);
  const [industryFilter, setIndustryFilter] = useState<string | null>(null);

  const activeIndustries = useMemo(() => {
    const set = new Set(tasks.map((t) => t.industry).filter(Boolean));
    return INDUSTRIES.filter((i) => set.has(i));
  }, [tasks]);

  const renderList = (filterFn: (t: typeof tasks[number]) => boolean) => {
    const list = tasks.filter(filterFn).filter((t) => !industryFilter || t.industry === industryFilter);
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
        actions={
          role === "mentor" ? (
            <Button onClick={() => setCreateOpen(true)} className="gap-2">
              <Plus size={15} /> Nowy Battle Task
            </Button>
          ) : undefined
        }
      />

      {/* Industry filter */}
      {activeIndustries.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          <button
            onClick={() => setIndustryFilter(null)}
            className={cn(
              "px-3 py-1 rounded-full text-xs border transition",
              !industryFilter
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-surface text-muted-foreground border-border hover:text-foreground"
            )}
          >
            Wszystkie branże
          </button>
          {activeIndustries.map((ind) => (
            <button
              key={ind}
              onClick={() => setIndustryFilter(industryFilter === ind ? null : ind)}
              className={cn(
                "px-3 py-1 rounded-full text-xs border transition",
                industryFilter === ind
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-surface text-muted-foreground border-border hover:text-foreground"
              )}
            >
              {ind}
            </button>
          ))}
        </div>
      )}

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

      <CreateTaskDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
};

export default TasksPage;
