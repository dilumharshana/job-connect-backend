import db from "../../configs/dbConnection.js";

const connection = await db.getConnection();

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const loginQuery =
      "SELECT user_types.type, users.id FROM user_types INNER JOIN users on user_types.id = users.type WHERE email = ? and password = ?";

    const [userData] = await connection.execute(loginQuery, [email, password]);

    const userType = userData?.[0]?.type;
    const userId = userData?.[0]?.id;

    let userName = "";

    if (userType === "COMPANY") {
      const userNameQuery = "SELECT name FROM company WHERE id = ?";
      const [userNameData] = await connection.execute(userNameQuery, [userId]);
      userName = userNameData[0]?.name;
    } else {
      const userNameQuery = "SELECT name FROM applicants WHERE id = ?";
      const [userNameData] = await connection.execute(userNameQuery, [userId]);
      userName = userNameData[0]?.name;
    }

    if (userData?.[0]) {
      res.status(201).json({
        data: { userType, userId, userName }
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
