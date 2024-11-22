const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const AddedThread = require("../../Domains/threads/entities/AddedThread");
const ThreadRepository = require("../../Domains/threads/ThreadRepository");

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(addThread) {
    const { owner, title, body } = addThread;
    const id = `thread-${this._idGenerator()}`;

    const query = {
      text: "INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id, title, owner",
      values: [id, owner, title, body],
    };

    const result = await this._pool.query(query);

    return new AddedThread({ ...result.rows[0] });
  }

  async verifyAvailableThread(threadId) {
    const query = {
      text: "SELECT id FROM threads WHERE id = $1",
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount <= 0) {
      throw new NotFoundError("thread tidak ditemukan");
    }
  }

  async getThread(threadId) {
    const query = {
      text: `SELECT 
        "threads"."id", 
        "threads"."title", 
        "threads"."body", 
        "threads"."date", 
        "users"."username" 
      FROM "threads" 
      INNER JOIN "users" 
      ON "threads"."owner" = "users"."id" 
      WHERE "threads"."id" = $1`,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }
}

module.exports = ThreadRepositoryPostgres;
