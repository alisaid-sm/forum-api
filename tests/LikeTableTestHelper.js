/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const LikeTableTestHelper = {
  async addLike({
    id = "like-123",
    owner = "user-123",
    comment = "comment-123",
    is_delete = false,
  }) {
    const query = {
      text: "INSERT INTO likes VALUES($1, $2, $3, $4, $5)",
      values: [id, owner, comment, new Date(), is_delete],
    };

    await pool.query(query);
  },

  async findLikesById(id) {
    const query = {
      text: 'SELECT * FROM likes WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM likes WHERE 1=1');
  },
};

module.exports = LikeTableTestHelper;
