export interface SubmitIntakeInput {
  portalSlug: string;
  description: string;
  contactName?: string;
  browserInfo?: Record<string, unknown>;
  screenshots?: File[];
}

export interface SubmitIntakeResult {
  success: boolean;
  referenceId: string;
  message?: string;
}

export interface SubmitIntakeError {
  code: string;
  message: string;
}

export async function submitIntake(
  input: SubmitIntakeInput,
): Promise<SubmitIntakeResult> {
  const formData = new FormData();
  formData.append("portal_slug", input.portalSlug);
  formData.append("description", input.description);

  if (input.contactName) {
    formData.append("contactName", input.contactName);
  }

  if (input.browserInfo) {
    formData.append("browserInfo", JSON.stringify(input.browserInfo));
  }

  for (const file of input.screenshots ?? []) {
    formData.append("screenshots", file, file.name);
  }

  const response = await fetch("/api/intake", {
    method: "POST",
    body: formData,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error: SubmitIntakeError = {
      code: payload.code ?? "INTAKE_FAILED",
      message: payload.message ?? "Could not submit your issue.",
    };
    throw error;
  }

  return {
    success: true,
    referenceId: payload.referenceId,
    message: payload.message,
  };
}
