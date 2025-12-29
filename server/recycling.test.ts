import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

function createAuthContext(role: 'user' | 'admin' = 'user'): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("leaderboard.getTopSessions", () => {
  it("returns leaderboard data without authentication", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.leaderboard.getTopSessions({ period: "week", limit: 10 });

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });

  it("accepts limit parameter", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.leaderboard.getTopSessions({ period: "week", limit: 5 });

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeLessThanOrEqual(5);
  });
});

describe("machine.getStatus", () => {
  it("returns machine status for a given machineId", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.machine.getStatus({ machineId: "090373" });

    expect(result).toBeDefined();
    expect(result.machineId).toBe("090373");
    expect(["operational", "maintenance", "offline", "full", "error", "door_open"]).toContain(result.status);
    // Check that allTimeTotal is defined (may be from backbone or default)
    expect(result.allTimeTotal).toBeDefined();
  });
});

describe("locations.list", () => {
  it("returns list of locations without authentication", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.locations.list();

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("wally.chat", () => {
  it("responds to a simple greeting in Dutch", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.wally.chat({
      messages: [{ role: "user", content: "Hallo!" }],
      language: "nl",
    });

    expect(result).toBeDefined();
    expect(typeof result.message).toBe("string");
    expect(result.message.length).toBeGreaterThan(0);
  });
});

describe("abTest.trackEvent", () => {
  it("accepts a valid A/B test event", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.abTest.trackEvent({
      testName: "test-popup",
      variantKey: "A",
      visitorId: "test-visitor-123",
      eventType: "impression",
    });

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
  });
});

describe("drop.isQueueAvailable", () => {
  it("returns queue availability status", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.drop.isQueueAvailable();

    expect(result).toBeDefined();
    expect(typeof result.available).toBe("boolean");
  });
});
