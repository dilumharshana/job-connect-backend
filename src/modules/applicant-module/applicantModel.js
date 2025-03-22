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

const getAllAppliedJobs = async (req, res) => {
  try {
    const { applicantId } = req.params;

    if (!applicantId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let jobQuery =
      "SELECT applications.*, jobs.job_name, company.name as company_name FROM applications INNER JOIN jobs ON applications.jobId = jobs.Id INNER JOIN company ON applications.companyId = company.id WHERE applications.applicantId = ? ";

    let [jobData] = await connection.execute(jobQuery, [applicantId]);

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
      "pending"
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

const updateApplicantQualifications = async (req, res) => {
  try {
    const {
      years_of_experience = 0,
      qualifications,
      skills,
      userId
    } = req.body;

    console.log(years_of_experience, qualifications, skills, userId);

    if (
      !userId ||
      years_of_experience === null ||
      years_of_experience === undefined ||
      !qualifications ||
      !skills
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let updatedQualifications = ``;
    let updatedSkills = ``;

    qualifications?.forEach((element) => {
      if (updatedQualifications === "") {
        updatedQualifications = `${element}`;
      } else {
        updatedQualifications = `${updatedQualifications},${element}`;
      }
    });

    skills?.forEach((element) => {
      if (updatedSkills === "") {
        updatedSkills = `${element}`;
      } else {
        updatedSkills = `${updatedSkills},${element}`;
      }
    });

    const userQuery =
      "UPDATE applicants SET years_of_experience = ?, qualifications = ?, skills = ? WHERE user_id = ?";

    const [userData] = await connection.execute(userQuery, [
      years_of_experience,
      updatedQualifications,
      updatedSkills,
      userId
    ]);

    res.status(201).json({
      data: { userId: userData.affectedRows }
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message
    });
  }
};

const getSettings = async (req, res) => {
  try {
    const { applicantId } = req.params;

    if (!applicantId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let jobQuery =
      "SELECT years_of_experience, qualifications, skills from applicants where user_id = ?";

    const [results] = await connection.execute(jobQuery, [applicantId]);

    const settings = {
      skills: results?.[0]?.skills
        ?.split(",")
        ?.map((skill) => ({ value: skill, label: skill })),
      qualifications: results?.[0]?.qualifications
        ?.split(",")
        ?.map((qualification) => ({
          value: qualification,
          label: qualification
        })),
      years_of_experience: results?.[0]?.years_of_experience
    };

    res.status(201).json(settings);
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      message: error.message
    });
  }
};

const CompanyModule = {
  createApplicant,
  getAllJobs,
  applyJob,
  getAllAppliedJobs,
  updateApplicantQualifications,
  getSettings
};

export default CompanyModule;
