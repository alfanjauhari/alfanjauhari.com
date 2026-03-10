import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { asc, eq, notInArray } from "drizzle-orm";
import z from "zod";
import { client } from "@/db/client";
import { statusProfilesTable, statusStocksTable } from "@/db/schemas/status";
import { serverEnv } from "@/env/server";
import logger from "@/lib/logger";
import { adminMiddleware } from "@/middleware/auth";

const STATUS_SCOPE = "global";
const WEATHER_SYNC_INTERVAL_MS = 30 * 60 * 1000;
const STOCK_SYNC_INTERVAL_MS = 15 * 60 * 1000;
const STEAM_SYNC_INTERVAL_MS = 30 * 1000;

const WEATHER_CODE_MAP: Record<number, string> = {
  0: "Clear Sky",
  1: "Mostly Clear",
  2: "Partly Cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Rime Fog",
  51: "Light Drizzle",
  53: "Drizzle",
  55: "Heavy Drizzle",
  56: "Freezing Drizzle",
  57: "Heavy Freezing Drizzle",
  61: "Light Rain",
  63: "Rain",
  65: "Heavy Rain",
  66: "Freezing Rain",
  67: "Heavy Freezing Rain",
  71: "Light Snow",
  73: "Snow",
  75: "Heavy Snow",
  77: "Snow Grains",
  80: "Rain Showers",
  81: "Heavy Showers",
  82: "Violent Showers",
  85: "Snow Showers",
  86: "Heavy Snow Showers",
  95: "Thunderstorm",
  96: "Thunderstorm With Hail",
  99: "Severe Thunderstorm",
};

type SteamPlayingSnapshot = {
  title: string;
  appId?: string | null;
  syncedAt: Date;
};

let steamPlayingCache: {
  value: SteamPlayingSnapshot | null;
  syncedAt: number;
} | null = null;

const UpdateStatusProfileSchema = z.object({
  timezone: z.string().min(1),
  locationLabel: z.string().min(1),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  focusText: z.string().nullable(),
  focusProgress: z.number().int().min(0).max(100).nullable(),
  projectName: z.string().nullable(),
  projectMilestone: z.string().nullable(),
  projectProgress: z.number().int().min(0).max(100).nullable(),
  projectStatus: z.string().nullable(),
  readingTitle: z.string().nullable(),
  readingAuthor: z.string().nullable(),
  readingProgress: z.number().int().min(0).max(100).nullable(),
  playingTitle: z.string().nullable(),
  playingPlatform: z.string().nullable(),
  weatherManualSummary: z.string().nullable(),
  weatherManualTempC: z.number().min(-100).max(100).nullable(),
});

const SaveStatusStocksSchema = z.object({
  symbols: z.array(z.string().min(1)).max(12),
});

function normalizeNullableText(value: string | null | undefined) {
  const normalized = value?.trim() ?? "";
  return normalized.length ? normalized : null;
}

async function ensureStatusProfile() {
  await client
    .insert(statusProfilesTable)
    .values({
      scope: STATUS_SCOPE,
    })
    .onConflictDoNothing({ target: statusProfilesTable.scope });

  return client
    .select()
    .from(statusProfilesTable)
    .where(eq(statusProfilesTable.scope, STATUS_SCOPE))
    .limit(1)
    .then((rows) => rows[0]);
}

