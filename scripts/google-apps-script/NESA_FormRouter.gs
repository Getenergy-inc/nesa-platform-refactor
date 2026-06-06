/**
 * NESA-Africa 2026 — Google Pre-Nomination Services
 * Form Router + Customized Email Automation (Types A, A2, B, B2, C, D).
 *
 * Source of truth: docs/google-forms/email-routing-registry.json
 *
 * SECURITY RULES (do NOT violate):
 *  - Never store Gmail passwords here.
 *  - Never log full PII to public sheets beyond the defined notification log columns.
 *  - Never reveal nominator name/email/phone to nominee or school unless the
 *    nominator explicitly granted "share" consent on the form.
 *  - Reply-To on internal review emails MUST be the nominator's email.
 *  - Never imply approval, finalist status, school selection, grant approval, or winner selection.
 *  - Do NOT email nominees / schools when their contact email is missing or invalid.
 *
 * USAGE:
 *  1) Open the Google Sheet linked to the Form.
 *  2) Extensions -> Apps Script -> paste this file.
 *  3) Set FORM_KEY to the matching slug from the registry.
 *  4) Triggers -> Add Trigger -> onFormSubmit (From spreadsheet).
 *  5) Authorize once. No passwords stored.
 */

// ============== CONFIG ==============
const FORM_KEY = 'REPLACE_WITH_SLUG'; // e.g. 'best-csr-for-education-nigeria' or 'rmsa-west-africa'

const ADMIN_FALLBACK_EMAIL          = 'nesa.africa@gmail.com';
const SEND_NOMINATOR_CONFIRMATION   = true;
const SEND_INTERNAL_REVIEW          = true;
const SEND_NOMINEE_AWARENESS        = true; // award forms only, consent + valid email required
const SEND_SCHOOL_AWARENESS         = true; // rmsa forms only,  consent + valid email required
const BCC_ADMIN_COPY                = false;
const LOG_SHEET_NAME                = '_NotificationLog';
const MISSING                       = 'Not provided';

