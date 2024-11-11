const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const CommentRepository = require("../../Domains/comments/CommentRepository");
const AddedComment = require("../../Domains/comments/entities/AddedComment");
const GotComment = require("../../Domains/comments/entities/GotComment");

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

    const result = await this._pool.query(query);

    return result;
  }

  async getComment(getComment) {
    const queryThread = {
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
      values: [getComment.thread],
    };

    const resultThread = await this._pool.query(queryThread);

    const queryComments = {
      text: `
      SELECT 
        "comments"."id", 
        "users"."username", 
        "comments"."date", 
        CASE 
          WHEN "comments"."is_delete" THEN '**komentar telah dihapus**' 
          ELSE "comments"."content" 
        END AS "content"
      FROM comments 
      INNER JOIN "users" 
      ON "comments"."owner" = "users"."id" 
      WHERE "comments"."thread" = $1 
      ORDER BY "date" asc
      `,
      values: [getComment.thread],
    };

    const resultComment = await this._pool.query(queryComments);

    for (let i = 0; i < resultComment.rows.length; i++) {
      const queryReplies = {
        text: `
        SELECT 
          "replies"."id", 
          "users"."username", 
          "replies"."date", 
          CASE 
            WHEN "replies"."is_delete" THEN '**balasan telah dihapus**' 
            ELSE "replies"."content" 
          END AS "content"
        FROM replies 
        INNER JOIN "users" 
        ON "replies"."owner" = "users"."id" 
        WHERE "replies"."comment" = $1 
        ORDER BY "date" asc
        `,
        values: [resultComment.rows[i].id],
      };

      const resultReplies = await this._pool.query(queryReplies);

      resultComment.rows[i].replies = resultReplies.rows
    }

    resultThread.rows[0].comments = resultComment.rows;

    return new GotComment({ ...resultThread.rows[0] });
  }
}

module.exports = CommentRepositoryPostgres;
