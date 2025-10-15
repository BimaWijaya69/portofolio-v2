"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

type ContributionDay = {
  contributionCount: number;
  date: string;
  color: string;
};

type ContributionCalendar = {
  totalContributions: number;
  weeks: {
    contributionDays: ContributionDay[];
  }[];
};

type Repository = {
  name: string;
  owner: string;
  contributions: number;
};

type ContributionStats = {
  commits: number;
  issues: number;
  pullRequests: number;
  codeReview: number;
};

type ContributionsData = {
  calendar: ContributionCalendar;
  repositories: Repository[];
  stats: ContributionStats;
};

export default function GithubContributions() {
  const currentYear = new Date().getFullYear();
  const [data, setData] = useState<ContributionsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  // State untuk menyimpan data hari yang dipilih saat di-tap
  const [selectedDay, setSelectedDay] = useState<ContributionDay | null>(null);

  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  useEffect(() => {
    // Reset hari yang dipilih setiap kali tahun berubah
    setSelectedDay(null);

    async function fetchContributions() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/github/contributions?year=${selectedYear}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Gagal mengambil data kontribusi."
          );
        }

        const apiData = await response.json();

        const contributionCollection =
          apiData?.data?.user?.contributionsCollection;
        if (!contributionCollection) {
          throw new Error("Struktur data dari API tidak valid.");
        }

        const repos: Repository[] =
          contributionCollection.commitContributionsByRepository
            ?.slice(0, 3)
            .map((item: any) => ({
              name: item.repository.name,
              owner: item.repository.owner.login,
              contributions: item.contributions.totalCount,
            })) || [];

        const stats: ContributionStats = {
          commits: contributionCollection.totalCommitContributions || 0,
          issues: contributionCollection.totalIssueContributions || 0,
          pullRequests:
            contributionCollection.totalPullRequestContributions || 0,
          codeReview:
            contributionCollection.totalPullRequestReviewContributions || 0,
        };

        setData({
          calendar: contributionCollection.contributionCalendar,
          repositories: repos,
          stats,
        });
      } catch (err: any) {
        console.error("Fetch Error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchContributions();
  }, [selectedYear]);

  if (isLoading) {
    return (
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#C6F10E] animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse delay-75"></div>
            <div className="w-2 h-2 rounded-full bg-[#C6F10E] animate-pulse delay-150"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="text-red-400 text-sm text-center">{error}</div>
      </div>
    );
  }

  if (!data || !data.calendar) {
    return (
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="text-white/60 text-sm text-center">
          No contribution data available.
        </div>
      </div>
    );
  }

  const { calendar, repositories, stats } = data;
  const days = calendar.weeks.flatMap((week) => week.contributionDays);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const monthLabels: { month: string; col: number }[] = [];
  let lastMonth = -1;
  calendar.weeks.forEach((week, weekIndex) => {
    const firstDay = week.contributionDays[0];
    if (firstDay) {
      const date = new Date(firstDay.date);
      const currentMonth = date.getMonth();
      if (currentMonth !== lastMonth) {
        monthLabels.push({ month: months[currentMonth], col: weekIndex });
        lastMonth = currentMonth;
      }
    }
  });

  const maxContributions = Math.max(...days.map((d) => d.contributionCount), 1);
  const getContributionLevel = (count: number) => {
    if (count === 0) return "bg-white/5";
    const percentage = count / maxContributions;
    if (percentage < 0.25) return "bg-[#C6F10E]/20";
    if (percentage < 0.5) return "bg-[#C6F10E]/40";
    if (percentage < 0.75) return "bg-[#C6F10E]/60";
    return "bg-[#C6F10E]";
  };

  const totalActivity =
    stats.commits + stats.issues + stats.pullRequests + stats.codeReview;
  const getPercentage = (value: number) =>
    totalActivity > 0 ? (value / totalActivity) * 100 : 0;

  const statsData = [
    {
      label: "Commits",
      value: stats.commits,
      percentage: getPercentage(stats.commits),
      color: "bg-gradient-to-r from-[#C6F10E] to-yellow-300",
    },
    {
      label: "Pull requests",
      value: stats.pullRequests,
      percentage: getPercentage(stats.pullRequests),
      color: "bg-gradient-to-r from-yellow-200 to-yellow-400",
    },
    {
      label: "Code review",
      value: stats.codeReview,
      percentage: getPercentage(stats.codeReview),
      color: "bg-gradient-to-r from-[#C6F10E] to-green-400",
    },
    {
      label: "Issues",
      value: stats.issues,
      percentage: getPercentage(stats.issues),
      color: "bg-gradient-to-r from-yellow-200 to-[#C6F10E]",
    },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="border-b border-white/10 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-white/70"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
            </svg>
            <div className="text-sm text-white/90">
              <span className="font-semibold text-white">
                {calendar.totalContributions}
              </span>{" "}
              <span className="text-white/60">
                contributions in{" "}
                {selectedYear === currentYear ? "the last year" : selectedYear}
              </span>
            </div>
          </div>
          <Select
            value={selectedYear.toString()}
            onValueChange={(value) => setSelectedYear(parseInt(value))}
          >
            <SelectTrigger className="w-20 h-7 text-xs backdrop-blur-lg bg-white/10 text-white border-white/20 hover:bg-white/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="p-4">
        {/* Area untuk menampilkan info hari yang dipilih */}
        <div className="h-6 mb-2 text-xs text-center text-white/60 flex items-center justify-center">
          {selectedDay ? (
            <span>
              <span className="font-bold text-white">
                {selectedDay.contributionCount} contributions
              </span>{" "}
              on {formatDate(selectedDay.date)}
            </span>
          ) : (
            <span>Select a block to see details</span>
          )}
        </div>

        {/* Contribution Graph - Compact */}
        <div className="mb-4">
          <div className="overflow-x-auto pb-2">
            {/* Month labels */}
            <div className="flex gap-1 mb-2 ml-6">
              {monthLabels.map((label, index) => (
                <div
                  key={index}
                  className="text-[10px] text-white/50 flex-shrink-0"
                  style={{
                    marginLeft:
                      index === 0
                        ? 0
                        : `${
                            (label.col - (monthLabels[index - 1]?.col || 0)) * 8
                          }px`,
                  }}
                >
                  {label.month}
                </div>
              ))}
            </div>

            {/* Contribution grid */}
            <div className="flex gap-1">
              {/* Day labels */}
              <div className="flex flex-col justify-around pr-1">
                <div className="h-2"></div>
                <div className="h-2 flex items-center text-[10px] text-white/50">
                  Mon
                </div>
                <div className="h-2"></div>
                <div className="h-2 flex items-center text-[10px] text-white/50">
                  Wed
                </div>
                <div className="h-2"></div>
                <div className="h-2 flex items-center text-[10px] text-white/50">
                  Fri
                </div>
                <div className="h-2"></div>
              </div>

              {/* Grid cells */}
              <div className="flex-1">
                <div className="flex gap-[3px]">
                  {calendar.weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col gap-[3px]">
                      {week.contributionDays.map((day, dayIndex) => (
                        <div
                          key={dayIndex}
                          onClick={() => setSelectedDay(day)}
                          title={`${
                            day.contributionCount
                          } contributions on ${formatDate(day.date)}`}
                          className={`w-2 h-2 rounded-sm border border-white/10 hover:border-[#C6F10E]/50 hover:ring-1 hover:ring-[#C6F10E]/30 hover:shadow-lg hover:shadow-[#C6F10E]/20 transition-all duration-150 cursor-pointer ${getContributionLevel(
                            day.contributionCount
                          )}`}
                        ></div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-end gap-2 mt-3">
            <span className="text-[10px] text-white/50">Less</span>
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-sm bg-white/5 border border-white/10"></div>
              <div className="w-2 h-2 rounded-sm bg-[#C6F10E]/20 border border-white/10"></div>
              <div className="w-2 h-2 rounded-sm bg-[#C6F10E]/40 border border-white/10"></div>
              <div className="w-2 h-2 rounded-sm bg-[#C6F10E]/60 border border-white/10"></div>
              <div className="w-2 h-2 rounded-sm bg-[#C6F10E] border border-white/10"></div>
            </div>
            <span className="text-[10px] text-white/50">More</span>
          </div>
        </div>

        {/* Activity Stats - Compact */}
        {totalActivity > 0 && (
          <div className="border-t border-white/10 pt-3 space-y-2">
            {statsData.map(
              (stat, index) =>
                stat.value > 0 && (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/60">{stat.label}</span>
                      <span className="font-medium text-white">
                        {stat.value}
                      </span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`${stat.color} h-full rounded-full transition-all duration-500`}
                        style={{ width: `${stat.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                )
            )}
          </div>
        )}

        {/* Top Repositories - Compact */}
        {repositories.length > 0 && (
          <div className="border-t border-white/10 pt-3 mt-3">
            <div className="text-xs text-white/60">
              Top repositories:{" "}
              {repositories.slice(0, 2).map((repo, index) => (
                <span key={index}>
                  <a
                    href={`https://github.com/${repo.owner}/${repo.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#C6F10E] hover:text-yellow-400 hover:underline transition-colors"
                  >
                    {repo.name}
                  </a>
                  {index < 1 && repositories.length > 1 && ", "}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
