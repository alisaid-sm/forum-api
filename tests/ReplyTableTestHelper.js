/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ReplyTableTestHelper = {
  async addReply({
    id = "reply-123",
    owner = "user-123",
    comment = "comment-123",
    content = "test aja",
    is_delete = false,
  }) {
    const query = {
      text: "INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6)",
      values: [id, owner, comment, content, new Date(), is_delete],
    };

    await pool.query(query);
  },

  async findRepliesById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM replies WHERE 1=1');
  },
};

module.exports = ReplyTableTestHelper;
