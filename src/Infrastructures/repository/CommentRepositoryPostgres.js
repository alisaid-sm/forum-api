const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const CommentRepository = require("../../Domains/comments/CommentRepository");
const AddedComment = require("../../Domains/comments/entities/AddedComment");
const GotComment = require("../../Domains/threads/entities/GotThread");

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(addComment) {
    const { owner, thread, content } = addComment;

    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: "INSERT INTO comments VALUES($1, $2, $3, $4) RETURNING id, content, owner",
      values: [id, owner, thread, content],
    };

    const result = await this._pool.query(query);

    return new AddedComment({ ...result.rows[0] });
  }

  async verifyAvailableComment(commentId) {
    const query = {
      text: "SELECT id FROM comments WHERE id = $1",
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount <= 0) {
      throw new NotFoundError("comment tidak ditemukan");
    }
  }

  async verifyCommentOwner(ownerId, commentId) {
    const query = {
      text: "SELECT * FROM comments WHERE id = $1",
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (result.rows[0].owner !== ownerId) {
      throw new AuthorizationError(
        "Hanya pemilik komentar yang dapat menghapus komentar"
      );
    }
  }

  async deleteComment(deleteComment) {
    const query = {
      text: 'UPDATE "comments" SET "is_delete" = TRUE where "id" = $1 returning "id"',
      values: [deleteComment.comment],
    };

    await this._pool.query(query);
  }

  async getCommentsByThread(threadId) {
    const query = {
      text: `
      SELECT 
        "comments"."id", 
        "users"."username", 
        "comments"."date", 
        "comments"."content",
        "comments"."is_delete"
      FROM comments 
      INNER JOIN "users" 
      ON "comments"."owner" = "users"."id" 
      WHERE "comments"."thread" = $1 
      ORDER BY "date" asc
      `,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }
}

module.exports = CommentRepositoryPostgres;
