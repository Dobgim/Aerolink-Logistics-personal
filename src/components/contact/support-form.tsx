"use client";

import { useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/field";
import { Card } from "@/components/ui/primitives";
import { useToast } from "@/components/ui/toast";
import { EASE } from "@/components/ui/motion";

const SUBJECTS = [
  "Where is my shipment?",
  "Change a delivery address",
  "Customs or documentation",
  "Request a quote",
  "Business account enquiry",
  "Report a damaged shipment",
  "Something else",
];

interface Props {
  defaultSubject?: string;
  defaultTrackingNumber?: string;
}

export function SupportForm({ defaultSubject, defaultTrackingNumber }: Props) {
  const toast = useToast();
  const reduce = useReducedMotion();
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    setSubmitting(true);
    setErrors({});

    try {
      const response = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const payload = await response.json();

      if (!response.ok) {
        setErrors((payload.details as Record<string, string>) ?? {});
        toast.error(
          payload.error ?? "We could not send your message",
          "Please check the highlighted fields and try again.",
        );
        return;
      }

      form.reset();
      setDone(true);
      toast.success("Message sent", "Our support team will reply by email shortly.");
    } catch {
      toast.error("Network error", "Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        <Card className="py-12 text-center">
          <span className="mx-auto inline-flex size-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 aria-hidden className="size-7" />
          </span>
          <h2 className="mt-5 text-xl font-extrabold text-ink-900">Message received</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-600">
            Your request is with our support team. We reply to most messages within one business
            day, and sooner for shipments already in transit.
          </p>
          <Button variant="outline" size="md" className="mt-6" onClick={() => setDone(false)}>
            Send another message
          </Button>
        </Card>
      </motion.div>
    );
  }

  return (
    <Card>
      <form onSubmit={onSubmit} noValidate className="grid gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            name="name"
            label="Full name"
            required
            autoComplete="name"
            placeholder="Daniel Whitfield"
            error={errors.name}
          />
          <Input
            name="email"
            type="email"
            label="Email address"
            required
            autoComplete="email"
            placeholder="you@example.com"
            error={errors.email}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            name="phone"
            type="tel"
            label="Phone number"
            autoComplete="tel"
            placeholder="+1 (212) 555-0142"
            error={errors.phone}
          />
          <Input
            name="tracking_number"
            label="Tracking number"
            hint="Optional — speeds things up if your question is about a shipment."
            defaultValue={defaultTrackingNumber}
            placeholder="RPL-2026-983456"
            error={errors.tracking_number}
          />
        </div>

        <Select
          name="subject"
          label="Subject"
          required
          defaultValue={defaultSubject ?? SUBJECTS[0]}
          error={errors.subject}
        >
          {SUBJECTS.map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </Select>

        <Textarea
          name="message"
          label="How can we help?"
          required
          rows={6}
          placeholder="Tell us what you need — the more detail, the faster we can resolve it."
          error={errors.message}
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-ink-500">
            We use your details only to answer this request.
          </p>
          <Button
            type="submit"
            size="lg"
            loading={submitting}
            icon={<Send aria-hidden className="size-4" />}
            className="w-full sm:w-auto"
          >
            {submitting ? "Sending" : "Send message"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
