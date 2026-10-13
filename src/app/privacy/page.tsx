// Track A · /privacy (mockup: redesign-mockups/r3/privacy.html). New route.
// The copy is the mockup's draft, unchanged. It must be reconciled with the real tracking setup
// and the owner's legal details before launch (docs/redesign/DECISIONS.md → still open, items 2
// and 3): the Meta Pixel and Umami recorder.js in layout.tsx contradict "no ad trackers" and
// "cookie-free analytics" below. The `.todo` highlights mark what the owner must fill in.
import type { Metadata } from "next";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";
import { EMAIL } from "@/lib/site";
import { JsonLd } from "@/components/layout/JsonLd";
import { PageBg } from "@/components/layout/PageBg";
import { Eyebrow } from "@/components/ui/Chip";
import { Icon } from "@/components/ui/Icon";
import type { IconName } from "@/lib/icons";
import { PrivacyToc } from "./PrivacyToc";
import styles from "./privacy.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Privacy",
  description: "Your data, in plain English: what Red Elevators collects, why, who sees it and how to get it deleted.",
  path: "/privacy",
});

const SUMMARY: readonly (readonly [IconName, string, string])[] = [
  ["calendar", "Only what we need", "Booking details and the messages you send us."],
  ["lock", "Never sold", "No data brokers, no ad trackers."],
  ["audit", "Cookie-free analytics", "Anonymous page counts only."],
  ["check", "Yours to delete", "Email us and it’s gone within 30 days."],
];

/** [id, title] of each section of the policy (the table of contents and the h2s). */
const SECTIONS = [
  ["who", "Who we are"],
  ["collect", "What we collect, and why"],
  ["share", "Who else sees it"],
  ["keep", "How long we keep it"],
  ["rights", "Your rights"],
  ["cookies", "Cookies"],
  ["security", "Security"],
  ["changes", "Changes and contact"],
] as const;

const Todo = ({ children }: { children: string }) => <span className="todo">{children}</span>;
const Mail = () => (
  <a href={`mailto:${EMAIL}`}>
    <b>{EMAIL}</b>
  </a>
);

export default function PrivacyPage() {
  return (
    <>
      <PageBg tone="night" />
      <JsonLd data={breadcrumbLd([{ name: "Privacy", path: "/privacy" }])} />
      <main id="main" className={`page ${styles.privacy}`}>
        <section className="wrap pv-hero">
          <div className="rv">
            <Eyebrow>Privacy</Eyebrow>
            <h1 className="d1" style={{ marginTop: 20 }}>
              Your data, in plain English.
            </h1>
            <p className="lead">What we collect, why, who sees it and how to get it deleted. Last updated October 14, 2026.</p>
            <div className="draft">
              <Icon name="alert" />
              <span>Draft for review. This is a plain-English starting point, not legal advice. Have it checked before launch and fill in the highlighted items.</span>
            </div>
          </div>
          <h2 className="sr-only">The short version</h2>
          <div className="tldr">
            {SUMMARY.map(([icon, title, text], i) => (
              <div key={title} className={`rv d${i + 1}x`}>
                <div className="ico-tile">
                  <Icon name={icon} />
                </div>
                <h5>{title}</h5>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="light legal" data-night>
          <div className="wrap lg">
            <PrivacyToc sections={SECTIONS} />
            <article className="body">
              <h2 id="who">Who we are</h2>
              <p>
                <b>Red Elevators</b> builds and runs automation and marketing systems for short-term rental businesses. In this policy, “we” means Red Elevators, <Todo>registered company name and address</Todo>. You can reach us about anything here at <Mail />.
              </p>

              <h2 id="collect">What we collect, and why</h2>
              <table>
                <tbody>
                  <tr>
                    <th>WHEN</th>
                    <th>WHAT</th>
                    <th>WHY</th>
                  </tr>
                  <tr>
                    <td>You book a call</td>
                    <td>Name, email, number of units, your notes, the time you pick</td>
                    <td>To hold the call and prepare for it</td>
                  </tr>
                  <tr>
                    <td>You message us on WhatsApp or by email</td>
                    <td>Your number or address and what you write</td>
                    <td>To reply to you</td>
                  </tr>
                  <tr>
                    <td>You browse the site</td>
                    <td>Anonymous page views (no cookies, no personal data)</td>
                    <td>To see which pages help, using Umami analytics</td>
                  </tr>
                  <tr>
                    <td>You try the assistant demo</td>
                    <td>Nothing. The demo runs in your browser</td>
                    <td>
                      So you can try it safely <Todo>confirm if a live AI is used</Todo>
                    </td>
                  </tr>
                </tbody>
              </table>
              <p style={{ marginTop: 14 }}>We don’t buy data, we don’t run advertising trackers on this site, and we don’t sell or rent your information to anyone.</p>

              <h2 id="share">Who else sees it</h2>
              <p>Only the services that make the above work:</p>
              <ul>
                <li>
                  <b>Cal.com</b> runs our booking calendar.
                </li>
                <li>
                  <b>Google</b> sends the calendar invite and hosts the Meet video call.
                </li>
                <li>
                  <b>WhatsApp (Meta)</b> carries messages if you choose to chat there.
                </li>
                <li>
                  <b>Our email provider</b> <Todo>name it</Todo> stores emails you send us.
                </li>
                <li>
                  <b>Umami</b> counts anonymous page views.
                </li>
              </ul>
              <p>Each of these processes data under its own privacy policy. Some are based outside your country, including the United States.</p>

              <h2 id="keep">How long we keep it</h2>
              <p>
                Booking details and messages are kept for up to <b>24 months</b> after we last spoke, then deleted, unless you become a client, in which case they’re kept for as long as we work together and as the law requires for records. <Todo>confirm retention period</Todo>
              </p>

              <h2 id="rights">Your rights</h2>
              <p>
                Wherever you are, you can ask us to <b>show you</b> what we hold, <b>correct</b> it, or <b>delete</b> it. Email us and we’ll respond within 30 days.
              </p>
              <ul>
                <li>
                  <b>United States (including California, CCPA/CPRA):</b> you have the right to know, delete and correct your personal information, and to opt out of its sale or sharing. We don’t sell or share it for advertising.
                </li>
                <li>
                  <b>United Arab Emirates (PDPL):</b> you can access, correct and erase your data, restrict how it’s used, and object to processing.
                </li>
                <li>
                  <b>EU and UK visitors (GDPR):</b> you also have the right to data portability and to complain to your local data protection authority.
                </li>
              </ul>

              <h2 id="cookies">Cookies</h2>
              <p>This site doesn’t use tracking or advertising cookies. Our analytics are cookie-free. The booking calendar (Cal.com) may set cookies it needs to work while you book.</p>

              <h2 id="security">Security</h2>
              <p>We use reputable providers, keep access to client data limited to the people working on it, and build client systems inside the client’s own accounts so their data stays theirs.</p>

              <h2 id="changes">Changes and contact</h2>
              <p>
                If we change this policy, we’ll update the date at the top. Questions or requests: <Mail />.
              </p>
            </article>
          </div>
        </section>
      </main>
    </>
  );
}
