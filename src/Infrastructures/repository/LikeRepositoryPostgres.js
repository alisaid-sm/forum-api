const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const LikeRepository = require("../../Domains/likes/LikeRepository");

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addLike(comment, owner) {
    const id = `like-${this._idGenerator()}`;

    const query = {
      text: "INSERT INTO likes VALUES($1, $2, $3) RETURNING id, owner, comment",
      values: [id, owner, comment],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async verifyAvailableLikeInComment(comment, owner) {
    const query = {
      text: "SELECT id FROM likes WHERE comment = $1 AND owner = $2",
      values: [comment, owner],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async deleteLike(comment, owner) {
    const query = {
      text: 'UPDATE "likes" SET "is_delete" = TRUE where "comment" = $1 AND "owner" = $2 returning "id"',
      values: [comment, owner],
    };

    await this._pool.query(query);
  }

  async restoreLike(comment, owner) {
    const query = {
      text: 'UPDATE "likes" SET "is_delete" = FALSE where "comment" = $1 AND "owner" = $2 returning "id"',
      values: [comment, owner],
    };

    await this._pool.query(query);
  }

  async getTotalLikesByComments(commentIds) {
    const query = {
      text: `
      SELECT 
        "likes"."comment", 
        COUNT("likes"."id")
      FROM likes 
      WHERE 
        "likes"."comment" = ANY($1::text[]) 
        AND "likes"."is_delete" = FALSE
      GROUP BY "likes"."comment"
      `,
      values: [commentIds],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }
}

module.exports = LikeRepositoryPostgres;
