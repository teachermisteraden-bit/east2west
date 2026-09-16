import { redirect } from "next/navigation";
import { defaultLocale } from "@/i18n/locales";

/**
 * Reached only when the path carries no usable locale prefix. Send the visitor
 * to the default locale's 404, which is fully translated and on-brand.
 */
export default function RootNotFound() {
  redirect(`/${defaultLocale}/404`);
}