// ============== ROUTING TABLE ==============
const ROUTING = {
  // --- 23 Award Categories ---
  'education-content-social-media-influencers':           { type: 'award', label: 'Education Content Social Media Influencers',                              email: 'socialinfl4edafricanesa2026@gmail.com' },
  'african-footballers-supporting-education':             { type: 'award', label: 'African Footballers Supporting Education',                                email: 'footballers4edafricanesa2026@gmail.com' },
  'african-musicians-supporting-education':               { type: 'award', label: 'African Musicians Supporting Education',                                  email: 'musicians4edafricanesa2026@gmail.com' },
  'africa-education-icon-lifetime-achievement-2006-2026': { type: 'award', label: 'Africa Education Icon Lifetime Achievement Award 2006-2026',              email: 'eduicon2006to2026nesa2026@gmail.com' },
  'africa-education-philanthropy-icon-of-the-decade':     { type: 'award', label: 'Africa Education Philanthropy Icon of the Decade',                        email: 'eduphilanthropynesa2026@gmail.com' },
  'literary-new-curriculum-advocate-icon-of-the-decade':  { type: 'award', label: 'Literary & New Curriculum Advocate Icon of the Decade',                   email: 'literarycurriculumnesa2026@gmail.com' },
  'africa-technical-educator-icon-of-the-decade':         { type: 'award', label: 'Africa Technical Educator Icon of the Decade',                            email: 'technicaleducatornesa2026@gmail.com' },
  'best-csr-for-education-africa-regional':               { type: 'award', label: 'Best CSR for Education - Africa Regional',                                email: 'csreduafricanesa2026@gmail.com' },
  'best-csr-for-education-nigeria':                       { type: 'award', label: 'Best CSR for Education - Nigeria',                                        email: 'csredunigerianesa2026@gmail.com' },
  'best-edutech-innovation-for-education-africa-regional':{ type: 'award', label: 'Best EduTech Innovation for Education - Africa Regional',                 email: 'edtechafricanesa2026@gmail.com' },
  'best-media-organisation-for-education-advocacy-nigeria':{type: 'award', label: 'Best Media Organisation for Education Advocacy - Nigeria',                email: 'mediaadvocacyngnesa2026@gmail.com' },
  'best-ngo-for-education-advancement-nigeria':           { type: 'award', label: 'Best NGO for Education Advancement - Nigeria',                            email: 'ngoadvancementngnesa2026@gmail.com' },
  'best-ngo-for-education-advancement-africa-regional':   { type: 'award', label: 'Best NGO for Education Advancement - Africa Regional',                    email: 'ngoadvanceafricanesa2026@gmail.com' },
  'best-stem-education-programme-africa-regional':        { type: 'award', label: 'Best STEM Education Programme - Africa Regional',                         email: 'stemprogramafricanesa2026@gmail.com' },
  'best-creative-arts-contribution-to-education-nigeria': { type: 'award', label: 'Best Creative Arts Contribution to Education - Nigeria',                  email: 'creativeartsngnesa2026@gmail.com' },
  'best-education-policy-implementation-state-nigeria':   { type: 'award', label: 'Best Education Policy & Implementation State - Nigeria',                  email: 'edupolicystatenesa2026@gmail.com' },
  'best-tertiary-institution-library-nigeria':            { type: 'award', label: 'Best Tertiary Institution Library - Nigeria',                             email: 'tertiarylibraryngnesa2026@gmail.com' },
  'excellence-research-development-education-nigeria':    { type: 'award', label: 'Excellence in Research & Development for Education - Nigeria',            email: 'researchdevngnesa2026@gmail.com' },
  'excellence-christian-education-impact-africa':         { type: 'award', label: 'Excellence in Christian Education Impact - Africa Regional',              email: 'christianeduafricanesa2026@gmail.com' },
  'excellence-islamic-education-impact-africa':           { type: 'award', label: 'Excellence in Islamic Education Impact - Africa Regional',                email: 'islamiceduafricanesa2026@gmail.com' },
  'excellence-political-leadership-education-nigeria':    { type: 'award', label: 'Excellence in Political Leadership for Education - Nigeria',              email: 'politicaledungnesa2026@gmail.com' },
  'excellence-international-partnership-education-africa':{ type: 'award', label: 'Excellence in International Partnership for Education - Africa',          email: 'intlpartnerafricanesa2026@gmail.com' },
  'excellence-diaspora-educational-impact-international': { type: 'award', label: 'Excellence in Diaspora Educational Impact - International',               email: 'diasporaeduimpactnesa2026@gmail.com' },

  // --- 8 RMSA / EduAid-Africa Regional Forms ---
  'rmsa-west-africa':          { type: 'rmsa', label: 'West Africa',          email: 'rmsawafricaeduaidafrica@gmail.com' },
  'rmsa-east-africa':          { type: 'rmsa', label: 'East Africa',          email: 'rmsaeafricaeduaidafrica@gmail.com' },
  'rmsa-central-africa':       { type: 'rmsa', label: 'Central Africa',       email: 'rmsacafricaeduaidafrica@gmail.com' },
  'rmsa-southern-africa':      { type: 'rmsa', label: 'Southern Africa',      email: 'rmsasafricaeduaidafrica@gmail.com' },
  'rmsa-north-africa':         { type: 'rmsa', label: 'North Africa',         email: 'rmsanafricaeduaidafrica@gmail.com' },
  'rmsa-sahel-africa':         { type: 'rmsa', label: 'Sahel Africa',         email: 'rmsasaheleduaidafrica@gmail.com' },
  'rmsa-horn-of-africa':       { type: 'rmsa', label: 'Horn of Africa',       email: 'rmsahornafricaeduaidafrica@gmail.com' },
  'rmsa-indian-ocean-islands': { type: 'rmsa', label: 'Indian Ocean Islands', email: 'rmsaindianoceaneduaidafrica@gmail.com' },
};

