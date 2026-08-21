'use client';

import { useState, useCallback } from 'react';
import FormSection from './FormSection';
import PackageCard from './PackageCard';
import DrinkSlot, { type DrinkSlotState } from './DrinkSlot';
import { PACKAGES, getPackageById, isPackageEligible } from '@/lib/config/packages';
import { EVENT_TYPES } from '@/lib/config/event-types';

interface InquiryFormState {
  // Section 01
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  // Section 02
  eventDate: string;
  eventType: string;
  eventTypeOther: string;
  estimatedGuestCount: string;
  eventLocation: string;
  eventTime: string;
  // Section 03
  packageId: string;
  // Section 04
  drinks: DrinkSlotState[];
  // Section 05
  additionalNotes: string;
  // Anti-spam
  honeypot: string;
  // UI state
  isSubmitting: boolean;
  isSuccess: boolean;
  errors: Record<string, string>;
}

const emptyDrinkSlot: DrinkSlotState = {
  choiceType: null,
  signatureDrinkId: null,
  custom: { base: null, puree: null, syrup: null, garnishes: [] },
};

const initialState: InquiryFormState = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  eventDate: '',
  eventType: '',
  eventTypeOther: '',
  estimatedGuestCount: '',
  eventLocation: '',
  eventTime: '',
  packageId: '',
  drinks: [],
  additionalNotes: '',
  honeypot: '',
  isSubmitting: false,
  isSuccess: false,
  errors: {},
};

