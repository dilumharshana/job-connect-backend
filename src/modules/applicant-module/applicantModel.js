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
    const { category } = req.params;

    if (!category) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let jobQuery = "SELECT * FROM jobs where isActive = 1";

    if (category !== "all") {
      jobQuery = "SELECT * FROM jobs where isActive = 1 AND category = ?";
    }

    const [jobData] = await connection.execute(jobQuery, [category]);

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
const CompanyModule = {
  createApplicant,
  getAllJobs
};

export default CompanyModule;
