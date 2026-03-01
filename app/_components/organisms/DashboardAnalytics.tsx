"use client";

import { PostWithRelations } from "@/app/_types/Post";
import {
  Newspaper,
  Eye,
  TrendingUp,
  CheckCircle2,
  Clock,
  Tag,
  BarChart3,
  CalendarDays,
  Users,
  PieChart as PieIcon,
} from "lucide-react";
import Image from "next/image";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";

interface DashboardAnalyticsProps {
  posts: PostWithRelations[];
  total: number;
}

export const DashboardAnalytics = ({ posts, total }: DashboardAnalyticsProps) => {
  const isAdmin =
    posts.some((p) => p.author?.role === "ADMIN") &&
    new Set(posts.map((p) => p.authorId)).size > 1;

  const published = posts.filter((p) => p.published);
  const drafts = posts.filter((p) => !p.published);
  const totalViews = posts.reduce((acc, p) => acc + (p.views || 0), 0);
  const mostViewed = [...posts]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5);
  const recentPosts = [...posts]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Category breakdown
  const byCategory = posts.reduce(
    (acc, post) => {
      const name = post.category?.name || "Sem Categoria";
      const color = post.category?.color || "#283583";
      if (!acc[name]) acc[name] = { count: 0, color };
      acc[name].count++;
      return acc;
    },
    {} as Record<string, { count: number; color: string }>,
  );

  // Category data for Pie chart
  const categoryPieData = Object.entries(byCategory)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 6)
    .map(([name, { count, color }]) => ({ name, value: count, color }));

  // Authors breakdown (admin only)
  const byAuthor = posts.reduce(
    (acc, post) => {
      const name = post.author?.name || "Desconhecido";
      if (!acc[name]) acc[name] = { count: 0, photo: post.author?.photoProfile };
      acc[name].count++;
      return acc;
    },
    {} as Record<string, { count: number; photo: string | undefined }>,
  );

  // Author bar chart data
  const authorBarData = Object.entries(byAuthor)
    .sort((a, b) => b[1].count - a[1].count)
    .map(([name, { count }]) => ({ name: name.split(" ")[0], count }));

  // Posts per month (last 6 months)
  const monthlyData = getMonthlyData(posts);

  // Published vs Drafts donut
  const statusData = [
    { name: "Publicados", value: published.length, color: "#5FAD56" },
    { name: "Rascunhos", value: drafts.length, color: "#F9C74F" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-[#C4161C] via-[#283583] to-[#5FAD56]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-[#C4161C] mb-1">
              {isAdmin ? "Painel Administrativo" : "Meu Painel"}
            </p>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">
              Dashboard <span className="text-[#283583]">Analytics</span>
            </h1>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            label="Total de Posts"
            value={total}
            icon={<Newspaper className="w-5 h-5" />}
            color="#283583"
            sub={`${published.length} publicados`}
          />
          <KpiCard
            label="Publicados"
            value={published.length}
            icon={<CheckCircle2 className="w-5 h-5" />}
            color="#5FAD56"
            sub={`${Math.round((published.length / (total || 1)) * 100)}% do total`}
          />
          <KpiCard
            label="Rascunhos"
            value={drafts.length}
            icon={<Clock className="w-5 h-5" />}
            color="#F9C74F"
            textDark
            sub="aguardando publicação"
          />
          <KpiCard
            label="Total de Views"
            value={totalViews.toLocaleString("pt-BR")}
            icon={<Eye className="w-5 h-5" />}
            color="#C4161C"
            sub="visualizações acumuladas"
          />
        </div>

        {/* Row 2: Area chart + Status donut */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Area chart — posts por mês */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-[#283583]/10 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-[#283583]" />
              </div>
              <div>
                <h2 className="font-black text-gray-900 text-base">Posts por Mês</h2>
                <p className="text-xs text-gray-500">Últimos 6 meses</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={monthlyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#283583" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#283583" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fontWeight: 700, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fontWeight: 700, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "none",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                  itemStyle={{ color: "#283583" }}
                  labelStyle={{ color: "#64748b", fontSize: 11 }}
                  formatter={(v) => [v ?? 0, "Posts"]}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#283583"
                  strokeWidth={2.5}
                  fill="url(#areaGrad)"
                  dot={{ r: 4, fill: "#283583", strokeWidth: 2, stroke: "#fff" }}
                  activeDot={{ r: 6, fill: "#C4161C" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Donut — Status */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#5FAD56]/10 flex items-center justify-center">
                <PieIcon className="w-5 h-5 text-[#5FAD56]" />
              </div>
              <div>
                <h2 className="font-black text-gray-900 text-base">Status</h2>
                <p className="text-xs text-gray-500">Publicados vs Rascunhos</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="45%"
                  innerRadius={55}
                  outerRadius={78}
                  paddingAngle={4}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {statusData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 12, fontWeight: 700 }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 10,
                    border: "none",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Row 3: Category pie + Most viewed + Author bar / Recent */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Category Pie */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#C4161C]/10 flex items-center justify-center">
                <Tag className="w-5 h-5 text-[#C4161C]" />
              </div>
              <div>
                <h2 className="font-black text-gray-900 text-base">Por Categoria</h2>
                <p className="text-xs text-gray-500">{Object.keys(byCategory).length} categorias</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={230}>
              <PieChart>
                <Pie
                  data={categoryPieData}
                  cx="50%"
                  cy="42%"
                  outerRadius={72}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {categoryPieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 11, fontWeight: 700 }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 10,
                    border: "none",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                  formatter={(v) => [v ?? 0, ""]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Most Viewed */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-[#5FAD56]/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[#5FAD56]" />
              </div>
              <div>
                <h2 className="font-black text-gray-900 text-base">Mais Visualizados</h2>
                <p className="text-xs text-gray-500">Top 5 posts</p>
              </div>
            </div>
            <div className="space-y-3">
              {mostViewed.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-6">Nenhum post ainda</p>
              )}
              {mostViewed.map((post, i) => (
                <div key={post.id} className="flex items-center gap-3 group">
                  <span
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0"
                    style={{
                      background: i === 0 ? "#F9C74F" : i === 1 ? "#e2e8f0" : "#f1f5f9",
                      color: i === 0 ? "#283583" : "#64748b",
                    }}
                  >
                    {i + 1}
                  </span>
                  <div className="relative w-9 h-9 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                    {post.photoUrl ? (
                      <Image src={post.photoUrl} alt={post.title} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Newspaper className="w-4 h-4 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate group-hover:text-[#C4161C] transition-colors">
                      {post.title}
                    </p>
                    <span
                      className="text-[10px] font-black px-1.5 py-0.5 rounded mt-0.5 inline-block"
                      style={{
                        backgroundColor: post.category.color + "22",
                        color: post.category.color,
                      }}
                    >
                      {post.category.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-black text-gray-500 shrink-0">
                    <Eye className="w-3 h-3" />
                    {(post.views || 0).toLocaleString("pt-BR")}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Admin: Author horizontal bar chart | Journalist: Recent posts */}
          {isAdmin ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-[#283583]/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-[#283583]" />
                </div>
                <div>
                  <h2 className="font-black text-gray-900 text-base">Por Jornalista</h2>
                  <p className="text-xs text-gray-500">{Object.keys(byAuthor).length} autores</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={authorBarData}
                  layout="vertical"
                  margin={{ top: 0, right: 8, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                  <XAxis
                    type="number"
                    allowDecimals={false}
                    tick={{ fontSize: 11, fontWeight: 700, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 11, fontWeight: 700, fill: "#475569" }}
                    axisLine={false}
                    tickLine={false}
                    width={70}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 10,
                      border: "none",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                    formatter={(v) => [v ?? 0, "Posts"]}
                    cursor={{ fill: "#f8fafc" }}
                  />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]} fill="#283583" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-[#F9C74F]/20 flex items-center justify-center">
                  <CalendarDays className="w-5 h-5 text-[#c4a000]" />
                </div>
                <div>
                  <h2 className="font-black text-gray-900 text-base">Posts Recentes</h2>
                  <p className="text-xs text-gray-500">Últimas criações</p>
                </div>
              </div>
              <div className="space-y-3">
                {recentPosts.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-6">Nenhum post ainda</p>
                )}
                {recentPosts.map((post) => (
                  <div key={post.id} className="flex items-center gap-3 group">
                    <div className="relative w-9 h-9 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                      {post.photoUrl ? (
                        <Image src={post.photoUrl} alt={post.title} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Newspaper className="w-4 h-4 text-gray-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-900 truncate group-hover:text-[#C4161C] transition-colors">
                        {post.title}
                      </p>
                      <p className="text-[10px] text-gray-400 font-semibold mt-0.5">
                        {new Date(post.createdAt).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-black px-2 py-1 rounded-lg shrink-0 ${
                        post.published
                          ? "bg-[#5FAD56]/15 text-[#3d8040]"
                          : "bg-[#F9C74F]/20 text-[#a07000]"
                      }`}
                    >
                      {post.published ? "Publicado" : "Rascunho"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─── KPI Card ─── */

function KpiCard({
  label,
  value,
  icon,
  color,
  sub,
  textDark,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  sub?: string;
  textDark?: boolean;
}) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-3 shadow-sm relative overflow-hidden"
      style={{ backgroundColor: color }}
    >
      <div
        className="absolute -top-4 -right-4 w-24 h-24 rounded-full"
        style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
      />
      <div
        className="absolute top-6 -right-2 w-12 h-12 rounded-full"
        style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
      />
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center relative"
        style={{
          backgroundColor: "rgba(255,255,255,0.2)",
          color: textDark ? "#283583" : "white",
        }}
      >
        {icon}
      </div>
      <div className="relative">
        <div
          className="text-3xl font-black leading-none"
          style={{ color: textDark ? "#283583" : "white" }}
        >
          {value}
        </div>
        <div
          className="text-xs font-black uppercase tracking-wide mt-1"
          style={{ color: textDark ? "#283583cc" : "rgba(255,255,255,0.8)" }}
        >
          {label}
        </div>
        {sub && (
          <div
            className="text-[10px] font-semibold mt-0.5"
            style={{ color: textDark ? "#283583aa" : "rgba(255,255,255,0.6)" }}
          >
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Helpers ─── */

function getMonthlyData(posts: PostWithRelations[]) {
  const now = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const label = d
      .toLocaleDateString("pt-BR", { month: "short" })
      .replace(".", "");
    const count = posts.filter((p) => {
      const pd = new Date(p.createdAt);
      return (
        pd.getFullYear() === d.getFullYear() && pd.getMonth() === d.getMonth()
      );
    }).length;
    return { label, count };
  });
}