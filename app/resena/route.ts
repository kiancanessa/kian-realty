import { NextResponse } from "next/server";
import { GOOGLE_WRITE_REVIEW_URL } from "../lib/googleLinks";

/** A short address for QR codes, cards and messages: it sends the visitor to
 *  Google's "write a review" box for El Casa Rosarito. Printed material keeps
 *  working even if Google's own link ever changes. */
export function GET() {
  return NextResponse.redirect(GOOGLE_WRITE_REVIEW_URL, 302);
}
