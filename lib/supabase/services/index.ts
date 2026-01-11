// News Services
export {
  getNews,
  getLatestNews,
  getFeaturedNews,
  getNewsBySlug,
  getNewsByCategory,
  getAllNewsSlugs,
} from './news';

// News Images Services
export {
  getNewsImages,
  getNewsFeaturedImage,
  getNewsImagesForList,
  type NewsImage,
} from './news-images';

// Events Services
export {
  getEvents,
  getUpcomingEvents,
  getFeaturedEvents,
  getEventBySlug,
  getEventsByType,
  getAllEventSlugs,
  EVENT_TYPE_CONFIG,
} from './events';

// Council Services
export {
  getCouncilSessions,
  getCouncilSessionBySlug,
  getCouncilSessionYears,
  getCouncilDecisions,
  getCouncilDecisionBySlug,
  getCouncilDecisionYears,
  getSessionsWithDecisionsCount,
  getSessionAnnouncements,
  getSessionsForHotarari,
  getAllSessionSlugs,
  getAllDecisionSlugs,
  type SessionSource,
} from './council';

// Document Services
export {
  getDocuments,
  getDocumentsByCategory,
  getDocumentCategories,
  getDocumentYears,
  getAssetDeclarations,
  getAssetDeclarationYears,
  getAssetDeclarationsByDepartment,
  getTransparencyDocuments,
  getTransparencyYears,
} from './documents';

// Staff & Council Members Services
export {
  getStaffMembers,
  getStaffByPosition,
  getLeadership,
  getCouncilMembers,
  getCouncilMembersWithCommissions,
  getCouncilCommissions,
  getCouncilCommissionsWithMembers,
  type StaffMember,
  type CouncilMember,
  type CouncilCommission,
} from './staff';

// Jobs Services
export {
  getJobVacancies,
  getActiveJobs,
  getJobVacancyBySlug,
  getAllJobSlugs,
  type JobVacancy,
  type JobVacancyDocument,
} from './jobs';

// Reports Services
export {
  getReports,
  getReportsByType,
  getReportBySlug,
  getReportYears,
  getAllReportSlugs,
  type Report,
} from './reports';

// Programs Services
export {
  getPrograms,
  getProgramBySlug,
  getProgramsByType,
  getFeaturedPrograms,
  getAllProgramSlugs,
  type Program,
  type ProgramDocument,
} from './programs';

// Pages & FAQ Services
export {
  getPageBySlug,
  getPageByPath,
  getPages,
  getChildPages,
  getFAQs,
  getFAQsByCategory,
  getFAQCategories,
  getAllPageSlugs,
  type Page,
  type FAQ,
} from './pages';
