import { NextResponse } from 'next/server';
import { inquirySchema } from '@/lib/validation/inquiry-schema';
import { normalizePhone } from '@/lib/validation/phone';
import { getPackageById, isPackageEligible } from '@/lib/config/packages';
import { SIGNATURE_DRINKS } from '@/lib/config/drinks';
import { getTodayInBusinessTimezone } from '@/lib/utils/format';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';
import { sendInquiryNotification } from '@/lib/email/send-inquiry-notification';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Zod validate
    const parsed = inquirySchema.safeParse(body);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path.join('.') || '_form';
        if (!errors[key]) errors[key] = issue.message;
      }
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    const data = parsed.data;

    // 2. Honeypot check
    if (data.honeypot) {
      return NextResponse.json(
        { success: false, errors: { _form: 'Submission rejected' } },
        { status: 400 }
      );
    }

    // 3. Normalize inputs
    const firstName = data.firstName.trim();
    const lastName = data.lastName.trim();
    const email = data.email.trim().toLowerCase();
    const eventLocation = data.eventLocation.trim();
    const eventTypeOther = data.eventTypeOther?.trim() || null;
    const additionalNotes = data.additionalNotes?.trim() || null;

    let phoneResult;
    try {
      phoneResult = normalizePhone(data.phoneNumber);
    } catch {
      return NextResponse.json(
        { success: false, errors: { phoneNumber: 'Please enter a valid phone number' } },
        { status: 400 }
      );
    }

    // 4. Validate event date is not in the past
    const today = getTodayInBusinessTimezone();
    if (data.eventDate < today) {
      return NextResponse.json(
        { success: false, errors: { eventDate: 'Event date must be today or in the future' } },
        { status: 400 }
      );
    }

    // 5. Validate "Other" event type requires description
    if (data.eventType === 'Other' && !eventTypeOther) {
      return NextResponse.json(
        { success: false, errors: { eventTypeOther: 'Please specify your event type' } },
        { status: 400 }
      );
    }

    // 6. Package eligibility
    if (!isPackageEligible(data.packageId, data.estimatedGuestCount)) {
      return NextResponse.json(
        { success: false, errors: { packageId: 'This package is not available for your guest count' } },
        { status: 400 }
      );
    }

    // 7. Drink count validation
    const pkg = getPackageById(data.packageId)!;
    if (data.drinks.length !== pkg.allowedDrinkCount) {
      return NextResponse.json(
        { success: false, errors: { drinks: `Expected ${pkg.allowedDrinkCount} drinks for this package` } },
        { status: 400 }
      );
    }

    // 8. Build drinks payload with server-derived snapshots
    const drinksPayload = data.drinks.map((drink) => {
      if (drink.choiceType === 'signature') {
        const sig = SIGNATURE_DRINKS.find((d) => d.id === drink.signatureDrinkId);
        return {
          choiceType: 'signature' as const,
          signatureDrinkId: drink.signatureDrinkId,
          signatureDrinkNameSnapshot: sig?.name ?? drink.signatureDrinkId,
        };
      }
      return {
        choiceType: 'custom' as const,
        custom: {
          base: drink.custom.base,
          puree: drink.custom.puree,
          syrup: drink.custom.syrup,
          garnishes: drink.custom.garnishes,
        },
      };
    });

    // 9. Call create_inquiry RPC (package price/mode snapshots derived by RPC internally)
    const supabase = createAdminSupabaseClient();
    const { data: result, error: rpcError } = await supabase.rpc('create_inquiry', {
      p_first_name: firstName,
      p_last_name: lastName,
      p_email: email,
      p_phone_number: phoneResult.phoneNumber,
      p_phone_search_digits: phoneResult.phoneSearchDigits,
      p_event_date: data.eventDate,
      p_event_type: data.eventType,
      p_event_type_other: eventTypeOther,
      p_estimated_guest_count: data.estimatedGuestCount,
      p_event_location: eventLocation,
      p_event_time: data.eventTime,
      p_package_id: data.packageId,
      p_additional_notes: additionalNotes,
      p_drinks: drinksPayload,
      p_source: 'website',
    });

    if (rpcError) {
      console.error('[API] create_inquiry RPC failed:', rpcError.message);
      return NextResponse.json(
        { success: false, error: 'Something went wrong' },
        { status: 500 }
      );
    }

    const reference = result?.reference as string;

    // 10. Send notification email (await inside try/catch — log failure but proceed)
    try {
      await sendInquiryNotification({
        reference,
        firstName,
        lastName,
        email,
        phoneNumber: phoneResult.phoneNumber,
        eventDate: data.eventDate,
        eventTime: data.eventTime,
        eventType: data.eventType,
        eventTypeOther: eventTypeOther ?? undefined,
        estimatedGuestCount: data.estimatedGuestCount,
        eventLocation,
        packageName: pkg.name,
        packagePriceDisplay: pkg.priceDisplay,
        drinks: drinksPayload,
        additionalNotes: additionalNotes ?? undefined,
        inquiryId: result?.id as string,
      });
    } catch (emailError) {
      console.error(
        `[Resend] Notification failed for inquiry ${reference}:`,
        emailError instanceof Error ? emailError.message : 'Unknown error'
      );
    }

    // 11. Success response
    return NextResponse.json({ success: true, reference });
  } catch (error) {
    console.error(
      '[API] Unexpected error:',
      error instanceof Error ? error.message : 'Unknown'
    );
    return NextResponse.json(
      { success: false, error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
