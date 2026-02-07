/**
 * NESA-Africa 2025 — Judging Criteria Configuration
 * 20-point structured criteria for competitive award categories
 * Used by judges for 1-10 scoring
 */

export interface JudgingCriterion {
  id: string;
  number: number;
  label: string;
  description: string;
  weight?: number; // Default 1, can be adjusted for weighted scoring
  maxScore: number; // Typically 10
}

export interface JudgingCategory {
  id: string;
  name: string;
  definition: string;
  scope: "africa" | "nigeria" | "regional";
  competitive: boolean;
  criteriaCount: number;
  criteria: JudgingCriterion[];
}

// =====================================================
// 1. Best Media Organization in Educational Advocacy (Africa)
// =====================================================
export const MEDIA_ADVOCACY_CRITERIA: JudgingCategory = {
  id: "media_advocacy_africa",
  name: "Best Media Organization in Educational Advocacy",
  definition: "Recognizes media organizations (print, digital, broadcast, and social media) that significantly contribute to educational advocacy, awareness, and policy change in Africa.",
  scope: "africa",
  competitive: true,
  criteriaCount: 20,
  criteria: [
    { id: "media_1", number: 1, label: "Educational Content Impact", description: "Quality and relevance of educational topics covered.", maxScore: 10 },
    { id: "media_2", number: 2, label: "Advocacy Effectiveness", description: "Influence on education policies and societal perspectives.", maxScore: 10 },
    { id: "media_3", number: 3, label: "Community Engagement", description: "Interaction with the audience and engagement in educational campaigns.", maxScore: 10 },
    { id: "media_4", number: 4, label: "Innovation in Content Delivery", description: "Use of new formats, multimedia, and digital storytelling.", maxScore: 10 },
    { id: "media_5", number: 5, label: "Coverage & Reach", description: "Extent of audience engagement (national/international).", maxScore: 10 },
    { id: "media_6", number: 6, label: "Consistency & Frequency", description: "Regular publication of high-quality educational content.", maxScore: 10 },
    { id: "media_7", number: 7, label: "Social Media Influence", description: "Strength of digital presence and engagement on social platforms.", maxScore: 10 },
    { id: "media_8", number: 8, label: "Data-Driven Reporting", description: "Use of statistics, expert insights, and factual accuracy.", maxScore: 10 },
    { id: "media_9", number: 9, label: "Journalistic Integrity", description: "Adherence to ethical reporting and credible sources.", maxScore: 10 },
    { id: "media_10", number: 10, label: "Influence on Public Perception", description: "Impact on shaping education-related discussions.", maxScore: 10 },
    { id: "media_11", number: 11, label: "Collaborations with Education Stakeholders", description: "Partnerships with NGOs, schools, policymakers.", maxScore: 10 },
    { id: "media_12", number: 12, label: "Diversity & Inclusion", description: "Representation of marginalized groups in content.", maxScore: 10 },
    { id: "media_13", number: 13, label: "Call-to-Action Effectiveness", description: "Ability to mobilize audiences for educational initiatives.", maxScore: 10 },
    { id: "media_14", number: 14, label: "Use of Local Languages", description: "Accessibility for diverse linguistic audiences.", maxScore: 10 },
    { id: "media_15", number: 15, label: "Multimedia Integration", description: "Incorporation of videos, infographics, interactive media.", maxScore: 10 },
    { id: "media_16", number: 16, label: "Educational Awareness Campaigns", description: "Participation in national/global educational initiatives.", maxScore: 10 },
    { id: "media_17", number: 17, label: "Fact-Based vs Opinion-Based Reporting", description: "Balance between factual reporting and editorials.", maxScore: 10 },
    { id: "media_18", number: 18, label: "Historical Contribution to Education Advocacy", description: "Organization's track record and legacy.", maxScore: 10 },
    { id: "media_19", number: 19, label: "Coverage of Crisis in Education", description: "Response to emergencies affecting education (COVID-19, strikes).", maxScore: 10 },
    { id: "media_20", number: 20, label: "Sustainability of Efforts", description: "Long-term commitment to education journalism.", maxScore: 10 },
  ],
};

