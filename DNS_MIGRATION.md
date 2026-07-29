# DNS Migration — Netcore → GoDaddy

Moving DNS management for **jlmorison.com** from Netcore to GoDaddy, and pointing the
website to Vercel. Email (Microsoft 365) must keep working throughout.

**Where these values come from:** every value below was read off the LIVE domain using
`dig` (which queries the DNS records Netcore is currently serving). Nothing here is
invented — it's a copy of what already works today. Verified: 2026-07-27.

---

## The simple version (what to actually do)

1. Log into **GoDaddy → jlmorison.com → DNS → Manage DNS**.
2. Add **every record in Section A** below, exactly as written. (These are your email +
   Microsoft 365 records — copy them character-for-character.)
3. Add/change the **2 records in Section B** below. (These point the website to Vercel.)
4. In Vercel → Settings → Domains, add `jlmorison.com` and `www.jlmorison.com`. If Vercel
   shows different values than Section B, use Vercel's.
5. **Check it worked** (Section D) — while Netcore is still live.
6. Only after the check passes: **GoDaddy → Nameservers → Change → use GoDaddy
   nameservers.** This is the actual switch. (Section E)
7. Wait up to a few hours, then run the final checks (Section F).

> Golden rule: build ALL records in GoDaddy FIRST, switch nameservers LAST.
> Never switch nameservers with an empty GoDaddy zone — email would break.

---

## Section A — Email + Microsoft 365 (COPY EXACTLY, do not change)

| Type  | Name / Host              | Value                                                                                  | Priority |
|-------|--------------------------|----------------------------------------------------------------------------------------|----------|
| MX    | `@`                      | `jlmorison-com.mail.protection.outlook.com`                                            | `0`      |
| TXT   | `@`                      | `v=spf1 include:spf.mandrillapp.com include:netcore.co.in include:spf.protection.outlook.com -all` | —  |
| TXT   | `@`                      | `MS=ms50388942`                                                                        | —        |
| TXT   | `@`                      | `google-site-verification=M6i8T805jD8e0dwvjJ8tS4EnCUKmOjlrD8kz16cPc24`                | —        |
| TXT   | `_dmarc`                 | `v=DMARC1; p=reject;`  ← **EDIT** GoDaddy's auto-added default to this exact value      | —        |
| CNAME | `autodiscover`           | `autodiscover.outlook.com`                                                             | —        |
| CNAME | `selector1._domainkey`   | `selector1-jlmorison-com._domainkey.jlmorisoncom.onmicrosoft.com`                     | —        |
| CNAME | `selector2._domainkey`   | `selector2-jlmorison-com._domainkey.jlmorisoncom.onmicrosoft.com`                     | —        |
| CNAME | `enterpriseregistration` | `enterpriseregistration.windows.net`                                                  | —        |
| CNAME | `enterpriseenrollment`   | `enterpriseenrollment-s.manage.microsoft.com`                                          | —        |
| CNAME | `sip`                    | `sipdir.online.lync.com`                                                               | —        |
| CNAME | `lyncdiscover`           | `webdir.online.lync.com`                                                               | —        |

### SRV records (GoDaddy asks for the parts separately)

| Field    | Record 1                  | Record 2                       |
|----------|---------------------------|--------------------------------|
| Service  | `_sip`                    | `_sipfederationtls`            |
| Protocol | `_tls`                    | `_tcp`                         |
| Name     | `@`                       | `@`                            |
| Priority | `100`                     | `100`                          |
| Weight   | `1`                       | `1`                            |
| Port     | `443`                     | `5061`                         |
| Target   | `sipdir.online.lync.com`  | `sipfed.online.lync.com`       |

Notes:
- The three `@` TXT records can all coexist — that's normal. Just make sure there is only
  ONE line starting with `v=spf1`.
- `sip`, `lyncdiscover`, `enterprise*`, and the SRV records are Microsoft Teams / Skype /
  device-enrollment records. Harmless to keep; recreate them so nothing silently breaks.
- **`enterpriseenrollment`** uses the newer `-s` (secure) value per Microsoft's admin panel.
  The old live value (without `-s`) also worked; we use Microsoft's current one.