// ============== FIELD HINTS (case-insensitive substring match) ==============
const HINTS = {
  nominatorName:        ['nominator full name', 'your full name', 'full name'],
  nominatorEmail:       ['nominator email', 'your email', 'email address', 'email'],
  nominatorPhone:       ['whatsapp', 'phone'],
  nominatorCountryRes:  ['country of residence'],
  nominatorCountryOrig: ['country of origin'],
  consentShare:         ['consent for nesa-africa to share', 'consent to share contact', 'share my name and contact'],
  consentUpdates:       ['consent to receive nesa-africa updates', 'receive updates'],

  nomineeName:          ['nominee name', 'full name of nominee', 'nominee'],
  nomineeType:          ['nominee type'],
  nomineeEmail:         ['nominee email', 'nominee contact email', 'public contact email'],
  nomineeCountry:       ['nominee country'],
  nomineeRegion:        ['african region', 'region'],
  nomineeOrg:           ['organization', 'platform'],
  nomineeWebsite:       ['website', 'social link', 'social media'],
  nomineeContactRoute:  ['best contact', 'verification route', 'nominee contact'],

  awardGroup:           ['award group'],
  awardCategory:        ['award category'],
  awardSubcategory:     ['award subcategory', 'subcategory'],

  impactSummary:        ['education impact summary', 'impact summary'],
  beneficiaries:        ['beneficiaries'],
  evidenceLink1:        ['evidence link 1', 'evidence link'],
  evidenceLink2:        ['evidence link 2'],
  reason:               ['reason for nomination', 'reason'],
  knowsNominee:         ['know nominee personally', 'knows nominee'],
  accuracy:             ['accuracy confirmation', 'confirm accuracy'],
  integrity:            ['integrity declaration'],

  // RMSA / school
  schoolName:           ['school name', 'name of school'],
  schoolContactPerson:  ['school contact person', 'contact person'],
  schoolContactEmail:   ['school contact email', 'school email'],
  schoolContactPhone:   ['school contact phone', 'school phone', 'school whatsapp'],
  schoolContactConsent: ['can nesa-africa', 'can eduaid-africa', 'can rmsa contact', 'can team contact school', 'contact the school'],
  schoolCountry:        ['school country', 'country'],
  schoolRegion:         ['region'],
};

