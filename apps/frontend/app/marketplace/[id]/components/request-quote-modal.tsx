'use client';

import type React from 'react';
import { useState } from 'react';
import { requestQuote, type QuoteRequestPayload } from '@/lib/api';
import { DatePicker } from '@/app/components/date-picker';

type Status = 'idle' | 'loading' | 'success' | 'error';

type Props = {
  adSlotId: string;
  adSlotName: string;
  onClose: () => void;
};

export function RequestQuoteModal({ adSlotId, adSlotName, onClose }: Props) {
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [budget, setBudget] = useState('');
  const [goals, setGoals] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [requirements, setRequirements] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');
  const [quoteId, setQuoteId] = useState<string | null>(null);

  const isValidEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!companyName.trim()) {
      setStatus('error');
      setMessage('Company name is required.');
      return;
    }

    if (!isValidEmail(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    setMessage('');

    const payload: QuoteRequestPayload = {
      email: email.trim(),
      companyName: companyName.trim(),
      adSlotId,
      adSlotName,
      phone: phone.trim() || undefined,
      budget: budget.trim() || undefined,
      goals: goals.trim() || undefined,
      timeline: preferredDate.trim() || undefined,
      requirements: requirements.trim() || undefined,
    };

    try {
      const result = await requestQuote(payload);
      if (result.success) {
        setStatus('success');
        setQuoteId(result.quoteId);
        setMessage('Your request has been sent. We will get back to you soon.');
        setCompanyName('');
        setEmail('');
        setPhone('');
        setBudget('');
        setGoals('');
        setPreferredDate('');
        setRequirements('');
      } else {
        setStatus('error');
        setMessage('Something went wrong. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage(
        error instanceof Error ? error.message : 'Something went wrong. Please try again.'
      );
    }
  };

  const disabled = status === 'loading';

  const inputClass =
    'w-full rounded-lg border border-[--color-border] bg-[--color-background] px-3 py-2.5 text-white placeholder:text-[--color-muted] focus:border-[--color-primary] focus:outline-none focus:ring-2 focus:ring-[--color-primary]/20';
  const labelClass = 'mb-1.5 block text-sm font-medium text-[--color-foreground]';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
      <div className="w-full max-w-xl rounded-xl border border-[--color-border] bg-[--color-card] p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Request a Quote</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-1.5 text-sm text-[--color-muted] transition-colors hover:bg-[--color-card-hover] hover:text-white"
          >
            Close
          </button>
        </div>
        <p className="mb-6 text-sm text-[--color-muted]">
          Tell us a bit about your campaign and we will follow up with a custom quote for{' '}
          <span className="font-semibold text-white">{adSlotName}</span>.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="quote-company" className={labelClass}>
                Company name
              </label>
              <input
                id="quote-company"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className={inputClass}
                disabled={disabled}
                required
              />
            </div>
            <div>
              <label htmlFor="quote-email" className={labelClass}>
                Contact email
              </label>
              <input
                id="quote-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                disabled={disabled}
                required
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="quote-phone" className={labelClass}>
                Phone (optional)
              </label>
              <input
                id="quote-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputClass}
                disabled={disabled}
              />
            </div>
            <div>
              <label htmlFor="quote-budget" className={labelClass}>
                Estimated budget
              </label>
              <input
                id="quote-budget"
                type="text"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="$5,000 / month"
                className={inputClass}
                disabled={disabled}
              />
            </div>
          </div>
          <div>
            <label htmlFor="quote-goals" className={labelClass}>
              Campaign goals
            </label>
            <input
              id="quote-goals"
              type="text"
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              placeholder="Brand awareness, lead generation, etc."
              className={inputClass}
              disabled={disabled}
            />
          </div>
          <div>
            <label htmlFor="quote-preferred-date" className={labelClass}>
              Preferred start date
            </label>
            <DatePicker
              id="quote-preferred-date"
              value={preferredDate}
              onChange={setPreferredDate}
              min={new Date()}
              placeholder="Select campaign start date"
              disabled={disabled}
              className={inputClass}
              aria-label="Preferred start date"
            />
          </div>
          <div>
            <label htmlFor="quote-requirements" className={labelClass}>
              Special requirements
            </label>
            <textarea
              id="quote-requirements"
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              rows={4}
              placeholder="Share any details that will help us price this placement for you."
              className={`${inputClass} min-h-[100px] resize-y`}
              disabled={disabled}
            />
          </div>
          {message && (
            <p
              className={`rounded-lg border px-3 py-2 text-sm ${
                status === 'success'
                  ? 'border-[--color-success]/50 bg-[--color-success]/10 text-[--color-success]'
                  : 'border-[--color-error]/50 bg-[--color-error]/10 text-[--color-error]'
              }`}
            >
              {quoteId && status === 'success' ? `${message} Reference ID: ${quoteId}.` : message}
            </p>
          )}
          <div className="flex flex-col-reverse items-center justify-between gap-3 pt-4 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-lg border border-[--color-border] bg-transparent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[--color-card-hover] sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={disabled}
              className="w-full rounded-lg bg-[--color-primary] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[--color-primary-hover] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {status === 'loading' ? 'Sending...' : 'Send quote request'}
            </button>
          </div>
          <p className="pt-2 text-center text-xs text-[--color-muted] sm:text-left">
            Typical response time: within 2 business days.
          </p>
        </form>
      </div>
    </div>
  );
}
