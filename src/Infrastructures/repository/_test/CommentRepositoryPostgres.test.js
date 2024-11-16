const CommentsTableTestHelper = require("../../../../tests/CommentTableTestHelper");
const ReplyTableTestHelper = require("../../../../tests/ReplyTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const AddComment = require("../../../Domains/comments/entities/AddComment");
const AddedComment = require("../../../Domains/comments/entities/AddedComment");
const DeleteComment = require("../../../Domains/comments/entities/DeleteComment");
const pool = require("../../database/postgres/pool");
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");

describe("CommentRepositoryPostgres", () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addComment function", () => {
    it("should persist add comment and return added comment correctly", async () => {
      await UsersTableTestHelper.addUser({ username: "dicoding" });
      await ThreadsTableTestHelper.addThread({
        owner: "user-123",
        title: "test",
        body: "test aja",
      });

      // Arrange
      const addComment = new AddComment({
        owner: "user-123",
        thread: "thread-123",
        content: "test aja",
      });
      const fakeIdGenerator = () => "123"; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await commentRepositoryPostgres.addComment(addComment);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById(
        "comment-123"
      );
      expect(comments).toHaveLength(1);
    });

    it("should return added comment correctly", async () => {
      await UsersTableTestHelper.addUser({ username: "dicoding" });
      await ThreadsTableTestHelper.addThread({
        owner: "user-123",
        title: "test",
        body: "test aja",
      });

      // Arrange
      const addComment = new AddComment({
        owner: "user-123",
        thread: "thread-123",
        content: "test aja",
      });
      const fakeIdGenerator = () => "123"; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(
        addComment
      );

      // Assert
      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: "comment-123",
          content: "test aja",
          owner: "user-123",
        })
      );
    });
  });

  describe("deleteComment function", () => {
    it("should success soft delete comment", async () => {
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
      const deleteComment = new DeleteComment({
        owner: "user-123",
        thread: "thread-123",
        comment: "comment-123",
      });
      const fakeIdGenerator = () => "123"; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await commentRepositoryPostgres.deleteComment(
        deleteComment
      );

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById(
        "comment-123"
      );
      expect(comments).toHaveLength(1);
      expect(comments[0].is_delete).toEqual(true);
    });
  });

  describe("verifyAvailableComment function", () => {
    it("should resolves comment found", async () => {
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
      const fakeIdGenerator = () => "123"; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Assert
      await expect(
        commentRepositoryPostgres.verifyAvailableComment("comment-123")
      ).resolves.toBeUndefined();
      expect(() =>
        commentRepositoryPostgres.verifyAvailableComment("comment-123")
      ).not.toThrow(new NotFoundError("comment tidak ditemukan"));
    });
    it("should error 404 comment not found", async () => {
      // Arrange
      const fakeIdGenerator = () => "123"; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Assert
      await expect(
        commentRepositoryPostgres.verifyAvailableComment("comment-123")
      ).rejects.toThrow(new NotFoundError("comment tidak ditemukan"));
    });
  });

  describe("verifyCommentOwner function", () => {
    it("should resolves user has comment", async () => {
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
      const fakeIdGenerator = () => "123"; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Assert
      await expect(
        commentRepositoryPostgres.verifyCommentOwner("user-123", "comment-123")
      ).resolves.toBeUndefined();
      expect(() =>
        commentRepositoryPostgres.verifyCommentOwner("user-123", "comment-123")
      ).not.toThrow(
        new AuthorizationError(
          "Hanya pemilik komentar yang dapat menghapus komentar"
        )
      );
    });
    it("should error 403 user is not authorized", async () => {
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
      const fakeIdGenerator = () => "123"; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Assert
      await expect(
        commentRepositoryPostgres.verifyCommentOwner("user-1233", "comment-123")
      ).rejects.toThrow(
        new AuthorizationError(
          "Hanya pemilik komentar yang dapat menghapus komentar"
        )
      );
    });
  });

  describe("getCommentsByThread function", () => {
    it("should success getCommentsByThread", async () => {
      await UsersTableTestHelper.addUser({ username: "dicoding" });
      await ThreadsTableTestHelper.addThread({
        owner: "user-123",
        title: "test",
        body: "test aja",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
      });

      const fakeIdGenerator = () => "123"; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const comments = await commentRepositoryPostgres.getCommentsByThread(
        "thread-123"
      );

      // Assert
      expect(comments).toHaveLength(1);
      expect(comments).toStrictEqual([{
        id: "comment-123",
        username: "dicoding",
        date: comments[0].date,
        content: "test aja",
        is_delete: false
      }]);
    });
  });
});