// ============== ENTRY POINT ==============
function onFormSubmit(e) {
  const route = ROUTING[FORM_KEY];
  const r = buildResponseMap_(e);
  const ts = new Date();
  const responseId = Utilities.getUuid();

  const nominatorEmail = pick_(r, HINTS.nominatorEmail);
  const isRmsa  = route && route.type === 'rmsa';
  const nomineeEmail = isRmsa ? '' : pick_(r, HINTS.nomineeEmail);
  const schoolEmail  = isRmsa ? pick_(r, HINTS.schoolContactEmail) : '';

  const result = {
    nominatorConfirmation: 'Pending',
    internalReview:        'Pending',
    nomineeAwareness:      'Not Sent',
    schoolAwareness:       'Not Sent',
    error: ''
  };

  if (!route) {
    notifyAdmin_('Routing Missing', 'FORM_KEY="' + FORM_KEY + '" not found in ROUTING table.', r);
    return writeLog_(ts, responseId, 'unknown', FORM_KEY, nominatorEmail, nomineeEmail, schoolEmail,
      ADMIN_FALLBACK_EMAIL, 'Not Sent', 'Failed', 'Not Sent', 'Not Sent', 'FORM_KEY not in ROUTING');
  }

  // 1) Internal review notification (Type B / B2)
  if (SEND_INTERNAL_REVIEW) {
    try {
      const subj = isRmsa
        ? 'New RMSA / EduAid Special Needs School Nomination - ' + route.label + ' - ' + (pick_(r, HINTS.schoolName) || MISSING)
        : 'New NESA-Africa 2026 Pre-Nomination - ' + route.label + ' - ' + (pick_(r, HINTS.nomineeName) || MISSING);
      const body = isRmsa ? buildInternalRmsaBody_(route, r, ts) : buildInternalAwardBody_(route, r, ts);
      const opts = { name: 'NESA-Africa Pre-Nomination Services' };
      if (nominatorEmail) opts.replyTo = nominatorEmail;
      if (BCC_ADMIN_COPY) opts.bcc = ADMIN_FALLBACK_EMAIL;
      GmailApp.sendEmail(route.email, subj, body, opts);
      result.internalReview = 'Sent';
    } catch (err) {
      result.internalReview = 'Failed';
      result.error = appendErr_(result.error, 'internal: ' + err);
      notifyAdmin_('Internal Review Email Failed', String(err), r);
    }
  } else {
    result.internalReview = 'Not Sent';
  }

  // 2) Nominator confirmation (Type A / A2)
  if (SEND_NOMINATOR_CONFIRMATION) {
    if (!isValidEmail_(nominatorEmail)) {
      result.nominatorConfirmation = 'Missing Email';
    } else {
      try {
        const subj = isRmsa
          ? 'Special Needs School Nomination Received - NESA-Africa / EduAid-Africa / RMSA'
          : 'NESA-Africa 2026 Nomination Received - ' + route.label;
        const body = isRmsa ? buildNominatorRmsaBody_(route, r, ts) : buildNominatorAwardBody_(route, r, ts);
        GmailApp.sendEmail(nominatorEmail, subj, body, {
          name: isRmsa
            ? 'NESA-Africa / EduAid-Africa / Rebuild My School Africa Team'
            : 'NESA-Africa 2026 Pre-Nomination Review Team'
        });
        result.nominatorConfirmation = 'Sent';
      } catch (err) {
        result.nominatorConfirmation = 'Failed';
        result.error = appendErr_(result.error, 'nominator: ' + err);
      }
    }
  } else {
    result.nominatorConfirmation = 'Not Sent';
  }

  // 3) Nominee awareness (Type C) — award forms only
  if (!isRmsa && SEND_NOMINEE_AWARENESS) {
    if (!isValidEmail_(nomineeEmail)) {
      result.nomineeAwareness = 'Missing Email';
    } else if (!hasShareConsent_(r)) {
      // Consent gating still allows sending the awareness email, but the email
      // must never reveal nominator identity. We send a redacted version.
      result.nomineeAwareness = sendNomineeAwareness_(nomineeEmail, route, r, false, result);
    } else {
      result.nomineeAwareness = sendNomineeAwareness_(nomineeEmail, route, r, true, result);
    }
  }

  // 4) School awareness (Type D) — RMSA forms only
  if (isRmsa && SEND_SCHOOL_AWARENESS) {
    if (!isValidEmail_(schoolEmail)) {
      result.schoolAwareness = 'Missing Email';
    } else if (!hasSchoolContactConsent_(r)) {
      result.schoolAwareness = 'Consent Not Given';
    } else {
      try {
        GmailApp.sendEmail(schoolEmail,
          'Your School Has Been Recommended for EduAid-Africa / Rebuild My School Africa Review',
          buildSchoolAwarenessBody_(route, r),
          { name: 'NESA-Africa / EduAid-Africa / Rebuild My School Africa Team' });
        result.schoolAwareness = 'Sent';
      } catch (err) {
        result.schoolAwareness = 'Failed';
        result.error = appendErr_(result.error, 'school: ' + err);
      }
    }
  }

  writeLog_(ts, responseId, route.type, route.label,
    nominatorEmail, nomineeEmail, schoolEmail, route.email,
    result.nominatorConfirmation, result.internalReview,
    result.nomineeAwareness, result.schoolAwareness, result.error);
}

