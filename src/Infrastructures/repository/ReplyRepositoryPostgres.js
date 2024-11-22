const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const AddedReply = require("../../Domains/replies/entities/AddedReply");
const ReplyRepository = require("../../Domains/replies/ReplyRepository");

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(addReply) {
    const { owner, comment, content } = addReply;

    const id = `reply-${this._idGenerator()}`;

    const query = {
      text: "INSERT INTO replies VALUES($1, $2, $3, $4) RETURNING id, content, owner",
      values: [id, owner, comment, content],
    };

    const result = await this._pool.query(query);

    return new AddedReply({ ...result.rows[0] });
  }

  async verifyAvailableReply(replyId) {
    const query = {
      text: "SELECT id FROM replies WHERE id = $1",
      values: [replyId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount <= 0) {
      throw new NotFoundError("reply tidak ditemukan");
    }
  }

  async verifyReplyOwner(ownerId, replyId) {
    const query = {
      text: "SELECT * FROM replies WHERE id = $1",
      values: [replyId],
    };

    const result = await this._pool.query(query);

    if (result.rows[0].owner !== ownerId) {
      throw new AuthorizationError(
        "Hanya pemilik balasan yang dapat menghapus balasan"
      );
    }
  }

  async deleteReply(deleteComment) {
    const query = {
      text: 'UPDATE "replies" SET "is_delete" = TRUE where "id" = $1 returning "id"',
      values: [deleteComment.reply],
    };

    await this._pool.query(query);
  }

  async getRepliesByComments(commentIds) {
    const query = {
      text: `
      SELECT 
        "replies"."id", 
        "users"."username", 
        "replies"."date", 
        "replies"."content", 
        "replies"."comment", 
        "replies"."is_delete"
      FROM replies 
      INNER JOIN "users" 
      ON "replies"."owner" = "users"."id" 
      WHERE "replies"."comment" = ANY($1::text[]) 
      ORDER BY "date" asc
      `,
      values: [commentIds],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }
}

module.exports = ReplyRepositoryPostgres;
