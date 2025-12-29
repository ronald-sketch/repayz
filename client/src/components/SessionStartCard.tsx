import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { Clock, Play, X, CheckCircle, Loader2, AlertCircle } from "lucide-react";

interface SessionStartCardProps {
  onSessionStarted?: (name: string) => void;
  onSessionEnded?: () => void;
}

export default function SessionStartCard({ onSessionStarted, onSessionEnded }: SessionStartCardProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  // Check if queue is available
  const { data: isAvailable, refetch: refetchAvailable } = trpc.drop.isQueueAvailable.useQuery(
    undefined,
    { refetchInterval: 5000 }
  );

  // Get current pending drop (if user has active session)
  const { data: pendingDrop, refetch: refetchPending } = trpc.drop.getPendingDrop.useQuery(
    undefined,
    { refetchInterval: 2000 }
  );

  // Start session mutation
  const startSessionMutation = trpc.drop.addToQueue.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        setError(null);
        refetchPending();
        refetchAvailable();
        onSessionStarted?.(name);
      } else {
        setError(data.message);
      }
    },
    onError: (err) => {
      setError(err.message || "Er ging iets mis");
    },
  });

  // Cancel session mutation
  const cancelMutation = trpc.drop.cancelPendingDrop.useMutation({
    onSuccess: () => {
      setName("");
      setError(null);
      refetchPending();
      refetchAvailable();
      onSessionEnded?.();
    },
  });

  // Calculate time remaining
  useEffect(() => {
    if (!pendingDrop?.expiresAt) {
      setTimeRemaining(null);
      return;
    }

    const updateTime = () => {
      const now = new Date().getTime();
      const expires = new Date(pendingDrop.expiresAt).getTime();
      const remaining = Math.max(0, Math.floor((expires - now) / 1000));
      setTimeRemaining(remaining);

      if (remaining === 0) {
        refetchPending();
        refetchAvailable();
        onSessionEnded?.();
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [pendingDrop?.expiresAt]);

  const handleStartSession = () => {
    if (!name.trim()) {
      setError("Vul je naam in");
      return;
    }
    setError(null);
    startSessionMutation.mutate({ name: name.trim() });
  };

  const handleCancel = () => {
    if (pendingDrop?.name) {
      cancelMutation.mutate({ name: pendingDrop.name });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Active session view
  if (pendingDrop) {
    return (
      <Card className="border-4 border-emerald-500 shadow-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30">
        <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <CheckCircle className="w-8 h-8" />
            Sessie Actief!
          </CardTitle>
          <CardDescription className="text-emerald-50">
            Ga nu naar de machine en recycle je items
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Timer */}
          <div className="text-center">
            <div className="inline-flex items-center gap-3 bg-white dark:bg-slate-800 rounded-2xl px-8 py-4 shadow-lg">
              <Clock className={`w-8 h-8 ${timeRemaining && timeRemaining < 120 ? "text-red-500 animate-pulse" : "text-emerald-600"}`} />
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Tijd resterend</p>
                <p className={`text-4xl font-bold ${timeRemaining && timeRemaining < 120 ? "text-red-600" : "text-emerald-600"}`}>
                  {timeRemaining !== null ? formatTime(timeRemaining) : "--:--"}
                </p>
              </div>
            </div>
          </div>

          {/* Name display */}
          <div className="text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Je recyclet als:</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{pendingDrop.name}</p>
          </div>

          {/* Instructions */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 space-y-3">
            <h4 className="font-semibold text-slate-900 dark:text-white">Wat nu?</h4>
            <ol className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <span className="bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shrink-0">1</span>
                <span>Ga naar de REPAYZ machine bij Scooterpoint</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shrink-0">2</span>
                <span>Recycle je flessen en blikjes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shrink-0">3</span>
                <span>Scan de QR code voor je Tikkie betaling</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shrink-0">4</span>
                <span>Je score wordt automatisch toegevoegd aan het leaderboard!</span>
              </li>
            </ol>
          </div>

          {/* Cancel button */}
          <Button
            onClick={handleCancel}
            variant="outline"
            disabled={cancelMutation.isPending}
            className="w-full border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400"
          >
            {cancelMutation.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <X className="w-4 h-4 mr-2" />
            )}
            Annuleer Sessie
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Start session view
  return (
    <Card className="border-2 border-slate-200 dark:border-slate-700 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Play className="w-8 h-8 text-emerald-600" />
          Start Recycling Sessie
        </CardTitle>
        <CardDescription>
          Vul je naam in voordat je gaat recyclen. Je hebt 15 minuten om je items in te leveren.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Availability status */}
        {!isAvailable && (
          <div className="flex items-center gap-2 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-orange-700 dark:text-orange-300">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm">Iemand is al bezig. Wacht tot de huidige sessie is afgelopen.</p>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-700 dark:text-red-300">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Name input */}
        <div>
          <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
            Jouw naam voor het leaderboard
          </label>
          <Input
            placeholder="Bijv. Jan, Team Groen, Buurtvereniging..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleStartSession()}
            className="text-lg"
            disabled={!isAvailable || startSessionMutation.isPending}
          />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Max 50 tekens. Ongepaste namen worden geblokkeerd.
          </p>
        </div>

        {/* Start button */}
        <Button
          onClick={handleStartSession}
          disabled={!isAvailable || !name.trim() || startSessionMutation.isPending}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-lg py-6"
        >
          {startSessionMutation.isPending ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Naam wordt gecontroleerd...
            </>
          ) : (
            <>
              <Play className="w-5 h-5 mr-2" />
              Start Sessie (15 min)
            </>
          )}
        </Button>

        {/* Info */}
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
          Na het starten heb je 15 minuten om je items in te leveren bij de machine.
          Je score wordt automatisch toegevoegd aan het leaderboard.
        </p>
      </CardContent>
    </Card>
  );
}
