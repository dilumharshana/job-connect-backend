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

const CompanyModule = {
  createCompany,
  createJob
};

export default CompanyModule;
