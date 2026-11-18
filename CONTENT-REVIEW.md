# Homepage content match

The user's latest requested content reference is https://thop-site.vercel.app/.
This supersedes the earlier request to omit unconfirmed source entries.

Compared the public homepage HTML and its public application bundles with
`lib/content.ts`. All 84 long-form entries checked matched, including the
programme details, process steps and medical disclaimers. No medical copy
was rewritten.

Updated the rendered homepage to restore the live site's About and Journal
navigation, caption punctuation, HEALTHSPAN label, DISCOVER separator,
MEET THE FOUNDER CTA, fifth FAQ, Ethics Committee footer link and contact
placeholders. Removed the extra team CTA and unmatched supporting labels.

The results-time FAQ still contains `[To be confirmed by BIOVITY]`, and contact
fields still contain `[to be supplied]`, exactly as the live reference does.
These are unresolved source placeholders, not invented timings or contact details.

The existing design, hero content, typography, models and animation system remain.
The six-link navigation uses its existing menu treatment at tablet sizes to fit.
Decorative duplicate titles, carousel chrome and repeated programme summaries from
the older layout are not duplicated solely to reproduce that site's DOM.

Evidence: `artifacts/content-match/audit.json`, `live-copy.txt` and `live.html`.
Browser coverage checks 68 content passages, six header links, five FAQs, the
founder CTA, footer links, mobile navigation and existing interactions.