// ============== EMAIL BODIES ==============
function buildNominatorAwardBody_(route, r, ts) {
  return [
    'Dear ' + (pick_(r, HINTS.nominatorName) || 'Nominator') + ',',
    '',
    'Thank you for submitting a nomination recommendation for NESA-Africa 2026 — The New Education Standard Award Africa.',
    '',
    'We have received your nomination under:',
    '',
    'Award Group: '       + (pick_(r, HINTS.awardGroup)       || MISSING),
    'Award Category: '    + route.label,
    'Award Subcategory: ' + (pick_(r, HINTS.awardSubcategory) || MISSING),
    'Nominee Name: '      + (pick_(r, HINTS.nomineeName)      || MISSING),
    'Submission Date: '   + ts,
    '',
    'Your submission will now enter the NESA-Africa pre-nomination review process. The review process may include:',
    '  - completeness check',
    '  - category-fit review',
    '  - evidence review',
    '  - duplicate check',
    '  - nominee verification',
    '  - public profile review',
    '  - governance and integrity review',
    '  - preparation for website database synchronization where approved',
    '',
    'Please note: this submission does not automatically make the nominee an approved nominee, finalist, honouree, or winner.',
    '',
    'Sponsorship, donation, ticket purchase, merchandise purchase, endorsement, media visibility, public voting, or AGC Voting Coin participation does not influence nominee approval, finalist selection, judging, honouree selection, or award winner selection.',
    '',
    'If additional information is required, the NESA-Africa review team may contact you.',
    '',
    'Thank you for helping us identify education changemakers across Africa, the diaspora, and friends of Africa.',
    '',
    'Warm regards,',
    'NESA-Africa 2026 Pre-Nomination Review Team',
    'The African Blue-Garnet Awards for Education'
  ].join('\n');
}

function buildNominatorRmsaBody_(route, r, ts) {
  return [
    'Dear ' + (pick_(r, HINTS.nominatorName) || 'Nominator') + ',',
    '',
    'Thank you for submitting a special needs school nomination for the NESA-Africa 2026/2027 EduAid-Africa Special Needs School Intervention powered through Rebuild My School Africa.',
    '',
    'We have received your submission for:',
    '',
    'School Name: '     + (pick_(r, HINTS.schoolName)    || MISSING),
    'Region: '          + route.label,
    'Country: '         + (pick_(r, HINTS.schoolCountry) || MISSING),
    'Submission Date: ' + ts,
    '',
    'Your submission may support:',
    '  - regional school identification',
    '  - EduAid-Africa Special Needs Schools Grant Services review',
    '  - evidence verification',
    '  - special needs education mapping',
    '  - school intervention planning',
    '  - donor / CSR support mapping',
    '  - EduAid-Africa EduTourism 2027 commissioning planning',
    '  - Rebuild My School Africa impact reporting',
    '',
    'Please note: this submission does not guarantee school selection, grant approval, intervention approval, regional winner status, or funding allocation.',
    '',
    'All nominated schools must pass eligibility review, evidence review, regional verification, governance review, and intervention planning.',
    '',
    'Donation interest, EduTourism interest, sponsorship, endorsement, public voting, or media visibility does not guarantee school selection.',
    '',
    'If additional information is required, the NESA-Africa / EduAid-Africa / RMSA review team may contact you.',
    '',
    'Thank you for supporting special needs education intervention across Africa.',
    '',
    'Warm regards,',
    'NESA-Africa / EduAid-Africa / Rebuild My School Africa Team'
  ].join('\n');
}

