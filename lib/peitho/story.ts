// The scripted cold open — the real story of how we got into this hackathon,
// priced as a live market. FULLY DETERMINISTIC: hardcoded beats, ZERO live model
// calls. Each beat shifts the odds and the spread. Reuses the SAME derivation as
// the real engine, so the story's gauge behaves identically to the board's.

import type { ModelBet } from "./types";

export type StoryBeat = {
  title: string; // the development
  narration: string; // what just happened
  bets: ModelBet[]; // the panel's read after this beat
  media?: { image?: string; alt?: string; loadingBar?: boolean }; // optional proof
  signal?: boolean; // show a "signal detected" badge on this beat
};

const mb = (
  model: string,
  price: number,
  confidence: number,
  rationale: string,
): ModelBet => ({ model, price, confidence, rationale, signalsUsed: [], toolCalls: [] });

export const STORY_PROSPECT = {
  name: "Abed → AI Growth Hackathon",
  initials: "AB",
};

export const STORY_BEATS: StoryBeat[] = [
  {
    title: "T-minus one day",
    narration:
      "I found out about this hackathon on Friday — one day before it started, and applications had effectively closed.",
    media: { image: "/story/tomas-tweet.jpg", alt: "How I found out — the Orange Slice hackathon invite" },
    bets: [
      mb("claude", 2, 0.5, "A day out, with the window structurally closed. Brutal odds."),
      mb("gpt", 1, 0.62, "No realistic path I can see — timing is fatal here."),
      mb("gemini", 1, 0.45, "No momentum, just an intention. Nothing to price up."),
      mb("grok", 0, 0.4, "Nothing live to confirm. This basically doesn't happen."),
    ],
  },
  {
    title: "Wait — I know that name",
    narration:
      "The organizer is Orange Slice. The name is familiar — I'd been on a prospect call with their CEO, Vihaar, about a year ago.",
    signal: true,
    media: { image: "/story/hackathon-banner.png", alt: "AI Growth Hackathon by Orange Slice" },
    bets: [
      mb("claude", 14, 0.6, "A prior relationship with the organizer is exactly the warm edge that moves this."),
      mb("gpt", 8, 0.55, "A year-old call isn't a trigger — but it is a door."),
      mb("gemini", 9, 0.5, "A network signal appears; still nothing concrete."),
      mb("grok", 9, 0.52, "A real human connection. I'll weight that up a little."),
    ],
  },
  {
    title: "The cold email",
    narration:
      "So I email Vihaar directly — remind him of the call, mention I'm in town, and ask if there's any chance to get us in.",
    media: { image: "/story/email-to-vihaar.png", alt: "Email to Vihaar asking to join" },
    bets: [
      mb("claude", 18, 0.62, "He took the ask straight to the decision-maker. Correct move."),
      mb("gpt", 13, 0.55, "A reach-out isn't a yes, but the funnel is moving."),
      mb("gemini", 14, 0.5, "Intent is now an action — a slight lift."),
      mb("grok", 15, 0.55, "He shot his shot. That's a live attempt."),
    ],
  },
  {
    title: "Vihaar forwards it to YC",
    narration:
      "Vihaar replies: “Just forwarded this to the YC team, would love to have you!” — the CEO himself, vouching.",
    media: { image: "/story/vihaar-reply.png", alt: "Vihaar replies and forwards to YC" },
    bets: [
      mb("claude", 34, 0.78, "Founder vouch plus an internal forward — that's real institutional pull."),
      mb("gpt", 28, 0.72, "A warm intro in motion this minute. Strong, time-sensitive trigger."),
      mb("gemini", 30, 0.7, "The funnel is advancing fast now."),
      mb("grok", 28, 0.7, "The CEO says yes in writing. Hard to argue with."),
    ],
  },
  {
    title: "YC says it's full",
    narration:
      "Then YC operations comes back: the event is full. Does a founder's vouch override an ops “no”? The panel splits.",
    media: { image: "/story/yc-rejection.png", alt: "YC rejection — the event is full" },
    bets: [
      mb("claude", 28, 0.58, "A founder vouch usually beats ops capacity — I stay relatively high."),
      mb("gpt", 12, 0.6, "“Full” is a hard stop. This likely doesn't close in time."),
      mb("gemini", 18, 0.5, "Momentum stalled against a capacity wall."),
      mb("grok", 22, 0.55, "Founder intent is still live; ops is a process detail. I hold."),
    ],
  },
  {
    title: "Show up anyway",
    narration:
      "We show up in person. I spot Vihaar through the window, catch him on camera, and make the case. Vihaar: “Fifty-fifty I can get you in.”",
    media: { image: "/story/vihaar-window.png", alt: "Vihaar at the window" },
    bets: [
      mb("claude", 52, 0.7, "In person, and the founder himself put it at 50/50. A live coin flip."),
      mb("gpt", 46, 0.66, "A genuine coin flip — but it's happening in real time, in the room."),
      mb("gemini", 50, 0.64, "Momentum is back; the outcome is truly open."),
      mb("grok", 52, 0.7, "He's talking to us face to face. That's as live as a signal gets."),
    ],
  },
  {
    title: "We're in",
    narration:
      "We queue. We wait. And in the end — we're in. From 1% to a market we closed in person.",
    media: { image: "/story/were-in.png", alt: "We made it in" },
    bets: [
      mb("claude", 99, 0.95, "Resolved in the room — relationship, presence, and persistence."),
      mb("gpt", 100, 0.96, "Converted. The timing question is finally answered."),
      mb("gemini", 99, 0.93, "Full momentum. Done."),
      mb("grok", 100, 0.95, "Physically inside. Confirmed."),
    ],
  },
];
