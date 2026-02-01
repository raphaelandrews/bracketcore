"use client";

import { MatchCard, type Match } from "@bracketcore/registry";

const completed: Match = {
  id: "demo-completed",
  round: 0,
  position: 0,
  bestOf: 3,
  status: "completed",
  teams: [
    {
      team: { id: "team-liquid", name: "Team Liquid" },
      score: 2,
      isWinner: true,
    },
    {
      team: { id: "og", name: "OG" },
      score: 0,
      isWinner: false,
    },
  ],
};

function todayAt(hours: number, minutes: number) {
  const d = new Date();
  d.setHours(hours, minutes, 0, 0);
  return d;
}

function daysFromNow(days: number, hours: number, minutes: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hours, minutes, 0, 0);
  return d;
}

const live: Match = {
  id: "demo-live",
  round: 0,
  position: 0,
  bestOf: 5,
  status: "live",
  scheduledAt: todayAt(14, 0),
  teams: [
    {
      team: { id: "evil-geniuses", name: "Evil Geniuses" },
      score: 2,
    },
    {
      team: { id: "team-secret", name: "Team Secret" },
      score: 1,
    },
  ],
};

const upcoming: Match = {
  id: "demo-upcoming",
  round: 0,
  position: 0,
  bestOf: 3,
  status: "upcoming",
  scheduledAt: daysFromNow(1, 18, 0),
  teams: [
    {
      team: { id: "navi", name: "NaVi" },
      score: 0,
    },
    {
      team: { id: "virtus-pro", name: "Virtus.pro" },
      score: 0,
    },
  ],
};

const scheduled: Match = {
  id: "demo-scheduled",
  round: 0,
  position: 0,
  bestOf: 3,
  status: "upcoming",
  scheduledAt: daysFromNow(3, 16, 30),
  teams: [
    { team: null, score: 0 },
    { team: null, score: 0 },
  ],
};

const tbd: Match = {
  id: "demo-tbd",
  round: 0,
  position: 0,
  bestOf: 5,
  status: "upcoming",
  teams: [
    { team: null, score: 0 },
    { team: null, score: 0 },
  ],
};

function PreviewWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="not-prose flex items-center justify-center h-72 w-full p-10 rounded-xl">
      {children}
    </div>
  );
}

export function MatchCardPreview() {
  return (
    <PreviewWrapper>
      <MatchCard match={completed} />
    </PreviewWrapper>
  );
}

export function MatchCardLive() {
  return (
    <PreviewWrapper>
      <MatchCard match={live} />
    </PreviewWrapper>
  );
}

export function MatchCardUpcoming() {
  return (
    <PreviewWrapper>
      <MatchCard match={upcoming} />
    </PreviewWrapper>
  );
}

export function MatchCardScheduled() {
  return (
    <PreviewWrapper>
      <MatchCard match={scheduled} />
    </PreviewWrapper>
  );
}

export function MatchCardTBD() {
  return (
    <PreviewWrapper>
      <MatchCard match={tbd} />
    </PreviewWrapper>
  );
}
