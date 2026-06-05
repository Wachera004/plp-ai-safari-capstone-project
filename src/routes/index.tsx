import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Shield,
  Activity,
  Database,
  Lock,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Radio,
  Cpu,
  Users,
  FileText,
  Power,
  Signal,
  Battery,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FinSoko · Digital Pride Orchestration Console" },
      {
        name: "description",
        content:
          "Enterprise multi-agent orchestration dashboard for FinSoko's HUNT protocol — alternative agricultural credit scoring across East Africa.",
      },
      { property: "og:title", content: "FinSoko · Digital Pride Orchestration Console" },
    ],
  }),
  component: Dashboard,
});

type AgentState = "idle" | "active" | "complete" | "frozen-amber" | "frozen-red";

interface LogLine {
  ts: string;
  text: string;
  tone?: "info" | "warn" | "ok" | "err";
}

const PRESETS = [
  {
    id: "p1",
    label: "Distress signal · school fees",
    text: "Jambo! I have zero money for school fees this term.",
  },
  {
    id: "p2",
    label: "Credit request · harvest transport",
    text: "Harvest complete. Requesting KES 12,000 credit line for market transport.",
  },
];

const now = () => {
  const d = new Date();
  return d.toTimeString().slice(0, 8);
};

function classify(message: string) {
  const lower = message.toLowerCase();
  const isDistress =
    lower.includes("school fees") ||
    lower.includes("zero money") ||
    lower.includes("loan shark");
  const krMatch = message.match(/kes\s*([\d,]+)/i);
  const amount = krMatch ? parseInt(krMatch[1].replace(/,/g, ""), 10) : 0;
  return {
    isDistress,
    amount,
    crop: lower.includes("maize")
      ? "Maize"
      : lower.includes("matooke") || lower.includes("banana")
        ? "Matooke"
        : "Mixed Smallholder",
    purpose: lower.includes("transport")
      ? "Post-harvest market transport"
      : lower.includes("fees")
        ? "Household liquidity (education)"
        : "Working capital",
  };
}

