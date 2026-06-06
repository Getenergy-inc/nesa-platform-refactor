/**
 * NESA-Africa 2026 — Google Pre-Nomination Services
 * Form Router: onFormSubmit -> route email notification to correct recipient.
 *
 * SECURITY RULES (do NOT violate):
 *  - Never store Gmail passwords here.
 *  - Never log full PII to public sheets.
 *  - Reply-To MUST be the nominator's email (so reviewers can reply directly).
 *  - From address is the authorized Apps Script account; we cannot spoof nominator.
 *
 * USAGE:
 *  1) Open the Google Sheet linked to the Form.
 *  2) Extensions -> Apps Script -> paste this file.
 *  3) Set the FORM_KEY constant below to the matching key in ROUTING (slug).
 *  4) Triggers -> Add Trigger -> onFormSubmit (from spreadsheet).
 *  5) Authorize once. No passwords stored.
 *
 * Source of truth for recipients: docs/google-forms/email-routing-registry.json
 */

// ============== CONFIG ==============
// Set this to the slug from email-routing-registry.json for THIS form/sheet.
// Example award: 'best-csr-for-education-nigeria'
// Example RMSA:  'rmsa-west-africa'
const FORM_KEY = 'REPLACE_WITH_SLUG';

const ADMIN_FALLBACK_EMAIL = 'nesa.africa@gmail.com';
const SEND_NOMINATOR_CONFIRMATION = true;
const LOG_SHEET_NAME = '_NotificationLog';

// ============== ROUTING TABLE (mirror of registry JSON) ==============
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

// Field-name hints to detect nominator email / nominee / school in the response.
// Match is case-insensitive substring. Order = priority.
const EMAIL_FIELD_HINTS = ['email address', 'your email', 'nominator email', 'email'];
const NOMINEE_FIELD_HINTS = ['nominee name', 'nominee', 'full name of nominee'];
const SCHOOL_FIELD_HINTS = ['school name', 'name of school', 'school'];
const REGION_FIELD_HINTS = ['region'];

// ============== ENTRY POINT ==============
function onFormSubmit(e) {
  const route = ROUTING[FORM_KEY];
  const responses = buildResponseMap_(e);
  const timestamp = new Date();
  const responseId = Utilities.getUuid();

  const nominatorEmail = pickByHints_(responses, EMAIL_FIELD_HINTS);
  if (!route) {
    notifyAdmin_('Routing Missing', 'FORM_KEY="' + FORM_KEY + '" not found in ROUTING table.', responses);
    log_(timestamp, responseId, 'unknown', FORM_KEY, nominatorEmail, ADMIN_FALLBACK_EMAIL, '(routing missing)', 'Recipient Missing', 'FORM_KEY not in ROUTING');
    return;
  }
  if (!nominatorEmail) {
    notifyAdmin_('Nominator Email Missing', 'No email field detected on submission.', responses);
    log_(timestamp, responseId, route.type, route.label, '', route.email, '(no nominator email)', 'Nominator Email Missing', 'Email field not detected');
    return;
  }

  const isRmsa = route.type === 'rmsa';
  const nomineeOrSchool = isRmsa
    ? pickByHints_(responses, SCHOOL_FIELD_HINTS) || '(school name missing)'
    : pickByHints_(responses, NOMINEE_FIELD_HINTS) || '(nominee name missing)';

  const subject = isRmsa
    ? 'NESA 2026/2027 RMSA School Nomination - ' + route.label + ' - ' + nomineeOrSchool
    : 'NESA 2026 Pre-Nomination Submission - ' + route.label + ' - ' + nomineeOrSchool;

  const body = isRmsa
    ? buildRmsaBody_(route, responses, timestamp)
    : buildAwardBody_(route, responses, timestamp);

  try {
    GmailApp.sendEmail(route.email, subject, body, {
      replyTo: nominatorEmail,
      name: 'NESA-Africa Pre-Nomination Services',
    });
    log_(timestamp, responseId, route.type, route.label, nominatorEmail, route.email, subject, 'Sent', '');
  } catch (err) {
    log_(timestamp, responseId, route.type, route.label, nominatorEmail, route.email, subject, 'Failed', String(err));
    notifyAdmin_('Notification Failed', String(err), responses);
    return;
  }

  if (SEND_NOMINATOR_CONFIRMATION) {
    try {
      GmailApp.sendEmail(nominatorEmail,
        'Thank you for your NESA-Africa nomination submission',
        buildConfirmationBody_(responses),
        { name: 'NESA-Africa Team' });
    } catch (err) {
      // confirmation failure is non-fatal
      log_(timestamp, responseId, route.type, route.label, nominatorEmail, nominatorEmail,
        '(confirmation)', 'Retry Required', 'Confirmation failed: ' + err);
    }
  }
}

