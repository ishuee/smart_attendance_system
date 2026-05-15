const pool = require('../db/connection');

const login = async (req, res) => {
  const { email, password } = req.body;

  console.log("Email received:", email);

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    console.log("DB result:", result.rows); 

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'User not found' });
    }

    const user = result.rows[0];

    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        role: user.role,
        email: user.email
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { login };