function Dashboard() {
  const [draft, setDraft] = useState(PRESETS[1].text);
  const [running, setRunning] = useState(false);
  const [scout, setScout] = useState<AgentState>("idle");
  const [guardian, setGuardian] = useState<AgentState>("idle");
  const [hunter, setHunter] = useState<AgentState>("idle");
  const [scoutLogs, setScoutLogs] = useState<LogLine[]>([]);
  const [guardianLogs, setGuardianLogs] = useState<LogLine[]>([]);
  const [hunterBrief, setHunterBrief] = useState<null | {
    age: number;
    location: string;
    dependents: number;
    crop: string;
    alignment: string;
    amount: number;
    risk: string;
    decision: string;
    purpose: string;
  }>(null);
  const [auditLogs, setAuditLogs] = useState<LogLine[]>([
    { ts: now(), text: "[OASIS Charters Enabled]: k-Anonymity set to depth k=15", tone: "ok" },
    { ts: now(), text: "[TRAIL Compliance]: Session lines scrubbed after 180 days per Kenya DPA 2022", tone: "ok" },
    { ts: now(), text: "[Region Lock]: Data residency anchored to AWS af-south-1 (Cape Town)", tone: "ok" },
  ]);
  const [trailPulse, setTrailPulse] = useState<string | null>(null);

  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);
  const clearTimers = () => {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
  };
  useEffect(() => () => clearTimers(), []);

  const pushAudit = (text: string, tone: LogLine["tone"] = "info") =>
    setAuditLogs((l) => [...l.slice(-40), { ts: now(), text, tone }]);

  const runSimulation = (text: string) => {
    if (running) return;
    clearTimers();
    setRunning(true);
    setScout("idle");
    setGuardian("idle");
    setHunter("idle");
    setScoutLogs([]);
    setGuardianLogs([]);
    setHunterBrief(null);

    const meta = classify(text);
    const schedule = (ms: number, fn: () => void) =>
      timeouts.current.push(setTimeout(fn, ms));

    // SCOUT
    schedule(150, () => {
      setScout("active");
      setScoutLogs([{ ts: now(), text: `INBOUND :: "${text}"`, tone: "info" }]);
      pushAudit(`[Scout] Inbound SMS received · vernacular pre-processor engaged`, "info");
    });
    schedule(900, () => {
      setScoutLogs((l) => [
        ...l,
        { ts: now(), text: "Vernacular NLP · Swahili/Luganda tokens normalised", tone: "info" },
      ]);
    });
    schedule(1500, () => {
      setScoutLogs((l) => [
        ...l,
        {
          ts: now(),
          text: meta.isDistress
            ? "Sentiment :: DISTRESS · No loan pitch issued · escalating context only"
            : "Sentiment :: TRANSACTIONAL · Packaging context for Guardian",
          tone: meta.isDistress ? "warn" : "ok",
        },
      ]);
      pushAudit("[Gender Proxy Filter] :: Strings stripped of inferred gender markers", "ok");
    });
    schedule(2100, () => {
      setScout("complete");
      setScoutLogs((l) => [
        ...l,
        { ts: now(), text: "Handoff :: payload signed → Guardian", tone: "ok" },
      ]);
    });

    // GUARDIAN
    schedule(2400, () => {
      setGuardian("active");
      setGuardianLogs([
        { ts: now(), text: "Triage opened · TRAIL memory layers engaged", tone: "info" },
      ]);
      setTrailPulse("transient");
    });
    schedule(3000, () => {
      setTrailPulse("relational");
      setGuardianLogs((l) => [
        ...l,
        { ts: now(), text: "Relational :: Opt-in ledger consulted (consent v3.2)", tone: "info" },
      ]);
      pushAudit("[Ethnicity Proxy Anonymization] :: Sub-county hashed before lookup", "ok");
    });
    schedule(3600, () => {
      setTrailPulse("archival");
      setGuardianLogs((l) => [
        ...l,
        { ts: now(), text: "Archival :: Anonymised baseline cohort matched (n=842)", tone: "info" },
      ]);
    });
    schedule(4200, () => {
      setTrailPulse("landrights");
      const overLimit = meta.amount > 15000;
      const decision = meta.isDistress
        ? "ESCALATE · No underwriting on distress signals"
        : overLimit
          ? `ESCALATE · Request KES ${meta.amount.toLocaleString()} exceeds KES 15,000 ceiling`
          : `PRE-APPROVE · KES ${(meta.amount || 12000).toLocaleString()} within RANK envelope`;
      setGuardianLogs((l) => [
        ...l,
        { ts: now(), text: `Land Rights :: Payload locked to af-south-1`, tone: "info" },
        { ts: now(), text: `Decision :: ${decision}`, tone: meta.isDistress ? "warn" : overLimit ? "warn" : "ok" },
      ]);
      pushAudit(`[Guardian] ${decision}`, meta.isDistress || overLimit ? "warn" : "ok");
    });
    schedule(4900, () => {
      setGuardian("complete");
      setTrailPulse(null);
    });

    // HUNTER
    schedule(5100, () => {
      setHunter("active");
    });
    schedule(5900, () => {
      setHunter("complete");
      const overLimit = meta.amount > 15000;
      setHunterBrief({
        age: meta.isDistress ? 41 : 37,
        location: meta.isDistress ? "Busia · Matayos Ward" : "Bungoma · Kanduyi Ward",
        dependents: meta.isDistress ? 4 : 2,
        crop: meta.crop,
        alignment: meta.isDistress
          ? "Off-cycle (pre-planting deficit window)"
          : "Aligned · Maize long-rain harvest +6 days",
        amount: meta.amount || 0,
        purpose: meta.purpose,
        risk: meta.isDistress
          ? "FLAG · Distress signal · refer to social-impact desk, NOT credit"
          : overLimit
            ? "FLAG · Above autonomous ceiling · human review required"
            : "GREEN · Within RANK envelope · co-sign recommended",
        decision: meta.isDistress
          ? "Route to Financial Literacy Coach + County Social Services"
          : overLimit
            ? "Human officer co-approval required"
            : "Auto-issue subject to final officer sign-off",
      });
      pushAudit("[Hunter] Officer Briefing Card compiled · awaiting human sign-off", "ok");
      setRunning(false);
    });
  };

  const killScout = () => {
    clearTimers();
    setScout("frozen-amber");
    setRunning(false);
    pushAudit("[KILL SWITCH *#700#] Scout agent frozen · amber hold", "warn");
  };
  const killGuardian = () => {
    clearTimers();
    setGuardian("frozen-red");
    setRunning(false);
    pushAudit("[KILL SWITCH *#733#] Guardian agent frozen · red hold · underwriting suspended", "err");
  };
  const resetAll = () => {
    clearTimers();
    setScout("idle");
    setGuardian("idle");
    setHunter("idle");
    setScoutLogs([]);
    setGuardianLogs([]);
    setHunterBrief(null);
    setRunning(false);
    pushAudit("[Operator] Console reset · all agents returned to idle", "info");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Bar */}
      <header className="border-b border-border/80 bg-card/40 backdrop-blur">
        <div className="mx-auto max-w-[1600px] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-md bg-primary/15 border border-primary/40 grid place-items-center">
              <Cpu className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-sm tracking-[0.2em] text-muted-foreground uppercase">FinSoko</div>
              <div className="text-base font-semibold leading-tight">
                Digital Pride · Multi-Agent Orchestration Console
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-primary/40 text-primary">
              <Radio className="h-3 w-3 mr-1.5" /> HUNT Protocol v2.4
            </Badge>
            <Badge variant="outline" className="border-emerald-500/40 text-emerald-400">
              <CheckCircle2 className="h-3 w-3 mr-1.5" /> Kenya DPA 2022 · COMPLIANT
            </Badge>
            <span className="text-xs text-muted-foreground tabular-nums ml-2">
              {now()} EAT
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-6 py-6 space-y-6">
        {/* METRICS */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <MetricCard
            icon={<TrendingUp className="h-4 w-4" />}
            label="Financial Inclusion"
            value="+37%"
            sub="Loan approvals · informal market vendors"
            accent="primary"
          />
          <MetricCard
            icon={<Shield className="h-4 w-4" />}
            label="Default Risk Strategy"
            value="< 3.0%"
            sub="Portfolio-At-Risk (PAR) ceiling"
            accent="emerald"
          />
          <MetricCard
            icon={<Activity className="h-4 w-4" />}
            label="Operational Efficiency"
            value="14 hrs"
            sub="Saved per credit officer / week"
            accent="cyan"
          />
          <MetricCard
            icon={<Database className="h-4 w-4" />}
            label="Data Sovereignty"
            value="100%"
            sub="Sovereign custody · AWS Cape Town (af-south-1)"
            accent="violet"
          />
        </section>

        {/* MAIN GRID */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* PHONE / INBOUND */}
          <div className="lg:col-span-3">
            <SectionLabel>Inbound Channel · SMS Simulator</SectionLabel>
            <Card className="bg-card/60 border-border p-4 mt-2">
              <PhoneMock
                draft={draft}
                running={running}
              />
              <div className="mt-4 space-y-2">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  Preset farmer signals
                </div>
                {PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setDraft(p.text)}
                    className="w-full text-left rounded-md border border-border/80 bg-secondary/40 hover:bg-secondary px-3 py-2 transition-colors"
                  >
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      {p.label}
                    </div>
                    <div className="text-xs mt-1 text-foreground/90 leading-snug">"{p.text}"</div>
                  </button>
                ))}
              </div>
              <Textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Type a custom inbound SMS…"
                className="mt-3 bg-input/60 border-border text-sm min-h-[72px]"
              />
              <div className="flex gap-2 mt-3">
                <Button
                  className="flex-1"
                  disabled={running || !draft.trim()}
                  onClick={() => runSimulation(draft)}
                >
                  {running ? "Running HUNT…" : "Dispatch to Scout"}
                </Button>
                <Button variant="outline" onClick={resetAll} disabled={running}>
                  Reset
                </Button>
              </div>
            </Card>
          </div>

          {/* AGENTS */}
          <div className="lg:col-span-9 grid grid-cols-1 xl:grid-cols-3 gap-4">
            <AgentCard
              index={1}
              name="Scout Agent"
              role="Financial Literacy Coach"
              state={scout}
              rank={{
                R: "Literacy Coach",
                A: "Max 3 SMS/day · No loan pitches",
                N: "Escalate on 'Loan Shark' keywords",
              }}
              killLabel="KILL SWITCH · USSD *#700#"
              killTone="amber"
              onKill={killScout}
              icon={<Signal className="h-4 w-4" />}
            >
              <LogStream logs={scoutLogs} empty="Awaiting inbound dispatch…" />
            </AgentCard>

            <AgentCard
              index={2}
              name="Guardian Agent"
              role="Loan Triage System"
              state={guardian}
              rank={{
                R: "Underwriting Triage",
                A: "Approvals ≤ KES 15,000 only",
                N: "Escalate if > KES 15K or > 2 children under 5",
              }}
              killLabel="KILL SWITCH · USSD *#733#"
              killTone="red"
              onKill={killGuardian}
              icon={<Shield className="h-4 w-4" />}
            >
              <TrailMap active={trailPulse} />
              <LogStream logs={guardianLogs} empty="Triage queue empty." />
            </AgentCard>

            <AgentCard
              index={3}
              name="Hunter Agent"
              role="Human-in-the-Loop Liaison"
              state={hunter}
              rank={{
                R: "Briefing Compiler",
                A: "Read-only · No autonomous disbursement",
                N: "Always route to human officer board",
              }}
              icon={<Users className="h-4 w-4" />}
            >
              <BriefingCard brief={hunterBrief} />
            </AgentCard>
          </div>
        </section>

        {/* GUARDRAILS + AUDIT */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Card className="lg:col-span-5 bg-card/60 border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <SectionLabel>System Guardrails</SectionLabel>
                <div className="text-base font-semibold mt-1">Active validation states</div>
              </div>
              <Lock className="h-4 w-4 text-muted-foreground" />
            </div>
            <ul className="space-y-2">
              <GuardItem label="Gender Proxy Filtering" status="ACTIVE" tone="ok" />
              <GuardItem label="Ethnicity Proxy Anonymization" status="ACTIVE" tone="ok" />
              <GuardItem label="Busia County Cross-Border Kill Switch" status="MONITORING" tone="warn" />
              <GuardItem label="k-Anonymity Cohort Depth (k=15)" status="ENFORCED" tone="ok" />
              <GuardItem label="180-day Session Scrub (Kenya DPA 2022)" status="ON SCHEDULE" tone="ok" />
              <GuardItem label="AWS af-south-1 Region Lock" status="LOCKED" tone="ok" />
            </ul>
          </Card>

          <Card className="lg:col-span-7 bg-card/60 border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <SectionLabel>Regulatory Audit Trail</SectionLabel>
                <div className="text-base font-semibold mt-1">
                  Immutable console · append-only
                </div>
              </div>
              <Badge variant="outline" className="border-emerald-500/40 text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
                LIVE
              </Badge>
            </div>
            <div className="rounded-md bg-background/80 border border-border font-mono text-[11px] leading-relaxed p-3 h-[260px] overflow-y-auto">
              {auditLogs.map((l, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-muted-foreground shrink-0">{l.ts}</span>
                  <span
                    className={
                      l.tone === "ok"
                        ? "text-emerald-300"
                        : l.tone === "warn"
                          ? "text-amber-300"
                          : l.tone === "err"
                            ? "text-rose-300"
                            : "text-foreground/85"
                    }
                  >
                    {l.text}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <footer className="text-[11px] text-muted-foreground/80 flex flex-wrap items-center justify-between gap-2 pt-2 pb-6">
          <span>FinSoko · Digital Pride · Visual prototype for regulatory board review</span>
          <span>Aligned with matooke + maize harvest cycles · Kenya DPA 2022 · Republic of Kenya</span>
        </footer>
      </main>
    </div>
  );
}

/* ---------- subcomponents ---------- */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
      {children}
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  accent: "primary" | "emerald" | "cyan" | "violet";
}) {
  const ring = {
    primary: "border-primary/30",
    emerald: "border-emerald-500/30",
    cyan: "border-cyan-500/30",
    violet: "border-violet-500/30",
  }[accent];
  const txt = {
    primary: "text-primary",
    emerald: "text-emerald-400",
    cyan: "text-cyan-400",
    violet: "text-violet-400",
  }[accent];
  return (
    <Card className={`bg-card/60 ${ring} p-5 relative overflow-hidden`}>
      <div className="flex items-center justify-between">
        <SectionLabel>{label}</SectionLabel>
        <span className={`${txt}`}>{icon}</span>
      </div>
      <div className={`mt-3 text-3xl font-semibold tracking-tight ${txt}`}>{value}</div>
      <div className="text-xs text-muted-foreground mt-1 leading-snug">{sub}</div>
      <div className={`absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-40 ${txt}`} />
    </Card>
  );
}

