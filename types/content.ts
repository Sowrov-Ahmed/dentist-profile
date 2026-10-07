export type NavigationItem = {
  label: string;
  href: string;
  children?: NavigationItem[];
};

export type SocialLink = {
  label: string;
  href: string;
};

export type SiteConfig = {
  brandName: string;
  tagline: string;
  siteUrl: string;
  logo: string;
  whiteLogo?: string;
  navigation?: NavigationItem[];
  navigationSource?: string;
  socialLinks: SocialLink[];
  footerCopy?: string;
  newsletterCopy?: string;
  newsletterSuccessMessage?: string;
  footerLegalLinks?: NavigationItem[];
  seo: {
    titleTemplate: string;
    defaultTitle: string;
    description: string;
  };
  disclaimer?: string;
};

export type Statistic = {
  value: string;
  numeric?: number;
  suffix?: string;
  label: string;
};

export type DoctorAboutSpecialistCredential = {
  abbreviation: string;
  title: string;
};

export type DoctorAboutSpecialistTraining = {
  period: string;
  qualification: string;
  institution: string;
  details: string;
};

export type DoctorAboutSpecialistExperience = {
  period: string;
  role: string;
  institution: string;
  description: string;
};

export type DoctorAboutSpecialist = {
  profile: {
    fullName: string;
    professionalTitle: string;
    specialistFocus: string;
    shortDescriptor: string;
    shortProfile: string;
    professionalPositioning: string;
    patientCareStatement: string;
    specialistDesignation: string;
    shortProfessionalSummary: string;
    credentials: string[];
    portraitImage: string;
    portraitAlt: string;
  };
  introduction: {
    heading: string;
    professionalApproach: string;
    specialistExperience: string;
    patientCarePhilosophy: string;
    communicationCommitment: string;
  };
  credentials: DoctorAboutSpecialistCredential[];
  academicPosition: {
    role: string;
    department: string;
    institution: string;
    period: string;
  };
  credentialsAndSpecialization: {
    dentalSpecialization: string;
    coreProfessionalCredentials: string[];
    areasOfSpecialistExpertise: string[];
  };
  education: DoctorAboutSpecialistTraining[];
  internationalTraining: DoctorAboutSpecialistTraining[];
  experience: DoctorAboutSpecialistExperience[];
  career: DoctorAboutSpecialistExperience[];
  qualifications: DoctorAboutSpecialistTraining[];
  memberships: Array<{
    organization: string;
    role: string;
  }>;
  awards: Array<{
    title: string;
    year: string;
    institution: string;
  }>;
};

export type DoctorProfile = {
  name: string;
  title: string;
  shortTitle: string;
  profileNotice?: string;
  aboutSpecialist: DoctorAboutSpecialist;
  qualifications: string[];
  professionalInfo: string[];
  heroEyebrow: string;
  heroTitle: string;
  heroHighlight?: string;
  heroDescription: string;
  appointmentCta: string;
  phone: string;
  secondaryPhone?: string;
  email: string;
  secondaryEmail?: string;
  address: string;
  officeHours: string[];
  profileImage: string;
  aboutImages: {
    main: string;
    side: string;
    generalMain?: string;
    generalSide?: string;
  };
  intro: string;
  aboutTitle: string;
  aboutDescription: string;
  homeAboutTitle?: string;
  homeAboutDescription?: string;
  highlights: string[];
  stats: Statistic[];
  questionBox?: {
    title: string;
    description: string;
  };
  happyPatients?: {
    value: string;
    label: string;
    image: string;
  };
  emergencyNote: string;
};

export type DetailSection = {
  heading: string;
  body: string;
};

export type ServiceFAQ = {
  question: string;
  answer: string;
};