// =====================================================
// 2. Best CSR in Education (Africa - Regional Competition)
// =====================================================
export const CSR_AFRICA_CRITERIA: JudgingCategory = {
  id: "csr_education_africa",
  name: "Best Corporate Social Responsibility (CSR) in Education",
  definition: "Recognizes corporations that contribute significantly to education through CSR initiatives in Africa.",
  scope: "regional",
  competitive: true,
  criteriaCount: 20,
  criteria: [
    { id: "csr_af_1", number: 1, label: "Scale of CSR Program", description: "Number of people impacted.", maxScore: 10 },
    { id: "csr_af_2", number: 2, label: "Sustainability & Long-Term Impact", description: "Long-term educational benefits.", maxScore: 10 },
    { id: "csr_af_3", number: 3, label: "Innovation in CSR Strategy", description: "Unique approaches to CSR in education.", maxScore: 10 },
    { id: "csr_af_4", number: 4, label: "Budget & Investment in Education", description: "Financial contribution to education.", maxScore: 10 },
    { id: "csr_af_5", number: 5, label: "Infrastructure Support", description: "Building/renovating schools and libraries.", maxScore: 10 },
    { id: "csr_af_6", number: 6, label: "Scholarship & Grants Provision", description: "Number and effectiveness of scholarships.", maxScore: 10 },
    { id: "csr_af_7", number: 7, label: "Teacher Training & Development", description: "Initiatives to upskill educators.", maxScore: 10 },
    { id: "csr_af_8", number: 8, label: "Technological Integration", description: "Use of EdTech in learning programs.", maxScore: 10 },
    { id: "csr_af_9", number: 9, label: "Community Engagement & Participation", description: "Direct involvement of local communities.", maxScore: 10 },
    { id: "csr_af_10", number: 10, label: "Measurable Educational Outcomes", description: "Improvements in literacy/numeracy.", maxScore: 10 },
    { id: "csr_af_11", number: 11, label: "Diversity & Inclusion Strategies", description: "Focus on marginalized groups.", maxScore: 10 },
    { id: "csr_af_12", number: 12, label: "Environmental Sustainability", description: "Eco-friendly education programs.", maxScore: 10 },
    { id: "csr_af_13", number: 13, label: "Educational Awareness Campaigns", description: "Public engagement in CSR efforts.", maxScore: 10 },
    { id: "csr_af_14", number: 14, label: "Emergency Educational Support", description: "Response to disasters affecting learning.", maxScore: 10 },
    { id: "csr_af_15", number: 15, label: "Employee Volunteerism in Education", description: "Corporate staff participation.", maxScore: 10 },
    { id: "csr_af_16", number: 16, label: "Partnerships with Government & NGOs", description: "Collaborative CSR efforts.", maxScore: 10 },
    { id: "csr_af_17", number: 17, label: "Monitoring & Evaluation Mechanisms", description: "Methods used to measure impact.", maxScore: 10 },
    { id: "csr_af_18", number: 18, label: "Scalability of the CSR Program", description: "Ability to expand the initiative.", maxScore: 10 },
    { id: "csr_af_19", number: 19, label: "Innovation in Teaching & Learning Methods", description: "Use of creative methodologies.", maxScore: 10 },
    { id: "csr_af_20", number: 20, label: "Alignment with SDG Goals", description: "Contribution to UN SDG 4 on education.", maxScore: 10 },
  ],
};

