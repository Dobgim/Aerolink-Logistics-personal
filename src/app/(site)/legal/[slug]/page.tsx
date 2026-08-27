import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { Container, Section } from "@/components/ui/primitives";
import { SITE } from "@/lib/constants/site";

interface LegalDoc {
  title: string;
  summary: string;
  sections: { heading: string; body: string[] }[];
}

const DOCS: Record<string, LegalDoc> = {
  privacy: {
    title: "Privacy Policy",
    summary:
      "How AeroLink Logistics collects, uses and protects personal data when you ship with us or track a shipment.",
    sections: [
      {
        heading: "What we collect",
        body: [
          "When a shipment is booked we collect the sender's and receiver's name, address, email and phone number, along with a description of the goods. This is the minimum needed to carry and clear the shipment.",
          "When you use the tracking page we record the tracking number searched and standard technical information such as your browser type and IP address.",
          "When you contact support we keep the message, your contact details and any tracking number you reference.",
        ],
      },
      {
        heading: "Why we use it",
        body: [
          "To carry, clear and deliver shipments, and to prove delivery afterwards.",
          "To answer support requests and resolve claims.",
          "To meet customs, aviation security and tax obligations, which require us to retain shipment records.",
        ],
      },
      {
        heading: "Who we share it with",
        body: [
          "Customs authorities and airlines, where the law or the carriage requires it.",
          "Delivery partners performing the final leg in the destination country.",
          "We do not sell personal data, and we do not share it for advertising.",
        ],
      },
      {
        heading: "How long we keep it",
        body: [
          "Shipment and customs records are retained for seven years, as required by trade and tax law.",
          "Support correspondence is retained for two years.",
        ],
      },
      {
        heading: "Your rights",
        body: [
          `You can ask for a copy of your data, ask us to correct it, or ask us to delete anything we are not legally required to keep. Write to ${SITE.email} and we will respond within 30 days.`,
        ],
      },
    ],
  },
  terms: {
    title: "Terms of Carriage",
    summary:
      "The terms on which AeroLink Logistics accepts, carries and delivers shipments.",
    sections: [
      {
        heading: "Acceptance",
        body: [
          "By handing a shipment to AeroLink you agree to these terms on behalf of yourself and anyone else with an interest in the shipment.",
          "We may open and inspect any shipment for security or customs purposes without notice.",
        ],
      },
      {
        heading: "What we will not carry",
        body: [
          "Cash, bullion, precious stones, live animals, human remains, firearms and anything prohibited by the origin or destination country.",
          "Dangerous goods are accepted only under a declared dangerous-goods booking with the correct documentation.",
        ],
      },
      {
        heading: "Transit commitments",
        body: [
          "Published transit times are business-day estimates measured from the first collection scan. They exclude customs delays, weather, industrial action and any cause outside our control.",
          "Where an express service carries a money-back commitment, the remedy is a refund of the freight charge and nothing further.",
        ],
      },
      {
        heading: "Liability",
        body: [
          "Our liability for loss or damage is limited to the standard transit liability applicable to the service, unless additional declared-value cover was purchased at booking.",
          "We are not liable for indirect or consequential loss, including loss of profit or loss of market, however it arises.",
        ],
      },
      {
        heading: "Claims",
        body: [
          "Claims for damage must be notified within seven days of delivery, and claims for loss within thirty days of the shipment date. Claims outside these windows cannot be considered.",
        ],
      },
      {
        heading: "Charges",
        body: [
          "Freight charges are payable by the sender. Duties and taxes are payable by the receiver unless the sender elected to pay them at booking.",
          "Where a shipment is refused or undeliverable, return charges are payable by the sender.",
        ],
      },
    ],
  },
  cookies: {
    title: "Cookie Policy",
    summary: "The cookies this site sets and what each one does.",
    sections: [
      {
        heading: "Strictly necessary cookies",
        body: [
          "We set a session cookie when you sign in. It identifies your account for the duration of the session and is required for the site to work. It is HTTP-only, so scripts on the page cannot read it.",
        ],
      },
      {
        heading: "What we do not set",
        body: [
          "This site sets no advertising, profiling or cross-site tracking cookies, and embeds no third-party trackers.",
        ],
      },
      {
        heading: "Managing cookies",
        body: [
          "You can clear or block cookies in your browser settings. Blocking the session cookie will prevent you from signing in, but tracking a shipment does not require any cookie at all.",
        ],
      },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(DOCS).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = DOCS[slug];
  if (!doc) return { title: "Not found" };

  return {
    title: doc.title,
    description: doc.summary,
    alternates: { canonical: `/legal/${slug}` },
  };
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = DOCS[slug];
  if (!doc) notFound();

  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title={doc.title}
        description={doc.summary}
        breadcrumbs={[{ label: doc.title }]}
      />

      <Section>
        <Container>
          <div className="max-w-3xl">
            <p className="text-sm text-ink-500">
              This is a fictional company created for a portfolio project. The policy below is
              written to be realistic, not to constitute legal advice.
            </p>

            <div className="mt-10 space-y-10">
              {doc.sections.map((section) => (
                <section key={section.heading}>
                  <h2 className="text-xl font-extrabold text-ink-900 sm:text-2xl">
                    {section.heading}
                  </h2>
                  <div className="mt-3 space-y-3">
                    {section.body.map((paragraph) => (
                      <p key={paragraph} className="text-base leading-relaxed text-ink-600">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
