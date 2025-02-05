import db from "../../configs/dbConnection.js";

const connection = db.getConnection();

const createCompany = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    await connection.beginTransaction();

    const createUserQuery =
      "INSERT INTO users (email,password,type) VALUES (?,?,?)";

    const [userData] = await connection.execute(createUserQuery, [
      email,
      password,
      1
    ]);

    // const query =
    //   "INSERT INTO company (name, email, password) VALUES (?, ?, ?)";

    // connection.query(query, [name, email, password], (err, results) => {
    //   if (err) {
    //     console.error("Error executing query:", err.stack);
    //     return res.status(500).json({ error: "Failed to save company data" });
    //   }

    await connection.commit();

    res.status(201).json({
      message: "Company data saved successfully",
      companyId: results.insertId
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