// =====================================================
// 3. Best NGO Contribution to Education for All (Africa - Regional)
// =====================================================
export const NGO_AFRICA_CRITERIA: JudgingCategory = {
  id: "ngo_education_africa",
  name: "Best NGO Contribution to Achieving Education for All",
  definition: "Recognizes NGOs that significantly contribute to achieving universal education access.",
  scope: "regional",
  competitive: true,
  criteriaCount: 20,
  criteria: [
    { id: "ngo_af_1", number: 1, label: "Scale of Impact", description: "Number of schools/communities reached.", maxScore: 10 },
    { id: "ngo_af_2", number: 2, label: "Sustainability of Programs", description: "Longevity of education projects.", maxScore: 10 },
    { id: "ngo_af_3", number: 3, label: "Effectiveness of Initiatives", description: "Measurable educational improvements.", maxScore: 10 },
    { id: "ngo_af_4", number: 4, label: "Innovative Solutions", description: "New approaches to education challenges.", maxScore: 10 },
    { id: "ngo_af_5", number: 5, label: "Involvement in Policy Advocacy", description: "Impact on education policies.", maxScore: 10 },
    { id: "ngo_af_6", number: 6, label: "Inclusion & Diversity", description: "Gender balance and disability inclusion.", maxScore: 10 },
    { id: "ngo_af_7", number: 7, label: "Teacher Training & Development", description: "Support for educators' professional growth.", maxScore: 10 },
    { id: "ngo_af_8", number: 8, label: "Technology Integration", description: "Use of EdTech and digital tools.", maxScore: 10 },
    { id: "ngo_af_9", number: 9, label: "Financial Transparency", description: "Accountability in funds allocation.", maxScore: 10 },
    { id: "ngo_af_10", number: 10, label: "Partnerships with Stakeholders", description: "Government, donors, and institutions.", maxScore: 10 },
    { id: "ngo_af_11", number: 11, label: "Scholarship & Grants Programs", description: "Financial support for students.", maxScore: 10 },
    { id: "ngo_af_12", number: 12, label: "Community Engagement", description: "Grassroots participation in initiatives.", maxScore: 10 },
    { id: "ngo_af_13", number: 13, label: "Educational Materials & Resources", description: "Contribution to curriculum and materials.", maxScore: 10 },
    { id: "ngo_af_14", number: 14, label: "Capacity Building & Leadership Development", description: "Strengthening school leadership.", maxScore: 10 },
    { id: "ngo_af_15", number: 15, label: "Crisis & Emergency Response", description: "Rapid response in conflict-affected regions.", maxScore: 10 },
    { id: "ngo_af_16", number: 16, label: "Alignment with SDG 4", description: "Contribution to universal education goals.", maxScore: 10 },
    { id: "ngo_af_17", number: 17, label: "Impact in Rural & Underserved Areas", description: "Focus on education equity.", maxScore: 10 },
    { id: "ngo_af_18", number: 18, label: "Monitoring & Evaluation Mechanisms", description: "Tools for assessing progress.", maxScore: 10 },
    { id: "ngo_af_19", number: 19, label: "Social Awareness & Public Engagement", description: "Awareness campaigns on education issues.", maxScore: 10 },
    { id: "ngo_af_20", number: 20, label: "Funding Sustainability & Donor Relations", description: "Strategies for long-term financing.", maxScore: 10 },
  ],
};