async function syncWeather(force = false) {
  const profile = await ensureStatusProfile();

  if (!profile) {
    return null;
  }

  const isStale =
    !profile.weatherSyncedAt ||
    Date.now() - profile.weatherSyncedAt.getTime() > WEATHER_SYNC_INTERVAL_MS;

  if (!force && !isStale) {
    return profile;
  }

  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${profile.latitude}&longitude=${profile.longitude}&current=temperature_2m,weather_code`,
    );

    if (!response.ok) {
      return profile;
    }

    const payload = (await response.json()) as {
      current?: {
        temperature_2m?: number;
        weather_code?: number;
      };
    };

    const weatherCode = payload.current?.weather_code;
    const weatherSummary =
      typeof weatherCode === "number"
        ? (WEATHER_CODE_MAP[weatherCode] ?? "Weather")
        : null;
    const temperature =
      typeof payload.current?.temperature_2m === "number"
        ? payload.current.temperature_2m
        : null;

    const result = await client
      .update(statusProfilesTable)
      .set({
        weatherAutoSummary: weatherSummary,
        weatherAutoTempC: temperature,
        weatherSyncedAt: new Date(),
      })
      .where(eq(statusProfilesTable.id, profile.id))
      .returning();

    return result[0] ?? profile;
  } catch (error) {
    logger.error(error);
    return profile;
  }
}

async function syncStocks(force = false) {
  const stocks = await client
    .select()
    .from(statusStocksTable)
    .orderBy(asc(statusStocksTable.sortOrder), asc(statusStocksTable.symbol));

  if (!stocks.length) {
    return stocks;
  }

  const staleThreshold = new Date(Date.now() - STOCK_SYNC_INTERVAL_MS);
  const hasStaleData = stocks.some(
    (stock) => !stock.syncedAt || stock.syncedAt < staleThreshold,
  );

  if (!force && !hasStaleData) {
    return stocks;
  }

  const symbols = stocks.map((stock) => stock.symbol).join(",");

  try {
    const response = await fetch(
      `https://query2.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(symbols)}`,
    );

    if (!response.ok) {
      return stocks;
    }

    const payload = (await response.json()) as {
      quoteResponse?: {
        result?: Array<{
          symbol?: string;
          regularMarketPrice?: number;
          regularMarketChangePercent?: number;
          currency?: string;
        }>;
      };
    };

    const quoteBySymbol = new Map(
      (payload.quoteResponse?.result ?? [])
        .filter((quote) => quote.symbol)
        .map((quote) => [quote.symbol as string, quote]),
    );

    await client.transaction(async (trx) => {
      for (const stock of stocks) {
        const quote = quoteBySymbol.get(stock.symbol);

        if (!quote) {
          continue;
        }

        await trx
          .update(statusStocksTable)
          .set({
            autoPrice:
              typeof quote.regularMarketPrice === "number"
                ? quote.regularMarketPrice
                : null,
            autoChangePercent:
              typeof quote.regularMarketChangePercent === "number"
                ? quote.regularMarketChangePercent
                : null,
            currency: quote.currency ?? null,
            delayed: true,
            syncedAt: new Date(),
          })
          .where(eq(statusStocksTable.id, stock.id));
      }
    });

    return client
      .select()
      .from(statusStocksTable)
      .orderBy(asc(statusStocksTable.sortOrder), asc(statusStocksTable.symbol));
  } catch (error) {
    logger.error(error);
    return stocks;
  }
}

async function syncSteamPlaying() {
  const apiKey = serverEnv.STEAM_API_KEY;
  const steamId = serverEnv.STEAM_ID;

  if (!apiKey || !steamId) {
    return null;
  }

  if (
    steamPlayingCache &&
    Date.now() - steamPlayingCache.syncedAt < STEAM_SYNC_INTERVAL_MS
  ) {
    return steamPlayingCache.value;
  }

  try {
    const response = await fetch(
      `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${encodeURIComponent(
        apiKey,
      )}&steamids=${encodeURIComponent(steamId)}`,
    );

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as {
      response?: {
        players?: Array<{
          gameextrainfo?: string;
          gameid?: string;
        }>;
      };
    };

    const player = payload.response?.players?.[0];
    const title = player?.gameextrainfo?.trim();
    const appId = player?.gameid ?? null;

    const value = title
      ? {
          title,
          appId,
          syncedAt: new Date(),
        }
      : null;

    steamPlayingCache = {
      value,
      syncedAt: Date.now(),
    };

    return value;
  } catch (error) {
    logger.error(error);
    return null;
  }
}

function buildStatusSnapshot(data: {
  profile: Awaited<ReturnType<typeof ensureStatusProfile>> | null;
  stocks: Awaited<ReturnType<typeof syncStocks>>;
  steamPlaying: Awaited<ReturnType<typeof syncSteamPlaying>>;
}) {
  const { profile, stocks, steamPlaying } = data;

  if (!profile) {
    return null;
  }

  const hasWeatherManualOverride =
    profile.weatherManualSummary !== null ||
    profile.weatherManualTempC !== null;

  return {
    profile: {
      ...profile,
      playingTitle: steamPlaying?.title ?? profile.playingTitle,
      playingPlatform: steamPlaying?.title ? "Steam" : profile.playingPlatform,
      weather: {
        summary: profile.weatherManualSummary ?? profile.weatherAutoSummary,
        tempC: profile.weatherManualTempC ?? profile.weatherAutoTempC,
        syncedAt: profile.weatherSyncedAt,
        source: hasWeatherManualOverride ? "manual" : "auto",
      },
    },
    stocks,
  };
}