function PhoneMock({ draft, running }: { draft: string; running: boolean }) {
  return (
    <div className="mx-auto w-full max-w-[240px] rounded-[28px] border border-border bg-background/80 p-2 shadow-inner">
      <div className="rounded-[22px] bg-card border border-border/80 overflow-hidden">
        <div className="flex items-center justify-between px-3 py-1.5 text-[10px] text-muted-foreground border-b border-border/60">
          <span>Safaricom</span>
          <div className="flex items-center gap-1">
            <Signal className="h-3 w-3" />
            <Battery className="h-3 w-3" />
          </div>
        </div>
        <div className="px-3 py-3 space-y-2 min-h-[170px]">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            To: FinSoko · 22377
          </div>
          <div className="rounded-lg bg-secondary/70 border border-border/60 px-3 py-2 text-[11px] leading-snug">
            {draft || <span className="text-muted-foreground">No message drafted…</span>}
          </div>
          {running && (
            <div className="text-[10px] text-primary flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Sending over GSM…
            </div>
          )}
        </div>
        <div className="border-t border-border/60 px-3 py-2 text-[10px] text-muted-foreground">
          Reply STOP to unsubscribe · KE
        </div>
      </div>
    </div>
  );
}

function AgentCard({
  index,
  name,
  role,
  state,
  rank,
  killLabel,
  killTone,
  onKill,
  icon,
  children,
}: {
  index: number;
  name: string;
  role: string;
  state: AgentState;
  rank: { R: string; A: string; N: string };
  killLabel?: string;
  killTone?: "amber" | "red";
  onKill?: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  const frozen = state === "frozen-amber" || state === "frozen-red";
  const ring =
    state === "active"
      ? "border-primary/60 shadow-[0_0_0_1px_var(--color-primary)]"
      : state === "complete"
        ? "border-emerald-500/40"
        : state === "frozen-amber"
          ? "border-amber-500/60"
          : state === "frozen-red"
            ? "border-rose-600/60"
            : "border-border";
  const dot =
    state === "active"
      ? "bg-primary animate-pulse"
      : state === "complete"
        ? "bg-emerald-400"
        : state === "frozen-amber"
          ? "bg-amber-400"
          : state === "frozen-red"
            ? "bg-rose-500"
            : "bg-muted-foreground/50";
  return (
    <Card className={`bg-card/70 border ${ring} p-4 flex flex-col gap-3 transition-shadow`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-md bg-secondary border border-border grid place-items-center">
            {icon}
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Agent 0{index}
            </div>
            <div className="text-sm font-semibold leading-tight">{name}</div>
            <div className="text-[11px] text-muted-foreground">{role}</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider">
          <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
          <span className="text-muted-foreground">
            {frozen ? "Frozen" : state === "idle" ? "Idle" : state === "active" ? "Active" : "Done"}
          </span>
        </div>
      </div>

      <div className="rounded-md bg-background/60 border border-border/70 p-2.5 text-[10.5px] leading-relaxed font-mono">
        <span className="text-primary">RANK</span>{" "}
        <span className="text-muted-foreground">[</span>
        <div className="pl-3">
          <div><span className="text-emerald-400">R</span>: {rank.R}</div>
          <div><span className="text-emerald-400">A</span>: {rank.A}</div>
          <div><span className="text-emerald-400">N</span>: {rank.N}</div>
        </div>
        <span className="text-muted-foreground">]</span>
      </div>

      <div className="flex-1">{children}</div>

      {killLabel && (
        <button
          onClick={onKill}
          disabled={frozen}
          className={`group flex items-center justify-center gap-2 w-full rounded-md border px-3 py-2 text-[11px] uppercase tracking-wider font-medium transition-colors ${
            killTone === "red"
              ? "border-rose-600/50 text-rose-300 hover:bg-rose-950/40"
              : "border-amber-500/50 text-amber-300 hover:bg-amber-950/30"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <Power className="h-3.5 w-3.5" />
          {killLabel}
        </button>
      )}
    </Card>
  );
}

function LogStream({ logs, empty }: { logs: LogLine[]; empty: string }) {
  return (
    <div className="rounded-md bg-background/70 border border-border/70 font-mono text-[10.5px] leading-relaxed p-2.5 h-[170px] overflow-y-auto">
      {logs.length === 0 && (
        <div className="text-muted-foreground/70 italic">{empty}</div>
      )}
      {logs.map((l, i) => (
        <div key={i} className="flex gap-2">
          <span className="text-muted-foreground shrink-0">{l.ts}</span>
          <span
            className={
              l.tone === "ok"
                ? "text-emerald-300"
                : l.tone === "warn"
                  ? "text-amber-300"
                  : l.tone === "err"
                    ? "text-rose-300"
                    : "text-foreground/85"
            }
          >
            {l.text}
          </span>
        </div>
      ))}
    </div>
  );
}

function TrailMap({ active }: { active: string | null }) {
  const items: { id: string; label: string; sub: string }[] = [
    { id: "transient", label: "Transient", sub: "Active payload processing" },
    { id: "relational", label: "Relational", sub: "Opt-in ledger logs" },
    { id: "archival", label: "Archival", sub: "Anonymized baselines" },
    { id: "landrights", label: "Land Rights", sub: "Locked · AWS Cape Town" },
  ];
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">
        TRAIL Memory Architecture
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {items.map((it) => {
          const on = active === it.id;
          return (
            <div
              key={it.id}
              className={`rounded-md border px-2 py-1.5 text-[10px] transition-colors ${
                on
                  ? "border-primary/70 bg-primary/10 text-primary"
                  : "border-border/70 bg-background/40 text-muted-foreground"
              }`}
            >
              <div className="font-semibold tracking-wide">
                {on && "● "}{it.label}
              </div>
              <div className="text-[9.5px] opacity-80 leading-tight">{it.sub}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BriefingCard({
  brief,
}: {
  brief: null | {
    age: number;
    location: string;
    dependents: number;
    crop: string;
    alignment: string;
    amount: number;
    risk: string;
    decision: string;
    purpose: string;
  };
}) {
  if (!brief) {
    return (
      <div className="rounded-md bg-background/70 border border-dashed border-border/70 p-4 h-[230px] grid place-items-center text-center">
        <div className="text-[11px] text-muted-foreground">
          <FileText className="h-5 w-5 mx-auto mb-2 opacity-60" />
          Awaiting upstream agents…
          <div className="text-[10px] mt-1">
            Briefing card materialises after Scout + Guardian complete.
          </div>
        </div>
      </div>
    );
  }
  const isFlag = brief.risk.startsWith("FLAG");
  const isDistress = brief.risk.toLowerCase().includes("distress");
  return (
    <div className="rounded-md bg-background/80 border border-border p-3 text-[11px] space-y-2">
      <div className="flex items-center justify-between border-b border-border/70 pb-2">
        <div className="font-semibold text-foreground">Human Credit Officer Briefing</div>
        <Badge
          variant="outline"
          className={
            isDistress
              ? "border-rose-500/50 text-rose-300"
              : isFlag
                ? "border-amber-500/50 text-amber-300"
                : "border-emerald-500/50 text-emerald-300"
          }
        >
          {isDistress ? "SOCIAL · NOT CREDIT" : isFlag ? "OFFICER REVIEW" : "GREEN PATH"}
        </Badge>
      </div>
      <BriefRow k="Applicant Age" v={`${brief.age} yrs`} />
      <BriefRow k="Sub-County" v={brief.location} />
      <BriefRow k="Dependents (under 5)" v={String(brief.dependents)} />
      <BriefRow k="Primary Crop" v={brief.crop} />
      <BriefRow k="Harvest Alignment" v={brief.alignment} />
      <BriefRow
        k="Requested Amount"
        v={brief.amount ? `KES ${brief.amount.toLocaleString()}` : "—"}
      />
      <BriefRow k="Stated Purpose" v={brief.purpose} />
      <div className="border-t border-border/70 pt-2">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
          Risk Flag
        </div>
        <div
          className={`flex items-start gap-1.5 mt-0.5 ${
            isDistress ? "text-rose-300" : isFlag ? "text-amber-300" : "text-emerald-300"
          }`}
        >
          {isDistress || isFlag ? (
            <AlertTriangle className="h-3.5 w-3.5 mt-px shrink-0" />
          ) : (
            <CheckCircle2 className="h-3.5 w-3.5 mt-px shrink-0" />
          )}
          <span>{brief.risk}</span>
        </div>
      </div>
      <div className="rounded bg-secondary/60 border border-border/70 px-2 py-1.5 text-[10.5px]">
        <span className="text-muted-foreground">Recommended action · </span>
        {brief.decision}
      </div>
    </div>
  );
}

function BriefRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</span>
      <span className="text-foreground/90 text-right">{v}</span>
    </div>
  );
}

function GuardItem({
  label,
  status,
  tone,
}: {
  label: string;
  status: string;
  tone: "ok" | "warn";
}) {
  return (
    <li className="flex items-center justify-between rounded-md border border-border/70 bg-background/40 px-3 py-2">
      <div className="flex items-center gap-2 text-sm">
        {tone === "ok" ? (
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
        ) : (
          <AlertTriangle className="h-4 w-4 text-amber-400" />
        )}
        <span>{label}</span>
      </div>
      <span
        className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border ${
          tone === "ok"
            ? "border-emerald-500/40 text-emerald-300 bg-emerald-950/30"
            : "border-amber-500/40 text-amber-300 bg-amber-950/30"
        }`}
      >
        {status}
      </span>
    </li>
  );
}
