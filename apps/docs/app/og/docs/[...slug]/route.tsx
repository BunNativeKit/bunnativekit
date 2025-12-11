import { ImageResponse } from "@takumi-rs/image-response";
import {
	Box,
	Braces,
	FileCode2,
	FunctionSquare,
	Hash,
	icons,
} from "lucide-react";
import { notFound } from "next/navigation";
import type { JSX } from "react";
import { getPageImage, source } from "@/lib/source";

/* ---------- color system ---------- */

type ColorKind = "bg" | "accent" | "text-primary" | "text-muted";

const getColor = (kind: ColorKind): string => {
	const defaults: Record<ColorKind, string> = {
		bg: "#09090b",
		accent: "#f43f5e",
		"text-primary": "#fafafa",
		"text-muted": "#71717a",
	};

	const tokens: Partial<Record<ColorKind, string>> = {
		accent: "__LAZYDOCS_ACCENT__",
		bg: "__LAZYDOCS_BG__",
		"text-primary": "__LAZYDOCS_TEXT_PRIMARY__",
		"text-muted": "__LAZYDOCS_TEXT_MUTED__",
	};

	const candidate = tokens[kind];
	if (candidate && !candidate.startsWith("__LAZYDOCS_")) return candidate;

	return defaults[kind];
};

/* ---------- helpers ---------- */

type PageCategory = "function" | "class" | "interface" | "type" | "docs";

const getCategoryFromPath = (path: string | undefined | null): PageCategory => {
	if (!path) return "docs";
	const lower = path.toLowerCase();
	if (lower.includes("/functions/")) return "function";
	if (lower.includes("/classes/")) return "class";
	if (lower.includes("/interfaces/")) return "interface";
	if (lower.includes("/type-aliases/") || lower.includes("/types/"))
		return "type";
	return "docs";
};

const getCategoryIcon = (category: PageCategory): JSX.Element => {
	const color = getColor("accent");
	const props = { tw: "w-5 h-5", color, strokeWidth: 2 };

	switch (category) {
		case "function":
			return <FunctionSquare {...props} />;
		case "class":
			return <Box {...props} />;
		case "interface":
			return <Braces {...props} />;
		case "type":
			return <Hash {...props} />;
		default:
			return <FileCode2 {...props} />;
	}
};

const getCategoryLabel = (category: PageCategory): string => {
	const labels: Record<PageCategory, string> = {
		function: "Function",
		class: "Class",
		interface: "Interface",
		type: "Type",
		docs: "Documentation",
	};
	return labels[category];
};

const getPageIcon = (
	icon: string | undefined | null,
	category: PageCategory,
): JSX.Element => {
	const color = getColor("accent");
	if (icon && icon in icons) {
		const IconComponent = icons[icon as keyof typeof icons];
		return <IconComponent tw="w-8 h-8" color={color} strokeWidth={1.8} />;
	}
	// Return category icon but larger for the main logo box
	switch (category) {
		case "function":
			return <FunctionSquare tw="w-8 h-8" color={color} strokeWidth={1.8} />;
		case "class":
			return <Box tw="w-8 h-8" color={color} strokeWidth={1.8} />;
		case "interface":
			return <Braces tw="w-8 h-8" color={color} strokeWidth={1.8} />;
		case "type":
			return <Hash tw="w-8 h-8" color={color} strokeWidth={1.8} />;
		default:
			return <FileCode2 tw="w-8 h-8" color={color} strokeWidth={1.8} />;
	}
};

const getCategoryIconSmall = (category: PageCategory): JSX.Element => {
	const color = getColor("accent");
	switch (category) {
		case "function":
			return <FunctionSquare tw="w-5 h-5" color={color} strokeWidth={2} />;
		case "class":
			return <Box tw="w-5 h-5" color={color} strokeWidth={2} />;
		case "interface":
			return <Braces tw="w-5 h-5" color={color} strokeWidth={2} />;
		case "type":
			return <Hash tw="w-5 h-5" color={color} strokeWidth={2} />;
		default:
			return <FileCode2 tw="w-5 h-5" color={color} strokeWidth={2} />;
	}
};

const getBreadcrumb = (path: string | undefined | null): string[] => {
	if (!path) return [];
	try {
		const parts = path
			.split("/")
			.map((s) => s.trim())
			.filter(Boolean);
		// Take middle segments (skip first which is usually pkg name, and last which is the page)
		return parts.slice(1, -1).slice(0, 3);
	} catch {
		return [];
	}
};

export const revalidate = false;

/* ---------- route ---------- */