// =====================================================
// 4. Best Creative Arts Industry Contribution (Nigeria)
// =====================================================
export const CREATIVE_ARTS_NIGERIA_CRITERIA: JudgingCategory = {
  id: "creative_arts_nigeria",
  name: "Best Creative Arts Industry Contribution to Education",
  definition: "Recognizes individuals or groups in the creative industry (Nollywood, music, literature, performing arts, and visual arts) that use their platforms to advance education and create educational awareness.",
  scope: "nigeria",
  competitive: true,
  criteriaCount: 20,
  criteria: [
    { id: "arts_ng_1", number: 1, label: "Educational Themes in Content", description: "Clear messaging that promotes learning.", maxScore: 10 },
    { id: "arts_ng_2", number: 2, label: "Outreach & Accessibility", description: "The number of students, schools, or communities impacted.", maxScore: 10 },
    { id: "arts_ng_3", number: 3, label: "Impact on Youth & Schools", description: "Direct engagement with students and teachers.", maxScore: 10 },
    { id: "arts_ng_4", number: 4, label: "Creativity & Innovation", description: "Unique and original approaches in content delivery.", maxScore: 10 },
    { id: "arts_ng_5", number: 5, label: "Community Engagement", description: "Active participation in community-based educational projects.", maxScore: 10 },
    { id: "arts_ng_6", number: 6, label: "Use of Local Languages", description: "Content is available in multiple African languages for accessibility.", maxScore: 10 },
    { id: "arts_ng_7", number: 7, label: "Social Media Influence", description: "Reach and engagement across social platforms.", maxScore: 10 },
    { id: "arts_ng_8", number: 8, label: "Media Coverage & Publicity", description: "Recognition in mainstream and digital media.", maxScore: 10 },
    { id: "arts_ng_9", number: 9, label: "Partnerships with Schools & NGOs", description: "Collaborations with educational institutions and non-profits.", maxScore: 10 },
    { id: "arts_ng_10", number: 10, label: "Awards & Recognition", description: "Previous honors or acknowledgment for educational contributions.", maxScore: 10 },
    { id: "arts_ng_11", number: 11, label: "Educational Value of Performances", description: "How performances promote knowledge and critical thinking.", maxScore: 10 },
    { id: "arts_ng_12", number: 12, label: "Engagement with Teachers", description: "Direct involvement of educators in content creation.", maxScore: 10 },
    { id: "arts_ng_13", number: 13, label: "Innovative Use of Technology in Content", description: "Use of digital tools or AI to enhance educational messages.", maxScore: 10 },
    { id: "arts_ng_14", number: 14, label: "Sustainability & Longevity of Impact", description: "Long-term influence and reusability of content.", maxScore: 10 },
    { id: "arts_ng_15", number: 15, label: "Advocacy for Education Policy Change", description: "Efforts to improve education systems through advocacy.", maxScore: 10 },
    { id: "arts_ng_16", number: 16, label: "Diversity & Inclusion in Content", description: "Representation of gender, culture, and marginalized groups.", maxScore: 10 },
    { id: "arts_ng_17", number: 17, label: "Relevance to African Educational Challenges", description: "Addresses real challenges in the education sector.", maxScore: 10 },
    { id: "arts_ng_18", number: 18, label: "Integration with School Curriculum", description: "Alignment with learning goals or syllabus objectives.", maxScore: 10 },
    { id: "arts_ng_19", number: 19, label: "Role in Career Development", description: "Inspires and equips learners for career paths in creative industries.", maxScore: 10 },
    { id: "arts_ng_20", number: 20, label: "Financial & Material Investment in Education", description: "Personal or corporate contributions to educational development.", maxScore: 10 },
  ],
};

