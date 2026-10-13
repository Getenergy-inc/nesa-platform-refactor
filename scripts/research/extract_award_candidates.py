"""Extract fixed-width PDF text into a private provenance manifest; never publish it.
Usage: python3 scripts/research/extract_award_candidates.py SOURCE_DIR OUTPUT_JSON
"""
import collections
import hashlib
import json
import re
import sys
import unicodedata
from pathlib import Path


def normalize_name(name):
    return re.sub(r"[^\w]+", " ", unicodedata.normalize("NFKC", name).casefold()).strip()


def identifiable(name):
    if len(name) < 3 or "■" in name:
        return False
    if re.match(r"^(?:WA|EA|CA|NA|SA|IO|Horn|Sahel|Gulf African diaspora)\s", name) and not name.startswith("Sahel Academy"):
        return False
    if re.match(r"^(?:Local |Diaspora |Women digital |Girls digital |Global (?:tech CSR|humanitarian EdTech|offline-first)|International (?:donor|results-based)|African diaspora |African Muslim student |Regional (?:Arabic|education)|Islamic school fee |Private/NGO TVET|Bilateral TVET)", name):
        return False
    if name in {"Ahmed", "Amadou", "Amanda", "Ashraf", "Charlotte", "Daphne", "Denise", "Dieumerci", "Erin", "Wayua"}:
        return False
    if re.search(r"^(?:CA|EA|NA|SA|WA|IO)\s+(?:LMS|Qur.anic|assessment|madrasa|mobile|offline|robotics|university|virtual|zakat|FMCG)|philanthropy\s+(?:CA|EA|Horn|Islands|NA|SA|Sahel|WA|Regional)|^(?:Bilateral emergency|Regional education|Islamic education support|Local icon|Publishing digital|Telecom established|Banking|Banks Education|Corporate CSR|Established NGO digital|International NGO|Skills philanthropy|TVET philanthropy|Literacy philanthropy|EiE philanthropy|Girls. education philanthropy|Faith-linked|University-linked|Diaspora philanthropy|African-led education philanthropy|Emergency education philanthropy)", name, re.I):
        return False
    generic = r"\b(other|unnamed|selected|regional pool|master list|type|providers|partners|startups|initiatives|networks|schools|programmes|programs|foundations|scholarships|mentorship|outreach|clubs)\b"
    # Recognisable proper names are retained even when their programme title contains a generic word.
    named = r"\b(UNICEF|UNESCO|GPE|ECW|UNHCR|World Bank|AfDB|Mastercard|Microsoft|Google|Cisco|Huawei|Vodacom|Orange|Airtel|MTN|Shell|TotalEnergies|Dangote|Oando|Lafarge|CAMFED|COOPI|ACSI|Edify|Edulution|uLesson|Afrilearn|Eneza|M-Shule|Ubongo|Siyavula|STEMpower|STEMi|Dext|DEXT|Prime STEM|UNISA|UNDP|UNRWA|USAID|JICA|KOICA|GIZ|Plan International|Save the Children|Street Child|Room to Read|World Vision|Catholic|Baptist|Adventist|Islamic Development Bank|IsDB|Al-Azhar|LEGO|Kolibri|Learning Equality|Tech4Dev|TechnoServe|VVOB|CODE|GirlHype|GirlCode|SheCodes|AkiraChix|FIRST Global|Teach For|Teach4|SOS|Right To Play|FAWE|Vodafone)\b"
    if re.search(r"\b(other|unnamed|selected|regional pool|master list|type|where documented)\b", name, re.I):
        return False
    if re.search(r"^(?:Global foundation|International foundation|Foundation[- ](?:linked|partners|school)|NGO.EdTech|Diaspora (?:community|university)|Bilateral girls)|\b(?:NGO partners|implementing partners|related STEM NGOs|foundation partners|foundation.*interface)\b", name, re.I):
        return False
    if re.search(generic, name, re.I) and not re.search(named, name, re.I):
        # A named institution/programme is not a plural regional placeholder.
        if not re.search(r"\b(University|College|Seminary|Academy|Institute|Foundation|School|Centre|Center|Association|Mission|System|Council)\b", name):
            return False
    if re.match(r"^(?:WA|EA|CA|NA|IO|SA|DRC|African|Africa|Regional|Global|Local|Diaspora|Community|Rural|Refugee|Private|Public|National|International|Central Africa|West Africa|East Africa|North Africa|Southern Africa)\s+(?:STEM|girls|coding|digital|education|teacher|Islamic|Christian|school|youth|TVET|skills|learning|scholarship|women)", name, re.I) and not re.search(named, name, re.I):
        return False
    return True