export async function GET(
	_req: Request,
	{ params }: RouteContext<"/og/docs/[...slug]">,
) {
	const { slug } = await params;
	const page = source.getPage(slug.slice(0, -1));
	if (!page) notFound();

	const site = "bunnativekit";
	const title = page.data.title ?? `${site} Docs`;
	const description = page.data.description ?? "";
	const path = page.data.info?.path;
	const category = getCategoryFromPath(path);
	const breadcrumbs = getBreadcrumb(path);
	const tocCount = page.data.toc?.length ?? 0;

	const bg = getColor("bg");
	const accent = getColor("accent");
	const textPrimary = getColor("text-primary");
	const textMuted = getColor("text-muted");

	return new ImageResponse(
		<div tw="relative flex h-[630px] w-[1200px] overflow-hidden bg-[#09090b]">
			{/* Background gradient orbs - using rgba like the working snippet */}
			<div tw="pointer-events-none absolute inset-0">
				{/* Top-left accent glow - positioned to be more visible */}
				<div tw="absolute -left-20 -top-20 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_at_center,_rgba(244,63,94,0.35),_transparent_60%)]" />
				{/* Bottom-right subtle glow */}
				<div tw="absolute -right-16 -bottom-16 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle_at_center,_rgba(244,63,94,0.2),_transparent_60%)]" />
				{/* Top center darkening */}
				<div tw="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(9,9,11,0.8),_transparent_70%)]" />
			</div>

			{/* Subtle grid pattern */}
			<div
				tw="absolute inset-0 opacity-30"
				style={{
					backgroundImage: `linear-gradient(rgba(113,113,122,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(113,113,122,0.15) 1px, transparent 1px)`,
					backgroundSize: "80px 80px",
				}}
			/>

			{/* Decorative code lines - right side */}
			<div
				tw="absolute right-16 top-1/2 flex flex-col opacity-15"
				style={{ transform: "translateY(-50%)" }}
			>
				{[...Array(9)].map((_, i) => (
					<div key={i} tw="flex items-center mb-4">
						<div
							tw="h-2.5 rounded-full mr-3 bg-zinc-500"
							style={{ width: `${50 + Math.sin(i * 1.5) * 70}px` }}
						/>
						<div
							tw="h-2.5 rounded-full bg-rose-500 opacity-70"
							style={{ width: `${35 + Math.cos(i * 2) * 50}px` }}
						/>
					</div>
				))}
			</div>

			{/* Main content */}
			<div tw="flex flex-col h-full w-full p-16">
				{/* Header row */}
				<div tw="flex items-center justify-between">
					{/* Logo + Site name */}
					<div tw="flex items-center">
						<div tw="flex items-center justify-center w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/40">
							{getPageIcon(page.data.icon, category)}
						</div>
						<div tw="w-1 h-10 rounded-full ml-5 bg-rose-500" />
						<span
							tw="text-3xl font-bold ml-5 text-zinc-50"
							style={{ letterSpacing: "-0.02em" }}
						>
							{site}
						</span>
					</div>

					{/* Category badge */}
					<div tw="flex items-center px-5 py-3 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-500">
						{getCategoryIconSmall(category)}
						<span
							tw="ml-2.5 text-base font-semibold uppercase"
							style={{ letterSpacing: "0.05em" }}
						>
							{getCategoryLabel(category)}
						</span>
					</div>
				</div>

				{/* Breadcrumb */}
				{breadcrumbs.length > 0 && (
					<div tw="flex items-center mt-7">
						{breadcrumbs.map((crumb, i) => (
							<div key={i} tw="flex items-center">
								{i > 0 && <span tw="mx-3 text-xl text-zinc-500">/</span>}
								<span tw="text-xl font-medium text-zinc-500">{crumb}</span>
							</div>
						))}
					</div>
				)}

				{/* Title block */}
				<div tw="flex flex-col mt-10 flex-1">
					<h1
						tw="text-6xl font-black max-w-[900px] text-zinc-50"
						style={{ letterSpacing: "-0.03em", lineHeight: 1.1 }}
					>
						{title}
					</h1>

					{description && (
						<p
							tw="text-2xl mt-6 max-w-[750px] font-medium text-zinc-500"
							style={{ lineHeight: 1.4 }}
						>
							{description.length > 120
								? description.slice(0, 120) + "..."
								: description}
						</p>
					)}
				</div>

				{/* Footer */}
				<div tw="flex items-center justify-between pt-6 border-t border-zinc-800">
					<div tw="flex items-center">
						<div tw="w-3 h-3 rounded-full bg-rose-500" />
						<span tw="ml-4 text-lg font-medium text-zinc-500">docs</span>
						<span tw="mx-3 text-lg text-zinc-500">•</span>
						<span tw="text-lg font-medium text-zinc-500">
							{slug.slice(0, -1).join(" / ")}
						</span>
					</div>

					{tocCount > 0 && (
						<div tw="flex items-center">
							<span tw="text-lg text-zinc-500">{tocCount} sections</span>
						</div>
					)}
				</div>
			</div>
		</div>,
		{
			width: 1200,
			height: 630,
			format: "webp",
		},
	);
}

export function generateStaticParams() {
	return source.getPages().map((page) => ({
		lang: page.locale,
		slug: getPageImage(page).segments,
	}));
}