// =====================================================
// 5. Best EduTech Organization (Africa)
// =====================================================
export const EDUTECH_AFRICA_CRITERIA: JudgingCategory = {
  id: "edutech_africa",
  name: "Best EduTech Organization",
  definition: "Recognizes outstanding EduTech companies leveraging technology to improve education across Africa.",
  scope: "africa",
  competitive: true,
  criteriaCount: 20,
  criteria: [
    { id: "edutech_1", number: 1, label: "Innovation in Educational Technology", description: "Introduction of new, effective tools for education.", maxScore: 10 },
    { id: "edutech_2", number: 2, label: "User-Friendliness & Accessibility", description: "Easy-to-use platforms, accessible to all learners.", maxScore: 10 },
    { id: "edutech_3", number: 3, label: "Impact on Learning Outcomes", description: "Evidence-based improvements in student performance.", maxScore: 10 },
    { id: "edutech_4", number: 4, label: "Affordability & Scalability", description: "Cost-effectiveness and ability to scale across regions.", maxScore: 10 },
    { id: "edutech_5", number: 5, label: "Integration with Local Curriculum", description: "Alignment with national and international education standards.", maxScore: 10 },
    { id: "edutech_6", number: 6, label: "Inclusivity & Special Needs Support", description: "Features supporting students with disabilities.", maxScore: 10 },
    { id: "edutech_7", number: 7, label: "Digital & Mobile Access", description: "Availability across devices and mobile platforms.", maxScore: 10 },
    { id: "edutech_8", number: 8, label: "Partnerships with Schools & Governments", description: "Collaboration with educational institutions.", maxScore: 10 },
    { id: "edutech_9", number: 9, label: "Teacher Training & Professional Development", description: "Educator-focused tools and training programs.", maxScore: 10 },
    { id: "edutech_10", number: 10, label: "Gamification & Interactive Learning", description: "Use of gaming and interactive techniques to boost learning.", maxScore: 10 },
    { id: "edutech_11", number: 11, label: "Data-Driven Insights & AI Integration", description: "Use of analytics and artificial intelligence in learning solutions.", maxScore: 10 },
    { id: "edutech_12", number: 12, label: "Cybersecurity & Data Privacy Compliance", description: "Adherence to international data protection regulations.", maxScore: 10 },
    { id: "edutech_13", number: 13, label: "Use of Local Languages", description: "Multilingual options for diverse learners.", maxScore: 10 },
    { id: "edutech_14", number: 14, label: "Crisis & Emergency Education Response", description: "Support for learning in conflict and disaster zones.", maxScore: 10 },
    { id: "edutech_15", number: 15, label: "Affordability & Open-Source Access", description: "Accessibility for underprivileged learners.", maxScore: 10 },
    { id: "edutech_16", number: 16, label: "Personalized Learning Pathways", description: "Adaptive learning systems based on student needs.", maxScore: 10 },
    { id: "edutech_17", number: 17, label: "User Feedback & Customer Support", description: "Strong technical support and response to user feedback.", maxScore: 10 },
    { id: "edutech_18", number: 18, label: "Sustainability of Business Model", description: "Long-term financial sustainability and market impact.", maxScore: 10 },
    { id: "edutech_19", number: 19, label: "Recognition & Industry Awards", description: "Previous achievements in the EduTech sector.", maxScore: 10 },
    { id: "edutech_20", number: 20, label: "Contribution to Education Policy", description: "Influence on local and national education policies.", maxScore: 10 },
  ],
};

// =====================================================
// 6. Best NGO Contribution to Education (Nigeria)
// =====================================================
export const NGO_NIGERIA_CRITERIA: JudgingCategory = {
  id: "ngo_education_nigeria",
  name: "Best NGO Contribution to Education in Nigeria",
  definition: "Recognizes non-governmental organizations (NGOs) that are making a significant impact in Nigeria's education sector.",
  scope: "nigeria",
  competitive: true,
  criteriaCount: 20,
  criteria: [
    { id: "ngo_ng_1", number: 1, label: "Number of Schools & Students Impacted", description: "Reach and scale of programs.", maxScore: 10 },
    { id: "ngo_ng_2", number: 2, label: "Sustainability & Longevity", description: "Long-term impact of educational projects.", maxScore: 10 },
    { id: "ngo_ng_3", number: 3, label: "Innovation in Education Interventions", description: "Unique and effective educational programs.", maxScore: 10 },
    { id: "ngo_ng_4", number: 4, label: "Scholarships & Financial Support", description: "Number and quality of scholarship opportunities provided.", maxScore: 10 },
    { id: "ngo_ng_5", number: 5, label: "Teacher Training & Capacity Building", description: "Professional development programs for educators.", maxScore: 10 },
    { id: "ngo_ng_6", number: 6, label: "Use of Technology & Digital Learning", description: "Tech-driven solutions for learning.", maxScore: 10 },
    { id: "ngo_ng_7", number: 7, label: "Infrastructure Development", description: "School construction and renovation projects.", maxScore: 10 },
    { id: "ngo_ng_8", number: 8, label: "Partnerships & Collaborations", description: "Engagement with local and international bodies.", maxScore: 10 },
    { id: "ngo_ng_9", number: 9, label: "Monitoring & Evaluation System", description: "Measurable impact tracking and reporting.", maxScore: 10 },
    { id: "ngo_ng_10", number: 10, label: "Education Policy Advocacy", description: "Efforts to improve Nigeria's education policies.", maxScore: 10 },
    { id: "ngo_ng_11", number: 11, label: "Inclusion of Marginalized Communities", description: "Targeting disadvantaged and underprivileged groups.", maxScore: 10 },
    { id: "ngo_ng_12", number: 12, label: "Financial Transparency & Accountability", description: "Efficient use of funds and clear reporting.", maxScore: 10 },
    { id: "ngo_ng_13", number: 13, label: "Community Engagement & Parental Involvement", description: "Active involvement of families in education.", maxScore: 10 },
    { id: "ngo_ng_14", number: 14, label: "Emergency Education & Disaster Response", description: "Efforts in crisis-affected areas.", maxScore: 10 },
    { id: "ngo_ng_15", number: 15, label: "Alignment with National Education Goals", description: "Contribution to Nigeria's development plans.", maxScore: 10 },
    { id: "ngo_ng_16", number: 16, label: "Public Awareness & Media Engagement", description: "Visibility and education awareness campaigns.", maxScore: 10 },
    { id: "ngo_ng_17", number: 17, label: "Diversity & Gender Inclusion", description: "Special attention to gender equality.", maxScore: 10 },
    { id: "ngo_ng_18", number: 18, label: "Mentorship & Leadership Development", description: "Programs supporting student leadership growth.", maxScore: 10 },
    { id: "ngo_ng_19", number: 19, label: "Volunteer & Internship Programs", description: "Involvement of young people in NGO activities.", maxScore: 10 },
    { id: "ngo_ng_20", number: 20, label: "Recognition & Previous Awards", description: "Prior acknowledgment of educational impact.", maxScore: 10 },
  ],
};