export default function InquiryForm() {
  const [form, setForm] = useState<InquiryFormState>(initialState);
  const [excessDrinkCount, setExcessDrinkCount] = useState(0);

  // Derive package info
  const selectedPackage = form.packageId ? getPackageById(form.packageId) : null;
  const allowedDrinkCount = selectedPackage?.allowedDrinkCount ?? 0;

  // Check package eligibility
  const guestCount = parseInt(form.estimatedGuestCount, 10);
  const hasGuestCount = !isNaN(guestCount) && guestCount > 0;
  const eligibilityErrors: Record<string, string> = {};

  if (form.packageId && hasGuestCount) {
    if (!isPackageEligible(form.packageId, guestCount)) {
      const pkg = getPackageById(form.packageId);
      if (pkg?.guestMax !== null && guestCount > (pkg?.guestMax ?? 0)) {
        eligibilityErrors[form.packageId] = `${pkg?.name} is for events with ${pkg?.guestMax} or fewer guests.`;
      } else if (pkg?.guestMin !== null && guestCount < (pkg?.guestMin ?? 0)) {
        eligibilityErrors[form.packageId] = `${pkg?.name} requires at least ${pkg?.guestMin} guests.`;
      }
    }
  }

  const hasEligibilityError = Object.keys(eligibilityErrors).length > 0;
  const hasExcessDrinks = excessDrinkCount > 0;
  const isSubmitDisabled = form.isSubmitting || hasEligibilityError || hasExcessDrinks;

  // Update a text field
  const updateField = useCallback((field: keyof InquiryFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value, errors: { ...prev.errors, [field]: '' } }));
  }, []);

  // Handle package selection
  const handlePackageSelect = useCallback((packageId: string) => {
    setForm((prev) => {
      const newPkg = getPackageById(packageId);
      const newAllowed = newPkg?.allowedDrinkCount ?? 0;
      const currentDrinks = prev.drinks;
      let newDrinks: DrinkSlotState[];

      if (newAllowed > currentDrinks.length) {
        // Append empty slots
        newDrinks = [
          ...currentDrinks,
          ...Array.from({ length: newAllowed - currentDrinks.length }, () => ({ ...emptyDrinkSlot })),
        ];
        setExcessDrinkCount(0);
      } else if (newAllowed < currentDrinks.length) {
        // Keep all drinks but mark excess
        newDrinks = currentDrinks;
        setExcessDrinkCount(currentDrinks.length - newAllowed);
      } else {
        newDrinks = currentDrinks;
        setExcessDrinkCount(0);
      }

      return {
        ...prev,
        packageId,
        drinks: newDrinks,
        errors: { ...prev.errors, packageId: '' },
      };
    });
  }, []);

  // Handle guest count change — re-evaluate eligibility
  const handleGuestCountChange = useCallback((value: string) => {
    setForm((prev) => ({
      ...prev,
      estimatedGuestCount: value,
      errors: { ...prev.errors, estimatedGuestCount: '' },
    }));
  }, []);

  // Handle drink slot change
  const handleDrinkChange = useCallback((index: number, state: DrinkSlotState) => {
    setForm((prev) => {
      const newDrinks = [...prev.drinks];
      newDrinks[index] = state;
      return { ...prev, drinks: newDrinks };
    });
  }, []);

  // Remove excess drink selections
  const handleRemoveExcess = useCallback(() => {
    setForm((prev) => {
      const newDrinks = prev.drinks.slice(0, allowedDrinkCount);
      return { ...prev, drinks: newDrinks };
    });
    setExcessDrinkCount(0);
  }, [allowedDrinkCount]);

  // Build submission payload
  const buildPayload = () => {
    const activeDrinks = form.drinks.slice(0, allowedDrinkCount);
    const drinks = activeDrinks.map((drink) => {
      if (drink.choiceType === 'signature') {
        return { choiceType: 'signature' as const, signatureDrinkId: drink.signatureDrinkId! };
      }
      return {
        choiceType: 'custom' as const,
        custom: {
          base: drink.custom.base!,
          puree: drink.custom.puree!,
          syrup: drink.custom.syrup!,
          garnishes: drink.custom.garnishes,
        },
      };
    });

    return {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phoneNumber: form.phoneNumber,
      eventDate: form.eventDate,
      eventType: form.eventType,
      eventTypeOther: form.eventType === 'Other' ? form.eventTypeOther : undefined,
      estimatedGuestCount: parseInt(form.estimatedGuestCount, 10),
      eventLocation: form.eventLocation,
      eventTime: form.eventTime,
      packageId: form.packageId,
      drinks,
      additionalNotes: form.additionalNotes || undefined,
      honeypot: form.honeypot || undefined,
    };
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForm((prev) => ({ ...prev, isSubmitting: true, errors: {} }));

    try {
      const payload = buildPayload();
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setForm((prev) => ({ ...prev, isSubmitting: false, isSuccess: true }));
      } else {
        const data = await res.json().catch(() => null);
        const errors: Record<string, string> = {};
        if (data?.errors && typeof data.errors === 'object') {
          for (const [key, value] of Object.entries(data.errors)) {
            errors[key] = Array.isArray(value) ? value[0] : String(value);
          }
        } else if (data?.error) {
          errors._form = data.error;
        } else {
          errors._form = 'Something went wrong. Please try again.';
        }
        setForm((prev) => ({ ...prev, isSubmitting: false, errors }));
      }
    } catch {
      setForm((prev) => ({
        ...prev,
        isSubmitting: false,
        errors: { _form: 'Something went wrong. Please try again.' },
      }));
    }
  };

  // Success state
  if (form.isSuccess) {
    return (
      <div className="rounded-2xl bg-frosted-mint/30 p-8 lg:p-12 text-center">
        <h2 className="font-display text-2xl lg:text-3xl text-slate">Thank You!</h2>
        <p className="font-body text-base text-slate/80 mt-4 max-w-md mx-auto leading-relaxed">
          Thanks for your inquiry — someone from our team will be in touch within 1 business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-16" noValidate>
      {/* Honeypot */}
      <input
        type="text"
        name="honeypot"
        tabIndex={-1}
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
        value={form.honeypot}
        onChange={(e) => updateField('honeypot', e.target.value)}
        autoComplete="off"
      />

      {/* Section 01: About You */}
      <FormSection number="01" heading="About You">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="firstName" className="block font-body text-sm font-medium text-slate mb-1.5">
              First Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="firstName"
              type="text"
              required
              aria-required="true"
              aria-describedby={form.errors.firstName ? 'firstName-error' : undefined}
              value={form.firstName}
              onChange={(e) => updateField('firstName', e.target.value)}
              className="w-full rounded-xl border border-slate/20 px-4 py-3 font-body text-base text-slate bg-cool-white focus:outline-none focus:ring-2 focus:ring-slate/30"
            />
            {form.errors.firstName && (
              <p id="firstName-error" className="font-body text-xs text-rose-500 mt-1">{form.errors.firstName}</p>
            )}
          </div>
          <div>
            <label htmlFor="lastName" className="block font-body text-sm font-medium text-slate mb-1.5">
              Last Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="lastName"
              type="text"
              required
              aria-required="true"
              aria-describedby={form.errors.lastName ? 'lastName-error' : undefined}
              value={form.lastName}
              onChange={(e) => updateField('lastName', e.target.value)}
              className="w-full rounded-xl border border-slate/20 px-4 py-3 font-body text-base text-slate bg-cool-white focus:outline-none focus:ring-2 focus:ring-slate/30"
            />
            {form.errors.lastName && (
              <p id="lastName-error" className="font-body text-xs text-rose-500 mt-1">{form.errors.lastName}</p>
            )}
          </div>
        </div>
        <div>
          <label htmlFor="email" className="block font-body text-sm font-medium text-slate mb-1.5">
            Email <span className="text-rose-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            required
            aria-required="true"
            autoComplete="email"
            aria-describedby={form.errors.email ? 'email-error' : undefined}
            value={form.email}
            onChange={(e) => updateField('email', e.target.value)}
            className="w-full rounded-xl border border-slate/20 px-4 py-3 font-body text-base text-slate bg-cool-white focus:outline-none focus:ring-2 focus:ring-slate/30"
          />
          {form.errors.email && (
            <p id="email-error" className="font-body text-xs text-rose-500 mt-1">{form.errors.email}</p>
          )}
        </div>
        <div>
          <label htmlFor="phoneNumber" className="block font-body text-sm font-medium text-slate mb-1.5">
            Phone Number <span className="text-rose-500">*</span>
          </label>
          <input
            id="phoneNumber"
            type="tel"
            required
            aria-required="true"
            autoComplete="tel"
            aria-describedby={form.errors.phoneNumber ? 'phoneNumber-error' : undefined}
            value={form.phoneNumber}
            onChange={(e) => updateField('phoneNumber', e.target.value)}
            className="w-full rounded-xl border border-slate/20 px-4 py-3 font-body text-base text-slate bg-cool-white focus:outline-none focus:ring-2 focus:ring-slate/30"
          />
          {form.errors.phoneNumber && (
            <p id="phoneNumber-error" className="font-body text-xs text-rose-500 mt-1">{form.errors.phoneNumber}</p>
          )}
        </div>
      </FormSection>

      {/* Section 02: Your Event */}
      <FormSection number="02" heading="Your Event">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="eventDate" className="block font-body text-sm font-medium text-slate mb-1.5">
              Event Date <span className="text-rose-500">*</span>
            </label>
            <input
              id="eventDate"
              type="date"
              required
              aria-required="true"
              aria-describedby={form.errors.eventDate ? 'eventDate-error' : undefined}
              value={form.eventDate}
              onChange={(e) => updateField('eventDate', e.target.value)}
              className="w-full rounded-xl border border-slate/20 px-4 py-3 font-body text-base text-slate bg-cool-white focus:outline-none focus:ring-2 focus:ring-slate/30"
            />
            {form.errors.eventDate && (
              <p id="eventDate-error" className="font-body text-xs text-rose-500 mt-1">{form.errors.eventDate}</p>
            )}
          </div>
          <div>
            <label htmlFor="eventTime" className="block font-body text-sm font-medium text-slate mb-1.5">
              Event Time <span className="text-rose-500">*</span>
            </label>
            <input
              id="eventTime"
              type="time"
              required
              aria-required="true"
              aria-describedby={form.errors.eventTime ? 'eventTime-error' : undefined}
              value={form.eventTime}
              onChange={(e) => updateField('eventTime', e.target.value)}
              className="w-full rounded-xl border border-slate/20 px-4 py-3 font-body text-base text-slate bg-cool-white focus:outline-none focus:ring-2 focus:ring-slate/30"
            />
            {form.errors.eventTime && (
              <p id="eventTime-error" className="font-body text-xs text-rose-500 mt-1">{form.errors.eventTime}</p>
            )}
          </div>
        </div>
        <div>
          <label htmlFor="eventType" className="block font-body text-sm font-medium text-slate mb-1.5">
            Event Type <span className="text-rose-500">*</span>
          </label>
          <select
            id="eventType"
            required
            aria-required="true"
            aria-describedby={form.errors.eventType ? 'eventType-error' : undefined}
            value={form.eventType}
            onChange={(e) => updateField('eventType', e.target.value)}
            className="w-full rounded-xl border border-slate/20 px-4 py-3 font-body text-base text-slate bg-cool-white focus:outline-none focus:ring-2 focus:ring-slate/30"
          >
            <option value="">Select event type</option>
            {EVENT_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {form.errors.eventType && (
            <p id="eventType-error" className="font-body text-xs text-rose-500 mt-1">{form.errors.eventType}</p>
          )}
        </div>
        {form.eventType === 'Other' && (
          <div>
            <label htmlFor="eventTypeOther" className="block font-body text-sm font-medium text-slate mb-1.5">
              Please Specify <span className="text-rose-500">*</span>
            </label>
            <input
              id="eventTypeOther"
              type="text"
              required
              aria-required="true"
              aria-describedby={form.errors.eventTypeOther ? 'eventTypeOther-error' : undefined}
              value={form.eventTypeOther}
              onChange={(e) => updateField('eventTypeOther', e.target.value)}
              className="w-full rounded-xl border border-slate/20 px-4 py-3 font-body text-base text-slate bg-cool-white focus:outline-none focus:ring-2 focus:ring-slate/30"
            />
            {form.errors.eventTypeOther && (
              <p id="eventTypeOther-error" className="font-body text-xs text-rose-500 mt-1">{form.errors.eventTypeOther}</p>
            )}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="estimatedGuestCount" className="block font-body text-sm font-medium text-slate mb-1.5">
              Estimated Guest Count <span className="text-rose-500">*</span>
            </label>
            <input
              id="estimatedGuestCount"
              type="number"
              required
              min="1"
              aria-required="true"
              aria-describedby={form.errors.estimatedGuestCount ? 'estimatedGuestCount-error' : undefined}
              value={form.estimatedGuestCount}
              onChange={(e) => handleGuestCountChange(e.target.value)}
              className="w-full rounded-xl border border-slate/20 px-4 py-3 font-body text-base text-slate bg-cool-white focus:outline-none focus:ring-2 focus:ring-slate/30"
            />
            {form.errors.estimatedGuestCount && (
              <p id="estimatedGuestCount-error" className="font-body text-xs text-rose-500 mt-1">{form.errors.estimatedGuestCount}</p>
            )}
          </div>
          <div>
            <label htmlFor="eventLocation" className="block font-body text-sm font-medium text-slate mb-1.5">
              Event Location <span className="text-rose-500">*</span>
            </label>
            <input
              id="eventLocation"
              type="text"
              required
              aria-required="true"
              aria-describedby={form.errors.eventLocation ? 'eventLocation-error' : undefined}
              value={form.eventLocation}
              onChange={(e) => updateField('eventLocation', e.target.value)}
              placeholder="Venue name, city, or address"
              className="w-full rounded-xl border border-slate/20 px-4 py-3 font-body text-base text-slate bg-cool-white focus:outline-none focus:ring-2 focus:ring-slate/30"
            />
            {form.errors.eventLocation && (
              <p id="eventLocation-error" className="font-body text-xs text-rose-500 mt-1">{form.errors.eventLocation}</p>
            )}
          </div>
        </div>
      </FormSection>

      {/* Section 03: Package */}
      <FormSection number="03" heading="Package">
        <p className="font-body text-sm text-slate/60 -mt-2">
          Your package can be changed later.
        </p>
        <div className="space-y-3">
          {PACKAGES.map((pkg) => {
            const eligible = !hasGuestCount || isPackageEligible(pkg.id, guestCount);
            return (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                isSelected={form.packageId === pkg.id}
                isEligible={eligible}
                onSelect={handlePackageSelect}
              />
            );
          })}
        </div>
        {hasEligibilityError && (
          <p className="font-body text-xs text-rose-500 mt-2">
            {Object.values(eligibilityErrors)[0]}
          </p>
        )}
        {form.errors.packageId && (
          <p className="font-body text-xs text-rose-500 mt-1">{form.errors.packageId}</p>
        )}
      </FormSection>

      {/* Section 04: Drink Choices */}
      {selectedPackage && (
        <FormSection number="04" heading="Drink Choices">
          <p className="font-body text-sm text-slate/60 -mt-2">
            Your package includes {allowedDrinkCount} drink{allowedDrinkCount !== 1 ? 's' : ''}.
          </p>

          {hasExcessDrinks && (
            <div className="rounded-xl bg-rose-petal/20 border border-rose-petal px-5 py-4">
              <p className="font-body text-sm text-slate">
                Your new package includes {allowedDrinkCount} drink{allowedDrinkCount !== 1 ? 's' : ''}. Please remove {excessDrinkCount} extra selection{excessDrinkCount !== 1 ? 's' : ''} to continue.
              </p>
              <button
                type="button"
                onClick={handleRemoveExcess}
                className="mt-3 font-body text-sm font-semibold text-slate underline underline-offset-2 hover:text-slate/80 transition-colors"
              >
                Remove Extra Selections
              </button>
            </div>
          )}

          <div className="space-y-5">
            {form.drinks.map((drink, index) => (
              <DrinkSlot
                key={index}
                index={index}
                state={drink}
                onChange={handleDrinkChange}
                isExcess={index >= allowedDrinkCount}
              />
            ))}
          </div>
        </FormSection>
      )}

      {/* Section 05: Anything Else */}
      <FormSection number="05" heading="Anything Else?">
        <div>
          <label htmlFor="additionalNotes" className="block font-body text-sm font-medium text-slate mb-1.5">
            Anything Else You Want Us to Know?
          </label>
          <textarea
            id="additionalNotes"
            rows={4}
            maxLength={2000}
            aria-describedby={form.errors.additionalNotes ? 'additionalNotes-error' : undefined}
            value={form.additionalNotes}
            onChange={(e) => updateField('additionalNotes', e.target.value)}
            className="w-full rounded-xl border border-slate/20 px-4 py-3 font-body text-base text-slate bg-cool-white focus:outline-none focus:ring-2 focus:ring-slate/30 resize-y min-h-[100px]"
          />
          {form.errors.additionalNotes && (
            <p id="additionalNotes-error" className="font-body text-xs text-rose-500 mt-1">{form.errors.additionalNotes}</p>
          )}
        </div>
      </FormSection>

      {/* Form-level error */}
      {form.errors._form && (
        <div className="rounded-xl bg-rose-petal/20 border border-rose-petal px-5 py-4">
          <p className="font-body text-sm text-rose-500">{form.errors._form}</p>
        </div>
      )}

      {/* Submit */}
      <div>
        <button
          type="submit"
          disabled={isSubmitDisabled}
          className="w-full sm:w-auto bg-slate text-cool-white rounded-full px-8 py-3.5 font-body font-semibold text-base transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
        >
          {form.isSubmitting ? 'Sending…' : 'Send Inquiry'}
        </button>
      </div>
    </form>
  );
}
