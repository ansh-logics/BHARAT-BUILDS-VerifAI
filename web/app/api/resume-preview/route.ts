import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function allowedApiOrigin(): string {
  const configured = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8082";
  return new URL(configured).origin;
}

export async function GET(request: NextRequest) {
  const rawUrl = request.nextUrl.searchParams.get("url");
  if (!rawUrl) {
    return NextResponse.json({ detail: "Resume URL is required." }, { status: 400 });
  }

  let resumeUrl: URL;
  try {
    resumeUrl = new URL(rawUrl);
  } catch {
    return NextResponse.json({ detail: "Invalid resume URL." }, { status: 400 });
  }

  if (
    resumeUrl.origin !== allowedApiOrigin() ||
    (!resumeUrl.pathname.startsWith("/storage/resumes/") &&
      !resumeUrl.pathname.startsWith("/storage/marksheets/"))
  ) {
    return NextResponse.json({ detail: "Resume URL is not allowed." }, { status: 403 });
  }

  try {
    const upstream = await fetch(resumeUrl, {
      cache: "no-store",
      headers: { Accept: "application/pdf,application/octet-stream;q=0.9,*/*;q=0.8" },
    });

    if (!upstream.ok) {
      return NextResponse.json(
        { detail: "Resume preview is temporarily unavailable." },
        { status: upstream.status },
      );
    }

    const contentType = upstream.headers.get("content-type") || "application/pdf";
    if (!contentType.toLowerCase().includes("pdf")) {
      return NextResponse.json(
        { detail: "The saved resume is not a PDF." },
        { status: 415 },
      );
    }

    return new NextResponse(await upstream.arrayBuffer(), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": "inline",
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return NextResponse.json(
      { detail: "Resume preview is temporarily unavailable." },
      { status: 502 },
    );
  }
}