export type DentalService = {
  id: string;
  slug: string;
  number: string;
  title: string;
  tabTitle: string;
  summary: string;
  description: string;
  homeCopy: string;
  homeCopyLead?: string;
  homeCopyRest?: string;
  icon: string;
  homeIcon?: string;
  image: string;
  homeImage?: string;
  detailImage: string;
  detailImages: string[];
  features: string[];
  benefits: string[];
  detailSections: DetailSection[];
  procedureSteps?: string[];
  faqs?: ServiceFAQ[];
  relatedSlugs: string[];
};

export type CaseStudy = {
  id: string;
  slug: string;
  number: string;
  label: string;
  title: string;
  shortTitle: string;
  summary: string;
  image: string;
  detailImage: string;
  detailImages: string[];
  challenge: string;
  approach: string;
  outcome: string;
  points: string[];
  relatedServiceSlugs: string[];
  relatedCaseSlugs?: string[];
};

export type BlogContentBlock = {
  heading: string;
  body: string;
};

export type BlogComment = {
  id: string;
  name: string;
  date: string;
  image: string;
  body: string;
  replies?: BlogComment[];
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  homeTitle?: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  comments: number;
  views: number;
  image: string;
  homeImage?: string;
  detailImage: string;
  videoImage: string;
  tags: string[];
  content: BlogContentBlock[];
  checklist: string[];
  quote: {
    text: string;
    name: string;
    role: string;
  };
  commentsList: BlogComment[];
};

export type HomeContent = {
  servicesIntro: {
    eyebrow: string;
    title: string;
    description: string;
  };
  choose: {
    eyebrow: string;
    title: string;
    description: string;
    image: string;
    items: Array<{
      number: string;
      title: string;
      description: string;
    }>;
  };
  videoCount: {
    title: string;
    description: string;
    videoUrl: string;
  };
  appointment: {
    eyebrow: string;
    title: string;
    description: string;
    successMessage: string;
  };
  caseEyebrow: string;
  caseTitle: string;
  testimonialEyebrow: string;
  testimonialTitle: string;
  blogEyebrow: string;
  blogTitle: string;
};

export type Testimonial = {
  name: string;
  role: string;
  image: string;
  quote: string;
  rating: number;
};

export type FAQ = {
  id: string;
  question: string;
  answer: string;
};

export type ContactContent = {
  title: string;
  subtitle: string;
  mapEmbedUrl: string;
  mapTitle: string;
};

export type ChamberSchedule = {
  days: string;
  hours: string;
};

export type ChamberFees = {
  new_patient: string;
  follow_up: string;
  telemedicine: string;
  report_review: string;
};

export type Chamber = {
  id: string;
  name: string;
  address: string;
  tag: string;
  days: string;
  hours: string;
  additionalSchedule: ChamberSchedule[];
  phone: string;
  primary: boolean;
  perPatientTime: number;
  fees: ChamberFees;
  mapUrl: string;
};

export type AppointmentConsultationType = {
  id: keyof ChamberFees;
  label: string;
  description: string;
};

export type AppointmentContent = {
  eyebrow: string;
  title: string;
  description: string;
  submitLabel: string;
  successMessage: string;
  consultationTypes: AppointmentConsultationType[];
};

export type AppointmentRequest = {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  preferredDate?: string;
  chamberId?: string;
  chamberName?: string;
  message: string;
};

export type AppointmentSubmissionRequest = {
  chamberId: string;
  consultationType: keyof ChamberFees;
  preferredDate: string;
  fullName: string;
  phone: string;
  email: string;
  reason: string;
};

export type AppointmentResponse = {
  id: string;
  status: "received";
  message: string;
  receivedAt: string;
};

export type AppointmentSubmissionResponse = AppointmentResponse & {
  selectedChamber: Pick<Chamber, "id" | "name" | "address" | "phone" | "primary">;
  consultationType: AppointmentConsultationType;
  fee: string;
};

export type NewsletterResponse = {
  status: "received";
  message: string;
  receivedAt: string;
};

export type BlogCommentRequest = {
  postSlug: string;
  name: string;
  email: string;
  comment: string;
};

export type BlogCommentResponse = {
  id: string;
  status: "received";
  message: string;
  receivedAt: string;
};
