import db from "../../configs/dbConnection.js";

const connection = await db.getConnection();

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const loginQuery =
      "SELECT user_types.type FROM user_types INNER JOIN users on user_types.id = users.type WHERE email = ? and password = ?";

    const [userData] = await connection.execute(loginQuery, [email, password]);

    console.log(userData);

    if (userData?.[0]) {
      res.status(201).json({
        data: { userType: userData?.[0]?.type }
      });
    } else {
      res.status(404).json({
        message: "user not found"
      });
    }
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      message: error.message
    });
  }
};

const AuthModule = {
  userLogin
};

export default AuthModule;
