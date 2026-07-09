import { NextResponse } from "next/server";

const MAX_FILES = 3;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(request: Request) {
  const serviceKey = process.env.VSOP_SERVICE_KEY;
  const apiBase =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
    "http://localhost:3001";

  if (!serviceKey) {
    return NextResponse.json(
      {
        code: "SERVICE_UNAVAILABLE",
        message:
          "Support intake is temporarily unavailable. (Missing VSOP_SERVICE_KEY on the frontend server.)",
      },
      { status: 503 },
    );
  }

  try {
    const incoming = await request.formData();
    const portalSlug = incoming.get("portal_slug");
    const description = incoming.get("description");

    if (!portalSlug || typeof portalSlug !== "string") {
      return NextResponse.json(
        {
          code: "INVALID_PORTAL_SLUG",
          message: "A valid portal is required.",
        },
        { status: 400 },
      );
    }

    const normalizedSlug = portalSlug.trim().toLowerCase();

    if (!description || typeof description !== "string" || !description.trim()) {
      return NextResponse.json(
        {
          code: "VALIDATION_ERROR",
          message: "Please describe the issue before submitting.",
        },
        { status: 400 },
      );
    }

    const outgoing = new FormData();
    outgoing.append("portal_slug", normalizedSlug);
    outgoing.append("description", description.trim());

    const contactName = incoming.get("contactName");
    if (contactName && typeof contactName === "string" && contactName.trim()) {
      outgoing.append("contactName", contactName.trim());
    }

    const browserInfo = incoming.get("browserInfo");
    if (browserInfo && typeof browserInfo === "string" && browserInfo.trim()) {
      outgoing.append("browserInfo", browserInfo);
    }

    const screenshots = incoming
      .getAll("screenshots")
      .filter((entry): entry is File => entry instanceof File && entry.size > 0);

    if (screenshots.length > MAX_FILES) {
      return NextResponse.json(
        {
          code: "VALIDATION_ERROR",
          message: `You can attach up to ${MAX_FILES} screenshots.`,
        },
        { status: 400 },
      );
    }

    for (const file of screenshots) {
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          {
            code: "VALIDATION_ERROR",
            message: "Each screenshot must be 5 MB or smaller.",
          },
          { status: 400 },
        );
      }
      outgoing.append("screenshots", file, file.name);
    }

    const response = await fetch(`${apiBase}/api/intake/internal`, {
      method: "POST",
      headers: {
        "X-VSOP-Service-Key": serviceKey,
        // Guard runs before multer — slug must be available via header
        "X-Portal-Slug": normalizedSlug,
      },
      body: outgoing,
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        {
          code: payload.code ?? "INTAKE_FAILED",
          message:
            payload.message ??
            "We could not submit your issue. Please try again shortly.",
        },
        { status: response.status },
      );
    }

    return NextResponse.json({
      success: true,
      referenceId: payload.reference_id ?? payload.referenceId,
      message: payload.message,
    });
  } catch (error) {
    console.error("[intake BFF]", error);
    return NextResponse.json(
      {
        code: "INTAKE_FAILED",
        message:
          "Something went wrong while submitting your issue. Check that the API is running.",
      },
      { status: 500 },
    );
  }
}