function buildInternalAwardBody_(route, r, ts) {
  return [
    'New NESA-Africa 2026 pre-nomination submission received.',
    '',
    '=== Award Information ===',
    'Award Group: '       + (pick_(r, HINTS.awardGroup)       || MISSING),
    'Award Category: '    + route.label,
    'Award Subcategory: ' + (pick_(r, HINTS.awardSubcategory) || MISSING),
    'Category Slug: '     + FORM_KEY,
    'Submission Date: '   + ts,
    'Source Form: '       + getFormTitle_(),
    'Response Sheet: '    + getSheetTitle_(),
    '',
    '=== Nominator Details ===',
    'Full Name: '             + (pick_(r, HINTS.nominatorName)        || MISSING),
    'Email: '                 + (pick_(r, HINTS.nominatorEmail)       || MISSING),
    'Phone / WhatsApp: '      + (pick_(r, HINTS.nominatorPhone)       || MISSING),
    'Country of Residence: '  + (pick_(r, HINTS.nominatorCountryRes)  || MISSING),
    'Country of Origin: '     + (pick_(r, HINTS.nominatorCountryOrig) || MISSING),
    'Consent to Share Contact: ' + (pick_(r, HINTS.consentShare)      || MISSING),
    '',
    '=== Nominee Details ===',
    'Nominee Name: '          + (pick_(r, HINTS.nomineeName)          || MISSING),
    'Nominee Type: '          + (pick_(r, HINTS.nomineeType)          || MISSING),
    'Nominee Country: '       + (pick_(r, HINTS.nomineeCountry)       || MISSING),
    'African Region: '        + (pick_(r, HINTS.nomineeRegion)        || MISSING),
    'Organization / Platform: ' + (pick_(r, HINTS.nomineeOrg)         || MISSING),
    'Website / Social Link: ' + (pick_(r, HINTS.nomineeWebsite)       || MISSING),
    'Nominee Contact / Verification Route: ' + (pick_(r, HINTS.nomineeContactRoute) || MISSING),
    'Nominee Email (if any): ' + (pick_(r, HINTS.nomineeEmail)        || MISSING),
    '',
    '=== Education Impact Evidence ===',
    'Impact Summary: '   + (pick_(r, HINTS.impactSummary) || MISSING),
    'Beneficiaries: '    + (pick_(r, HINTS.beneficiaries) || MISSING),
    'Evidence Link 1: '  + (pick_(r, HINTS.evidenceLink1) || MISSING),
    'Evidence Link 2: '  + (pick_(r, HINTS.evidenceLink2) || MISSING),
    'Reason for Nomination: ' + (pick_(r, HINTS.reason)   || MISSING),
    'Does Nominator Know Nominee Personally?: ' + (pick_(r, HINTS.knowsNominee) || MISSING),
    'Accuracy Confirmation: ' + (pick_(r, HINTS.accuracy) || MISSING),
    '',
    '=== Declaration ===',
    'Integrity Declaration Accepted: ' + (pick_(r, HINTS.integrity) || MISSING),
    '',
    '=== Review Action Required ===',
    'Please review this nomination for:',
    '  - completeness',
    '  - category fit',
    '  - evidence quality',
    '  - duplicate status',
    '  - verification readiness',
    '  - website sync readiness',
    '',
    'Reply-To is set to the nominator email above.'
  ].join('\n');
}

function buildInternalRmsaBody_(route, r, ts) {
  return [
    'New special needs school nomination received.',
    '',
    '=== Regional Information ===',
    'Region: '          + route.label,
    'Country: '         + (pick_(r, HINTS.schoolCountry) || MISSING),
    'Submission Date: ' + ts,
    'Source Form: '     + getFormTitle_(),
    'Response Sheet: '  + getSheetTitle_(),
    '',
    '=== Submitter Details ===',
    'Full Name: '            + (pick_(r, HINTS.nominatorName)        || MISSING),
    'Email: '                + (pick_(r, HINTS.nominatorEmail)       || MISSING),
    'Phone / WhatsApp: '     + (pick_(r, HINTS.nominatorPhone)       || MISSING),
    'Country of Residence: ' + (pick_(r, HINTS.nominatorCountryRes)  || MISSING),
    'Country of Origin: '    + (pick_(r, HINTS.nominatorCountryOrig) || MISSING),
    'Consent to Share Contact: ' + (pick_(r, HINTS.consentShare)     || MISSING),
    '',
    '=== School Identity ===',
    'School Name: '          + (pick_(r, HINTS.schoolName)          || MISSING),
    'School Contact Person: '+ (pick_(r, HINTS.schoolContactPerson) || MISSING),
    'School Contact Email: ' + (pick_(r, HINTS.schoolContactEmail)  || MISSING),
    'School Contact Phone: ' + (pick_(r, HINTS.schoolContactPhone)  || MISSING),
    'Can Team Contact School?: ' + (pick_(r, HINTS.schoolContactConsent) || MISSING),
    '',
    '=== Full Submission Data ===',
    formatAll_(r),
    '',
    '=== Review Action Required ===',
    'Please review this submission for:',
    '  - regional eligibility',
    '  - evidence quality',
    '  - school verification readiness',
    '  - grant service classification',
    '  - duplicate status',
    '  - EduTourism follow-up',
    '  - donation / pledge follow-up',
    '  - intervention planning readiness',
    '',
    'Reply-To is set to the submitter email above.'
  ].join('\n');
}

