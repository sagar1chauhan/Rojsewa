import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Star, TrendingUp, ThumbsUp, ThumbsDown, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TopNav from "@/modules/user/components/TopNav";
import BottomNav from "@/modules/user/components/BottomNav";

const ProviderReviews = () => {
  const navigate = useNavigate();
  const [filterRating, setFilterRating] = useState(0); // 0 = all
  const reviews = JSON.parse(localStorage.getItem("rozsewa_reviews") || "[]");

  const stats = useMemo(() => {
    if (reviews.length === 0) return { avg: 0, total: 0, dist: [0, 0, 0, 0, 0], positive: 0 };
    const dist = [0, 0, 0, 0, 0];
    let sum = 0;
    reviews.forEach(r => { sum += r.rating; dist[r.rating - 1]++; });
    return {
      avg: (sum / reviews.length).toFixed(1),
      total: reviews.length,
      dist,
      positive: Math.round(((dist[3] + dist[4]) / reviews.length) * 100),
    };
  }, [reviews]);

  const filtered = filterRating > 0 ? reviews.filter(r => r.rating === filterRating) : reviews;

  const suggestions = useMemo(() => {
    const tips = [];
    if (stats.avg < 4) tips.push("Focus on completing jobs on time to improve ratings.");
    if (stats.dist[0] + stats.dist[1] > 0) tips.push("Address low-rated reviews to prevent pattern of complaints.");
    if (reviews.length < 10) tips.push("Complete more bookings to build your review profile.");
    if (stats.positive < 80) tips.push("Maintain professional behaviour to increase positive reviews.");
    if (tips.length === 0) tips.push("Great job! Keep up the excellent service quality. 🌟");
    return tips;
  }, [stats, reviews]);

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <TopNav />
      <main className="container max-w-2xl px-4 py-6 space-y-6">
        <div className="flex items-center gap-3">
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border hover:bg-muted shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </motion.button>
          <h1 className="text-xl font-bold text-foreground">Reviews & Ratings</h1>
        </div>

        {/* Stats Card */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Big Rating */}
            <div className="text-center">
              <div className="text-5xl font-black text-foreground">{stats.avg}</div>
              <div className="flex gap-1 mt-1 justify-center">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} className={`h-4 w-4 ${s <= Math.round(stats.avg) ? "fill-amber-400 text-amber-400" : "text-border"}`} />
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{stats.total} reviews</p>
            </div>

            {/* Distribution */}
            <div className="flex-1 w-full space-y-1.5">
              {[5, 4, 3, 2, 1].map(n => {
                const count = stats.dist[n - 1];
                const pct = stats.total > 0 ? (count / stats.total) * 100 : 0;
                return (
                  <div key={n} className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-muted-foreground w-4">{n}</span>
                    <Star className="h-3 w-3 text-amber-400 shrink-0" />
                    <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                        className={`h-full rounded-full ${n >= 4 ? "bg-emerald-500" : n === 3 ? "bg-amber-500" : "bg-rose-500"}`} />
                    </div>
                    <span className="text-[10px] font-semibold text-muted-foreground w-6 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Performance Score */}
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-emerald-50 dark:bg-emerald-900/20 p-3 text-center">
              <ThumbsUp className="h-5 w-5 text-emerald-600 mx-auto" />
              <p className="text-lg font-black text-emerald-700 dark:text-emerald-300 mt-1">{stats.positive}%</p>
              <p className="text-[10px] font-semibold text-muted-foreground">Positive Reviews</p>
            </div>
            <div className="rounded-xl bg-blue-50 dark:bg-blue-900/20 p-3 text-center">
              <TrendingUp className="h-5 w-5 text-blue-600 mx-auto" />
              <p className="text-lg font-black text-blue-700 dark:text-blue-300 mt-1">{stats.avg >= 4.5 ? "A+" : stats.avg >= 4 ? "A" : stats.avg >= 3 ? "B" : "C"}</p>
              <p className="text-[10px] font-semibold text-muted-foreground">Performance Grade</p>
            </div>
          </div>
        </div>

        {/* Suggestions */}
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 space-y-2">
          <h3 className="text-xs font-bold text-primary uppercase tracking-wider">💡 Suggestions</h3>
          {suggestions.map((s, i) => (
            <p key={i} className="text-xs text-foreground">• {s}</p>
          ))}
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
          {[0, 5, 4, 3, 2, 1].map(n => (
            <button key={n} onClick={() => setFilterRating(n)}
              className={`rounded-full px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-all ${
                filterRating === n ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
              }`}>
              {n === 0 ? "All" : `${n}★`}
            </button>
          ))}
        </div>

        {/* Reviews */}
        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Star className="h-10 w-10 text-muted-foreground/30 mb-3" />
              <p className="text-sm font-semibold text-muted-foreground">No reviews yet</p>
            </div>
          )}
          {filtered.map((r, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {(r.user || "U").substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{r.user || "Customer"}</p>
                    <p className="text-[10px] text-muted-foreground">{r.service || "Service"}</p>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} className={`h-3 w-3 ${s <= r.rating ? "fill-amber-400 text-amber-400" : "text-border"}`} />
                  ))}
                </div>
              </div>
              {r.review && <p className="mt-2 text-xs text-muted-foreground">{r.review}</p>}
              {r.tags?.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {r.tags.map(t => (
                    <span key={t} className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">{t}</span>
                  ))}
                </div>
              )}
              <p className="mt-2 text-[10px] text-muted-foreground">
                {r.date ? new Date(r.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : ""}
              </p>
            </motion.div>
          ))}
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default ProviderReviews;