async function getStatusSnapshot() {
  const profile = await syncWeather();
  const stocks = await syncStocks();
  const steamPlaying = await syncSteamPlaying();

  return buildStatusSnapshot({ profile, stocks, steamPlaying });
}

export const getPublicStatusSnapshotFn = createServerFn().handler(async () =>
  getStatusSnapshot(),
);

export const getPublicStatusSnapshotQueryOptions = queryOptions({
  queryKey: ["public-status-snapshot"],
  queryFn: getPublicStatusSnapshotFn,
  refetchInterval: 15_000,
});

export const getAdminStatusSnapshotFn = createServerFn()
  .middleware([adminMiddleware])
  .handler(async () => getStatusSnapshot());

export const getAdminStatusSnapshotQueryOptions = queryOptions({
  queryKey: ["admin-status-snapshot"],
  queryFn: getAdminStatusSnapshotFn,
});

export const updateStatusProfileFn = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .inputValidator(UpdateStatusProfileSchema)
  .handler(async ({ data }) => {
    const profile = await ensureStatusProfile();

    if (!profile) {
      return false;
    }

    await client
      .update(statusProfilesTable)
      .set({
        timezone: data.timezone,
        locationLabel: data.locationLabel,
        latitude: data.latitude,
        longitude: data.longitude,
        focusText: normalizeNullableText(data.focusText),
        focusProgress: data.focusProgress,
        projectName: normalizeNullableText(data.projectName),
        projectMilestone: normalizeNullableText(data.projectMilestone),
        projectProgress: data.projectProgress,
        projectStatus: normalizeNullableText(data.projectStatus),
        readingTitle: normalizeNullableText(data.readingTitle),
        readingAuthor: normalizeNullableText(data.readingAuthor),
        readingProgress: data.readingProgress,
        playingTitle: normalizeNullableText(data.playingTitle),
        playingPlatform: normalizeNullableText(data.playingPlatform),
        weatherManualSummary: normalizeNullableText(data.weatherManualSummary),
        weatherManualTempC: data.weatherManualTempC,
      })
      .where(eq(statusProfilesTable.id, profile.id));

    return true;
  });

export const updateStatusProfileMutationOptions = mutationOptions({
  mutationKey: ["update-status-profile"],
  mutationFn: updateStatusProfileFn,
});

export const saveStatusStocksFn = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .inputValidator(SaveStatusStocksSchema)
  .handler(async ({ data }) => {
    const symbols = Array.from(
      new Set(
        data.symbols
          .map((symbol) => symbol.trim().toUpperCase())
          .filter(Boolean),
      ),
    );

    await client.transaction(async (trx) => {
      if (symbols.length) {
        await trx
          .delete(statusStocksTable)
          .where(notInArray(statusStocksTable.symbol, symbols));
      } else {
        await trx.delete(statusStocksTable);
      }

      for (const [index, symbol] of symbols.entries()) {
        await trx
          .insert(statusStocksTable)
          .values({
            symbol,
            sortOrder: index,
          })
          .onConflictDoUpdate({
            target: statusStocksTable.symbol,
            set: {
              sortOrder: index,
            },
          });
      }
    });

    await syncStocks(true);

    return true;
  });

export const saveStatusStocksMutationOptions = mutationOptions({
  mutationKey: ["save-status-stocks"],
  mutationFn: saveStatusStocksFn,
});

export const refreshStatusWeatherFn = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .handler(async () => {
    await syncWeather(true);
    return true;
  });

export const refreshStatusStocksFn = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .handler(async () => {
    await syncStocks(true);
    return true;
  });

export const refreshStatusWeatherMutationOptions = mutationOptions({
  mutationKey: ["refresh-status-weather"],
  mutationFn: refreshStatusWeatherFn,
});

export const refreshStatusStocksMutationOptions = mutationOptions({
  mutationKey: ["refresh-status-stocks"],
  mutationFn: refreshStatusStocksFn,
});
