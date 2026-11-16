#!/usr/bin/env python3
"""Flag claims in a page's visible text that the supplied facts do not support.
Python 3 standard library only. A helper for the truth check, not a judge: it finds
numbers and risky phrases; a person or the ux-ethics role decides what each one is.

Usage:
  python3 claims.py PAGE_TEXT FACTS [--json]

PAGE_TEXT  visible text of the built page (verify.mjs writes it as text.txt)
FACTS      any text file holding the facts the copy may use (the brief or the profile's facts list)

Flags:
  number   a number of 2+ digits, or a digit with a unit (%, years, minutes ...), that does not
           occur in FACTS. Digits in Devanagari, Arabic-Indic, Persian and full-width forms are
           normalised; separators are ignored, so 1,80,000 = 180000 and 4.920 = 4920.
  number cluster  6+ such numbers within a short span (often a sample-data table: check it is labelled)
  phrase   social proof, ratings, urgency or scarcity (deadlines, stock, "people viewing"), guarantees,
           credentials or awards, confirmshaming or fear wording on a decline option ("No thanks, I
           don't want to save", "Accept risk"), and claims about the site itself (cookies, tracking,
           data storage), unless FACTS has them.
  promise  common wordings of service promises and policies (reply times, what to bring, no spam, VAT, ...).
Not caught: numbers written as words ("fifty minutes") and most promises phrased freely, especially in
non-English copy. In the project's smoke test (12 pages) it flagged about half of the 42 unsupported claims
a careful reader found, and the one trap; it also flags supplied services described in new words. Always
read the page too (see references/truth-check.md).
Exit 1 when anything is flagged.
"""
import json
import re
import sys

DIGITS = {}
for zero in (0x0966, 0x0660, 0x06F0, 0xFF10, 0x09E6, 0x0BE6):  # Devanagari, Arabic-Indic, Persian, full-width, Bengali, Tamil
    for i in range(10):
        DIGITS[chr(zero + i)] = str(i)
NUM = re.compile(r"\d(?:[\d.,  ٫٬']*\d)?")
UNIT = re.compile(r"^\s*(%|\+|percent|per ?cent|years?|yrs?|months?|weeks?|days?|hours?|hrs?|minutes?|mins?|seconds?|secs?|stars?|★|⭐|x\b|times|"
                  r"students?|patients?|clients?|customers?|users?|members?|families|wells|people|"
                  r"साल|वर्ष|मिनट|घंटे|दिन|छात्र|"
                  r"jahre?|monate?|tage?|stunden|minuten|kunden|"
                  r"سنوات|سنة|دقائق|دقيقة|ساعة)", re.I)

PHRASES = {
    "social proof / ratings": r"trusted by|rated \d|\d(\.\d)? ?(out of|/) ?5|reviews?\b|testimonials?|happy (customers|clients|patients|students|families)|customers? (love|trust)|★|⭐|"
                              r"toppers?\b|selections?\b|\bAIR \d|success rate|"
                              r"टॉपर|सिलेक्शन|"
                              r"kunden vertrauen|bewertungen|testsieger",
    "urgency / scarcity": r"only \d+ (left|remaining)|selling fast|sells? out|sold out|go(es)? fast|limited (time|stock|seats?|edition)|hurry|last chance|don'?t miss|ends (soon|tonight|today)|before it'?s gone|"
                          r"offer ends|deal ends|ends in \d|expires in|today only|only today|while stocks? lasts?|almost (gone|sold out)|(few|last) (left|remaining|seats?|spots?)|in high demand|selling out|"
                          r"\d+ (people|others|visitors|shoppers) (are )?(viewing|looking|watching)|\d+ (people )?(just )?(bought|booked|purchased|signed up)|"
                          r"सीमित सीट|जल्दी करें|आखिरी मौका|सिर्फ़? आज|केवल आज|ऑफ़?र (जल्द )?खत्म|"
                          r"nur noch|jetzt zugreifen|nur heute|عرض محدود|لفترة محدودة",
    "confirmshaming / fear wording": r"no,? thanks?,? i\b[^.!?\n]{0,40}|\bi (?:don'?t|do not) (?:want|like|need|care)(?: about| to)? (?:save|saving|learn|grow|improve|win|succeed|protect|be (?:safe|healthy|protected|successful)|money|discounts?|deals?|free|better|my (?:free|bonus|discount|gift))\b[^.!?\n]{0,25}|i(?:'ll| will) (?:pay full price|miss out|take (?:the|my) chances|risk it)|"
                                     r"\bi (?:prefer|like) (?:to )?(?:pay|paying)\b|accept (?:the )?risk|stay unprotected|leave (?:me|my \w+) unprotected|"
                                     r"i(?:'m| am) not interested in (?:saving|growing|learning|improving|success)|i(?:'d| would) rather (?:pay|miss|stay)|"
                                     r"nein,? danke,? ich|नहीं,? मुझे [^\n।]{0,30}नहीं चाहिए",
    "guarantee / outcome promise": r"guarantee[ds]?|100 ?% (safe|secure|guaranteed|satisf\w*)|risk[- ]free|painless|pain[- ]free|no risk|assured|"
                                   r"गारंटी|पक्का सिलेक्शन|garantiert|بدون ألم|مضمون",
    "credential / award / ranking": r"award[- ]?winning|\bawards?\b|certified|accredited|approved by|recogni[sz]ed by|\bISO ?\d{3,5}|#1\b|number one|no\. ?1|best in|leading|"
                                    r"सर्वश्रेष्ठ|नंबर 1|zertifiziert|ausgezeichnet|marktführer|الأفضل",
    "service promise / policy": r"\bwe(?:'ll| will)? (?:reply|respond|get back|call you|send|explain|arrange|confirm|text you|email you|check|visit|look at|refund)|"
                                r"you(?:'ll| will) (?:get|receive|hear)|\bno spam|unsubscribe any ?time|one email|no credit card|no obligation|cancel any ?time|free of charge|"
                                r"please bring|what to bring|arrive \d+|(?:is|are) welcome to|you can (?:hold|sit|bring|switch|stop)|video call|"
                                r"plus VAT|excl(?:\.|uding) VAT|keine kreditkarte|zuz\u00fcglich|zzgl\.|ohne risiko|"
                                r"\u0939\u092e (?:\u0906\u092a\u0915\u094b )?(?:\u092c\u0924\u093e\u090f\u0902\u0917\u0947|\u092d\u0947\u091c\u0947\u0902\u0917\u0947|\u0915\u0949\u0932 \u0915\u0930\u0947\u0902\u0917\u0947)|"
                                r"\u0646\u0631\u062f \u0639\u0644\u064a\u0643|\u0646\u0631\u0633\u0644 \u0644\u0643|\u0627\u062d\u0636\u0631 \u0642\u0628\u0644",
    "claim about the site": r"no cookies|(does not|doesn'?t|do not|don'?t) use cookies|no tracking|without tracking|stores? no (data|information)|(does not|doesn'?t) store|"
                            r"only I read|read only by me|keine cookies|kein tracking|لا يحفظ",
}


