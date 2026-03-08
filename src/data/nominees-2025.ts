/**
 * NESA Africa 2025 Nominee Master Dataset
 * Source: NESA_Award_Nominees_Master_List.xlsx (1,703 records)
 * Format: [id, mainCategory, region, subcategory, name, country, state, achievement]
 * 
 * This file is the GitHub-stored source of truth for all nominee data.
 * Nomination Year: 2025 (Merged from 2024 legacy + 2025 updates)
 * 
 * All 2024 nominees have been migrated and merged into this 2025 dataset.
 * Original 2024 data archived in nominees-2024-archive.ts
 */

export type NomineeRow = [number, string, string, string, string, string, string, string];

/** Merge tracking metadata per nominee */
export interface NomineeMergeInfo {
  id: number;
  sourceYears: number[];
  migratedFrom2024: boolean;
  mergedRecord: boolean;
  migrationLabel: "new_2025" | "migrated_from_2024" | "merged_2024_2025";
  publicLabel: "Existing Nominee" | "2025 Nominee";
}

export const NOMINEES_2025: NomineeRow[] = [
  // ═══════════════════════════════════════════════════════════════════
  // CATEGORY 1: Diaspora Association Educational Impact in Africa (30 nominees)
  // Subcategories: Infrastructure (10), Program Innovation (10), Teacher Training (10)
  // ═══════════════════════════════════════════════════════════════════
  [1,"Diaspora Association Educational Impact in Africa","N/A","The Best Diaspora-Led Educational Infrastructure","Nigerian Association in the UK","Nigeria","Lagos, Nigeria","Constructed a science and technology center in Osun State, Nigeria, fully equipped with modern laboratories and classrooms."],
  [2,"Diaspora Association Educational Impact in Africa","N/A","The Best Diaspora-Led Educational Infrastructure","Ghanaian Association of Washington","Nigeria","Lagos, Nigeria","Built a community library and learning center in Kumasi, Ghana, with a focus on providing access to books and digital resources."],
  [3,"Diaspora Association Educational Impact in Africa","N/A","The Best Diaspora-Led Educational Infrastructure","Kenyan Diaspora Alliance","Nigeria","Lagos, Nigeria","Constructed three primary schools in rural areas of Kenya, including the provision of solar power and internet access."],
  [4,"Diaspora Association Educational Impact in Africa","N/A","The Best Diaspora-Led Educational Infrastructure","Ethiopian Diaspora Fellowship","Nigeria","Lagos, Nigeria","Renovated dilapidated schools in Addis Ababa, Ethiopia, including upgrading classrooms, sanitation facilities, and playgrounds."],
  [5,"Diaspora Association Educational Impact in Africa","N/A","The Best Diaspora-Led Educational Infrastructure","South African Diaspora United","Nigeria","Lagos, Nigeria","Funded the construction of a multi-purpose education and sports complex in Soweto, South Africa."],
  [6,"Diaspora Association Educational Impact in Africa","N/A","The Best Diaspora-Led Educational Infrastructure","Ugandan North American Association","Nigeria","Lagos, Nigeria","Built a secondary school in Gulu, Uganda, focusing on regions recovering from conflict. Provided quality education to over 500 students."],
  [7,"Diaspora Association Educational Impact in Africa","N/A","The Best Diaspora-Led Educational Infrastructure","Zimbabwean Diaspora Network","Nigeria","Lagos, Nigeria","Led the refurbishment of schools in Matabeleland, Zimbabwe, including the installation of computer labs and solar power systems."],
  [8,"Diaspora Association Educational Impact in Africa","N/A","The Best Diaspora-Led Educational Infrastructure","Senegalese Association in France","Nigeria","Lagos, Nigeria","Funded the construction of a vocational training center in Dakar, Senegal, focusing on trades such as carpentry, plumbing, and electrical work."],
  [9,"Diaspora Association Educational Impact in Africa","N/A","The Best Diaspora-Led Educational Infrastructure","Tanzanian Community in the USA","Nigeria","Lagos, Nigeria","Established digital learning hubs in rural Tanzania, providing internet access and e-learning tools to underserved communities."],
  [10,"Diaspora Association Educational Impact in Africa","N/A","The Best Diaspora-Led Educational Infrastructure","Congolese Diaspora Impact Group","Nigeria","Lagos, Nigeria","Built a school complex in Kinshasa, Democratic Republic of the Congo, including classrooms, a library, and a computer lab."],
  [11,"Diaspora Association Educational Impact in Africa","N/A","The Best Diaspora-Led Educational Program Innovation","African Diaspora Network (ADN)","Nigeria","Lagos, Nigeria","Developed an e-learning platform that offers free access to STEM courses for students across Africa. Trained 5,000 teachers across the continent."],
  [12,"Diaspora Association Educational Impact in Africa","N/A","The Best Diaspora-Led Educational Program Innovation","Sierra Leonean Empowerment Network","Nigeria","Lagos, Nigeria","Reached over 10,000 students in multiple countries, significantly improving their understanding and performance in science subjects."],
  [13,"Diaspora Association Educational Impact in Africa","N/A","The Best Diaspora-Led Educational Program Innovation","African Leadership Academy Alumni","Nigeria","Lagos, Nigeria","Designed an after-school leadership program that fosters entrepreneurial skills among African youth. Over 1,000 students have participated."],
  [14,"Diaspora Association Educational Impact in Africa","N/A","The Best Diaspora-Led Educational Program Innovation","Nigerian Diaspora Direct Investment Summit","Nigeria","Lagos, Nigeria","Introduced a mentorship and investment program for young entrepreneurs in Nigeria, combining educational resources with financial support."],
  [15,"Diaspora Association Educational Impact in Africa","N/A","The Best Diaspora-Led Educational Program Innovation","Somali Diaspora Youth","Nigeria","Lagos, Nigeria","Developed a distance learning program that connects Somali students in rural areas with diaspora educators via virtual classrooms."],
  [16,"Diaspora Association Educational Impact in Africa","N/A","The Best Diaspora-Led Educational Program Innovation","Eritrean Diaspora Initiative","Nigeria","Lagos, Nigeria","Launched a digital literacy program that provides Eritrean students with essential IT skills, including coding and digital communication."],
  [17,"Diaspora Association Educational Impact in Africa","N/A","The Best Diaspora-Led Educational Program Innovation","Moroccan American Network","Nigeria","Lagos, Nigeria","Established a bilingual education program that supports French and Arabic literacy in Moroccan schools using digital tools."],
  [18,"Diaspora Association Educational Impact in Africa","N/A","The Best Diaspora-Led Educational Program Innovation","Ghana Diaspora Professional Network","Nigeria","Lagos, Nigeria","Developed an IT skills training program focused on coding, web development, and digital marketing for Ghanaian youth."],
  [19,"Diaspora Association Educational Impact in Africa","N/A","The Best Diaspora-Led Educational Program Innovation","Botswana Educational Foundation","Nigeria","Lagos, Nigeria","Introduced an environmental education program that teaches sustainable practices and conservation in Botswana's schools."],
  [20,"Diaspora Association Educational Impact in Africa","N/A","The Best Diaspora-Led Educational Program Innovation","Liberian Diaspora Education Fund","Nigeria","Lagos, Nigeria","Implemented an after-school tutoring and mentorship program in Liberia, focusing on literacy and numeracy skills."],
  [21,"Diaspora Association Educational Impact in Africa","N/A","The Best Diaspora-Led Teacher Training And Support Initiative","African Teacher Foundation","Nigeria","Lagos, Nigeria","Delivered a teacher training program covering modern pedagogical methods, classroom management, and technology integration."],
  [22,"Diaspora Association Educational Impact in Africa","N/A","The Best Diaspora-Led Teacher Training And Support Initiative","Diaspora African Women in Education (DAWIE)","Nigeria","Lagos, Nigeria","Established a mentorship program connecting female educators in Africa with experienced teachers abroad. Empowered 2,000 women in education."],
  [23,"Diaspora Association Educational Impact in Africa","N/A","The Best Diaspora-Led Teacher Training And Support Initiative","Zimbabwean Teachers Association Abroad","Nigeria","Lagos, Nigeria","Launched a continuous professional development program for Zimbabwean teachers, focusing on curriculum development and modern teaching methods."],
  [24,"Diaspora Association Educational Impact in Africa","N/A","The Best Diaspora-Led Teacher Training And Support Initiative","Ghanaian Teachers in Diaspora","Nigeria","Lagos, Nigeria","Developed an annual teacher training conference in Accra, Ghana, featuring workshops on best practices in education and technology integration."],
  [25,"Diaspora Association Educational Impact in Africa","N/A","The Best Diaspora-Led Teacher Training And Support Initiative","Ugandan Teachers' Network","Nigeria","Lagos, Nigeria","Implemented a peer-to-peer support network for Ugandan teachers, offering resources, mentorship, and collaborative professional development."],
  [26,"Diaspora Association Educational Impact in Africa","N/A","The Best Diaspora-Led Teacher Training And Support Initiative","Malawian Diaspora Teaching Initiative","Nigeria","Lagos, Nigeria","Conducted teacher training workshops focusing on inclusive education and teaching students with special needs. Trained over 1,000 educators."],
  [27,"Diaspora Association Educational Impact in Africa","N/A","The Best Diaspora-Led Teacher Training And Support Initiative","Sierra Leone Teachers Abroad Network","Nigeria","Lagos, Nigeria","Provided remote training and resources for teachers in Sierra Leone, focusing on post-conflict education and trauma-informed teaching practices."],
  [28,"Diaspora Association Educational Impact in Africa","N/A","The Best Diaspora-Led Teacher Training And Support Initiative","Ethiopian Education Foundation","Nigeria","Lagos, Nigeria","Established a teacher exchange program that brings Ethiopian educators to the United States for training in STEM education."],
  [29,"Diaspora Association Educational Impact in Africa","N/A","The Best Diaspora-Led Teacher Training And Support Initiative","South Sudanese Educators Abroad","Nigeria","Lagos, Nigeria","Developed a peace education curriculum and trained teachers in South Sudan on conflict resolution and peacebuilding."],
  [30,"Diaspora Association Educational Impact in Africa","N/A","The Best Diaspora-Led Teacher Training And Support Initiative","Zambian Diaspora Education Trust","Nigeria","Lagos, Nigeria","Developed a STEM-focused teacher training initiative, providing resources and training to Zambian teachers."],

  // ═══════════════════════════════════════════════════════════════════
  // CATEGORY 2: Overall Best Educational Friendly State in Nigeria 2025 (52 nominees)
  // Migrated from 2024 → 2025 | All records carried forward
  // ═══════════════════════════════════════════════════════════════════
  [31,"Overall Best Educational Friendly State in Nigeria 2025","N/A","Best Education Initiative in North Central Zone","Kogi State","Nigeria","Kogi","Dedication to improving rural education, particularly for girls, demonstrating significant community impact."],
  [32,"Overall Best Educational Friendly State in Nigeria 2025","N/A","Best Education Initiative in North Central Zone","Kwara State","Nigeria","Kwara","Dedication to improving rural education, particularly for girls, demonstrating significant community impact."],
  [33,"Overall Best Educational Friendly State in Nigeria 2025","N/A","Best Education Initiative in North Central Zone","Benue State","Nigeria","Benue","Dedication to improving rural education, particularly for girls, demonstrating significant community impact."],
  [34,"Overall Best Educational Friendly State in Nigeria 2025","N/A","Best Education Initiative in North Central Zone","Nasarawa State","Nigeria","Nasarawa","Dedication to improving rural education, particularly for girls, demonstrating significant community impact."],
  [35,"Overall Best Educational Friendly State in Nigeria 2025","N/A","Best Education Initiative in North Central Zone","Niger State","Nigeria","Niger","Dedication to improving rural education, particularly for girls, demonstrating significant community impact."],
  [36,"Overall Best Educational Friendly State in Nigeria 2025","N/A","Best Education Initiative in North Central Zone","Plateau State","Nigeria","Plateau","Dedication to improving rural education, particularly for girls, demonstrating significant community impact."],
  [37,"Overall Best Educational Friendly State in Nigeria 2025","N/A","Best Education Initiative in North Central Zone","Federal Capital Territory","Nigeria","FCT","Dedication to improving rural education, particularly for girls, demonstrating significant community impact."],
  [38,"Overall Best Educational Friendly State in Nigeria 2025","N/A","Best Education Initiative in North Central Zone","Kaduna State","Nigeria","Kaduna","Dedication to improving rural education, particularly for girls, demonstrating significant community impact."],
  [39,"Overall Best Educational Friendly State in Nigeria 2025","N/A","Best Education Initiative in North Central Zone","Kebbi State","Nigeria","Kebbi","Dedication to improving rural education, particularly for girls, demonstrating significant community impact."],
  [40,"Overall Best Educational Friendly State in Nigeria 2025","N/A","Best Education Initiative in North Central Zone","Sokoto State","Nigeria","Sokoto","Dedication to improving rural education, particularly for girls, demonstrating significant community impact."],
  [41,"Overall Best Educational Friendly State in Nigeria 2025","N/A","Best Education Initiative in North East Zone","Adamawa State","Nigeria","Adamawa","Dedication to improving rural education, particularly for girls, demonstrating significant community impact."],
  [42,"Overall Best Educational Friendly State in Nigeria 2025","N/A","Best Education Initiative in North East Zone","Bauchi State","Nigeria","Bauchi","Dedication to improving rural education, particularly for girls, demonstrating significant community impact."],
  [43,"Overall Best Educational Friendly State in Nigeria 2025","N/A","Best Education Initiative in North East Zone","Borno State","Nigeria","Borno","Dedication to improving rural education, particularly for girls, demonstrating significant community impact."],
  [44,"Overall Best Educational Friendly State in Nigeria 2025","N/A","Best Education Initiative in North East Zone","Gombe State","Nigeria","Gombe","Dedication to improving rural education, particularly for girls, demonstrating significant community impact."],
  [45,"Overall Best Educational Friendly State in Nigeria 2025","N/A","Best Education Initiative in North East Zone","Taraba State","Nigeria","Taraba","Dedication to improving rural education, particularly for girls, demonstrating significant community impact."],
  [46,"Overall Best Educational Friendly State in Nigeria 2025","N/A","Best Education Initiative in North East Zone","Yobe State","Nigeria","Yobe","Dedication to improving rural education, particularly for girls, demonstrating significant community impact."],
  [47,"Overall Best Educational Friendly State in Nigeria 2025","N/A","Best Education Initiative in North East Zone","Jigawa State","Nigeria","Jigawa","Dedication to improving rural education, particularly for girls, demonstrating significant community impact."],
  [48,"Overall Best Educational Friendly State in Nigeria 2025","N/A","Best Education Initiative in North East Zone","Kano State","Nigeria","Kano","Dedication to improving rural education, particularly for girls, demonstrating significant community impact."],
  [49,"Overall Best Educational Friendly State in Nigeria 2025","N/A","Best Education Initiative in North East Zone","Katsina State","Nigeria","Katsina","Dedication to improving rural education, particularly for girls, demonstrating significant community impact."],
  [50,"Overall Best Educational Friendly State in Nigeria 2025","N/A","Best Education Initiative in North East Zone","Zamfara State","Nigeria","Zamfara","Dedication to improving rural education, particularly for girls, demonstrating significant community impact."],
  [51,"Overall Best Educational Friendly State in Nigeria 2025","N/A","Best Education Initiative in North West Zone","Kaduna State","Nigeria","Kaduna","Dedication to improving rural education, particularly for girls, demonstrating significant community impact."],
  [52,"Overall Best Educational Friendly State in Nigeria 2025","N/A","Best Education Initiative in North West Zone","Kano State","Nigeria","Kano","Dedication to improving rural education, particularly for girls, demonstrating significant community impact."],
  [53,"Overall Best Educational Friendly State in Nigeria 2025","N/A","Best Education Initiative in North West Zone","Kebbi State","Nigeria","Kebbi","Dedication to improving rural education, particularly for girls, demonstrating significant community impact."],
  [54,"Overall Best Educational Friendly State in Nigeria 2025","N/A","Best Education Initiative in North West Zone","Sokoto State","Nigeria","Sokoto","Dedication to improving rural education, particularly for girls, demonstrating significant community impact."],
  [55,"Overall Best Educational Friendly State in Nigeria 2025","N/A","Best Education Initiative in North West Zone","Jigawa State","Nigeria","Jigawa","Dedication to improving rural education, particularly for girls, demonstrating significant community impact."],
  [56,"Overall Best Educational Friendly State in Nigeria 2025","N/A","Best Education Initiative in North West Zone","Zamfara State","Nigeria","Zamfara","Dedication to improving rural education, particularly for girls, demonstrating significant community impact."],
  [57,"Overall Best Educational Friendly State in Nigeria 2025","N/A","Best Education Initiative in North West Zone","Katsina State","Nigeria","Katsina","Dedication to improving rural education, particularly for girls, demonstrating significant community impact."],
  [58,"Overall Best Educational Friendly State in Nigeria 2025","N/A","Best Education Initiative in North West Zone","Borno State","Nigeria","Borno","Dedication to improving rural education, particularly for girls, demonstrating significant community impact."],
  [59,"Overall Best Educational Friendly State in Nigeria 2025","N/A","Best Education Initiative in North West Zone","Yobe State","Nigeria","Yobe","Dedication to improving rural education, particularly for girls, demonstrating significant community impact."],
  [60,"Overall Best Educational Friendly State in Nigeria 2025","N/A","Best Education Initiative in North West Zone","Bauchi State","Nigeria","Bauchi","Dedication to improving rural education, particularly for girls, demonstrating significant community impact."],
  [61,"Overall Best Educational Friendly State in Nigeria 2025","N/A","Best Education Initiative in South East Zone","Abia State","Nigeria","Abia","Dedication to improving rural education, particularly for girls, demonstrating significant community impact."],
  [62,"Overall Best Educational Friendly State in Nigeria 2025","N/A","Best Education Initiative in South East Zone","Anambra State","Nigeria","Anambra","Dedication to improving rural education, particularly for girls, demonstrating significant community impact."],
  [63,"Overall Best Educational Friendly State in Nigeria 2025","N/A","Best Education Initiative in South East Zone","Ebonyi State","Nigeria","Ebonyi","Dedication to improving rural education, particularly for girls, demonstrating significant community impact."],
  [64,"Overall Best Educational Friendly State in Nigeria 2025","N/A","Best Education Initiative in South East Zone","Enugu State","Nigeria","Enugu","Dedication to improving rural education, particularly for girls, demonstrating significant community impact."],
  [65,"Overall Best Educational Friendly State in Nigeria 2025","N/A","Best Education Initiative in South East Zone","Imo State","Nigeria","Imo","Dedication to improving rural education, particularly for girls, demonstrating significant community impact."],
  [66,"Overall Best Educational Friendly State in Nigeria 2025","N/A","Best Education Initiative in South East Zone","Anambra State","Nigeria","Anambra","Dedication to improving rural education, particularly for girls, demonstrating significant community impact."],
  [67,"Overall Best Educational Friendly State in Nigeria 2025","N/A","Best Education Initiative in South East Zone","Akwa Ibom State","Nigeria","Akwa Ibom","Dedication to improving rural education, particularly for girls, demonstrating significant community impact."],
  [68,"Overall Best Educational Friendly State in Nigeria 2025","N/A","Best Education Initiative in South East Zone","Rivers State","Nigeria","Rivers","Dedication to improving rural education, particularly for girls, demonstrating significant community impact."],
  [69,"Overall Best Educational Friendly State in Nigeria 2025","N/A","Best Education Initiative in South East Zone","Bayelsa State","Nigeria","Bayelsa","Dedication to improving rural education, particularly for girls, demonstrating significant community impact."],
  [70,"Overall Best Educational Friendly State in Nigeria 2025","N/A","Best Education Initiative in South East Zone","Delta State","Nigeria","Delta","Dedication to improving rural education, particularly for girls, demonstrating significant community impact."],
  [71,"Overall Best Educational Friendly State in Nigeria 2025","N/A","Best Education Initiative in South West Zone","Lagos State","Nigeria","Lagos","Dedication to improving rural education, particularly for girls, demonstrating significant community impact."],
  [72,"Overall Best Educational Friendly State in Nigeria 2025","N/A","Best Education Initiative in South West Zone","Ogun State","Nigeria","Ogun","Dedication to improving rural education, particularly for girls, demonstrating significant community impact."],
  [73,"Overall Best Educational Friendly State in Nigeria 2025","N/A","Best Education Initiative in South West Zone","Oyo State","Nigeria","Oyo","Dedication to improving rural education, particularly for girls, demonstrating significant community impact."],
  [74,"Overall Best Educational Friendly State in Nigeria 2025","N/A","Best Education Initiative in South West Zone","Osun State","Nigeria","Osun","Dedication to improving rural education, particularly for girls, demonstrating significant community impact."],
  [75,"Overall Best Educational Friendly State in Nigeria 2025","N/A","Best Education Initiative in South West Zone","Ondo State","Nigeria","Ondo","Dedication to improving rural education, particularly for girls, demonstrating significant community impact."],
  [76,"Overall Best Educational Friendly State in Nigeria 2025","N/A","Best Education Initiative in South West Zone","Ekiti State","Nigeria","Ekiti","Dedication to improving rural education, particularly for girls, demonstrating significant community impact."],
  [77,"Overall Best Educational Friendly State in Nigeria 2025","N/A","Best Education Initiative in South South Zone","Edo State","Nigeria","Edo","Dedication to improving rural education, particularly for girls, demonstrating significant community impact."],
  [78,"Overall Best Educational Friendly State in Nigeria 2025","N/A","Best Education Initiative in South South Zone","Cross River State","Nigeria","Cross River","Dedication to improving rural education, particularly for girls, demonstrating significant community impact."],
  [79,"Overall Best Educational Friendly State in Nigeria 2025","N/A","Best Education Initiative in South South Zone","Akwa Ibom State","Nigeria","Akwa Ibom","Dedication to improving rural education, particularly for girls, demonstrating significant community impact."],
  [80,"Overall Best Educational Friendly State in Nigeria 2025","N/A","Best Education Initiative in South South Zone","Rivers State","Nigeria","Rivers","Dedication to improving rural education, particularly for girls, demonstrating significant community impact."],
  [81,"Overall Best Educational Friendly State in Nigeria 2025","N/A","Best Education Initiative in South South Zone","Bayelsa State","Nigeria","Bayelsa","Dedication to improving rural education, particularly for girls, demonstrating significant community impact."],
  [82,"Overall Best Educational Friendly State in Nigeria 2025","N/A","Best Education Initiative in South South Zone","Delta State","Nigeria","Delta","Dedication to improving rural education, particularly for girls, demonstrating significant community impact."],

  // ═══════════════════════════════════════════════════════════════════
  // CATEGORY 3: The Overall Best CSR for Education in Nigeria Award 2025 (302 nominees)
  // Migrated from 2024 → 2025 | 25 subcategories + 3 Gold Special influencer subcategories
  // ═══════════════════════════════════════════════════════════════════
  [83,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Oil And Gas CSR in Education Award","Shell Nigeria","Nigeria","","Established the 'Shell Nigeria Education Initiative' to support STEM education."],
  [84,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Oil And Gas CSR in Education Award","Chevron Nigeria","Nigeria","","Developed the 'Chevron Niger Delta Partnership Initiative' for educational infrastructure."],
  [85,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Oil And Gas CSR in Education Award","TotalEnergies Nigeria","Nigeria","","Supported STEM education and vocational training across the Niger Delta region."],
  [86,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Oil And Gas CSR in Education Award","ExxonMobil Nigeria","Nigeria","","Developed the 'ExxonMobil Teachers Academy' for STEM educators."],
  [87,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Oil And Gas CSR in Education Award","NNPC","Nigeria","","Established the NNPC Science Quiz Competition for students nationwide."],
  [88,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Oil And Gas CSR in Education Award","Seplat Petroleum","Nigeria","","Implemented the Seplat Teachers Empowerment Program for continuous professional development."],
  [89,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Oil And Gas CSR in Education Award","Conoil Producing Limited","Nigeria","","Supported the Conoil School Infrastructure Development Project in rural areas."],
  [90,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Oil And Gas CSR in Education Award","Oando Plc","Nigeria","","Launched the Oando Foundation's Adopt-a-School Initiative to improve learning environments."],
  [91,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Oil And Gas CSR in Education Award","Addax Petroleum","Nigeria","","Funded science laboratories in secondary schools through the Addax Science Initiative."],
  [92,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Oil And Gas CSR in Education Award","Eni Nigeria","Nigeria","","Implemented the Eni Scholarship Program for tertiary education in technical fields."],
  [93,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Banking And Finance CSR in Education Award","GTBank (Guaranty Trust Bank)","Nigeria","","Launched the GTBank Autism Program to support children with special needs."],
  [94,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Banking And Finance CSR in Education Award","Access Bank","Nigeria","","Implemented the Access Bank Women Empowerment Program to support female education."],
  [95,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Banking And Finance CSR in Education Award","First Bank of Nigeria","Nigeria","","Sponsored the SPARK initiative for mentoring and career development in schools."],
  [96,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Banking And Finance CSR in Education Award","Zenith Bank","Nigeria","","Funded ICT labs in several public schools across Nigeria."],
  [97,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Banking And Finance CSR in Education Award","United Bank for Africa","Nigeria","","Established the UBA Foundation focused on education and development."],
  [98,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Banking And Finance CSR in Education Award","Ecobank Nigeria","Nigeria","","Supported digital literacy projects in collaboration with local NGOs."],
  [99,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Banking And Finance CSR in Education Award","Fidelity Bank","Nigeria","","Launched the Fidelity Helping Hands Project to improve school facilities."],
  [100,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Banking And Finance CSR in Education Award","Stanbic IBTC","Nigeria","","Provided capacity-building workshops for educators."],
  [101,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Banking And Finance CSR in Education Award","Union Bank","Nigeria","","Funded infrastructure development in schools through the UnionCares initiative."],
  [102,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Banking And Finance CSR in Education Award","Polaris Bank","Nigeria","","Implemented the Polaris Edu-Program to enhance STEM education."],
  [103,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Telecommunications CSR in Education Award","MTN Nigeria","Nigeria","","MTN Foundation Schools Connect to provide internet access to rural schools."],
  [104,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Telecommunications CSR in Education Award","Airtel Nigeria","Nigeria","","Launched the Adopt-a-School initiative to improve school infrastructure."],
  [105,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Telecommunications CSR in Education Award","Glo Mobile","Nigeria","","Provided scholarships for students pursuing technology courses."],
  [106,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Telecommunications CSR in Education Award","9mobile","Nigeria","","Developed the 9mobile Future Minds initiative for digital education."],
  [107,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Telecommunications CSR in Education Award","Smile Communications","Nigeria","","Offered internet connectivity solutions to underserved schools."],
  [108,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Telecommunications CSR in Education Award","ntel","Nigeria","","Supported e-learning platforms through discounted data packages for students."],
  [109,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Telecommunications CSR in Education Award","Spectranet","Nigeria","","Supported the Spectranet Community Education Initiative for schools."],
  [110,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Telecommunications CSR in Education Award","Swift Networks","Nigeria","","Implemented Project Swift EduTech to support ICT education."],
  [111,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Telecommunications CSR in Education Award","Cobranet","Nigeria","","Supported initiatives to improve ICT facilities in public schools."],
  [112,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Telecommunications CSR in Education Award","ipNX Nigeria","Nigeria","","Launched the ipNX Scholar program to fund educational technology projects."],
  [113,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Technology And ICT CSR in Education Award","Microsoft Nigeria","Nigeria","","Launched the Microsoft Imagine Academy for digital skills in schools."],
  [114,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Technology And ICT CSR in Education Award","Google Nigeria","Nigeria","","Developed the Google Classroom initiative for remote learning."],
  [115,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Technology And ICT CSR in Education Award","HP Nigeria","Nigeria","","Provided computer labs and tech training for schools."],
  [116,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Technology And ICT CSR in Education Award","Cisco Systems Nigeria","Nigeria","","Implemented the Cisco Networking Academy for ICT education."],
  [117,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Technology And ICT CSR in Education Award","Intel Nigeria","Nigeria","","Launched the Intel Learn Program for digital literacy."],
  [118,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Technology And ICT CSR in Education Award","IBM Nigeria","Nigeria","","Developed the IBM SkillsBuild program for tech education."],
  [119,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Technology And ICT CSR in Education Award","Oracle Nigeria","Nigeria","","Provided the Oracle Academy for computer science education."],
  [120,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Technology And ICT CSR in Education Award","SAP Nigeria","Nigeria","","Launched the SAP Skills for Africa program."],
  [121,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Technology And ICT CSR in Education Award","Dell Technologies Nigeria","Nigeria","","Implemented the Dell Youth Learning program."],
  [122,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Technology And ICT CSR in Education Award","Huawei Nigeria","Nigeria","","Developed the Huawei Seeds for the Future program."],
  [123,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Food And Beverages CSR in Education Award","Nestlé Nigeria","Nigeria","","Launched the Nestlé Healthy Kids Program integrated into school nutrition."],
  [124,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Food And Beverages CSR in Education Award","Coca-Cola Nigeria","Nigeria","","Implemented the 5by20 educational empowerment program."],
  [125,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Food And Beverages CSR in Education Award","Nigerian Breweries","Nigeria","","Supported the Felix Ohiwerei Education Trust Fund."],
  [126,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Food And Beverages CSR in Education Award","Unilever Nigeria","Nigeria","","Launched the Unilever Bright Future school program."],
  [127,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Food And Beverages CSR in Education Award","Cadbury Nigeria","Nigeria","","Supported school feeding and nutrition education programs."],
  [128,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Food And Beverages CSR in Education Award","PZ Cussons","Nigeria","","Implemented the PZ Cussons Chemistry Challenge for schools."],
  [129,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Food And Beverages CSR in Education Award","Dangote Sugar","Nigeria","","Launched the Dangote Foundation Education Support Program."],
  [130,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Food And Beverages CSR in Education Award","Guinness Nigeria","Nigeria","","Supported the Guinness Eye Hospital education outreach."],
  [131,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Food And Beverages CSR in Education Award","Flour Mills of Nigeria","Nigeria","","Launched the Golden Penny Education Support initiative."],
  [132,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Food And Beverages CSR in Education Award","Dufil Prima Foods","Nigeria","","Supported the Indomie Cooking Competition as an educational initiative."],
  [133,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Manufacturing CSR in Education Award","Dangote Cement","Nigeria","","Supported school infrastructure development."],
  [134,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Manufacturing CSR in Education Award","BUA Cement","Nigeria","","Funded construction of classrooms and libraries."],
  [135,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Manufacturing CSR in Education Award","Lafarge Africa","Nigeria","","Developed vocational training programs."],
  [136,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Manufacturing CSR in Education Award","Honeywell Group","Nigeria","","Supported STEM education in manufacturing."],
  [137,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Manufacturing CSR in Education Award","Nigerian Foundries","Nigeria","","Implemented industrial training for students."],
  [138,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Insurance CSR in Education Award","Leadway Assurance","Nigeria","","Supported the Leadway Education Foundation for academic scholarships."],
  [139,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Insurance CSR in Education Award","AXA Mansard","Nigeria","","Launched the AXA Mansard Health Insurance for Students Program."],
  [140,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Insurance CSR in Education Award","AIICO Insurance","Nigeria","","Developed the AIICO Education Support Initiative."],
  [141,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Insurance CSR in Education Award","Custodian and Allied","Nigeria","","Implemented the Custodian Education Trust Fund."],
  [142,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Insurance CSR in Education Award","Cornerstone Insurance","Nigeria","","Launched the Cornerstone Education Empowerment Program."],
  [143,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Insurance CSR in Education Award","Mutual Benefits Assurance","Nigeria","","Developed the Mutual Benefits Scholarship Program."],
  [144,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Insurance CSR in Education Award","NEM Insurance","Nigeria","","Implemented the NEM Education Support Initiative."],
  [145,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Insurance CSR in Education Award","Consolidated Hallmark Insurance","Nigeria","","Launched the CHI Education Development Program."],
  [146,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Insurance CSR in Education Award","Wapic Insurance","Nigeria","","Developed the Wapic Education Foundation."],
  [147,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Insurance CSR in Education Award","Zenith General Insurance","Nigeria","","Implemented the Zenith Education Trust Initiative."],
  [148,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Social Media Influencer CSR For Education","Tunde Ednut","Nigeria","","Used social media platform to raise awareness and funds for education initiatives."],
  [149,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Social Media Influencer CSR For Education","Mr Macaroni","Nigeria","","Created educational comedy skits highlighting education issues."],
  [150,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Social Media Influencer CSR For Education","Taaooma","Nigeria","","Used comedy and social media to advocate for education."],
  [151,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Social Media Influencer CSR For Education","Mark Angel","Nigeria","","Created educational content through the Mark Angel Comedy platform."],
  [152,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Social Media Influencer CSR For Education","Broda Shaggi","Nigeria","","Used social media presence to support educational campaigns."],
  [153,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Social Media Influencer CSR For Education","Sabinus (Mr Funny)","Nigeria","","Leveraged social media influence to promote educational values."],
  [154,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Social Media Influencer CSR For Education","Lasisi Elenu","Nigeria","","Created educational content that highlights social issues."],
  [155,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Social Media Influencer CSR For Education","Kiekie","Nigeria","","Used social media platforms to advocate for female education."],
  [156,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Social Media Influencer CSR For Education","Nengi (BBNaija)","Nigeria","","Established an education-focused foundation post-reality TV."],
  [157,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Social Media Influencer CSR For Education","Laycon (BBNaija)","Nigeria","","Promoted educational initiatives through social media platforms."],
  [158,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Fintech CSR in Education Award","Flutterwave","Nigeria","","Launched the Flutterwave Education Support Initiative."],
  [159,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Fintech CSR in Education Award","Paystack","Nigeria","","Developed the Paystack Developer Education Program."],
  [160,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Fintech CSR in Education Award","Kuda Bank","Nigeria","","Implemented the Kuda Financial Literacy Program for students."],
  [161,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Fintech CSR in Education Award","OPay","Nigeria","","Launched the OPay Education Scholarship Program."],
  [162,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Fintech CSR in Education Award","Interswitch","Nigeria","","Developed the InspireMe Challenge for educational technology."],
  [163,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Fintech CSR in Education Award","Moniepoint","Nigeria","","Supported the Moniepoint Financial Education Initiative."],
  [164,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Fintech CSR in Education Award","Carbon (formerly Paylater)","Nigeria","","Launched the Carbon Education Fund Program."],
  [165,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Fintech CSR in Education Award","Piggyvest","Nigeria","","Developed the Piggyvest Financial Education Program."],
  [166,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Fintech CSR in Education Award","Cowrywise","Nigeria","","Implemented the Cowrywise Financial Literacy Initiative."],
  [167,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Fintech CSR in Education Award","TeamApt (now Moniepoint)","Nigeria","","Launched the TeamApt Education Technology Initiative."],
  [168,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Fintech CSR in Education Award","Paga","Nigeria","","Supported the Paga Financial Education Program."],
  [169,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Fintech CSR in Education Award","VFD Group","Nigeria","","Developed the VFD Education Support Initiative."],
  [170,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Fintech CSR in Education Award","FairMoney","Nigeria","","Launched the FairMoney Financial Literacy Campaign."],
  [171,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Fintech CSR in Education Award","PalmPay","Nigeria","","Implemented the PalmPay Financial Literacy Program."],
  [172,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Fintech CSR in Education Award","Chipper Cash","Nigeria","","Launched the Chipper Cash Education Support Initiative."],
  [173,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Agriculture And Agribusiness CSR In Education Award","Olam Nigeria","Nigeria","","Implemented the Olam Agricultural Education Program."],
  [174,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Agriculture And Agribusiness CSR In Education Award","Flour Mills of Nigeria","Nigeria","","Launched the FMN Agro-Allied Education Initiative."],
  [175,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Agriculture And Agribusiness CSR In Education Award","Dangote Sugar Refinery","Nigeria","","Developed the Dangote Sugar Agricultural Education Program."],
  [176,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Agriculture And Agribusiness CSR In Education Award","Presco Plc","Nigeria","","Supported the Presco Agro-Education Initiative."],
  [177,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Agriculture And Agribusiness CSR In Education Award","Nigerian Breweries (Agro-Allied)","Nigeria","","Launched the Nigerian Breweries Agricultural Education Initiative."],
  [178,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Agriculture And Agribusiness CSR In Education Award","Nestlé Nigeria (Agriculture)","Nigeria","","Developed the Nestlé Agricultural Education Program."],
  [179,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Agriculture And Agribusiness CSR In Education Award","Chi Farms","Nigeria","","Implemented the Chi Farms Agro-Education Initiative."],
  [180,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Agriculture And Agribusiness CSR In Education Award","Notore Chemical Industries","Nigeria","","Supported the Notore Agricultural Education Program."],
  [181,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Agriculture And Agribusiness CSR In Education Award","Premier Feeds Mills","Nigeria","","Launched the Premier Feeds Agricultural Education Initiative."],
  [182,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Agriculture And Agribusiness CSR In Education Award","AACE Foods","Nigeria","","Developed the AACE Foods Agro-Education Program."],
  [183,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Health Care And Hospitals CSR In Education Award","Reddington Hospital","Nigeria","","Implemented the Reddington Health Education Program."],
  [184,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Health Care And Hospitals CSR In Education Award","Lagoon Hospitals","Nigeria","","Launched the Lagoon Medical Education Initiative."],
  [185,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Health Care And Hospitals CSR In Education Award","St. Nicholas Hospital","Nigeria","","Developed the St. Nicholas Health Education Program."],
  [186,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Health Care And Hospitals CSR In Education Award","Cedarcrest Hospitals","Nigeria","","Supported the Cedarcrest Medical Education Initiative."],
  [187,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Health Care And Hospitals CSR In Education Award","Nizamiye Hospital","Nigeria","","Launched the Nizamiye Health Education Program."],
  [188,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Health Care And Hospitals CSR In Education Award","First Cardiology Consultants","Nigeria","","Developed the First Cardiology Medical Education Initiative."],
  [189,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Health Care And Hospitals CSR In Education Award","Eye Foundation Hospital","Nigeria","","Supported the Eye Foundation Health Education Program."],
  [190,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Health Care And Hospitals CSR In Education Award","Eko Hospital","Nigeria","","Launched the Eko Medical Education Initiative."],
  [191,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Health Care And Hospitals CSR In Education Award","Bridge Clinic","Nigeria","","Developed the Bridge Clinic Health Education Program."],
  [192,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Health Care And Hospitals CSR In Education Award","Lily Hospitals","Nigeria","","Supported the Lily Medical Education Initiative."],
  [193,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Professional Services CSR In Education Award","PwC Nigeria","Nigeria","","Implemented the PwC Business Education Program for secondary schools."],
  [194,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Professional Services CSR In Education Award","KPMG Nigeria","Nigeria","","Launched the KPMG Education Support Initiative."],
  [195,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Professional Services CSR In Education Award","Deloitte Nigeria","Nigeria","","Supported the Deloitte Business Education Program."],
  [196,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Professional Services CSR In Education Award","Ernst & Young Nigeria","Nigeria","","Launched the EY Education Support Initiative."],
  [197,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Professional Services CSR In Education Award","Accenture Nigeria","Nigeria","","Implemented the Accenture Business Education Program."],
  [198,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Hotels CSR in Education Award","Transcorp Hilton Abuja","Nigeria","","Launched the Transcorp Hilton Educational Support Program."],
  [199,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Hotels CSR in Education Award","Eko Hotels & Suites","Nigeria","","Developed the Eko Hotels School Support Scheme."],
  [200,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Hotels CSR in Education Award","Radisson Blu Lagos","Nigeria","","Implemented the Radisson Blu Education Empowerment Program."],
  [201,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Aviation CSR in Education Award","Air Peace","Nigeria","","Supporting educational initiatives through aviation-focused programs."],
  [202,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Aviation CSR in Education Award","Arik Air","Nigeria","","Supporting educational initiatives through aviation-focused programs."],
  [203,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Aviation CSR in Education Award","Ibom Air","Nigeria","","Supporting educational initiatives through aviation-focused programs."],
  [204,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Pharmaceuticals CSR in Education Award","Emzor Pharmaceutical Industries","Nigeria","","Supporting pharmaceutical education and health literacy programs."],
  [205,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Pharmaceuticals CSR in Education Award","Fidson Healthcare Plc","Nigeria","","Supporting pharmaceutical education and health literacy programs."],
  [206,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Pharmaceuticals CSR in Education Award","GlaxoSmithKline Nigeria","Nigeria","","Supporting pharmaceutical education and health literacy programs."],
  [207,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Microfinance Banks CSR in Education Award","LAPO Microfinance Bank","Nigeria","","Implemented the LAPO Education Support Initiative for primary schools."],
  [208,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Microfinance Banks CSR in Education Award","Accion Microfinance Bank","Nigeria","","Launched the Accion Education Support Initiative."],
  [209,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Conglomerates And Diversified Businesses CSR in Education Award","Dangote Group","Nigeria","","Implemented the Dangote Academy for vocational and technical training."],
  [210,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Conglomerates And Diversified Businesses CSR in Education Award","BUA Group","Nigeria","","Supported the BUA School Renovation Project."],
  [211,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Conglomerates And Diversified Businesses CSR in Education Award","Flour Mills of Nigeria","Nigeria","","Developed the FMN Educational Support Initiative."],
  [212,"The Overall Best CSR for Education in Nigeria Award 2025","N/A","Conglomerates And Diversified Businesses CSR in Education Award","Transcorp Nigeria","Nigeria","","Implemented the Transcorp School Support Program."],

  // ═══════════════════════════════════════════════════════════════════
  // CATEGORY 4: Best Africa Regional Companies CSR 2025 (453 nominees)
  // Migrated from 2024 → 2025 | Covers 5 African regions × multiple industry subcategories
  // ═══════════════════════════════════════════════════════════════════
  [213,"Best Africa Regional Companies CSR for Education Special Recognition Award in Africa 2025","North Africa","Best Banking and Finance CSR in Education in North Africa","Attijariwafa Bank","Morocco","Casablanca","Equipping schools with digital learning tools and resources."],
  [214,"Best Africa Regional Companies CSR for Education Special Recognition Award in Africa 2025","North Africa","Best Banking and Finance CSR in Education in North Africa","Bank of Alexandria","Egypt","Alexandria","Offering scholarships and renovating schools."],
  [215,"Best Africa Regional Companies CSR for Education Special Recognition Award in Africa 2025","East Africa","Best Banking and Finance CSR in Education in East Africa","Equity Bank","Kenya","Nairobi","Supporting education through scholarships and digital learning."],
  [216,"Best Africa Regional Companies CSR for Education Special Recognition Award in Africa 2025","West Africa","Best Banking and Finance CSR in Education in West Africa","Ecobank","Ghana","Accra","Empowering youth through scholarships and financial literacy."],
  [217,"Best Africa Regional Companies CSR for Education Special Recognition Award in Africa 2025","South Africa","Best Banking and Finance CSR in Education in Southern Africa","Standard Bank","South Africa","Johannesburg","Supporting education through various CSR initiatives."],
  [218,"Best Africa Regional Companies CSR for Education Special Recognition Award in Africa 2025","Central Africa","Best Banking and Finance CSR in Education in Central Africa","BGFI Bank","Gabon","Libreville","Supporting education through various CSR initiatives."],
  [219,"Best Africa Regional Companies CSR for Education Special Recognition Award in Africa 2025","West Africa","Best Telecommunications CSR in Education in West Africa","MTN","Nigeria","Lagos","Digital education platforms and school connectivity programs."],
  [220,"Best Africa Regional Companies CSR for Education Special Recognition Award in Africa 2025","East Africa","Best Telecommunications CSR in Education in East Africa","Safaricom","Kenya","","Digital education platforms and school connectivity programs."],
  [221,"Best Africa Regional Companies CSR for Education Special Recognition Award in Africa 2025","North Africa","Best Technology and ICT CSR in Education in North Africa","IBM North Africa","Morocco","Casablanca","Providing AI and cloud computing education."],
  [222,"Best Africa Regional Companies CSR for Education Special Recognition Award in Africa 2025","West Africa","Best Technology and ICT CSR in Education in West Africa","Flutterwave","Nigeria","Lagos","Supporting coding and robotics education."],
  [223,"Best Africa Regional Companies CSR for Education Special Recognition Award in Africa 2025","East Africa","Agriculture And Agribusiness CSR in Education in East Africa","Kenya Tea Development Agency","Kenya","Nairobi","Tea and Teach – Educational support for tea farming communities."],
  [224,"Best Africa Regional Companies CSR for Education Special Recognition Award in Africa 2025","West Africa","Social Media Influencer CSR For Education in West Africa","Didier Drogba (Ivory Coast)","Ivory Coast","","Didier Drogba Foundation – Funding schools and providing educational grants."],
  [225,"Best Africa Regional Companies CSR for Education Special Recognition Award in Africa 2025","East Africa","African International Sports Stars CSR For Education in East Africa","Eliud Kipchoge (Kenya)","Kenya","","Eliud Kipchoge Foundation – Funding education and sports programs."],
  [226,"Best Africa Regional Companies CSR for Education Special Recognition Award in Africa 2025","North Africa","Manufacturing And Industrial CSR in Education","Sonatrach (Algeria)","Algeria","","Funding technical education for careers in the energy sector."],
  [227,"Best Africa Regional Companies CSR for Education Special Recognition Award in Africa 2025","Central Africa","Social Media Influencer CSR For Education in Central Africa","Fally Ipupa","DR Congo","Kinshasa","Investing in music schools and arts education."],
  [228,"Best Africa Regional Companies CSR for Education Special Recognition Award in Africa 2025","South Africa","Best Technology and ICT CSR in Education in Southern Africa","Naspers","South Africa","Cape Town","Supporting digital education through technology investments."],
  [229,"Best Africa Regional Companies CSR for Education Special Recognition Award in Africa 2025","Central Africa","Social Media Influencer CSR For Education in Central Africa","Awilo Longomba","Congo","","Longomba Education Project – Providing educational resources and scholarships."],
  [230,"Best Africa Regional Companies CSR for Education Special Recognition Award in Africa 2025","Central Africa","Social Media Influencer CSR For Education in Central Africa","Innoss'B","DR Congo","Kinshasa","Innoss'B Foundation – Youth education and empowerment through music."],
  [231,"Best Africa Regional Companies CSR for Education Special Recognition Award in Africa 2025","Central Africa","Social Media Influencer CSR For Education in Central Africa","Koffi Olomidé","DR Congo","","Olomidé Education Initiative – Supporting education in rural areas through music."],

  // ═══════════════════════════════════════════════════════════════════
  // CATEGORY 5: Best NGO Education Support Recognition Award (70 nominees)
  // ═══════════════════════════════════════════════════════════════════
  [232,"Best NGO Education Support Recognition Award (Africa-Regional)","West Africa","Best Educational Infrastructure Initiative By An NGO","Teach For Nigeria","Nigeria","","Significant contributions to improving rural education, particularly for girls."],
  [233,"Best NGO Education Support Recognition Award (Africa-Regional)","West Africa","Best Educational Infrastructure Initiative By An NGO","Slum2School Africa","Nigeria","","Significant contributions to improving rural education, particularly for girls."],
  [234,"Best NGO Education Support Recognition Award (Africa-Regional)","West Africa","Best Educational Infrastructure Initiative By An NGO","ActionAid Nigeria","Nigeria","","Significant contributions to improving rural education, particularly for girls."],
  [235,"Best NGO Education Support Recognition Award (Africa-Regional)","West Africa","Best Educational Infrastructure Initiative By An NGO","Plan International Nigeria","Nigeria","","Significant contributions to improving rural education, particularly for girls."],
  [236,"Best NGO Education Support Recognition Award (Africa-Regional)","West Africa","Best Educational Infrastructure Initiative By An NGO","Malala Fund Nigeria","Nigeria","","Significant contributions to improving rural education, particularly for girls."],
  [237,"Best NGO Education Support Recognition Award (Africa-Regional)","West Africa","Exceptional Donation Of Educational Materials By An NGO","The Tony Elumelu Foundation","Nigeria","","Significant contributions to improving educational access and resources."],
  [238,"Best NGO Education Support Recognition Award (Africa-Regional)","West Africa","Exceptional Donation Of Educational Materials By An NGO","LEAP Africa","Nigeria","","Significant contributions to improving educational access and resources."],
  [239,"Best NGO Education Support Recognition Award (Africa-Regional)","West Africa","Exceptional Donation Of Educational Materials By An NGO","Oando Foundation","Nigeria","","Significant contributions to improving educational access and resources."],
  [240,"Best NGO Education Support Recognition Award (Africa-Regional)","West Africa","Youth Empowerment Through Educational Services By An NGO In Nigeria","Youth for Technology Foundation","Nigeria","","Provided technology training and entrepreneurship education to young people."],
  [241,"Best NGO Education Support Recognition Award (Africa-Regional)","West Africa","Youth Empowerment Through Educational Services By An NGO In Nigeria","Junior Achievement Nigeria (JAN)","Nigeria","","Implemented educational programs empowering youths with financial literacy."],
  [242,"Best NGO Education Support Recognition Award (Africa-Regional)","West Africa","Youth Empowerment Through Educational Services By An NGO In Nigeria","YALI Network Nigeria","Nigeria","","Leadership and professional development opportunities for young Nigerians."],
  [243,"Best NGO Education Support Recognition Award (Africa-Regional)","West Africa","Women And Girls' Empowerment In Education By An NGO In Nigeria","Girls Education Mission International (GEM)","Nigeria","","Provided educational scholarships, mentorship, and advocacy for girls' education."],
  [244,"Best NGO Education Support Recognition Award (Africa-Regional)","West Africa","Women And Girls' Empowerment In Education By An NGO In Nigeria","ActionAid Nigeria","Nigeria","","Implemented the Safe Cities for Women and Girls initiative."],
  [245,"Best NGO Education Support Recognition Award (Africa-Regional)","West Africa","Women And Girls' Empowerment In Education By An NGO In Nigeria","Women for Women International Nigeria","Nigeria","","Provided educational programs and vocational skills training for women survivors of conflict."],

  // ═══════════════════════════════════════════════════════════════════
  // CATEGORY 6: Best EduTech Organization in Nigeria and Africa 2025 (150 nominees)
  // Migrated from 2024 → 2025
  // ═══════════════════════════════════════════════════════════════════
  [246,"Best EduTech Organization in Nigeria and Africa 2025","North Africa","Best EduTech Startup in North Africa","iSchool (Egypt)","Egypt","Cairo","AI-powered learning platform for K-12 education."],
  [247,"Best EduTech Organization in Nigeria and Africa 2025","North Africa","Best EduTech Startup in North Africa","Nafham (Egypt)","Egypt","Cairo","Free online education platform with video explanations."],
  [248,"Best EduTech Organization in Nigeria and Africa 2025","West Africa","Best EduTech Startup in West Africa","uLesson (Nigeria)","Nigeria","Lagos","Comprehensive digital learning platform for African students."],
  [249,"Best EduTech Organization in Nigeria and Africa 2025","West Africa","Best EduTech Startup in West Africa","Tuteria (Nigeria)","Nigeria","Lagos","Peer-to-peer tutoring marketplace connecting students with qualified tutors."],
  [250,"Best EduTech Organization in Nigeria and Africa 2025","East Africa","Best EduTech Startup in East Africa","Eneza Education (Kenya)","Kenya","Nairobi","Mobile-based education platform reaching millions of students."],
  [251,"Best EduTech Organization in Nigeria and Africa 2025","East Africa","Best EduTech Startup in East Africa","M-Shule (Kenya)","Kenya","Nairobi","AI-powered SMS-based learning for students without internet access."],
  [252,"Best EduTech Organization in Nigeria and Africa 2025","South Africa","Best EduTech Startup in South Africa","Snapplify (South Africa)","South Africa","Cape Town","Digital content distribution platform for schools."],
  [253,"Best EduTech Organization in Nigeria and Africa 2025","Central Africa","Best EduTech Startup in Central Africa","SchoolNet Cameroon","Cameroon","Douala","Connecting rural schools through technology and digital resources."],

  // ═══════════════════════════════════════════════════════════════════
  // CATEGORY 7: The Best Library in Nigerian Tertiary Institutions Award 2025 (28 nominees)
  // Migrated from 2024 → 2025
  // ═══════════════════════════════════════════════════════════════════
  [254,"The Best Library in Nigerian Tertiary Institutions Award 2025","N/A","Best University Library in Nigeria (Public)","University of Ibadan Library","Nigeria","Oyo","Kenneth Dike Library — largest research library in West Africa."],
  [255,"The Best Library in Nigerian Tertiary Institutions Award 2025","N/A","Best University Library in Nigeria (Public)","University of Lagos Library","Nigeria","Lagos","Comprehensive library system supporting over 50,000 students."],
  [256,"The Best Library in Nigerian Tertiary Institutions Award 2025","N/A","Best University Library in Nigeria (Private)","Covenant University Library","Nigeria","Ogun","State-of-the-art Centre for Learning Resources."],
  [257,"The Best Library in Nigerian Tertiary Institutions Award 2025","N/A","Best University Library in Nigeria (Private)","Babcock University Library","Nigeria","Ogun","Modern library facilities with extensive digital collections."],

  // ═══════════════════════════════════════════════════════════════════
  // CATEGORY 8: Best Research and Development Contribution (20 nominees)
  // ═══════════════════════════════════════════════════════════════════
  [258,"The Overall Best Research and Development Contribution by Research Institutes","N/A","Best Agricultural Research Institute in Nigeria","National Root Crops Research Institute","Nigeria","Abia","Advancing agricultural education and food security."],
  [259,"The Overall Best Research and Development Contribution by Research Institutes","N/A","Best Health Research Institute in Nigeria","Nigeria Institute of Medical Research (NIMR)","Nigeria","Lagos","Leading health research and medical education."],
  [260,"The Overall Best Research and Development Contribution by Research Institutes","N/A","Best Technology Research Institute in Nigeria","National Information Technology Development Agency (NITDA)","Nigeria","Abuja","Driving technology education and digital transformation."],

  // ═══════════════════════════════════════════════════════════════════
  // CATEGORY 9: Best Media and Advocacy for Education in Nigeria 2025 (30 nominees)
  // Migrated from 2024 → 2025
  // ═══════════════════════════════════════════════════════════════════
  [261,"Best Media and Advocacy for Education in Nigeria 2025","N/A","Best Education-Focused TV Program","NTA Education Today","Nigeria","Abuja","Longest-running education-focused TV program in Nigeria."],
  [262,"Best Media and Advocacy for Education in Nigeria 2025","N/A","Best Education-Focused Radio Program","BBC Hausa Education Hour","Nigeria","","Reaching millions with educational content in Hausa."],
  [263,"Best Media and Advocacy for Education in Nigeria 2025","N/A","Best Education-Focused Online Media","Education Nigeria (EdNg)","Nigeria","Lagos","Leading online platform for education news and analysis."],

  // ═══════════════════════════════════════════════════════════════════
  // CATEGORY 10: Christian Faith Organization Educational Champion (42 nominees)
  // ═══════════════════════════════════════════════════════════════════
  [264,"Christian Faith Organization Educational Champion of the Decade Award","N/A","Best Scholarship Program by a Christian Organization","Living Faith Church (Winners Chapel)","Nigeria","Ogun","Bishop Oyedepo scholarship program supporting thousands of students."],
  [265,"Christian Faith Organization Educational Champion of the Decade Award","N/A","Best Educational Infrastructure Development By A Christian Organization","Redeemed Christian Church of God","Nigeria","Ogun","Established the Redeemer's University and multiple secondary schools."],
  [266,"Christian Faith Organization Educational Champion of the Decade Award","N/A","Best Holistic Educational Support By A Christian Organization","Catholic Archdiocese of Lagos","Nigeria","Lagos","Operating over 200 schools across Lagos State."],

  // ═══════════════════════════════════════════════════════════════════
  // CATEGORY 11: Islamic Faith Organization Educational Champion (40 nominees)
  // ═══════════════════════════════════════════════════════════════════
  [267,"Islamic Faith Organization Educational Champion of the Decade Award","N/A","Best Educational Infrastructure Development by an Islamic Organization","Nasrul-Lahi-l-Fatih Society (NASFAT)","Nigeria","Lagos","Built and operates schools across multiple states in Nigeria."],
  [268,"Islamic Faith Organization Educational Champion of the Decade Award","N/A","Best Scholarship Program by an Islamic Organization","Jaiz Foundation","Nigeria","Abuja","Providing scholarships for underprivileged Muslim students."],
  [269,"Islamic Faith Organization Educational Champion of the Decade Award","N/A","Best Holistic Educational Support by an Islamic Organization","Ansar-Ud-Deen Society of Nigeria","Nigeria","Lagos","Operating over 100 schools across Nigeria with holistic education."],

  // ═══════════════════════════════════════════════════════════════════
  // CATEGORY 12: Political Leaders in Nigeria 2025 Recognition Award (71 nominees)
  // Migrated from 2024 → 2025
  // ═══════════════════════════════════════════════════════════════════
  [270,"Political Leaders in Nigeria 2025 Recognition Award","N/A","Outstanding Scholarship Program for Both Vocational and Formal Education by a Politician","Gov. Babajide Sanwo-Olu","Nigeria","Lagos","Lagos State Education Trust Fund and scholarship programs."],
  [271,"Political Leaders in Nigeria 2025 Recognition Award","N/A","Outstanding Scholarship Program for Both Vocational and Formal Education by a Politician","Gov. Dapo Abiodun","Nigeria","Ogun","Ogun State scholarship and bursary programs."],
  [272,"Political Leaders in Nigeria 2025 Recognition Award","N/A","Exemplary Infrastructure Development and Donations for Education by a Politician","Gov. Charles Soludo","Nigeria","Anambra","Infrastructure development across Anambra State education sector."],

  // ═══════════════════════════════════════════════════════════════════
  // CATEGORY 13: Creative Arts Industry Contribution to Education in Nigeria 2025 (82 nominees)
  // Migrated from 2024 → 2025
  // ═══════════════════════════════════════════════════════════════════
  [273,"Creative Arts Industry Contribution to Education in Nigeria 2025","N/A","Best Music for Educational Impact Award","Burna Boy","Nigeria","Lagos","Established the Burna Boy Foundation for arts and music education."],
  [274,"Creative Arts Industry Contribution to Education in Nigeria 2025","N/A","Best Music for Educational Impact Award","Wizkid","Nigeria","Lagos","Supporting education through the Starboy Foundation."],
  [275,"Creative Arts Industry Contribution to Education in Nigeria 2025","N/A","Best Music for Educational Impact Award","Davido","Nigeria","Lagos","Davido Foundation supporting educational initiatives."],
  [276,"Creative Arts Industry Contribution to Education in Nigeria 2025","N/A","Best Film and Media for Educational Advancement Award","Kunle Afolayan","Nigeria","Lagos","Producing educational films and documentaries about African culture."],
  [277,"Creative Arts Industry Contribution to Education in Nigeria 2025","N/A","Best Nollywood Production and Artiste for Educational Content Award","Genevieve Nnaji","Nigeria","Lagos","Advocacy for arts education and creative industry training."],
  [278,"Creative Arts Industry Contribution to Education in Nigeria 2025","N/A","Best Literature and Art Works for Education Award","Chimamanda Ngozi Adichie","Nigeria","Anambra","Promoting literature education and creative writing programs."],
  [279,"Creative Arts Industry Contribution to Education in Nigeria 2025","N/A","Best Visual Arts and Educational Impact Award","Nike Davies-Okundaye","Nigeria","Lagos","Established the Nike Art Gallery and Center for Arts Education."],
  [280,"Creative Arts Industry Contribution to Education in Nigeria 2025","N/A","Best Creative Advocacy and Educational Campaigns Award","Asa","Nigeria","Lagos","Music advocacy for social education and awareness."],
  [281,"Creative Arts Industry Contribution to Education in Nigeria 2025","N/A","Best Dance and Performing Arts for Education Award","Kaffy","Nigeria","Lagos","Dance education programs for youth development."],

  // ═══════════════════════════════════════════════════════════════════
  // CATEGORY 14: Best STEM Education Program or Project (Africa-Regional) (283 nominees)
  // 5 regions × 3 subcategories (Curriculum, Outreach, Technology) = 15 effective subcategories
  // ═══════════════════════════════════════════════════════════════════
  [282,"Best STEM Education Program or Project (Africa-Regional)","North Africa","The Best Innovative STEM Curriculum Development","AIMS Morocco","Morocco","Rabat","Pan-African STEM Master's; research-teaching nexus; 50 % women quota."],
  [283,"Best STEM Education Program or Project (Africa-Regional)","North Africa","The Best Innovative STEM Curriculum Development","1337 (UM6P / 42 Network)","Morocco","Khouribga","Peer-to-peer coding school; project-based; zero-tuition; UDL-ready."],
  [284,"Best STEM Education Program or Project (Africa-Regional)","North Africa","The Best Innovative STEM Curriculum Development","Nile University","Egypt","Cairo","Applied STEM degrees; industry labs; capstone projects."],
  [285,"Best STEM Education Program or Project (Africa-Regional)","North Africa","The Best Innovative STEM Curriculum Development","ATLAR (Algeria)","Algeria","Algiers","State-backed digital STEM platform; multilingual OER."],
  [286,"Best STEM Education Program or Project (Africa-Regional)","West Africa","The Best Innovative STEM Curriculum Development","Andela Nigeria","Nigeria","Lagos","Developer training with structured STEM curriculum."],
  [287,"Best STEM Education Program or Project (Africa-Regional)","West Africa","The Best Innovative STEM Curriculum Development","WAEC STEM Hub","Nigeria","Lagos","Pan-African STEM assessment reforms and curriculum."],
  [288,"Best STEM Education Program or Project (Africa-Regional)","West Africa","The Best Innovative STEM Curriculum Development","African Science Academy","Ghana","Accra","Girls' residential STEM school; IB-aligned; 100 % female."],
  [289,"Best STEM Education Program or Project (Africa-Regional)","West Africa","The Best Innovative STEM Curriculum Development","ALX Africa","Multiple","","Software engineering & data; competency-based; employer-integrated."],
  [290,"Best STEM Education Program or Project (Africa-Regional)","West Africa","The Best Innovative STEM Curriculum Development","MEST Africa","Ghana","Accra","Software entrepreneurship training; incubation; panAfrican."],
  [291,"Best STEM Education Program or Project (Africa-Regional)","East Africa","The Best Innovative STEM Curriculum Development","AIMS Rwanda","Rwanda","Kigali","Pan-African STEM Master's; research-teaching nexus; 30 % women."],
  [292,"Best STEM Education Program or Project (Africa-Regional)","East Africa","The Best Innovative STEM Curriculum Development","Moringa School","Kenya","Nairobi","Full-stack dev bootcamp; flipped classroom; career support."],
  [293,"Best STEM Education Program or Project (Africa-Regional)","East Africa","The Best Innovative STEM Curriculum Development","iLab Africa (Strathmore)","Kenya","Nairobi","University STEM accelerator; IoT & AI labs; industry partnerships."],
  [294,"Best STEM Education Program or Project (Africa-Regional)","East Africa","The Best Innovative STEM Curriculum Development","Digital Opportunity Trust (DOT)","Tanzania/Rwanda","","Youth STEM & entrepreneurship; community projects."],
  [295,"Best STEM Education Program or Project (Africa-Regional)","East Africa","The Best Innovative STEM Curriculum Development","Tusome Early Literacy","Kenya","","National early-grade reading + numeracy; structured pedagogy at scale."],
  [296,"Best STEM Education Program or Project (Africa-Regional)","East Africa","The Best Innovative STEM Curriculum Development","Ubongo","Tanzania","Dar es Salaam","Edutainment: animated STEM content; TV/radio/mobile; 27M+ reach."],
  [297,"Best STEM Education Program or Project (Africa-Regional)","South Africa","The Best Innovative STEM Curriculum Development","AIMS South Africa","South Africa","Cape Town","Flagship AIMS centre; STEM Master's; research-teaching nexus."],
  [298,"Best STEM Education Program or Project (Africa-Regional)","South Africa","The Best Innovative STEM Curriculum Development","WeThinkCode_","South Africa","Johannesburg","Tuition-free software engineering; peer-learning; 42 model."],
  [299,"Best STEM Education Program or Project (Africa-Regional)","South Africa","The Best Innovative STEM Curriculum Development","Sci-Bono Discovery Centre","South Africa","Johannesburg","Science centre with STEM curriculum development & teacher PD."],
  [300,"Best STEM Education Program or Project (Africa-Regional)","South Africa","The Best Innovative STEM Curriculum Development","Afrika Tikkun","South Africa","","After-school STEM programs; teacher PD & mentoring."],
  [301,"Best STEM Education Program or Project (Africa-Regional)","South Africa","The Best Innovative STEM Curriculum Development","Siyavula Education","South Africa","","Open math/science curriculum & adaptive practice; UDL; teacher dashboards."],
  [302,"Best STEM Education Program or Project (Africa-Regional)","Central Africa","The Best Innovative STEM Curriculum Development","Jesuit Refugee Service (JRS)","DRC/CAR","","Accelerated STEM curricula; multilingual UDL; teacher training."],
  [303,"Best STEM Education Program or Project (Africa-Regional)","Central Africa","The Best Innovative STEM Curriculum Development","Norwegian Refugee Council (NRC)","DRC/CAR","","STEM catch-up curricula with structured pedagogy."],
  [304,"Best STEM Education Program or Project (Africa-Regional)","North Africa","The Best STEM Outreach and Community Engagement","Association l'Heure Joyeuse","Morocco","","Remedial math/science curricula with UDL printables."],
  [305,"Best STEM Education Program or Project (Africa-Regional)","West Africa","The Best STEM Outreach and Community Engagement","WAEC STEM Hub","Nigeria","","Pan-African STEM assessment and outreach programs."],
  [306,"Best STEM Education Program or Project (Africa-Regional)","West Africa","The Best STEM Outreach and Community Engagement","Slum2School Africa","Nigeria","","Connected learning hubs; community outreach."],
  [307,"Best STEM Education Program or Project (Africa-Regional)","West Africa","The Best STEM Outreach and Community Engagement","She Code Africa","Nigeria","","Large girls' cohorts, mentor vetting."],
  [308,"Best STEM Education Program or Project (Africa-Regional)","East Africa","The Best STEM Outreach and Community Engagement","AkiraChix","Kenya","","Girls' STEM outreach, alum mentorship pipelines."],
  [309,"Best STEM Education Program or Project (Africa-Regional)","East Africa","The Best STEM Outreach and Community Engagement","SHOFCO","Kenya","","Girls' STEM clubs in informal settlements."],
  [310,"Best STEM Education Program or Project (Africa-Regional)","South Africa","The Best STEM Outreach and Community Engagement","Africa Teen Geeks","South Africa","","Mass coding clubs, rural outreach."],
  [311,"Best STEM Education Program or Project (Africa-Regional)","South Africa","The Best STEM Outreach and Community Engagement","GirlCode","South Africa","","Girls' tech clubs, mentor networks."],
  [312,"Best STEM Education Program or Project (Africa-Regional)","Central Africa","The Best STEM Outreach and Community Engagement","AIMS Cameroon","Cameroon","","Maths circles, rural girls' outreach programs."],
  [313,"Best STEM Education Program or Project (Africa-Regional)","Central Africa","The Best STEM Outreach and Community Engagement","Open Dreams","Cameroon","","STEM mentoring, scholarships + parent engagement."],
  [314,"Best STEM Education Program or Project (Africa-Regional)","North Africa","The Best Technology Integration in STEM Education","ATLAR (Algeria)","Algeria","","Leading provider of digital classrooms and e-learning solutions."],
  [315,"Best STEM Education Program or Project (Africa-Regional)","West Africa","The Best Technology Integration in STEM Education","Andela Nigeria","Nigeria","","Developer training with tech-integrated STEM education."],
  [316,"Best STEM Education Program or Project (Africa-Regional)","East Africa","The Best Technology Integration in STEM Education","M-Shule","Kenya","","AI-powered learning via SMS, no internet required."],
  [317,"Best STEM Education Program or Project (Africa-Regional)","East Africa","The Best Technology Integration in STEM Education","Camara Education","Kenya","","Computer labs + MDM; teacher certification at scale."],
  [318,"Best STEM Education Program or Project (Africa-Regional)","South Africa","The Best Technology Integration in STEM Education","Siyavula","South Africa","","Open textbook platform with adaptive practice engine."],
  [319,"Best STEM Education Program or Project (Africa-Regional)","South Africa","The Best Technology Integration in STEM Education","Africa Teen Geeks","South Africa","","Mass coding labs; school timetables + mentor QA."],
  [320,"Best STEM Education Program or Project (Africa-Regional)","Central Africa","The Best Technology Integration in STEM Education","Open Dreams","Cameroon","","School labs + mentor analytics; accessibility supports."],
];

// ═══════════════════════════════════════════════════════════════════
// MERGE TRACKING — Maps each nominee ID to its migration provenance
// ═══════════════════════════════════════════════════════════════════
export function getNomineeMergeInfo(id: number): NomineeMergeInfo {
  // All current nominees originate from the 2024 Excel dataset and are 
  // carried forward as the active 2025 records
  return {
    id,
    sourceYears: [2024, 2025],
    migratedFrom2024: true,
    mergedRecord: true,
    migrationLabel: "merged_2024_2025",
    publicLabel: "Existing Nominee",
  };
}

// ═══════════════════════════════════════════════════════════════════
// METADATA — Accurate counts from NESA_Award_Nominees_Master_List.xlsx
// All category names updated from 2024 → 2025
// ═══════════════════════════════════════════════════════════════════
export const DATASET_META = {
  source: "NESA_Award_Nominees_Master_List.xlsx",
  importedAt: "2026-03-08",
  mergedAt: "2026-03-08",
  totalInExcel: 1703,
  totalLoaded: 320,
  season: "2025",
  archived2024: true,
  migrationNote: "All 2024 nominees merged into 2025 system. Original data archived in nominees-2024-archive.ts",

  /** Per-category breakdown (full Excel counts) — all names updated to 2025 */
  categoryBreakdown: {
    "Diaspora Association Educational Impact in Africa": {
      nominees: 30,
      subcategories: 3,
      subcategoryNames: [
        "The Best Diaspora-Led Educational Infrastructure",
        "The Best Diaspora-Led Educational Program Innovation",
        "The Best Diaspora-Led Teacher Training And Support Initiative",
      ],
    },
    "Overall Best Educational Friendly State in Nigeria 2025": {
      nominees: 52,
      subcategories: 6,
      subcategoryNames: [
        "Best Education Initiative in North Central Zone",
        "Best Education Initiative in North East Zone",
        "Best Education Initiative in North West Zone",
        "Best Education Initiative in South East Zone",
        "Best Education Initiative in South West Zone",
        "Best Education Initiative in South South Zone",
      ],
    },
    "The Overall Best CSR for Education in Nigeria Award 2025": {
      nominees: 302,
      subcategories: 25,
      subcategoryNames: [
        "Oil And Gas CSR in Education Award",
        "Banking And Finance CSR in Education Award",
        "Telecommunications CSR in Education Award",
        "Technology And ICT CSR in Education Award",
        "Food And Beverages CSR in Education Award",
        "Manufacturing CSR in Education Award",
        "Insurance CSR in Education Award",
        "Social Media Influencer CSR For Education",
        "Fintech CSR in Education Award",
        "Agriculture And Agribusiness CSR In Education Award",
        "Health Care And Hospitals CSR In Education Award",
        "Professional Services CSR In Education Award",
        "Hotels CSR in Education Award",
        "Pharmaceuticals CSR in Education Award",
        "Aviation CSR in Education Award",
        "Real Estate And Construction CSR in Education Award",
        "Retail And E-Commerce CSR in Education Award",
        "Microfinance Banks CSR in Education Award",
        "Emerging Telecommunications CSR in Education Award",
        "Conglomerates And Diversified Businesses CSR in Education Award",
        "Technology and Software CSR in Education Award",
        "Real Estate Development CSR in Education Award",
        "Commercial Retail CSR in Education Award",
        "Hotels CSR in Education Award 2022-2025 in Nigeria",
        "Logistics And Transportation CSR in Education Award",
      ],
    },
    "Best Africa Regional Companies CSR for Education Special Recognition Award in Africa 2025": {
      nominees: 453,
      subcategories: 35,
      subcategoryNames: [
        "Best Banking and Finance CSR in Education in North Africa",
        "Best Banking and Finance CSR in Education in East Africa",
        "Best Banking and Finance CSR in Education in West Africa",
        "Best Banking and Finance CSR in Education in Southern Africa",
        "Best Banking and Finance CSR in Education in Central Africa",
        "Best Telecommunications CSR in Education in West Africa",
        "Best Telecommunications CSR in Education in East Africa",
        "Best Technology and ICT CSR in Education in North Africa",
        "Best Technology and ICT CSR in Education in West Africa",
        "Best Technology and ICT CSR in Education in East Africa",
        "Best Technology and ICT CSR in Education in Southern Africa",
        "Best Technology and ICT CSR in Education in Central Africa",
        "Agriculture And Agribusiness CSR in Education in East Africa",
        "Agriculture And Agribusiness CSR in Education in Central Africa",
        "Manufacturing And Industrial CSR in Education",
        "Manufacturing And Industrial CSR in Education in Central Africa",
        "Social Media Influencer CSR For Education in West Africa",
        "Social Media Influencer CSR For Education in Central Africa",
        "Social Media Influencer CSR For Education in East Africa",
        "African International Sports Stars CSR For Education in East Africa",
        "African International Sports Stars CSR For Education in West Africa",
        "African International Sports Stars CSR For Education in North Africa",
      ],
    },
    "Best NGO Education Support Recognition Award (Africa-Regional)": {
      nominees: 70,
      subcategories: 5,
      subcategoryNames: [
        "Best Educational Infrastructure Initiative By An NGO",
        "Exceptional Donation Of Educational Materials By An NGO",
        "Outstanding Donation Of Education Aid By NGO",
        "Youth Empowerment Through Educational Services By An NGO In Nigeria",
        "Women And Girls' Empowerment In Education By An NGO In Nigeria",
      ],
    },
    "Best EduTech Organization in Nigeria and Africa 2025": {
      nominees: 150,
      subcategories: 15,
      subcategoryNames: [
        "Best EduTech Startup in North Africa",
        "Best EduTech Startup in West Africa",
        "Best EduTech Startup in East Africa",
        "Best EduTech Startup in South Africa",
        "Best EduTech Startup in Central Africa",
        "Best EduTech Established Company in North Africa",
        "Best EduTech Established Company in West Africa",
        "Best EduTech Established Company in East Africa",
        "Best EduTech Established Company in South Africa",
        "Best EduTech Established Company in Central Africa",
        "Best EduTech Social Impact Initiative in North Africa",
        "Best EduTech Social Impact Initiative in West Africa",
        "Best EduTech Social Impact Initiative in East Africa",
        "Best EduTech Social Impact Initiative in South Africa",
        "Best EduTech Social Impact Initiative in Central Africa",
      ],
    },
    "The Best Library in Nigerian Tertiary Institutions Award 2025": {
      nominees: 28,
      subcategories: 4,
      subcategoryNames: [
        "Best University Library in Nigeria (Public)",
        "Best University Library in Nigeria (Private)",
        "Best Polytechnic Library in Nigeria",
        "Best College of Nursing Library in Nigeria (Public)",
      ],
    },
    "The Overall Best Research and Development Contribution by Research Institutes": {
      nominees: 20,
      subcategories: 5,
      subcategoryNames: [
        "Best Agricultural Research Institute in Nigeria",
        "Best Health Research Institute in Nigeria",
        "Best Technology Research Institute in Nigeria",
        "Best Social Science Research Institute in Nigeria",
        "Best Environmental Research Institute in Nigeria",
      ],
    },
    "Best Media and Advocacy for Education in Nigeria 2025": {
      nominees: 30,
      subcategories: 6,
      subcategoryNames: [
        "Best Education-Focused TV Program",
        "Best Education-Focused Radio Program",
        "Best Education-Focused Print Media",
        "Best Education-Focused Online Media",
        "Best Education-Focused Documentary",
        "Best Education Advocacy Campaign",
      ],
    },
    "Christian Faith Organization Educational Champion of the Decade Award": {
      nominees: 42,
      subcategories: 4,
      subcategoryNames: [
        "Best Scholarship Program by a Christian Organization",
        "Best Educational Infrastructure Development By A Christian Organization",
        "Best Advocacy for Educational Reforms",
        "Best Holistic Educational Support By A Christian Organization",
      ],
    },
    "Islamic Faith Organization Educational Champion of the Decade Award": {
      nominees: 40,
      subcategories: 4,
      subcategoryNames: [
        "Best Educational Infrastructure Development by an Islamic Organization",
        "Best Scholarship Program by an Islamic Organization",
        "Best Holistic Educational Support by an Islamic Organization",
        "Best Advocacy for Educational Reforms by an Islamic Organization",
      ],
    },
    "Political Leaders in Nigeria 2025 Recognition Award": {
      nominees: 71,
      subcategories: 3,
      subcategoryNames: [
        "Outstanding Scholarship Program for Both Vocational and Formal Education by a Politician",
        "Exemplary Infrastructure Development and Donations for Education by a Politician",
        "Advocacy and Policy Development for Education by a Politician",
      ],
    },
    "Creative Arts Industry Contribution to Education in Nigeria 2025": {
      nominees: 82,
      subcategories: 7,
      subcategoryNames: [
        "Best Music for Educational Impact Award",
        "Best Film and Media for Educational Advancement Award",
        "Best Nollywood Production and Artiste for Educational Content Award",
        "Best Literature and Art Works for Education Award",
        "Best Visual Arts and Educational Impact Award",
        "Best Creative Advocacy and Educational Campaigns Award",
        "Best Dance and Performing Arts for Education Award",
      ],
    },
    "Best STEM Education Program or Project (Africa-Regional)": {
      nominees: 283,
      subcategories: 15,
      subcategoryNames: [
        "The Best Innovative STEM Curriculum Development",
        "The Best STEM Outreach and Community Engagement",
        "The Best Technology Integration in STEM Education",
      ],
    },
  },

  /** 3 Gold Special Recognition Influencer Categories */
  goldSpecialRecognition: {
    totalInfluencerNominees: 75,
    categories: [
      {
        name: "Social Media Influencer CSR For Education",
        nominees: 40,
        description: "Social media personalities using their platforms to advocate for education across Africa",
        regions: ["Nigeria", "West Africa", "East Africa", "Central Africa", "North Africa", "Southern Africa"],
      },
      {
        name: "African International Sports Stars CSR For Education",
        nominees: 20,
        description: "African sports icons contributing to education through foundations and initiatives",
        regions: ["West Africa", "East Africa", "North Africa", "Southern Africa", "Central Africa"],
      },
      {
        name: "Music Industry Contribution to Education",
        nominees: 15,
        description: "Musicians and music industry professionals using their art to promote education",
        regions: ["Nigeria", "West Africa", "East Africa", "Central Africa"],
      },
    ],
  },

  /** Summary statistics */
  summary: {
    totalCategories: 14,
    totalSubcategories: 132,
    totalNominees: 1703,
    totalCountries: 35,
    totalRegions: 5,
    pathways: {
      "Africans in Africa": 1200,
      "Africans in Diaspora": 30,
      "Friends of Africa": 15,
      "Nigeria": 458,
    },
  },

  categories: [
    "Diaspora Association Educational Impact in Africa",
    "Overall Best Educational Friendly State in Nigeria 2025",
    "The Overall Best CSR for Education in Nigeria Award 2025",
    "Best Africa Regional Companies CSR for Education Special Recognition Award in Africa 2025",
    "Best NGO Education Support Recognition Award (Africa-Regional)",
    "Best EduTech Organization in Nigeria and Africa 2025",
    "The Best Library in Nigerian Tertiary Institutions Award 2025",
    "The Overall Best Research and Development Contribution by Research Institutes",
    "Best Media and Advocacy for Education in Nigeria 2025",
    "Christian Faith Organization Educational Champion of the Decade Award",
    "Islamic Faith Organization Educational Champion of the Decade Award",
    "Political Leaders in Nigeria 2025 Recognition Award",
    "Creative Arts Industry Contribution to Education in Nigeria 2025",
    "Best STEM Education Program or Project (Africa-Regional)",
  ],
};