def classification(source, section):
    n = int(section[0]) if section and section[0].isdigit() else 1
    if "CSR" in source:
        return "best-csr-education-africa", "csr-regional"
    if "EduTech" in source:
        return "best-edutech-organisation-africa", ["edutech-startup-innovation", "edutech-established-impact", "edutech-social-impact"][n - 1]
    if "International" in source:
        return "international-bilateral-education", ["international-multilateral-un", "international-development-banks", "international-foundations", "international-emergencies"][n - 1]
    if "NGO_Foundations" in source:
        if n <= 5:
            return "best-ngo-education-africa", ["ngo-basic-primary", "ngo-girl-child", "ngo-refugee-displaced", "ngo-special-inclusive", "ngo-teacher-development"][n - 1]
        # Foundation education advancement isn't silently assigned literary eligibility.
        return "africa-education-icon-award", ["foundation-education-advancement", "icon-philanthropy", "icon-technical"][n - 6]
    if "STEM_Education_Programme" in source:
        return "best-stem-education-africa", ["stem-school-institution", "stem-ngo-nonprofit", "stem-edtech-digital", "stem-girls-initiative"][n - 1]
    if "Christian" in source:
        return "christian-education-impact-africa", "christian-theological-colleges" if section.startswith("PART 2") else "christian-school-systems"
    if "Islamic" in source:
        return "islamic-education-impact-africa", ["islamic-school-networks", "islamic-scholarship-waqf", "islamic-studies-institutions"][n - 1]
    if "Influencers" in source:
        kind = ["social-media", "music", "sports"][n - 1]
        return f"africa-{kind}-influencer-education", kind
    return "best-stem-education-africa", "stem-supporting-lens-" + str(n)


def extract(path):
    records = []
    section, region, bounds, row, page = "", "", None, None, 1

    def flush():
        if row:
            row["name"] = " ".join(row.pop("names")).strip()
            records.append(row.copy())

    for line_number, original in enumerate(path.read_text().split("\n"), 1):
        page += original.count("\f")
        line = original.replace("\f", "")
        text = line.strip()
        if re.match(r"^[1-9]\.\s+[A-Z]|^PART [12]", text):
            flush()
            row, section, bounds = None, text, None
        if re.match(r"^(WEST|EAST|CENTRAL|SOUTHERN|NORTH|HORN|SAHEL|INDIAN|AFRICAN DIASPORA|FRIENDS|CONTINENTAL)", text, re.I) and not re.search(r"\s{4}", text) and len(text) < 110:
            flush()
            row, region, bounds = None, text, None
        if re.match(r"^#\s+(Org|Name|Partnership)", text):
            flush()
            row = None
            start = line.index("#")
            country = re.search(r"Country", line)
            name = re.search(r"Organisation|Organization|Name|Partnership", line)
            if country and name:
                bounds = (start, name.start(), country.start())
            continue
        if not bounds:
            continue
        start, a, b = bounds
        rank = line[start:a].strip()
        if rank.isdigit():
            flush()
            # Column headers occasionally overlap the actual country cells. Derive
            # the name boundary from this row's spacing, not from header width.
            cell = re.match(r"\s*\d+\s{2,}(.+?)\s{2,}", line[start:])
            row_b = start + cell.end(1) if cell else b
            row = {"source_file": path.stem + ".pdf", "source_page": page, "source_row": int(rank), "source_line": line_number, "source_section": section, "source_region": region, "names": [line[a:b].strip()], "raw_text": [text]}
            row["names"] = [line[a:row_b].strip()]
            row["name_boundary"] = row_b
        elif row and not rank and len(line) > a:
            boundary = row.get("name_boundary", b)
            if line[a:boundary].strip():
                row["names"].append(line[a:boundary].strip())
            row["raw_text"].append(text)
    flush()
    return records


def main():
    entries, excluded, duplicates = [], [], []
    keys = set()
    for path in sorted(Path(sys.argv[1]).glob("*.txt")):
        for row in extract(path):
            if not identifiable(row["name"]):
                excluded.append(row)
                continue
            category, pathway = classification(row["source_file"], row["source_section"])
            key = "|".join([category, pathway, normalize_name(row["name"])])
            if key in keys:
                duplicates.append(row)
                continue
            keys.add(key)
            entries.append({**row, "category_slug": category, "pathway_slug": pathway, "dedupe_key": hashlib.sha256(key.encode()).hexdigest(), "nomination_status": "under_review", "publication_status": "unpublished", "nrc_verified": False, "nomination_source": "Research compilation — attached award PDFs", "mapping_status": "requires_nrc_mapping", "evidence_status": "source_claim_unverified"})
    out = Path(sys.argv[2])
    out.write_text(json.dumps(entries, ensure_ascii=False, indent=2))
    out.with_suffix(".excluded.json").write_text(json.dumps(excluded, ensure_ascii=False, indent=2))
    out.with_suffix(".duplicates.json").write_text(json.dumps(duplicates, ensure_ascii=False, indent=2))
    print(json.dumps({"staged_manifest": len(entries), "excluded": len(excluded), "duplicates": len(duplicates), "by_category": dict(collections.Counter(r["category_slug"] for r in entries))}, indent=2))


if __name__ == "__main__":
    main()