def normalise_digits(text):
    return "".join(DIGITS.get(c, c) for c in text)


def digits_key(token):
    token = re.sub(r"[.,\u066b]0{1,2}$", "", token)  # 290,00 = 290.00 = 290
    return re.sub(r"\D", "", token)


def context(text, start, end, width=45):
    a, b = max(0, start - width), min(len(text), end + width)
    return ("…" if a else "") + re.sub(r"\s+", " ", text[a:b]).strip() + ("…" if b < len(text) else "")


CLOCK = re.compile(r"^\d{1,2}:\d{2}(:\d{2})?$")
DATE = re.compile(r"^\d{1,4}[./-]\d{1,2}(?:[./-]\d{2,4})?\.?$")


def in_sequence(tokens, i):
    """True when token i is part of a run of 3+ consecutive integers nearby (list markers, bubble grids)."""
    try:
        v = int(tokens[i][0])
    except ValueError:
        return False
    near = {int(t) for t, pos in tokens[max(0, i - 6):i + 7] if t.isdigit() and abs(pos - tokens[i][1]) < 200}
    return (v - 1 in near and v + 1 in near) or (v + 1 in near and v + 2 in near) or (v - 1 in near and v - 2 in near)


def scan(page, facts):
    page_n, facts_n = normalise_digits(page), normalise_digits(facts)
    fact_tokens = [m.group() for m in NUM.finditer(facts_n)]
    fact_numbers = {digits_key(t) for t in fact_tokens}
    fact_parts = {str(int(x)) for t in fact_tokens for x in re.split(r"\D+", t) if x}
    fact_low = facts_n.lower()
    flags, seen = [], set()
    matches = list(NUM.finditer(page_n))
    tokens = [(m.group(), m.start()) for m in matches]
    numbers = []
    for i, m in enumerate(matches):
        tok, key = m.group(), digits_key(m.group())
        if not key or key in fact_numbers:
            continue
        if CLOCK.match(tok) or in_sequence(tokens, i):
            continue
        if DATE.match(tok):
            parts = [str(int(x)) for x in re.split(r"\D+", tok) if x]
            if all(x in fact_parts or ("20" + x.zfill(2)) in fact_parts or int(x) <= 12 for x in parts):
                continue
        if re.search(r"\u00a9\s*$", page_n[max(0, m.start() - 3):m.start()]):  # copyright year
            continue
        if len(key) == 1 and not UNIT.match(page_n[m.end():m.end() + 14]):
            continue
        if any(key in f for f in fact_numbers if len(key) >= 3):  # part of a supplied phone number or price
            continue
        if ("number", key) in seen:
            continue
        seen.add(("number", key))
        numbers.append({"kind": "number", "value": tok, "context": context(page_n, m.start(), m.end()), "pos": m.start()})
    # Collapse dense clusters (sample-data tables, timetables) into one item each.
    i = 0
    while i < len(numbers):
        j = i
        while j + 1 < len(numbers) and numbers[j + 1]["pos"] - numbers[i]["pos"] < 400:
            j += 1
        if j - i + 1 >= 6:
            vals = ", ".join(n["value"] for n in numbers[i:j + 1][:8])
            flags.append({"kind": "number cluster", "value": f"{j - i + 1} numbers", "context": f"{vals}… near: {numbers[i]['context']}"})
            i = j + 1
        else:
            flags.append({k: v for k, v in numbers[i].items() if k != "pos"})
            i += 1
    for label, pattern in PHRASES.items():
        for m in re.finditer(pattern, page_n, re.I):
            phrase = m.group().lower()
            if phrase in fact_low or (label, phrase) in seen:
                continue
            seen.add((label, phrase))
            flags.append({"kind": label, "value": m.group(), "context": context(page_n, m.start(), m.end())})
    return flags


def main(argv):
    args = [a for a in argv if not a.startswith("--")]
    if len(args) != 2:
        print(__doc__.strip(), file=sys.stderr)
        return 2
    page = open(args[0], encoding="utf-8").read()
    facts = open(args[1], encoding="utf-8").read()
    flags = scan(page, facts)
    if "--json" in argv:
        print(json.dumps(flags, ensure_ascii=False, indent=1))
    else:
        for f in flags:
            print(f"[{f['kind']}] {f['value']}  ·  {f['context']}")
        print(f"{len(flags)} item(s) to check against the facts" if flags else "nothing flagged (still read the page for promises and numbers written as words)")
    return 1 if flags else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
