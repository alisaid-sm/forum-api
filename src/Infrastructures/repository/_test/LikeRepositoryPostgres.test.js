const CommentsTableTestHelper = require("../../../../tests/CommentTableTestHelper");
const LikeTableTestHelper = require("../../../../tests/LikeTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const pool = require("../../database/postgres/pool");
const LikeRepositoryPostgres = require("../LikeRepositoryPostgres");

describe("ReplyRepositoryPostgres", () => {
  afterEach(async () => {
    await LikeTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addLike function", () => {
    it("should return added like correctly", async () => {
      await UsersTableTestHelper.addUser({ username: "dicoding" });
      await ThreadsTableTestHelper.addThread({
        owner: "user-123",
        title: "test",
        body: "test aja",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
      });

      // Arrange
      const payload = {
        owner: "user-123",
        thread: "thread-123",
        comment: "comment-123",
      };
      const fakeIdGenerator = () => "123"; // stub!
      const likeRepositoryPostgres = new LikeRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const addedLike = await likeRepositoryPostgres.addLike(payload.comment, payload.owner);

      // Assert
      expect(addedLike).toStrictEqual({
        id: "like-123",
        owner: "user-123",
        comment: "comment-123",
      });
    });
  });

  describe("deleteLike function", () => {
    it("should success soft delete like", async () => {
      await UsersTableTestHelper.addUser({ username: "dicoding" });
      await ThreadsTableTestHelper.addThread({
        owner: "user-123",
        title: "test",
        body: "test aja",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
      });
      await LikeTableTestHelper.addLike({
        id: "like-123",
      });

      // Arrange
      const payload = {
        owner: "user-123",
        thread: "thread-123",
        comment: "comment-123",
      };
      const fakeIdGenerator = () => "123"; // stub!
      const likeRepositoryPostgres = new LikeRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await likeRepositoryPostgres.deleteLike(payload.comment, payload.owner);

      // Assert
      const likes = await LikeTableTestHelper.findLikesById("like-123");
      expect(likes).toHaveLength(1);
      expect(likes[0].is_delete).toEqual(true);
    });
  });

  describe("restoreLike function", () => {
    it("should success restore like", async () => {
      await UsersTableTestHelper.addUser({ username: "dicoding" });
      await ThreadsTableTestHelper.addThread({
        owner: "user-123",
        title: "test",
        body: "test aja",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
      });
      await LikeTableTestHelper.addLike({
        id: "like-123",
        is_delete: true
      });

      // Arrange
      const payload = {
        owner: "user-123",
        thread: "thread-123",
        comment: "comment-123",
      };
      const fakeIdGenerator = () => "123"; // stub!
      const likeRepositoryPostgres = new LikeRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await likeRepositoryPostgres.restoreLike(payload.comment, payload.owner);

      // Assert
      const likes = await LikeTableTestHelper.findLikesById("like-123");
      expect(likes).toHaveLength(1);
      expect(likes[0].is_delete).toEqual(false);
    });
  });

  describe("verifyAvailableLikeInComment function", () => {
    it("should resolves like found", async () => {
      await UsersTableTestHelper.addUser({ username: "dicoding" });
      await ThreadsTableTestHelper.addThread({
        owner: "user-123",
        title: "test",
        body: "test aja",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
      });
      await LikeTableTestHelper.addLike({
        id: "like-123",
      });

      // Arrange
      const payload = {
        owner: "user-123",
        thread: "thread-123",
        comment: "comment-123",
      };
      const fakeIdGenerator = () => "123"; // stub!
      const likeRepositoryPostgres = new LikeRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Assert
      await expect(
        likeRepositoryPostgres.verifyAvailableLikeInComment(payload.comment, payload.owner)
      ).resolves.toHaveLength(1);
    });
  });

  describe("getTotalLikesByComments function", () => {
    it("should success getTotalLikesByComments", async () => {
      await UsersTableTestHelper.addUser({ username: "dicoding" });
      await ThreadsTableTestHelper.addThread({
        owner: "user-123",
        title: "test",
        body: "test aja",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
      });
      await LikeTableTestHelper.addLike({
        id: "like-123",
      });

      const fakeIdGenerator = () => "123"; // stub!
      const likeRepositoryPostgres = new LikeRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const likes = await likeRepositoryPostgres.getTotalLikesByComments([
        "comment-123",
      ]);

      // Assert
      expect(likes).toHaveLength(1);
      expect(likes).toStrictEqual([
        {
          comment: "comment-123",
          count: "1",
        },
      ]);
    });
  });
});
