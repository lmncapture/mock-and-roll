import 'server-only';

import { Resend } from 'resend';
import { serverEnv } from '@/lib/env/server';
import { publicEnv } from '@/lib/env/public';
import { formatDate, formatTime } from '@/lib/utils/format';

interface DrinkNotificationItem {
  choiceType: 'signature' | 'custom';
  signatureDrinkId?: string;
  signatureDrinkNameSnapshot?: string;
  custom?: {
    base: string;
    puree: string;
    syrup: string;
    garnishes: string[];
  };
}

interface NotificationData {
  reference: string;
  inquiryId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  eventDate: string;
  eventTime: string;
  eventType: string;
  eventTypeOther?: string;
  estimatedGuestCount: number;
  eventLocation: string;
  packageName: string;
  packagePriceDisplay: string;
  drinks: DrinkNotificationItem[];
  additionalNotes?: string;
}

function formatGarnishes(garnishes: string[]): string {
  if (garnishes.length === 0) return 'None';
  if (garnishes.length === 1) return garnishes[0];
  if (garnishes.length === 2) return `${garnishes[0]} & ${garnishes[1]}`;
  return `${garnishes.slice(0, -1).join(', ')} & ${garnishes[garnishes.length - 1]}`;
}

function buildDrinksSection(drinks: DrinkNotificationItem[]): string {
  return drinks
    .map((drink, i) => {
      const position = `Drink ${i + 1}`;
      if (drink.choiceType === 'signature') {
        return `${position} — Signature Mocktail\n  ${drink.signatureDrinkNameSnapshot || drink.signatureDrinkId}`;
      }
      if (drink.custom) {
        return [
          `${position} — Custom Mocktail`,
          `  Base: ${drink.custom.base}`,
          `  Purée: ${drink.custom.puree}`,
          `  Syrup: ${drink.custom.syrup}`,
          `  Garnishes: ${formatGarnishes(drink.custom.garnishes)}`,
          `  Preparation: Sparkling with club soda`,
        ].join('\n');
      }
      return `${position} — Unknown`;
    })
    .join('\n\n');
}

export async function sendInquiryNotification(
  data: NotificationData,
): Promise<void> {
  const resend = new Resend(serverEnv.resendApiKey);

  const subject = `New Mock & Roll Inquiry ${data.reference} — ${data.firstName} ${data.lastName}`;

  const adminLink = publicEnv.siteUrl
    ? `\n\nView in Dashboard: ${publicEnv.siteUrl}/admin/inquiries/${data.inquiryId}`
    : '';

  const eventTypeLine =
    data.eventType === 'Other' && data.eventTypeOther
      ? `${data.eventType} (${data.eventTypeOther})`
      : data.eventType;

  const body = [
    `CONTACT`,
    `  First Name: ${data.firstName}`,
    `  Last Name: ${data.lastName}`,
    `  Email: ${data.email}`,
    `  Phone: ${data.phoneNumber}`,
    ``,
    `EVENT`,
    `  Date: ${formatDate(data.eventDate)}`,
    `  Time: ${formatTime(data.eventTime)}`,
    `  Type: ${eventTypeLine}`,
    `  Guest Count: ${data.estimatedGuestCount}`,
    `  Location: ${data.eventLocation}`,
    ``,
    `PACKAGE`,
    `  ${data.packageName} (${data.packagePriceDisplay})`,
    ``,
    `DRINK CHOICES`,
    buildDrinksSection(data.drinks),
    ``,
    ...(data.additionalNotes
      ? [`ADDITIONAL NOTES`, `  ${data.additionalNotes}`, ``]
      : []),
    `Reference: ${data.reference}`,
    adminLink,
  ].join('\n');

  await resend.emails.send({
    from: serverEnv.resendFromEmail,
    to: serverEnv.notificationEmail,
    replyTo: data.email,
    subject,
    text: body,
  });
}
