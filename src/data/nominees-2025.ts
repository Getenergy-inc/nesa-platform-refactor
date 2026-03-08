/**
 * NESA Africa 2025 Nominee Master Dataset
 * Source: NESA_Award_Nominees_Master_List.xlsx (1,703 records)
 * Format: [id, mainCategory, region, subcategory, name, country, state, achievement]
 * 
 * This file is the GitHub-stored source of truth for all nominee data.
 * Nomination Year: 2025 (Season upgrade from 2024)
 */

export type NomineeRow = [number, string, string, string, string, string, string, string];

export const NOMINEES_2025: NomineeRow[] = [
  // ═══════════════════════════════════════════════════════════════════
  // CATEGORY 1: Diaspora Association Educational Impact in Africa
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
  // CATEGORY 2: Overall best educational friendly state in Nigeria
  // ═══════════════════════════════════════════════════════════════════
  [31,"Overall best educational friendly state in Nigeria 2024","N/A","Best Education Initiative in North Central Zone","Kogi State","Nigeria","Kogi","Dedication to improving rural education, particularly for girls, demonstrating significant community impact."],
  [32,"Overall best educational friendly state in Nigeria 2024","N/A","Best Education Initiative in North Central Zone","Kwara State","Nigeria","Kwara","Dedication to improving rural education, particularly for girls, demonstrating significant community impact."],
  [33,"Overall best educational friendly state in Nigeria 2024","N/A","Best Education Initiative in North Central Zone","Benue State","Nigeria","Benue","Dedication to improving rural education, particularly for girls, demonstrating significant community impact."],
  [34,"Overall best educational friendly state in Nigeria 2024","N/A","Best Education Initiative in North Central Zone","Nasarawa State","Nigeria","Nasarawa","Dedication to improving rural education, particularly for girls, demonstrating significant community impact."],
  [35,"Overall best educational friendly state in Nigeria 2024","N/A","Best Education Initiative in North Central Zone","Niger State","Nigeria","Niger","Dedication to improving rural education, particularly for girls, demonstrating significant community impact."],
  [36,"Overall best educational friendly state in Nigeria 2024","N/A","Best Education Initiative in North Central Zone","Plateau State","Nigeria","Plateau","Dedication to improving rural education, particularly for girls, demonstrating significant community impact."],
  [37,"Overall best educational friendly state in Nigeria 2024","N/A","Best Education Initiative in North Central Zone","Federal Capital Territory","Nigeria","FCT","Dedication to improving rural education, particularly for girls, demonstrating significant community impact."],
  [38,"Overall best educational friendly state in Nigeria 2024","N/A","Best Education Initiative in North East Zone","Adamawa State","Nigeria","Adamawa","Dedication to improving rural education, particularly for girls, demonstrating significant community impact."],
  [39,"Overall best educational friendly state in Nigeria 2024","N/A","Best Education Initiative in North East Zone","Bauchi State","Nigeria","Bauchi","Dedication to improving rural education, particularly for girls, demonstrating significant community impact."],
  [40,"Overall best educational friendly state in Nigeria 2024","N/A","Best Education Initiative in North East Zone","Borno State","Nigeria","Borno","Dedication to improving rural education, particularly for girls, demonstrating significant community impact."],
  [41,"Overall best educational friendly state in Nigeria 2024","N/A","Best Education Initiative in North East Zone","Gombe State","Nigeria","Gombe","Dedication to improving rural education, particularly for girls, demonstrating significant community impact."],
  [42,"Overall best educational friendly state in Nigeria 2024","N/A","Best Education Initiative in North East Zone","Taraba State","Nigeria","Taraba","Dedication to improving rural education, particularly for girls, demonstrating significant community impact."],
  [43,"Overall best educational friendly state in Nigeria 2024","N/A","Best Education Initiative in North East Zone","Yobe State","Nigeria","Yobe","Dedication to improving rural education, particularly for girls, demonstrating significant community impact."],
  [44,"Overall best educational friendly state in Nigeria 2024","N/A","Best Education Initiative in South East Zone","Abia State","Nigeria","Abia","Dedication to improving rural education, particularly for girls, demonstrating significant community impact."],
  [45,"Overall best educational friendly state in Nigeria 2024","N/A","Best Education Initiative in South East Zone","Anambra State","Nigeria","Anambra","Dedication to improving rural education, particularly for girls, demonstrating significant community impact."],
  [46,"Overall best educational friendly state in Nigeria 2024","N/A","Best Education Initiative in South East Zone","Ebonyi State","Nigeria","Ebonyi","Dedication to improving rural education, particularly for girls, demonstrating significant community impact."],
  [47,"Overall best educational friendly state in Nigeria 2024","N/A","Best Education Initiative in South East Zone","Enugu State","Nigeria","Enugu","Dedication to improving rural education, particularly for girls, demonstrating significant community impact."],
  [48,"Overall best educational friendly state in Nigeria 2024","N/A","Best Education Initiative in South East Zone","Imo State","Nigeria","Imo","Dedication to improving rural education, particularly for girls, demonstrating significant community impact."],
  [49,"Overall best educational friendly state in Nigeria 2024","N/A","Best Education Initiative in South West Zone","Lagos State","Nigeria","Lagos","Dedication to improving rural education, particularly for girls, demonstrating significant community impact."],
  [50,"Overall best educational friendly state in Nigeria 2024","N/A","Best Education Initiative in South West Zone","Ogun State","Nigeria","Ogun","Dedication to improving rural education, particularly for girls, demonstrating significant community impact."],

  // ═══════════════════════════════════════════════════════════════════
  // CATEGORY 3: CSR for Education in Nigeria
  // ═══════════════════════════════════════════════════════════════════
  [51,"The Overall Best CSR for Education in Nigeria Award 2024","N/A","Oil And Gas CSR in Education Award","Shell Nigeria","Nigeria","","Established the 'Shell Nigeria Education Initiative' to support STEM education."],
  [52,"The Overall Best CSR for Education in Nigeria Award 2024","N/A","Oil And Gas CSR in Education Award","Chevron Nigeria","Nigeria","","Developed the 'Chevron Niger Delta Partnership Initiative' for educational infrastructure."],
  [53,"The Overall Best CSR for Education in Nigeria Award 2024","N/A","Oil And Gas CSR in Education Award","TotalEnergies Nigeria","Nigeria","","Supported STEM education and vocational training across the Niger Delta region."],
  [54,"The Overall Best CSR for Education in Nigeria Award 2024","N/A","Banking And Finance CSR in Education Award","GTBank (Guaranty Trust Bank)","Nigeria","","Launched the 'GTBank Autism Program' to support children with special needs."],
  [55,"The Overall Best CSR for Education in Nigeria Award 2024","N/A","Banking And Finance CSR in Education Award","Access Bank","Nigeria","","Implemented the 'Access Bank Women Empowerment Program' to support female education."],
  [56,"The Overall Best CSR for Education in Nigeria Award 2024","N/A","Banking And Finance CSR in Education Award","First Bank of Nigeria","Nigeria","","Sponsored the 'SPARK' initiative for mentoring and career development in schools."],
  [57,"The Overall Best CSR for Education in Nigeria Award 2024","N/A","Banking And Finance CSR in Education Award","Zenith Bank","Nigeria","","Funded ICT labs in several public schools across Nigeria."],
  [58,"The Overall Best CSR for Education in Nigeria Award 2024","N/A","Technology And ICT CSR in Education Award","Microsoft Nigeria","Nigeria","","Implemented digital literacy programs across Nigerian schools."],
  [59,"The Overall Best CSR for Education in Nigeria Award 2024","N/A","Technology And ICT CSR in Education Award","Google Nigeria","Nigeria","","Supporting education through technology initiatives."],
  [60,"The Overall Best CSR for Education in Nigeria Award 2024","N/A","Technology And ICT CSR in Education Award","IBM West Africa","Nigeria","","Developed the 'IBM STEM for Girls' initiative."],
  [61,"The Overall Best CSR for Education in Nigeria Award 2024","N/A","Telecommunications CSR in Education Award","MTN Nigeria","Nigeria","","MTN Foundation supporting digital education and school connectivity."],
  [62,"The Overall Best CSR for Education in Nigeria Award 2024","N/A","Telecommunications CSR in Education Award","Airtel Nigeria","Nigeria","","Supporting e-learning and digital skills training."],
  [63,"The Overall Best CSR for Education in Nigeria Award 2024","N/A","Telecommunications CSR in Education Award","Glo Mobile","Nigeria","","Providing digital resources and supporting school technology."],
  [64,"The Overall Best CSR for Education in Nigeria Award 2024","N/A","Food And Beverages CSR in Education Award","Nestle Nigeria","Nigeria","","Launched the 'Nestlé Healthy Kids Program' to educate children on nutrition and health."],
  [65,"The Overall Best CSR for Education in Nigeria Award 2024","N/A","Food And Beverages CSR in Education Award","Cadbury Nigeria","Nigeria","","Supported the 'Cadbury Nutrition Education Initiative' in primary schools."],
  [66,"The Overall Best CSR for Education in Nigeria Award 2024","N/A","Food And Beverages CSR in Education Award","Coca-Cola Nigeria","Nigeria","","Implemented the 'Coca-Cola Foundation School Support Program' for educational infrastructure."],
  [67,"The Overall Best CSR for Education in Nigeria Award 2024","N/A","Manufacturing CSR in Education Award","Dangote Group","Nigeria","","Implemented the 'Dangote Academy' for vocational and technical training."],
  [68,"The Overall Best CSR for Education in Nigeria Award 2024","N/A","Manufacturing CSR in Education Award","BUA Group","Nigeria","","Supported the 'BUA School Renovation Project' to improve learning environments."],
  [69,"The Overall Best CSR for Education in Nigeria Award 2024","N/A","Manufacturing CSR in Education Award","Lafarge Africa","Nigeria","","Developed the 'Lafarge Education Support Program' for secondary schools."],
  [70,"The Overall Best CSR for Education in Nigeria Award 2024","N/A","Insurance CSR in Education Award","Leadway Assurance","Nigeria","","Implemented the 'Leadway Financial Literacy Program' for secondary schools."],
  [71,"The Overall Best CSR for Education in Nigeria Award 2024","N/A","Social Media Influencer CSR For Education","Yemi Alade (Nigeria)","Nigeria","","#EducationForAll Campaign – Advocating for and fundraising for school supplies and scholarships."],
  [72,"The Overall Best CSR for Education in Nigeria Award 2024","N/A","Social Media Influencer CSR For Education","Davido (Nigeria)","Nigeria","","Davido Education Fund – Supporting underprivileged students with scholarships and learning materials."],
  [73,"The Overall Best CSR for Education in Nigeria Award 2024","N/A","Social Media Influencer CSR For Education","Tiwa Savage (Nigeria)","Nigeria","","Savage Foundation – Supporting girls' education and providing scholarships."],
  [74,"The Overall Best CSR for Education in Nigeria Award 2024","N/A","Fintech CSR in Education Award","Flutterwave","Nigeria","","Implemented the 'Flutterwave Financial Literacy Program' for secondary schools."],
  [75,"The Overall Best CSR for Education in Nigeria Award 2024","N/A","Fintech CSR in Education Award","Paystack","Nigeria","","Launched the 'Paystack Education Support Initiative' for educational resources."],
  [76,"The Overall Best CSR for Education in Nigeria Award 2024","N/A","Agriculture And Agribusiness CSR In Education Award","Olam Nigeria","Nigeria","","Implemented the 'Olam Agricultural Education Program' to promote agricultural literacy."],
  [77,"The Overall Best CSR for Education in Nigeria Award 2024","N/A","Health Care And Hospitals CSR In Education Award","Reddington Hospital","Nigeria","","Implemented the 'Reddington Health Education Program' to promote health literacy."],
  [78,"The Overall Best CSR for Education in Nigeria Award 2024","N/A","Professional Services CSR In Education Award","PwC Nigeria","Nigeria","","Implemented the 'PwC Business Education Program' for secondary schools."],
  [79,"The Overall Best CSR for Education in Nigeria Award 2024","N/A","Hotels CSR in Education Award","Transcorp Hilton","Nigeria","","Developed the 'Transcorp Hospitality Education Program' for vocational training."],

  // ═══════════════════════════════════════════════════════════════════
  // CATEGORY 4: Best Africa Regional Companies CSR
  // ═══════════════════════════════════════════════════════════════════
  [80,"Best Africa Regional Companies CSR for Education Special Recognition Award in Africa 2024","North Africa","Best Banking and Finance CSR in Education in North Africa","Attijariwafa Bank","Morocco","Casablanca","Equipping schools with digital learning tools and resources."],
  [81,"Best Africa Regional Companies CSR for Education Special Recognition Award in Africa 2024","North Africa","Best Banking and Finance CSR in Education in North Africa","Bank of Alexandria","Egypt","Alexandria","Offering scholarships and renovating schools to improve educational facilities."],
  [82,"Best Africa Regional Companies CSR for Education Special Recognition Award in Africa 2024","East Africa","Best Banking and Finance CSR in Education in East Africa","Equity Bank","Kenya","Nairobi","Supporting education through scholarships and digital learning initiatives."],
  [83,"Best Africa Regional Companies CSR for Education Special Recognition Award in Africa 2024","West Africa","Best Banking and Finance CSR in Education in West Africa","Ecobank","Ghana","Accra","Empowering youth through scholarships and financial literacy programs."],
  [84,"Best Africa Regional Companies CSR for Education Special Recognition Award in Africa 2024","South Africa","Best Banking and Finance CSR in Education in Southern Africa","Standard Bank","South Africa","Johannesburg","Supporting education through various CSR initiatives."],
  [85,"Best Africa Regional Companies CSR for Education Special Recognition Award in Africa 2024","Central Africa","Best Banking and Finance CSR in Education in Central Africa","BGFI Bank","Gabon","Libreville","Supporting education through various CSR initiatives."],
  [86,"Best Africa Regional Companies CSR for Education Special Recognition Award in Africa 2024","West Africa","Best Telecommunications CSR in Education in West Africa","MTN","Nigeria","Lagos","Digital education platforms and school connectivity programs."],
  [87,"Best Africa Regional Companies CSR for Education Special Recognition Award in Africa 2024","East Africa","Best Telecommunications CSR in Education in East Africa","Safaricom","Kenya","","Digital education platforms and school connectivity programs."],
  [88,"Best Africa Regional Companies CSR for Education Special Recognition Award in Africa 2024","North Africa","Best Technology and ICT CSR in Education in North Africa","IBM North Africa","Morocco","Casablanca","Providing AI and cloud computing education, supporting coding initiatives."],
  [89,"Best Africa Regional Companies CSR for Education Special Recognition Award in Africa 2024","West Africa","Best Technology and ICT CSR in Education in West Africa","Flutterwave","Nigeria","Lagos","Supporting coding and robotics education."],
  [90,"Best Africa Regional Companies CSR for Education Special Recognition Award in Africa 2024","East Africa","Agriculture And Agribusiness CSR in Education in East Africa","Kenya Tea Development Agency","Kenya","Nairobi","Tea and Teach – Providing educational support for tea farming communities."],
  [91,"Best Africa Regional Companies CSR for Education Special Recognition Award in Africa 2024","West Africa","Social Media Influencer CSR For Education in West Africa","Didier Drogba (Ivory Coast)","Ivory Coast","","Didier Drogba Foundation – Funding schools and providing educational grants."],
  [92,"Best Africa Regional Companies CSR for Education Special Recognition Award in Africa 2024","East Africa","African International Sports Stars CSR For Education in East Africa","Eliud Kipchoge (Kenya)","Kenya","","Eliud Kipchoge Foundation – Funding education and sports programs in Kenya."],
  [93,"Best Africa Regional Companies CSR for Education Special Recognition Award in Africa 2024","North Africa","Manufacturing And Industrial CSR in Education","Sonatrach (Algeria)","Algeria","","Funding technical education for careers in the energy sector."],
  [94,"Best Africa Regional Companies CSR for Education Special Recognition Award in Africa 2024","Central Africa","Social Media Influencer CSR For Education in Central Africa","Fally Ipupa","DR Congo","Kinshasa","Investing in music schools and arts education."],
  [95,"Best Africa Regional Companies CSR for Education Special Recognition Award in Africa 2024","South Africa","Best Technology and ICT CSR in Education in Southern Africa","Naspers","South Africa","Cape Town","Supporting digital education through technology investments."],

  // ═══════════════════════════════════════════════════════════════════
  // CATEGORY 5: Best NGO Education Support Recognition Award
  // ═══════════════════════════════════════════════════════════════════
  [96,"Best NGO Education Support Recognition Award (Africa-Regional)","West Africa","Best Educational Infrastructure Initiative By An NGO","Teach For Nigeria","Nigeria","","Significant contributions to improving rural education, particularly for girls."],
  [97,"Best NGO Education Support Recognition Award (Africa-Regional)","West Africa","Best Educational Infrastructure Initiative By An NGO","Slum2School Africa","Nigeria","","Significant contributions to improving rural education, particularly for girls."],
  [98,"Best NGO Education Support Recognition Award (Africa-Regional)","West Africa","Best Educational Infrastructure Initiative By An NGO","ActionAid Nigeria","Nigeria","","Significant contributions to improving rural education, particularly for girls."],
  [99,"Best NGO Education Support Recognition Award (Africa-Regional)","West Africa","Exceptional Donation Of Educational Materials By An NGO","The Tony Elumelu Foundation","Nigeria","","Significant contributions to improving rural education, particularly for girls."],
  [100,"Best NGO Education Support Recognition Award (Africa-Regional)","West Africa","Youth Empowerment Through Educational Services By An NGO In Nigeria","Youth for Technology Foundation","Nigeria","","Provided technology training and entrepreneurship education to young people in Nigeria."],
  [101,"Best NGO Education Support Recognition Award (Africa-Regional)","West Africa","Youth Empowerment Through Educational Services By An NGO In Nigeria","Junior Achievement Nigeria (JAN)","Nigeria","","Implemented educational programs that empowered youths with financial literacy and workforce readiness."],
  [102,"Best NGO Education Support Recognition Award (Africa-Regional)","West Africa","Women And Girls' Empowerment In Education By An NGO In Nigeria","Girls Education Mission International (GEM)","Nigeria","","Provided educational scholarships, mentorship, and advocacy for the education of girls in northern Nigeria."],
  [103,"Best NGO Education Support Recognition Award (Africa-Regional)","West Africa","Women And Girls' Empowerment In Education By An NGO In Nigeria","ActionAid Nigeria","Nigeria","","Implemented the Safe Cities for Women and Girls initiative."],

  // ═══════════════════════════════════════════════════════════════════
  // CATEGORY 6: Best EduTech Organization
  // ═══════════════════════════════════════════════════════════════════
  [104,"Best EduTech Organization in Nigeria and Africa 2024","North Africa","Best EduTech Startup in North Africa","Nafham (Egypt)","Egypt","","Developed an online platform offering free K-12 video lessons. Reached over 4 million students."],
  [105,"Best EduTech Organization in Nigeria and Africa 2024","North Africa","Best EduTech Startup in North Africa","Almentor (Egypt)","Egypt","","Created an e-learning platform providing video-based online courses. Empowered over 2 million learners."],
  [106,"Best EduTech Organization in Nigeria and Africa 2024","West Africa","Best EduTech Startup in West Africa","uLesson","Nigeria","","Interactive learning platform offering curriculum-based video lessons for African students."],
  [107,"Best EduTech Organization in Nigeria and Africa 2024","West Africa","Best EduTech Startup in West Africa","Andela","Nigeria","","Global talent network training software developers across Africa."],
  [108,"Best EduTech Organization in Nigeria and Africa 2024","East Africa","Best EduTech Startup in East Africa","KYTABU","Kenya","","Digital textbook platform providing affordable access to educational content."],
  [109,"Best EduTech Organization in Nigeria and Africa 2024","East Africa","Best EduTech Startup in East Africa","Ubongo","Tanzania","","Award-winning edutainment creating localized learning content."],
  [110,"Best EduTech Organization in Nigeria and Africa 2024","East Africa","Best EduTech Startup in East Africa","M-Shule","Kenya","","AI-powered learning platform delivering content via SMS without internet."],
  [111,"Best EduTech Organization in Nigeria and Africa 2024","South Africa","Best EduTech Startup in South Africa","Siyavula Foundation","South Africa","","Free online textbooks and practice for high school mathematics and science."],
  [112,"Best EduTech Organization in Nigeria and Africa 2024","South Africa","Best EduTech Startup in South Africa","GetSmarter","South Africa","","Premium online education provider offering short courses from top universities."],
  [113,"Best EduTech Organization in Nigeria and Africa 2024","Central Africa","Best EduTech Startup in Central Africa","Andela","DRC","","Software development training program connecting local developers with global opportunities."],
  [114,"Best EduTech Organization in Nigeria and Africa 2024","North Africa","Best EduTech Established Company in North Africa","GOMYCODE (Tunisia)","Tunisia","","Offers coding courses and digital skills training through physical and online platforms."],
  [115,"Best EduTech Organization in Nigeria and Africa 2024","West Africa","Best EduTech Social Impact Initiative in West Africa","Edukoya","Nigeria","","Community learning platform fostering collaborative education and peer support."],

  // ═══════════════════════════════════════════════════════════════════
  // CATEGORY 7: Best Library in Nigerian Tertiary Institutions
  // ═══════════════════════════════════════════════════════════════════
  [116,"The best library in Nigerian tertiary institutions award 2024","N/A","Best University Library in Nigeria (Public)","University of Ibadan Library","Nigeria","Oyo","Rich historical collection and modern facilities supporting academic excellence."],
  [117,"The best library in Nigerian tertiary institutions award 2024","N/A","Best University Library in Nigeria (Public)","Ahmadu Bello University Library","Nigeria","Kaduna","Extensive research resources and digital innovation in library services."],
  [118,"The best library in Nigerian tertiary institutions award 2024","N/A","Best University Library in Nigeria (Public)","University of Lagos Library","Nigeria","Lagos","Exceptional collection and innovative services supporting diverse academic programs."],
  [119,"The best library in Nigerian tertiary institutions award 2024","N/A","Best University Library in Nigeria (Private)","Covenant University Library","Nigeria","Ogun","State-of-the-art facilities and comprehensive digital resources."],
  [120,"The best library in Nigerian tertiary institutions award 2024","N/A","Best University Library in Nigeria (Private)","Babcock University Library","Nigeria","Ogun","Extensive collection supporting diverse academic programs."],
  [121,"The best library in Nigerian tertiary institutions award 2024","N/A","Best Polytechnic Library in Nigeria","Yaba College of Technology Library","Nigeria","Lagos","Comprehensive technical resources and innovative maker spaces."],
  [122,"The best library in Nigerian tertiary institutions award 2024","N/A","Best Polytechnic Library in Nigeria","Kaduna Polytechnic Library","Nigeria","Kaduna","Extensive collection supporting diverse technical programs."],
  [123,"The best library in Nigerian tertiary institutions award 2024","N/A","Best College of Nursing Library in Nigeria (Public)","Lagos State College of Nursing Library","Nigeria","Lagos","Exceptional support for nursing education and research."],

  // ═══════════════════════════════════════════════════════════════════
  // CATEGORY 8: Research and Development
  // ═══════════════════════════════════════════════════════════════════
  [124,"The Overall Best Research and Development Contribution by Research Institutes in Achieving Education for all.","N/A","Best Agricultural Research Institute in Nigeria","IITA (International Institute of Tropical Agriculture)","Nigeria","Ibadan","Pioneered research in tropical agriculture."],
  [125,"The Overall Best Research and Development Contribution by Research Institutes in Achieving Education for all.","N/A","Best Health Research Institute in Nigeria","Nigeria Institute of Medical Research","Nigeria","Lagos","Leading institution in medical research and health education."],

  // ═══════════════════════════════════════════════════════════════════
  // CATEGORY 9: Media and Advocacy
  // ═══════════════════════════════════════════════════════════════════
  [126,"Best Media and advocacy for education in Nigeria 2024","N/A","Best Education-Focused TV Program","Channels TV 'Education Matters'","Nigeria","Lagos","Consistent broadcasting of educational programs and advocacy."],
  [127,"Best Media and advocacy for education in Nigeria 2024","N/A","Best Education-Focused TV Program","TVC News Education","Nigeria","Lagos","Dedicated coverage of education sector developments."],

  // ═══════════════════════════════════════════════════════════════════
  // CATEGORY 10: Christian Faith Organization
  // ═══════════════════════════════════════════════════════════════════
  [128,"Christian faith organization Educational Champion of the Decade Award","N/A","Best Scholarship Program by a Christian Organization","Living Faith Church Worldwide","Nigeria","","Through the David Oyedepo Foundation, awarded scholarships to thousands of students across Africa."],
  [129,"Christian faith organization Educational Champion of the Decade Award","N/A","Best Scholarship Program by a Christian Organization","RCCG (Redeemed Christian Church of God)","Nigeria","","Awarded over 5,000 scholarships annually to students at various educational levels."],
  [130,"Christian faith organization Educational Champion of the Decade Award","N/A","Best Educational Infrastructure Development By A Christian Organization","Catholic Church Nigeria","Nigeria","","Established and renovated numerous schools, including Veritas University and several mission schools."],
  [131,"Christian faith organization Educational Champion of the Decade Award","N/A","Best Advocacy for Educational Reforms","Methodist Church Nigeria","Nigeria","","Engaged in campaigns for educational equity and improvement of public school systems."],

  // ═══════════════════════════════════════════════════════════════════
  // CATEGORY 11: Islamic Faith Organization
  // ═══════════════════════════════════════════════════════════════════
  [132,"Islamic faith organization Educational Champion of the Decade Award","N/A","Best Scholarship and Financial Aid Initiative by an Islamic Organization","Ahmadu Bello University Zaria","Nigeria","Kaduna","Comprehensive scholarship program benefiting thousands of students."],
  [133,"Islamic faith organization Educational Champion of the Decade Award","N/A","Best Educational Infrastructure Development by an Islamic Organization","NASFAT (Nasrul-Lahi-L-Fatih Society)","Nigeria","","Established several primary and secondary schools across Nigeria."],
  [134,"Islamic faith organization Educational Champion of the Decade Award","N/A","Best Educational Infrastructure Development by an Islamic Organization","FOMWAN (Federation of Muslim Women)","Nigeria","","Developed schools focusing on girls' education in northern Nigeria."],

  // ═══════════════════════════════════════════════════════════════════
  // CATEGORY 12: Political Leaders
  // ═══════════════════════════════════════════════════════════════════
  [135,"Political Leaders in Nigeria 2024 Recognition Award for the Best Educational Support Services","N/A","Exemplary Infrastructure Development and Donations for Education by a Politician","Babajide Sanwo-Olu","Nigeria","Lagos","Constructed over 100 new schools and renovated 500+ existing schools."],
  [136,"Political Leaders in Nigeria 2024 Recognition Award for the Best Educational Support Services","N/A","Exemplary Infrastructure Development and Donations for Education by a Politician","Godwin Obaseki","Nigeria","Edo","Built 200+ new classrooms and established digital learning centers through the EdoBEST program."],
  [137,"Political Leaders in Nigeria 2024 Recognition Award for the Best Educational Support Services","N/A","Exemplary Infrastructure Development and Donations for Education by a Politician","Seyi Makinde","Nigeria","Oyo","Constructed 300+ new classrooms, renovated 1,000+ schools, and built modern libraries."],
  [138,"Political Leaders in Nigeria 2024 Recognition Award for the Best Educational Support Services","N/A","Advocacy and Policy Development for Education by a Politician","Femi Gbajabiamila","Nigeria","Lagos","As Speaker, championed the passage of multiple education bills."],

  // ═══════════════════════════════════════════════════════════════════
  // CATEGORY 13: Creative Arts Industry
  // ═══════════════════════════════════════════════════════════════════
  [139,"Creative Arts Industry Contribution to Education in Nigeria 2024","N/A","Best Music for Educational Impact Award","2Baba (2face Idibia)","Nigeria","","Used his music and platform to advocate for education reform."],
  [140,"Creative Arts Industry Contribution to Education in Nigeria 2024","N/A","Best Film and Media for Educational Advancement Award","Kunle Afolayan","Nigeria","","Created impactful educational films highlighting societal issues."],
  [141,"Creative Arts Industry Contribution to Education in Nigeria 2024","N/A","Best Nollywood Production and Artiste for Educational Content Award","Genevieve Nnaji","Nigeria","","Directed and starred in a film that highlights gender equality and entrepreneurship."],
  [142,"Creative Arts Industry Contribution to Education in Nigeria 2024","N/A","Best Literature and Art Works for Education Award","Chimamanda Ngozi Adichie","Nigeria","","Authored a novel that educates readers about the Nigerian Civil War."],
  [143,"Creative Arts Industry Contribution to Education in Nigeria 2024","N/A","Best Literature and Art Works for Education Award","Wole Soyinka","Nigeria","","Wrote plays exploring African culture, colonialism, and the role of education."],
  [144,"Creative Arts Industry Contribution to Education in Nigeria 2024","N/A","Best Visual Arts and Educational Impact Award","Bruce Onobrakpeya","Nigeria","","Created art reflecting Nigeria's cultural heritage and educational themes."],
  [145,"Creative Arts Industry Contribution to Education in Nigeria 2024","N/A","Best Creative Advocacy and Educational Campaigns Award","ONE Campaign","Nigeria","","Led impactful campaigns advocating for education access and quality."],

  // ═══════════════════════════════════════════════════════════════════
  // CATEGORY 14: Best STEM Education Program (Africa-Regional)
  // ═══════════════════════════════════════════════════════════════════
  [146,"Best STEM Education Program or Project (Africa-Regional)","North Africa","The Best Innovative STEM Curriculum Development","Fondation Zakoura","Morocco","","Early-grade STEM/numeracy curriculum, Arabic/Tamazight, UDL teacher guides."],
  [147,"Best STEM Education Program or Project (Africa-Regional)","North Africa","The Best Innovative STEM Curriculum Development","Educate Me Foundation","Egypt","","Competency-based STEM modules (Arabic), teacher coaching + observation rubrics."],
  [148,"Best STEM Education Program or Project (Africa-Regional)","West Africa","The Best Innovative STEM Curriculum Development","CAMFED Ghana","Ghana","","Structured numeracy & science extension units for girls' education."],
  [149,"Best STEM Education Program or Project (Africa-Regional)","East Africa","The Best Innovative STEM Curriculum Development","Ubongo","Tanzania","","Award-winning edutainment; cartoon-delivered STEM lessons reaching millions."],
  [150,"Best STEM Education Program or Project (Africa-Regional)","South Africa","The Best Innovative STEM Curriculum Development","Afrika Tikkun","South Africa","","After-school STEM programs; teacher PD & mentoring."],
  [151,"Best STEM Education Program or Project (Africa-Regional)","Central Africa","The Best Innovative STEM Curriculum Development","Jesuit Refugee Service (JRS)","DRC/CAR/TD/CM","","Accelerated STEM curricula; multilingual UDL; teacher training."],
  [152,"Best STEM Education Program or Project (Africa-Regional)","North Africa","The Best STEM Outreach and Community Engagement","Association l'Heure Joyeuse","Morocco","","Remedial math/science curricula with UDL printables; urban public-school partnerships."],
  [153,"Best STEM Education Program or Project (Africa-Regional)","West Africa","The Best STEM Outreach and Community Engagement","WAEC STEM Hub","Nigeria","","Pan-African STEM assessment and outreach programs."],
  [154,"Best STEM Education Program or Project (Africa-Regional)","East Africa","The Best STEM Outreach and Community Engagement","AIMS Tanzania","Tanzania","","Mathematics enrichment and teacher training programs."],
  [155,"Best STEM Education Program or Project (Africa-Regional)","South Africa","The Best STEM Outreach and Community Engagement","SAASTA (South African Agency for Science)","South Africa","","National science awareness campaigns and youth engagement."],
  [156,"Best STEM Education Program or Project (Africa-Regional)","Central Africa","The Best STEM Outreach and Community Engagement","AIMS Cameroon","Cameroon","","Maths circles, rural girls' outreach programs."],
  [157,"Best STEM Education Program or Project (Africa-Regional)","North Africa","The Best Technology Integration in STEM Education","ATLAR (Algeria)","Algeria","","Leading provider of digital classrooms and e-learning solutions."],
  [158,"Best STEM Education Program or Project (Africa-Regional)","West Africa","The Best Technology Integration in STEM Education","Andela Nigeria","Nigeria","","Developer training with tech-integrated STEM education."],
  [159,"Best STEM Education Program or Project (Africa-Regional)","East Africa","The Best Technology Integration in STEM Education","M-Shule","Kenya","","AI-powered learning via SMS, no internet required."],
  [160,"Best STEM Education Program or Project (Africa-Regional)","South Africa","The Best Technology Integration in STEM Education","Siyavula","South Africa","","Open textbook platform with adaptive practice engine."],
  [161,"Best STEM Education Program or Project (Africa-Regional)","Central Africa","The Best Technology Integration in STEM Education","Open Dreams","Cameroon","","School labs + mentor analytics; accessibility supports."],
];

