import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { RefreshCcwIcon } from "lucide-react";
import { type FormEvent, useMemo } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  getAdminStatusSnapshotQueryOptions,
  refreshStatusStocksFn,
  refreshStatusWeatherFn,
  saveStatusStocksMutationOptions,
  updateStatusProfileMutationOptions,
} from "@/fns/polymorphic/status";

function parseNullableText(formData: FormData, name: string) {
  const value = formData.get(name);
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();
  return normalized.length ? normalized : null;
}

function parseNullableNumber(formData: FormData, name: string) {
  const value = formData.get(name);

  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();
  if (!normalized.length) {
    return null;
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

export function StatusPanel() {
  const queryClient = useQueryClient();
  const { data } = useSuspenseQuery(getAdminStatusSnapshotQueryOptions);

  const updateProfileMutation = useMutation(updateStatusProfileMutationOptions);
  const saveStocksMutation = useMutation(saveStatusStocksMutationOptions);
  const refreshWeatherMutation = useMutation({
    mutationFn: () => refreshStatusWeatherFn(),
  });
  const refreshStocksMutation = useMutation({
    mutationFn: () => refreshStatusStocksFn(),
  });

  const defaultSymbols = useMemo(
    () => data?.stocks.map((stock) => stock.symbol).join(", ") ?? "",
    [data?.stocks],
  );

  if (!data) {
    return null;
  }

  const invalidateStatusQueries = () =>
    Promise.all([
      queryClient.invalidateQueries({
        queryKey: getAdminStatusSnapshotQueryOptions.queryKey,
      }),
      queryClient.invalidateQueries({
        queryKey: ["public-status-snapshot"],
      }),
    ]);

  const onSaveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const timezone = String(formData.get("timezone") ?? "").trim();
    const locationLabel = String(formData.get("locationLabel") ?? "").trim();
    const latitude = Number(formData.get("latitude") ?? 0);
    const longitude = Number(formData.get("longitude") ?? 0);

    if (
      !timezone ||
      !locationLabel ||
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {
      toast.error(
        "Timezone, location label, latitude, and longitude are required.",
      );
      return;
    }

    try {
      const saved = await updateProfileMutation.mutateAsync({
        data: {
          timezone,
          locationLabel,
          latitude,
          longitude,
          focusText: parseNullableText(formData, "focusText"),
          focusProgress: parseNullableNumber(formData, "focusProgress"),
          projectName: parseNullableText(formData, "projectName"),
          projectMilestone: parseNullableText(formData, "projectMilestone"),
          projectProgress: parseNullableNumber(formData, "projectProgress"),
          projectStatus: parseNullableText(formData, "projectStatus"),
          readingTitle: parseNullableText(formData, "readingTitle"),
          readingAuthor: parseNullableText(formData, "readingAuthor"),
          readingProgress: parseNullableNumber(formData, "readingProgress"),
          playingTitle: parseNullableText(formData, "playingTitle"),
          playingPlatform: parseNullableText(formData, "playingPlatform"),
          weatherManualSummary: parseNullableText(
            formData,
            "weatherManualSummary",
          ),
          weatherManualTempC: parseNullableNumber(
            formData,
            "weatherManualTempC",
          ),
        },
      });

      if (!saved) {
        toast.error("Failed to update status profile.");
        return;
      }

      await invalidateStatusQueries();
      toast.success("Status profile saved.");
    } catch {
      toast.error("Failed to save status profile.");
    }
  };

  const onSaveStocks = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const rawSymbols = String(formData.get("symbols") ?? "");
    const symbols = rawSymbols
      .split(",")
      .map((symbol) => symbol.trim())
      .filter(Boolean);

    try {
      await saveStocksMutation.mutateAsync({
        data: {
          symbols,
        },
      });

      await invalidateStatusQueries();
      toast.success("Stock symbols saved.");
    } catch {
      toast.error("Failed to save symbols.");
    }
  };

  const onRefreshWeather = async () => {
    try {
      await refreshWeatherMutation.mutateAsync();
      await invalidateStatusQueries();
      toast.success("Weather refreshed.");
    } catch {
      toast.error("Failed to refresh weather.");
    }
  };

  const onRefreshStocks = async () => {
    try {
      await refreshStocksMutation.mutateAsync();
      await invalidateStatusQueries();
      toast.success("Stock prices refreshed.");
    } catch {
      toast.error("Failed to refresh stocks.");
    }
  };

  const lastWeatherSync = data.profile.weather.syncedAt
    ? new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(data.profile.weather.syncedAt)
    : "Never";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <form
        className="border border-border p-6 space-y-6"
        onSubmit={onSaveProfile}
      >
        <div className="space-y-2">
          <h3 className="font-serif text-3xl">Status Data</h3>
          <p className="text-sm text-foreground/60">
            Control focus, current project, reading, playing, and
            weather/location overrides.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Timezone</Label>
            <Input
              name="timezone"
              defaultValue={data.profile.timezone}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Location Label</Label>
            <Input
              name="locationLabel"
              defaultValue={data.profile.locationLabel}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Latitude</Label>
            <Input
              name="latitude"
              type="number"
              defaultValue={data.profile.latitude}
              step="0.0001"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Longitude</Label>
            <Input
              name="longitude"
              type="number"
              defaultValue={data.profile.longitude}
              step="0.0001"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Focus</Label>
          <Input name="focusText" defaultValue={data.profile.focusText ?? ""} />
        </div>
        <div className="space-y-2">
          <Label>Focus Progress (%)</Label>
          <Input
            name="focusProgress"
            type="number"
            min={0}
            max={100}
            defaultValue={data.profile.focusProgress ?? ""}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2 sm:col-span-2">
            <Label>Active Project</Label>
            <Input
              name="projectName"
              defaultValue={data.profile.projectName ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label>Project Milestone</Label>
            <Input
              name="projectMilestone"
              defaultValue={data.profile.projectMilestone ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label>Project Status</Label>
            <Input
              name="projectStatus"
              defaultValue={data.profile.projectStatus ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label>Project Progress (%)</Label>
            <Input
              name="projectProgress"
              type="number"
              min={0}
              max={100}
              defaultValue={data.profile.projectProgress ?? ""}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2 sm:col-span-2">
            <Label>Reading Book</Label>
            <Input
              name="readingTitle"
              defaultValue={data.profile.readingTitle ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label>Reading Author</Label>
            <Input
              name="readingAuthor"
              defaultValue={data.profile.readingAuthor ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label>Reading Progress (%)</Label>
            <Input
              name="readingProgress"
              type="number"
              min={0}
              max={100}
              defaultValue={data.profile.readingProgress ?? ""}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Playing</Label>
            <Input
              name="playingTitle"
              defaultValue={data.profile.playingTitle ?? ""}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Platform</Label>
            <Input
              name="playingPlatform"
              defaultValue={data.profile.playingPlatform ?? ""}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Weather Override Summary (optional)</Label>
          <Textarea
            name="weatherManualSummary"
            defaultValue={data.profile.weatherManualSummary ?? ""}
          />
        </div>
        <div className="space-y-2">
          <Label>Weather Override Temperature (C)</Label>
          <Input
            name="weatherManualTempC"
            type="number"
            step="0.1"
            defaultValue={data.profile.weatherManualTempC ?? ""}
          />
        </div>

        <Button disabled={updateProfileMutation.isPending} type="submit">
          {updateProfileMutation.isPending ? "Saving..." : "Save Status Data"}
        </Button>
      </form>

      <div className="space-y-8">
        <form
          className="border border-border p-6 space-y-4"
          onSubmit={onSaveStocks}
        >
          <h3 className="font-serif text-3xl">Stocks</h3>
          <p className="text-sm text-foreground/60">
            Comma-separated symbols. Example: BBCA.JK, BBRI.JK, TLKM.JK
          </p>
          <div className="space-y-2">
            <Label>Symbols</Label>
            <Textarea name="symbols" defaultValue={defaultSymbols} />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button disabled={saveStocksMutation.isPending} type="submit">
              {saveStocksMutation.isPending ? "Saving..." : "Save Symbols"}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={refreshStocksMutation.isPending}
              onClick={onRefreshStocks}
            >
              <RefreshCcwIcon className="size-4" />
              Refresh Stocks
            </Button>
          </div>
        </form>

        <div className="border border-border p-6 space-y-4">
          <h3 className="font-serif text-3xl">Weather Sync</h3>
          <p className="text-sm text-foreground/60">
            Latest sync: {lastWeatherSync}
          </p>
          <Button
            type="button"
            variant="outline"
            disabled={refreshWeatherMutation.isPending}
            onClick={onRefreshWeather}
          >
            <RefreshCcwIcon className="size-4" />
            Refresh Weather
          </Button>
        </div>
      </div>
    </div>
  );
}