function sendNomineeAwareness_(toEmail, route, r, withNominatorIdentity, result) {
  try {
    const body = buildNomineeAwarenessBody_(route, r, withNominatorIdentity);
    GmailApp.sendEmail(toEmail,
      'You Have Been Recommended for NESA-Africa 2026 Review',
      body,
      { name: 'NESA-Africa 2026 Pre-Nomination Review Team' });
    return 'Sent';
  } catch (err) {
    result.error = appendErr_(result.error, 'nominee: ' + err);
    return 'Failed';
  }
}

function buildNomineeAwarenessBody_(route, r, withNominatorIdentity) {
  const recommender = withNominatorIdentity
    ? 'You were recommended by ' + (pick_(r, HINTS.nominatorName) || 'a NESA-Africa supporter') + '.'
    : 'You were recommended by a member of the public / NESA-Africa supporter.';
  return [
    'Dear ' + (pick_(r, HINTS.nomineeName) || 'Recipient') + ',',
    '',
    'You have been recommended for review under NESA-Africa 2026 — The New Education Standard Award Africa.',
    '',
    'Award Category: '    + route.label,
    'Award Subcategory: ' + (pick_(r, HINTS.awardSubcategory) || MISSING),
    'Award Group: '       + (pick_(r, HINTS.awardGroup)       || MISSING),
    '',
    recommender,
    '',
    'NESA-Africa recognizes education changemakers, institutions, creators, advocates, CSR contributors, public figures, and organizations advancing education across Africa, the diaspora, and friends of Africa.',
    '',
    'This message is to notify you that your name or organization has been submitted for preliminary review.',
    '',
    'Please note: this recommendation does not mean you have been approved as an official nominee, finalist, honouree, or winner.',
    '',
    'All submissions must pass eligibility review, category-fit review, evidence review, verification, governance review, and NESA-Africa integrity approval.',
    '',
    'Sponsorship, donation, ticket purchase, merchandise purchase, endorsement, media visibility, public voting, or AGC Voting Coin participation does not influence selection.',
    '',
    'If you wish to support the verification process, please reply with:',
    '  - correct official name',
    '  - preferred public profile',
    '  - website or social media links',
    '  - evidence of education impact',
    '  - contact person',
    '  - country and region',
    '  - short impact summary',
    '',
    'Thank you for your contribution to education advancement.',
    '',
    'Warm regards,',
    'NESA-Africa 2026 Pre-Nomination Review Team',
    'The African Blue-Garnet Awards for Education'
  ].join('\n');
}

function buildSchoolAwarenessBody_(route, r) {
  return [
    'Dear ' + (pick_(r, HINTS.schoolContactPerson) || 'School Administrator') + ',',
    '',
    'Your school has been recommended for preliminary review under the NESA-Africa 2026/2027 EduAid-Africa Special Needs School Intervention powered through Rebuild My School Africa.',
    '',
    'School Name: ' + (pick_(r, HINTS.schoolName)    || MISSING),
    'Region: '      + route.label,
    'Country: '     + (pick_(r, HINTS.schoolCountry) || MISSING),
    '',
    'This program supports the identification and review of special needs schools that may require education intervention, accessibility support, assistive technology, learning materials, renovation support, teacher development, or related school support services.',
    '',
    'Please note: this recommendation does not mean your school has been selected, approved for grant support, approved for intervention, or confirmed as a regional beneficiary.',
    '',
    'All school submissions must pass eligibility review, evidence review, regional verification, governance review, and intervention planning.',
    '',
    'Donation interest, EduTourism interest, sponsorship, endorsement, public voting, or media visibility does not guarantee school selection.',
    '',
    'If your school wishes to support the verification process, please reply with:',
    '  - official school name',
    '  - school address',
    '  - school contact person',
    '  - number of learners',
    '  - special needs categories served',
    '  - current urgent needs',
    '  - photos, videos, website, or public evidence links',
    '  - legal / board / PTA / management structure, if available',
    '  - confirmation that the team may contact the school',
    '',
    'Thank you for your commitment to special needs education.',
    '',
    'Warm regards,',
    'NESA-Africa / EduAid-Africa / Rebuild My School Africa Team'
  ].join('\n');
}

