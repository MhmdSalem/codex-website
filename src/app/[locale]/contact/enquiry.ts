/**
 * The contact form's shared state shape.
 *
 * Separate from `actions.ts` because a `"use server"` module may only export
 * async functions — a plain object exported alongside the action is a build
 * error, not a convenience.
 */
export interface EnquiryState {
  status: "idle" | "sent" | "error";
  /** Field-level messages, already translated. */
  errors?: Partial<Record<"name" | "email" | "message", string>>;
  /** Form-level message for a delivery failure. */
  message?: string;
  /** Echoed back so a rejected submission does not lose what was typed. */
  values?: { name: string; email: string; company: string; topic: string; message: string };
}

export const initialEnquiryState: EnquiryState = { status: "idle" };