- **SPF (the `v=spf1` line):** use the LONG version above, NOT the short
  `v=spf1 include:spf.protection.outlook.com -all` that Microsoft's panel shows. Microsoft
  only knows about itself; your real SPF also authorises Mandrill + Netcore as senders.
  Using the short version would make mail from those fail. (Trim later, separately — see C.)
- Microsoft's admin panel shows only its bare-minimum records. DKIM, DMARC, the `MS=` /
  Google verification TXTs, and the Teams/SIP records above are ALSO live and required —
  keep them all even though Microsoft's basic list omits them.

---

## Section B — Website (CHANGE these to point at Vercel)

The site currently points to an old host (`34.93.43.108`). These two records move it to Vercel.

| Type  | Name / Host | Value (use what VERCEL shows you)              |
|-------|-------------|-----------------------------------------------|
| A     | `@`         | `216.198.79.1` (Vercel's current apex IP)      |
| CNAME | `www`       | `<your-id>.vercel-dns-017.com` (Vercel gives a unique target) |

Status: ✅ DONE — already added in GoDaddy (A `@` = 216.198.79.1, www CNAME set).
Note: Vercel updated its apex IP from the old `76.76.21.21` to `216.198.79.1`, and now
hands out a unique per-project `www` CNAME. Always trust what Vercel's dashboard shows.

---

## Section C — Later cleanup (NOT during migration)

**SPF trim (do NOT do during migration):** Once everything is confirmed working and you're
sure nothing sends email via Netcore/Mandrill anymore, the root SPF can be trimmed to drop
`include:netcore.co.in` and `include:spf.mandrillapp.com`. Confirm they're truly unused first
(they authorise other mail senders — removing a live one sends that mail to spam). Do it as a
separate, single change — never during the move.

**Resend — DNS is DONE, env vars are the remaining task.** The Resend records were added on
the **`forms.jlmorison.com`** subdomain (not `send.jlmorison.com` as an earlier draft said):
- MX `send.forms` → `feedback-smtp.ap-northeast-1.amazonses.com` (priority 10) ✅ added
- TXT `send.forms` → `v=spf1 include:amazonses.com ~all` ✅ added
- TXT `resend._domainkey.forms` → `p=MIGf…` (DKIM) ✅ added

Because the verified Resend domain is `forms.jlmorison.com`, the form **from-addresses must be
on that subdomain**. The code defaults to root `@jlmorison.com`, which Resend has NOT verified,
so set these env vars in `.env.local` AND Vercel:
```
CONTACT_FROM_EMAIL=website@forms.jlmorison.com
RESEND_FROM_EMAIL=careers@forms.jlmorison.com
RESEND_API_KEY=<from Resend dashboard>   # still needs to be set
```
Recipients (Sanity "Send enquiries to") and reply-to stay on `@jlmorison.com` — they don't need
verification. After nameservers cut over, confirm Resend dashboard → Domains shows
`forms.jlmorison.com` as **Verified**.

---

## Section D — Verify BEFORE switching nameservers

GoDaddy's nameservers hold your new records even before you delegate to them. Query them
directly (replace `nsXX.domaincontrol.com` with the two nameservers GoDaddy shows you):

```
dig @ns__.domaincontrol.com jlmorison.com MX +short     # expect outlook
dig @ns__.domaincontrol.com jlmorison.com A +short      # expect 76.76.21.21
dig @ns__.domaincontrol.com jlmorison.com TXT +short    # expect the SPF + MS + google lines
```

Only continue if these match.

---

## Section E — The switch

GoDaddy → jlmorison.com → **Nameservers → Change** → choose "GoDaddy nameservers" (default),
remove `ns1.netcore.co.in` / `ns2.netcore.co.in`. Save.
Propagation: minutes to a few hours (up to 48h worst case). Email keeps flowing because the
MX value never changed.

---

## Section F — Final checks (within 24h after the switch)

```
dig jlmorison.com NS +short      # should now show domaincontrol.com (not netcore)
dig jlmorison.com MX +short      # still outlook
dig jlmorison.com A +short       # 76.76.21.21
```

Then:
- Send a test email in and out of a `@jlmorison.com` mailbox.
- Open https://jlmorison.com and https://www.jlmorison.com — both should load over HTTPS.
- Microsoft 365 Admin → Settings → Domains → jlmorison.com should show "Healthy".
</content>
</invoke>
