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
      message: "Company data saved successfully",
      companyId: companyData.insertId
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error
    });
  }
};

const CompanyModule = {
  createCompany
};

export default CompanyModule;
