const jobSources = [
  {
    id: "jobicy-all",
    name: "Jobicy All",
    url: "https://jobicy.com/?feed=job_feed"
  },
  {
    id: "jobicy-smm-full-time",
    name: "Jobicy SMM Full Time",
    url: "https://jobicy.com/?feed=job_feed&job_categories=smm&job_types=full-time"
  },
  {
    id: "jobicy-seller-france",
    name: "Jobicy Seller France",
    url: "https://jobicy.com/?feed=job_feed&job_categories=seller&job_types=full-time&search_region=france"
  },
  {
    id: "jobicy-design-multimedia",
    name: "Jobicy Design Multimedia",
    url: "https://jobicy.com/?feed=job_feed&job_categories=design-multimedia"
  },
  {
    id: "jobicy-data-science",
    name: "Jobicy Data Science",
    url: "https://jobicy.com/?feed=job_feed&job_categories=data-science"
  },
  {
    id: "jobicy-copywriting",
    name: "Jobicy Copywriting",
    url: "https://jobicy.com/?feed=job_feed&job_categories=copywriting"
  },
  {
    id: "jobicy-business",
    name: "Jobicy Business",
    url: "https://jobicy.com/?feed=job_feed&job_categories=business"
  },
  {
    id: "jobicy-management",
    name: "Jobicy Management",
    url: "https://jobicy.com/?feed=job_feed&job_categories=management"
  },
  {
    id: "higheredjobs",
    name: "HigherEdJobs",
    url: "https://www.higheredjobs.com/rss/articleFeed.cfm"
  }
];

const getJobSourceById = (id) => jobSources.find((source) => source.id === id);

module.exports = { jobSources, getJobSourceById };
