import db from "../../configs/dbConnection.js";

const connection = await db.getConnection();

const createCompany = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    await connection.beginTransaction();

    const userQuery = "INSERT INTO users (email,password,type) VALUES (?,?,?)";

    const [userData] = await connection.execute(userQuery, [
      email,
      password,
      3
    ]);

    const companyQuery = "INSERT INTO company (name, user_id) VALUES (?, ?)";

    const [companyData] = await connection.execute(companyQuery, [
      name,
      userData?.insertId
    ]);

    await connection.commit();

    res.status(201).json({
      data: { userId: companyData.insertId }
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      message: error.message
    });
  }
};

const createJob = async (req, res) => {
  try {
    const {
      companyId,
      job_name,
      category,
      description,
      communication_level,
      critical_think_level,
      job_knowledge_level,
      work_mode,
      salary,
      experience
    } = req.body;

    console.log(req.body);

    if (
      !companyId ||
      !job_name ||
      !category ||
      !description ||
      !communication_level ||
      !critical_think_level ||
      !job_knowledge_level ||
      !work_mode ||
      !salary ||
      !experience
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const jobQuery =
      "INSERT INTO jobs (company, job_name, category, description, communication_level, job_knowledge_level, critical_think_level, experience, work_mode, salary ) VALUES (?,?,?,?,?,?,?,?,?,?)";

    const [jobData] = await connection.execute(jobQuery, [
      companyId,
      job_name,
      category,
      description,
      parseInt(communication_level),
      parseInt(critical_think_level),
      parseInt(job_knowledge_level),
      parseInt(experience),
      work_mode,
      salary
    ]);

    res.status(201).json({
      data: { jobId: jobData.id }
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      message: error.message
    });
  }
};

const getAllJobs = async (req, res) => {
  try {
    const { companyId } = req.params;

    if (!companyId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const jobQuery =
      "SELECT jobs.*, COUNT(applications.applicantId) as applicant_count FROM jobs left join applications on jobs.id = applications.jobId inner join company on jobs.company = company.id WHERE company.id = ? GROUP BY jobs.id;";

    const [jobData] = await connection.execute(jobQuery, [companyId]);

    res.status(201).json({
      data: jobData
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      message: error.message
    });
  }
};

const getDashboardData = async (req, res) => {
  try {
    const { companyId } = req.params;

    if (!companyId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const totalActiveJobCountQuery =
      "SELECT COUNT(*) AS activeJobCount FROM jobs WHERE company = ? AND isActive = 1";
    const [activeJobCount] = await connection.execute(
      totalActiveJobCountQuery,
      [companyId]
    );

    const totalInactiveJobCountQuery =
      "SELECT COUNT(*) AS inactiveJobCount FROM jobs WHERE company = ? AND isActive = 0";
    const [inActiveJobCount] = await connection.execute(
      totalInactiveJobCountQuery,
      [companyId]
    );

    const totalApplicantsCountQuery =
      "SELECT COUNT(applicantId) as total_applicants FROM applications inner join jobs on applications.jobId = jobs.id inner join company on jobs.company = company.id where company.id = ?";
    const [applicantsCount] = await connection.execute(
      totalApplicantsCountQuery,
      [companyId]
    );

    const mostAppliedJobQuery =
      "SELECT jobs.*, COUNT(*) AS applicant_count from jobs INNER JOIN applications on jobs.id = applications.jobId inner join company on  jobs.company = company.id  where company.id = ? GROUP BY applications.jobId ORDER BY applicant_count DESC LIMIT 1 ";
    const [mostAppliedJobCount] = await connection.execute(
      mostAppliedJobQuery,
      [companyId]
    );

    const leastAppliedJobQuery =
      "SELECT jobs.*, COUNT(*) AS applicants_count from jobs inner join applications on jobs.id = applications.jobId inner join company on jobs.company = company.id where company.id = ?  GROUP BY applications.jobId  ORDER BY applicants_count ASC LIMIT 1 ";
    const [leastAppliedJobCount] = await connection.execute(
      leastAppliedJobQuery,
      [companyId]
    );

    const jobClicksQuery =
      "SELECT COUNT(clicks) as jobClicks from jobs where company = ?";
    const [jobClickCount] = await connection.execute(jobClicksQuery, [
      companyId
    ]);

    res.status(201).json({
      data: {
        activeJobCount: activeJobCount?.[0]?.activeJobCount,
        inActiveJobCount: inActiveJobCount?.[0]?.inactiveJobCount,
        applicantsCount: applicantsCount?.[0].total_applicants,
        mostAppliedJob: mostAppliedJobCount?.[0],
        leastAppliedJob: leastAppliedJobCount?.[0],
        jobClicks: jobClickCount?.[0].jobClicks
      }
    });
  } catch (error) {
    console.log(error);
  }
};

const CompanyModule = {
  createCompany,
  createJob,
  getAllJobs,
  getDashboardData
};

export default CompanyModule;