// ============== HELPERS ==============
function buildResponseMap_(e) {
  const map = {};
  if (!e || !e.namedValues) return map;
  Object.keys(e.namedValues).forEach(function (k) {
    const v = e.namedValues[k];
    map[k] = Array.isArray(v) ? v.join(', ') : String(v || '');
  });
  return map;
}

function pickByHints_(map, hints) {
  const keys = Object.keys(map);
  for (var i = 0; i < hints.length; i++) {
    const hint = hints[i].toLowerCase();
    for (var j = 0; j < keys.length; j++) {
      if (keys[j].toLowerCase().indexOf(hint) !== -1 && map[keys[j]]) return map[keys[j]];
    }
  }
  return '';
}

function buildAwardBody_(route, r, ts) {
  return [
    'NESA-Africa 2026 Pre-Nomination Submission',
    '',
    '=== Award Information ===',
    'Award Category: ' + route.label,
    'Category Slug: ' + FORM_KEY,
    'Submission Date: ' + ts,
    '',
    '=== Submitted Data ===',
    formatAll_(r),
    '',
    'Please review for completeness, evidence quality, duplicate status, category fit, and database synchronization readiness.',
  ].join('\n');
}

function buildRmsaBody_(route, r, ts) {
  return [
    'NESA-Africa 2026/2027 RMSA / EduAid-Africa School Nomination',
    '',
    '=== Regional Information ===',
    'Region: ' + route.label,
    'Region Slug: ' + FORM_KEY,
    'Submission Date: ' + ts,
    '',
    '=== Submitted Data ===',
    formatAll_(r),
    '',
    'Please review for regional eligibility, evidence quality, verification readiness, grant service needs, EduTourism follow-up, donation follow-up, duplicate status, and intervention planning.',
  ].join('\n');
}

function buildConfirmationBody_(r) {
  const name = pickByHints_(r, ['full name', 'name']) || 'Nominator';
  return [
    'Dear ' + name + ',',
    '',
    'Thank you for submitting a nomination to NESA-Africa.',
    '',
    'Your submission has been received through the official NESA-Africa Google Pre-Nomination Services and will be reviewed for completeness, evidence, category fit, duplicate status, verification readiness, and governance/integrity approval.',
    '',
    'Submission does not guarantee nominee approval, finalist status, honouree status, school selection, grant approval, regional intervention selection, or award winner selection.',
    '',
    'Sponsorship, donation, ticket purchase, merchandise purchase, endorsement, media visibility, public voting, or AGC Voting Coin participation does not influence selection.',
    '',
    'Thank you for helping us identify education changemakers and special needs schools across Africa and the diaspora.',
    '',
    'NESA-Africa Team',
  ].join('\n');
}

function formatAll_(map) {
  return Object.keys(map).map(function (k) { return k + ': ' + map[k]; }).join('\n');
}

function notifyAdmin_(reason, detail, r) {
  try {
    GmailApp.sendEmail(ADMIN_FALLBACK_EMAIL,
      '[NESA Router Alert] ' + reason + ' - ' + FORM_KEY,
      reason + '\n\n' + detail + '\n\nForm Key: ' + FORM_KEY + '\n\nResponse Snapshot:\n' + formatAll_(r || {}));
  } catch (_) { /* swallow */ }
}

function log_(ts, id, formType, categoryOrRegion, nominatorEmail, recipient, subject, status, error) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(LOG_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(LOG_SHEET_NAME);
    sheet.appendRow(['timestamp','response_id','form_type','category_or_region',
      'nominator_email','recipient_email','notification_subject',
      'notification_status','error_message','sent_at']);
  }
  sheet.appendRow([ts, id, formType, categoryOrRegion, nominatorEmail, recipient,
    subject, status, error, new Date()]);
}
