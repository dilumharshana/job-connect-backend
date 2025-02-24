import db from "../../configs/dbConnection.js";

const connection = await db.getConnection();

const createApplicant = async (req, res) => {
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
      4
    ]);

    const companyQuery = "INSERT INTO applicants (name, user_id) VALUES (?, ?)";

    const [companyData] = await connection.execute(companyQuery, [
      name,
      userData?.insertId
    ]);

    await connection.commit();

    res.status(201).json({
      data: { userId: companyData.insertId }
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message
    });
  }
};

const getAllJobs = async (req, res) => {
  try {
    const { category, applicantId } = req.params;

    if (!category || !applicantId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let jobQuery =
      "SELECT jobs.*, company.name as companyName FROM jobs LEFT JOIN company on jobs.company = company.id where jobs.id NOT IN (SELECT jobId from applications WHERE applicantId = ?) AND jobs.isActive = 1 ";

    if (category !== "all") {
      jobQuery =
        "SELECT jobs.*, company.name as companyName FROM jobs LEFT JOIN company on jobs.company = company.id where jobs.id NOT IN (SELECT jobId from applications WHERE applicantID = ?) AND jobs.isActive = 1 AND jobs.category = ? ";
    }

    let jobData = [];

    if (category !== "all") {
      jobData = await connection.execute(jobQuery, [applicantId, category]);
    } else {
      jobData = await connection.execute(jobQuery, [applicantId]);
      console.log(jobData);
    }

    res.status(201).json({
      data: jobData?.[0]
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      message: error.message
    });
  }
};

const applyJob = async (req, res) => {
  try {
    const {
      applicantId,
      companyId,
      jobId,
      communication_level,
      job_knowledge_level,
      critical_thinking_level,
      cv_data
    } = req.body;

    if (
      !applicantId ||
      !companyId ||
      !jobId ||
      communication_level === "" ||
      job_knowledge_level === "" ||
      critical_thinking_level === "" ||
      !cv_data
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const applicationQuery =
      "INSERT INTO applications (companyId, jobId, applicantId, communication_level, job_knowledge_level, critical_thinking_level, cv_data, status) VALUES (?,?,?,?,?,?,?,?)";

    const [applicationData] = await connection.execute(applicationQuery, [
      companyId,
      jobId,
      applicantId,
      communication_level,
      job_knowledge_level,
      critical_thinking_level,
      cv_data,
      "applied"
    ]);
    console.log(applicationData);

    res.status(201).json({
      data: { applicationId: applicationData?.insertId }
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message
    });
  }
};

const CompanyModule = {
  createApplicant,
  getAllJobs,
  applyJob
};

export default CompanyModule;