// ============== UTILITIES ==============
function buildResponseMap_(e) {
  const m = {};
  if (!e || !e.namedValues) return m;
  Object.keys(e.namedValues).forEach(function (k) {
    const v = e.namedValues[k];
    m[k] = Array.isArray(v) ? v.join(', ') : String(v || '');
  });
  return m;
}

function pick_(map, hints) {
  const keys = Object.keys(map);
  for (var i = 0; i < hints.length; i++) {
    const h = hints[i].toLowerCase();
    for (var j = 0; j < keys.length; j++) {
      if (keys[j].toLowerCase().indexOf(h) !== -1 && map[keys[j]]) return map[keys[j]];
    }
  }
  return '';
}

function isValidEmail_(s) {
  return !!s && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s).trim());
}

function hasShareConsent_(r) {
  const v = (pick_(r, HINTS.consentShare) || '').toLowerCase();
  if (!v) return false;
  if (v.indexOf('no') === 0 || v.indexOf('please keep') !== -1) return false;
  if (v.indexOf('contact me first') !== -1) return false;
  return v.indexOf('yes') !== -1 || v.indexOf('may share') !== -1;
}

function hasSchoolContactConsent_(r) {
  const v = (pick_(r, HINTS.schoolContactConsent) || '').toLowerCase();
  return v.indexOf('yes') !== -1;
}

function formatAll_(map) {
  return Object.keys(map).map(function (k) { return k + ': ' + map[k]; }).join('\n');
}

function appendErr_(existing, msg) {
  return existing ? (existing + ' | ' + msg) : msg;
}

function getFormTitle_() {
  try {
    const url = SpreadsheetApp.getActiveSpreadsheet().getFormUrl();
    if (!url) return MISSING;
    return FormApp.openByUrl(url).getTitle();
  } catch (_) { return MISSING; }
}

function getSheetTitle_() {
  try { return SpreadsheetApp.getActiveSpreadsheet().getName(); } catch (_) { return MISSING; }
}

function notifyAdmin_(reason, detail, r) {
  try {
    GmailApp.sendEmail(ADMIN_FALLBACK_EMAIL,
      '[NESA Router Alert] ' + reason + ' - ' + FORM_KEY,
      reason + '\n\n' + detail + '\n\nForm Key: ' + FORM_KEY +
      '\n\nResponse Snapshot:\n' + formatAll_(r || {}));
  } catch (_) { /* swallow */ }
}

function writeLog_(ts, id, formType, categoryOrRegion,
                   nominatorEmail, nomineeEmail, schoolEmail, recipient,
                   confStatus, internalStatus, nomineeStatus, schoolStatus, error) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(LOG_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(LOG_SHEET_NAME);
    sheet.appendRow([
      'timestamp','response_id','form_type','category_or_region',
      'nominator_email','nominee_email','school_email','recipient_review_email',
      'nominator_confirmation_status','internal_review_notification_status',
      'nominee_awareness_status','school_awareness_status',
      'error_message','sent_at'
    ]);
  }
  sheet.appendRow([
    ts, id, formType, categoryOrRegion,
    nominatorEmail || '', nomineeEmail || '', schoolEmail || '', recipient || '',
    confStatus, internalStatus, nomineeStatus, schoolStatus,
    error || '', new Date()
  ]);
}