// =====================================================
// 7. Best CSR in Education (Nigeria)
// =====================================================
export const CSR_NIGERIA_CRITERIA: JudgingCategory = {
  id: "csr_education_nigeria",
  name: "Best Corporate Social Responsibility (CSR) in Education",
  definition: "Recognizes companies in Nigeria that implement outstanding CSR initiatives focused on education.",
  scope: "nigeria",
  competitive: true,
  criteriaCount: 20,
  criteria: [
    { id: "csr_ng_1", number: 1, label: "Scale of CSR Program", description: "Number of students/schools reached.", maxScore: 10 },
    { id: "csr_ng_2", number: 2, label: "Sustainability of CSR Initiatives", description: "Long-term benefits for the education sector.", maxScore: 10 },
    { id: "csr_ng_3", number: 3, label: "Scholarship & Grant Programs", description: "Financial support to students and teachers.", maxScore: 10 },
    { id: "csr_ng_4", number: 4, label: "Infrastructure Development", description: "School buildings, libraries, and educational centers.", maxScore: 10 },
    { id: "csr_ng_5", number: 5, label: "Technology & Digital Learning Integration", description: "Use of EdTech to enhance learning.", maxScore: 10 },
    { id: "csr_ng_6", number: 6, label: "Collaboration with Government & NGOs", description: "Partnership with educational stakeholders.", maxScore: 10 },
    { id: "csr_ng_7", number: 7, label: "Monitoring & Evaluation System", description: "Evidence of CSR program success.", maxScore: 10 },
    { id: "csr_ng_8", number: 8, label: "Community Engagement", description: "Direct involvement of beneficiaries.", maxScore: 10 },
    { id: "csr_ng_9", number: 9, label: "Financial Investment in Education", description: "Total funding allocated for CSR efforts.", maxScore: 10 },
    { id: "csr_ng_10", number: 10, label: "Teacher Training & Capacity Building", description: "Training initiatives for educators.", maxScore: 10 },
    { id: "csr_ng_11", number: 11, label: "Inclusion & Gender Equality", description: "Special focus on disadvantaged groups.", maxScore: 10 },
    { id: "csr_ng_12", number: 12, label: "Employee Volunteerism & Participation", description: "Staff involvement in education projects.", maxScore: 10 },
    { id: "csr_ng_13", number: 13, label: "Sponsorship of Learning Programs", description: "Contributions to education summits and workshops.", maxScore: 10 },
    { id: "csr_ng_14", number: 14, label: "Public Awareness & Education Advocacy", description: "Use of CSR for policy improvement.", maxScore: 10 },
    { id: "csr_ng_15", number: 15, label: "Measurable Student Outcomes", description: "Improvement in student performance.", maxScore: 10 },
    { id: "csr_ng_16", number: 16, label: "Emergency & Crisis Response", description: "Support in emergencies affecting education.", maxScore: 10 },
    { id: "csr_ng_17", number: 17, label: "Alignment with National & Global Education Goals", description: "Support for SDG 4 (Quality Education).", maxScore: 10 },
    { id: "csr_ng_18", number: 18, label: "Recognition & Awards", description: "Prior acknowledgment of CSR efforts.", maxScore: 10 },
    { id: "csr_ng_19", number: 19, label: "Scalability of CSR Efforts", description: "Potential for CSR model replication.", maxScore: 10 },
    { id: "csr_ng_20", number: 20, label: "Financial Transparency & Accountability", description: "Clear reporting of CSR fund usage.", maxScore: 10 },
  ],
};