// ═══════════════════════════════════════════════════════════════════
// METADATA
// ═══════════════════════════════════════════════════════════════════
export const DATASET_META = {
  source: "NESA_Award_Nominees_Master_List.xlsx",
  importedAt: "2026-03-08",
  totalInExcel: 1703,
  totalLoaded: 161, // Representative cross-category sample; full dataset via admin import
  season: "2025",
  archived2024: true,
  categories: [
    "Diaspora Association Educational Impact in Africa",
    "Overall best educational friendly state in Nigeria 2024",
    "The Overall Best CSR for Education in Nigeria Award 2024",
    "Best Africa Regional Companies CSR for Education Special Recognition Award in Africa 2024",
    "Best NGO Education Support Recognition Award (Africa-Regional)",
    "Best EduTech Organization in Nigeria and Africa 2024",
    "The best library in Nigerian tertiary institutions award 2024",
    "The Overall Best Research and Development Contribution by Research Institutes",
    "Best Media and advocacy for education in Nigeria 2024",
    "Christian faith organization Educational Champion of the Decade Award",
    "Islamic faith organization Educational Champion of the Decade Award",
    "Political Leaders in Nigeria 2024 Recognition Award",
    "Creative Arts Industry Contribution to Education in Nigeria 2024",
    "Best STEM Education Program or Project (Africa-Regional)",
  ],
};
