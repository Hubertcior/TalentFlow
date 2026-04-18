using TalentFlow.API.Models;
using TalentFlow.API.Services;

namespace TalentFlow.API.Data;

public static class SeedData
{
    // Demo accounts — email / hasło: demo123
    public const string DemoPassword = "demo123";

    public static void Seed(AppDbContext db)
    {
        if (db.Accounts.Any()) return;

        var companies = new List<Company>
        {
            new() { Id = "c-demo-1", Name = "TechFlow", MentorName = "Kamil Wiśniewski", Industry = "IT & Technologie" },
            new() { Id = "c-2", Name = "CreativeHub", MentorName = "Anna Kowalska", Industry = "Marketing" },
            new() { Id = "c-3", Name = "LexCorp", MentorName = "Marek Dąbrowski", Industry = "Prawo" },
            new() { Id = "c-4", Name = "HotelGrand", MentorName = "Beata Nowak", Industry = "Hotelarstwo" },
            new() { Id = "c-5", Name = "FinanceAce", MentorName = "Tomasz Wiśniak", Industry = "Rachunkowość" },
            new() { Id = "c-6", Name = "GreenBuild", MentorName = "Katarzyna Zając", Industry = "Budownictwo" },
        };

        var talents = new List<Talent>
        {
            new() { Id = "t-demo-1", Name = "Zofia Malinowska", Initials = "ZM", RoleTitle = "Marketing & Komunikacja", Bio = "Pasjonatka digital marketingu i social media. Tworzę treści, które angażują i budują społeczności.", Age = 21, City = "Warszawa", Availability = Availability.Now, Interests = """["Social Media","Content Marketing","Grafika","Copywriting"]""" },
            new() { Id = "t-demo-2", Name = "Piotr Nowak", Initials = "PN", RoleTitle = "Frontend Developer", Bio = "Buduję interfejsy użytkownika z pasją do szczegółów. Zafascynowany React i nowoczesnym CSS.", Age = 22, City = "Kraków", Availability = Availability.Soon, Interests = """["React","TypeScript","CSS","UI/UX"]""" },
            new() { Id = "t-3", Name = "Aleksandra Kowalczyk", Initials = "AK", RoleTitle = "Graphic Designer", Bio = "Projektuję identyfikacje wizualne i materiały reklamowe. Styl minimalistyczny to mój znak rozpoznawczy.", Age = 20, City = "Wrocław", Availability = Availability.Now, Interests = """["Branding","Ilustracja","Figma","Adobe Suite"]""" },
            new() { Id = "t-4", Name = "Michał Wiśniewski", Initials = "MW", RoleTitle = "Backend Developer", Bio = "Buduję skalowalne API i mikroserwisy. Lubię rozwiązywać złożone problemy algorytmiczne.", Age = 23, City = "Poznań", Availability = Availability.Busy, Interests = """["Python","Docker","Kubernetes","Bazy danych"]""" },
            new() { Id = "t-5", Name = "Natalia Dąbrowska", Initials = "ND", RoleTitle = "UX Researcher", Bio = "Prowadzę badania użytkowników i tworzę personas. Wierzę, że dobry design zaczyna się od empatii.", Age = 21, City = "Gdańsk", Availability = Availability.Now, Interests = """["Badania UX","Prototypowanie","Psychologia","Figma"]""" },
            new() { Id = "t-6", Name = "Bartosz Lewandowski", Initials = "BL", RoleTitle = "Data Analyst", Bio = "Analizuję dane i tworzę dashboardy. Pomagam firmom podejmować lepsze decyzje oparte na liczbach.", Age = 24, City = "Warszawa", Availability = Availability.Soon, Interests = """["Python","Power BI","SQL","Machine Learning"]""" },
            new() { Id = "t-7", Name = "Karolina Zielińska", Initials = "KZ", RoleTitle = "PR & Komunikacja", Bio = "Tworzę strategie komunikacyjne i zarządzam relacjami z mediami. Specjalizuję się w PR kryzysowym.", Age = 22, City = "Łódź", Availability = Availability.Now, Interests = """["PR","Media Relations","Copywriting","Event Marketing"]""" },
            new() { Id = "t-8", Name = "Dominik Szymański", Initials = "DS", RoleTitle = "Mobile Developer", Bio = "Tworzę aplikacje mobilne na iOS i Android. Pasjonat Flutter i natywnego development.", Age = 23, City = "Katowice", Availability = Availability.Now, Interests = """["Flutter","Swift","Kotlin","Mobile UX"]""" },
            new() { Id = "t-9", Name = "Iga Kamińska", Initials = "IK", RoleTitle = "E-commerce Specialist", Bio = "Zarządzam sklepami internetowymi i optymalizuję konwersję. Specjalizuję się w SEO i płatnych kampaniach.", Age = 20, City = "Kraków", Availability = Availability.Soon, Interests = """["E-commerce","SEO","Google Ads","Analytics"]""" },
        };

        var tasks = new List<BattleTask>
        {
            new() { Id = "task-1", CompanyId = "c-demo-1", Title = "Zaprojektuj onboarding dla aplikacji SaaS", Brief = "Stwórz flow onboardingu dla nowego użytkownika naszej platformy do zarządzania projektami. Pokaż jak w 3 krokach pomożesz userowi zrozumieć wartość produktu.", Reward = "Praktyki 3 miesiące + mentoring", Status = Models.TaskStatus.Judging, Industry = "IT & Technologie", DueAt = DateTime.UtcNow.AddDays(-2), CreatedAt = DateTime.UtcNow.AddDays(-14) },
            new() { Id = "task-2", CompanyId = "c-2", Title = "Kampania social media dla Gen Z", Brief = "Zaproponuj strategię kampanii na TikTok i Instagram dla naszego nowego produktu skierowanego do osób 18-25 lat. Uwzględnij content plan na miesiąc.", Reward = "Wynagrodzenie 2500 zł + udział w kampanii", Status = Models.TaskStatus.Open, Industry = "Marketing", DueAt = DateTime.UtcNow.AddDays(7), CreatedAt = DateTime.UtcNow.AddDays(-3) },
            new() { Id = "task-3", CompanyId = "c-3", Title = "Analiza prawna startupu fintech", Brief = "Przygotuj brief prawny dotyczący wymogów regulacyjnych dla startupu chcącego uruchomić aplikację do płatności w Polsce i UE.", Reward = "Mentoring + referencje", Status = Models.TaskStatus.Open, Industry = "Prawo", DueAt = DateTime.UtcNow.AddDays(14), CreatedAt = DateTime.UtcNow.AddDays(-1) },
            new() { Id = "task-4", CompanyId = "c-4", Title = "Optymalizacja doświadczenia gościa hotelowego", Brief = "Zaproponuj 5 konkretnych usprawnień procesu check-in/check-out w hotelu 4-gwiazdkowym bazując na badaniach UX i trendach hotelarskich.", Reward = "Staż płatny 2 miesiące", Status = Models.TaskStatus.Closed, Industry = "Hotelarstwo", DueAt = DateTime.UtcNow.AddDays(-10), CreatedAt = DateTime.UtcNow.AddDays(-30) },
            new() { Id = "task-5", CompanyId = "c-5", Title = "Dashboard raportowania finansowego", Brief = "Zaprojektuj mockup dashboardu do raportowania KPI finansowych dla CFO firmy średniej wielkości. Uwzględnij wizualizacje danych i alert system.", Reward = "Praktyki + możliwość zatrudnienia", Status = Models.TaskStatus.Open, Industry = "Rachunkowość", DueAt = DateTime.UtcNow.AddDays(10), CreatedAt = DateTime.UtcNow.AddDays(-5) },
        };

        var submissions = new List<Submission>
        {
            new() { Id = "sub-1", TaskId = "task-1", TalentId = "t-demo-1", Summary = "Stworzyłam flow 3-krokowy: 1) wybór roli, 2) konfiguracja pierwszego projektu, 3) zaproszenie zespołu. Każdy krok ma progress bar i możliwość pominięcia.", SubmittedAt = DateTime.UtcNow.AddDays(-5), Rank = 1 },
            new() { Id = "sub-2", TaskId = "task-1", TalentId = "t-demo-2", Summary = "Zaproponowałem interaktywny tutorial z tooltipami nakładanymi na UI. Użytkownik uczy się przez działanie, nie przez czytanie instrukcji.", SubmittedAt = DateTime.UtcNow.AddDays(-4), Rank = 2 },
            new() { Id = "sub-3", TaskId = "task-1", TalentId = "t-3", Summary = "Zaprojektowałam wideo-onboarding (30 sek) + checklist z gamifikacją. Pierwsze zadanie do wykonania odblokowuje odznakę.", SubmittedAt = DateTime.UtcNow.AddDays(-6), Rank = 3 },
            new() { Id = "sub-4", TaskId = "task-1", TalentId = "t-5", Summary = "Oparłam design na badaniach: 68% userów porzuca onboarding w kroku 2. Moje rozwiązanie eliminuje friction przez auto-fill i smart defaults.", SubmittedAt = DateTime.UtcNow.AddDays(-3) },
            new() { Id = "sub-5", TaskId = "task-2", TalentId = "t-demo-1", Summary = "Strategia oparta na trendzie #dayinmylife + collab z micro-influencerami (5-50k). Content plan: 4 posty/tydzień IG + 2 TikToki.", SubmittedAt = DateTime.UtcNow.AddDays(-1) },
            new() { Id = "sub-6", TaskId = "task-2", TalentId = "t-7", Summary = "Proponuję kampanię opartą na UGC (user-generated content) z hashtagiem brandowym. Challenge + nagrody za najlepsze posty.", SubmittedAt = DateTime.UtcNow.AddDays(-2) },
            new() { Id = "sub-7", TaskId = "task-3", TalentId = "t-4", Summary = "Przygotowałem analizę wymogów PSD2, AML i RODO dla aplikacji płatniczej. Kluczowe: licencja EMI lub agent EPI.", SubmittedAt = DateTime.UtcNow.AddDays(-1) },
            new() { Id = "sub-8", TaskId = "task-4", TalentId = "t-5", Summary = "Moje 5 rekomendacji: 1) mobile check-in 24h wcześniej, 2) keyless entry, 3) AI concierge chatbot, 4) express checkout QR, 5) digital welcome pack.", SubmittedAt = DateTime.UtcNow.AddDays(-12), Rank = 1 },
            new() { Id = "sub-9", TaskId = "task-4", TalentId = "t-demo-1", Summary = "Skupiłam się na redukcji czasu oczekiwania: aplikacja hotelowa z pre-check-in i zamówieniami z pokoju. Prototyp w Figma dołączam.", SubmittedAt = DateTime.UtcNow.AddDays(-11), Rank = 2 },
            new() { Id = "sub-10", TaskId = "task-5", TalentId = "t-6", Summary = "Dashboard z 6 widgetami KPI, wykresem trendu 12M, tabelą top/bottom departamentów i systemem alertów email dla odchyleń >10%.", SubmittedAt = DateTime.UtcNow.AddDays(-2) },
            new() { Id = "sub-11", TaskId = "task-5", TalentId = "t-demo-2", Summary = "Mockup w Figma z dark/light mode, drill-down na poziom projektu i eksportem do PDF/Excel. Uwzględniłem WCAG 2.1 dla accessibility.", SubmittedAt = DateTime.UtcNow.AddDays(-1) },
        };

        var decisions = new List<Decision>
        {
            new() { Id = "dec-1", TalentId = "t-demo-1", CompanyId = "c-demo-1", TaskId = "task-1", Outcome = DecisionOutcome.Accepted, CreatedAt = DateTime.UtcNow.AddDays(-3), ResponseTimeHours = 48 },
            new() { Id = "dec-2", TalentId = "t-demo-1", CompanyId = "c-2", Outcome = DecisionOutcome.Rejected, Tip = "Potrzebujesz więcej praktycznego doświadczenia w tej dziedzinie", Note = "Twoja strategia była dobra, ale brakowało konkretnych KPI.", CreatedAt = DateTime.UtcNow.AddDays(-7), ResponseTimeHours = 24, Usefulness = 5 },
            new() { Id = "dec-3", TalentId = "t-demo-2", CompanyId = "c-demo-1", TaskId = "task-1", Outcome = DecisionOutcome.Accepted, CreatedAt = DateTime.UtcNow.AddDays(-3), ResponseTimeHours = 48 },
            new() { Id = "dec-4", TalentId = "t-3", CompanyId = "c-demo-1", TaskId = "task-1", Outcome = DecisionOutcome.Accepted, CreatedAt = DateTime.UtcNow.AddDays(-3), ResponseTimeHours = 48 },
            new() { Id = "dec-5", TalentId = "t-5", CompanyId = "c-demo-1", TaskId = "task-1", Outcome = DecisionOutcome.Rejected, Tip = "Popracuj nad komunikacją w zespole", Note = "Świetna analiza danych, ale rozwiązanie było zbyt skomplikowane dla użytkownika końcowego.", CreatedAt = DateTime.UtcNow.AddDays(-3), ResponseTimeHours = 48 },
            new() { Id = "dec-6", TalentId = "t-demo-1", CompanyId = "c-4", TaskId = "task-4", Outcome = DecisionOutcome.Accepted, CreatedAt = DateTime.UtcNow.AddDays(-9), ResponseTimeHours = 12 },
            new() { Id = "dec-7", TalentId = "t-demo-2", CompanyId = "c-3", Outcome = DecisionOutcome.Rejected, Tip = "Brak dopasowania do aktualnych potrzeb firmy", CreatedAt = DateTime.UtcNow.AddDays(-2), ResponseTimeHours = 6 },
            new() { Id = "dec-8", TalentId = "t-6", CompanyId = "c-5", TaskId = "task-5", Outcome = DecisionOutcome.Accepted, CreatedAt = DateTime.UtcNow.AddDays(-1), ResponseTimeHours = 2 },
            new() { Id = "dec-9", TalentId = "t-7", CompanyId = "c-2", TaskId = "task-2", Outcome = DecisionOutcome.Rejected, Tip = "Popracuj nad komunikacją w zespole", Note = "Dobry pomysł, ale potrzebujemy więcej doświadczenia w B2C.", CreatedAt = DateTime.UtcNow.AddDays(-1), ResponseTimeHours = 18, Usefulness = 4 },
            new() { Id = "dec-10", TalentId = "t-5", CompanyId = "c-4", TaskId = "task-4", Outcome = DecisionOutcome.Accepted, CreatedAt = DateTime.UtcNow.AddDays(-9), ResponseTimeHours = 12 },
        };

        var badges = new List<Badge>
        {
            new() { Id = "badge-1", TalentId = "t-demo-1", Company = "TechFlow", TaskTitle = "Zaprojektuj onboarding dla aplikacji SaaS", Rank = 1, Total = 4, AwardedAt = DateTime.UtcNow.AddDays(-3) },
            new() { Id = "badge-2", TalentId = "t-demo-1", Company = "HotelGrand", TaskTitle = "Optymalizacja doświadczenia gościa hotelowego", Rank = 2, Total = 2, AwardedAt = DateTime.UtcNow.AddDays(-9) },
            new() { Id = "badge-3", TalentId = "t-demo-2", Company = "TechFlow", TaskTitle = "Zaprojektuj onboarding dla aplikacji SaaS", Rank = 2, Total = 4, AwardedAt = DateTime.UtcNow.AddDays(-3) },
            new() { Id = "badge-4", TalentId = "t-3", Company = "TechFlow", TaskTitle = "Zaprojektuj onboarding dla aplikacji SaaS", Rank = 3, Total = 4, AwardedAt = DateTime.UtcNow.AddDays(-3) },
            new() { Id = "badge-5", TalentId = "t-5", Company = "HotelGrand", TaskTitle = "Optymalizacja doświadczenia gościa hotelowego", Rank = 1, Total = 2, AwardedAt = DateTime.UtcNow.AddDays(-9) },
        };

        var pwHash = PasswordHelper.Hash(DemoPassword);
        var accounts = new List<Account>
        {
            new() { Id = "acc-demo-1", Email = "zofia@demo.pl", PasswordHash = pwHash, DisplayName = "Zofia Malinowska", Subtitle = "Marketing & Komunikacja · Warszawa", Initials = "ZM", Role = Role.Talent, TalentId = "t-demo-1", CompanyId = null, Bio = "Pasjonatka digital marketingu", Color = "from-primary to-violet" },
            new() { Id = "acc-demo-2", Email = "piotr@demo.pl", PasswordHash = pwHash, DisplayName = "Piotr Nowak", Subtitle = "Frontend Developer · Kraków", Initials = "PN", Role = Role.Talent, TalentId = "t-demo-2", CompanyId = null, Bio = "Buduję interfejsy użytkownika", Color = "from-cyan-500 to-blue-600" },
            new() { Id = "acc-demo-3", Email = "kamil@demo.pl", PasswordHash = pwHash, DisplayName = "Kamil Wiśniewski", Subtitle = "Mentor · TechFlow", Initials = "KW", Role = Role.Mentor, TalentId = null, CompanyId = "c-demo-1", Bio = "Mentor w TechFlow", Color = "from-violet to-purple-700" },
        };

        db.Companies.AddRange(companies);
        db.Talents.AddRange(talents);
        db.Tasks.AddRange(tasks);
        db.Submissions.AddRange(submissions);
        db.Decisions.AddRange(decisions);
        db.Badges.AddRange(badges);
        db.Accounts.AddRange(accounts);
        db.SaveChanges();
    }
}