// =====================================================
// ALL JUDGING CATEGORIES
// =====================================================
export const ALL_JUDGING_CATEGORIES: JudgingCategory[] = [
  MEDIA_ADVOCACY_CRITERIA,
  CSR_AFRICA_CRITERIA,
  NGO_AFRICA_CRITERIA,
  CREATIVE_ARTS_NIGERIA_CRITERIA,
  EDUTECH_AFRICA_CRITERIA,
  NGO_NIGERIA_CRITERIA,
  CSR_NIGERIA_CRITERIA,
];

// =====================================================
// SCORING UTILITIES
// =====================================================

export const SCORE_RANGE = {
  min: 1,
  max: 10,
  labels: {
    1: "Poor",
    2: "Very Weak",
    3: "Weak",
    4: "Below Average",
    5: "Average",
    6: "Above Average",
    7: "Good",
    8: "Very Good",
    9: "Excellent",
    10: "Outstanding",
  } as Record<number, string>,
};

export interface JudgeScore {
  criterionId: string;
  score: number;
  notes?: string;
}

export interface CategoryScorecard {
  categoryId: string;
  nomineeId: string;
  judgeUserId: string;
  scores: JudgeScore[];
  totalScore: number;
  averageScore: number;
  submittedAt?: string;
}

/**
 * Calculate total and average scores for a scorecard
 */
export function calculateScores(scores: JudgeScore[]): { total: number; average: number } {
  if (scores.length === 0) return { total: 0, average: 0 };
  
  const total = scores.reduce((sum, s) => sum + s.score, 0);
  const average = total / scores.length;
  
  return { total, average: Math.round(average * 100) / 100 };
}

/**
 * Calculate weighted scores if weights are defined
 */
export function calculateWeightedScore(
  scores: JudgeScore[],
  category: JudgingCategory
): number {
  const criteriaMap = new Map(category.criteria.map(c => [c.id, c]));
  
  let totalWeight = 0;
  let weightedSum = 0;
  
  scores.forEach(score => {
    const criterion = criteriaMap.get(score.criterionId);
    const weight = criterion?.weight ?? 1;
    weightedSum += score.score * weight;
    totalWeight += weight;
  });
  
  return totalWeight > 0 ? Math.round((weightedSum / totalWeight) * 100) / 100 : 0;
}

/**
 * Get category by ID
 */
export function getJudgingCategoryById(categoryId: string): JudgingCategory | undefined {
  return ALL_JUDGING_CATEGORIES.find(c => c.id === categoryId);
}

/**
 * Get categories by scope
 */
export function getJudgingCategoriesByScope(scope: JudgingCategory["scope"]): JudgingCategory[] {
  return ALL_JUDGING_CATEGORIES.filter(c => c.scope === scope);
}

/**
 * Validate a complete scorecard (all criteria scored)
 */
export function validateScorecard(
  scores: JudgeScore[],
  categoryId: string
): { valid: boolean; missing: string[] } {
  const category = getJudgingCategoryById(categoryId);
  if (!category) return { valid: false, missing: [] };
  
  const scoredIds = new Set(scores.map(s => s.criterionId));
  const missing = category.criteria
    .filter(c => !scoredIds.has(c.id))
    .map(c => c.label);
  
  return {
    valid: missing.length === 0,
    missing,
  };
}
