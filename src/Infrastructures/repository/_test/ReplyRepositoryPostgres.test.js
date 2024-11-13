const CommentsTableTestHelper = require("../../../../tests/CommentTableTestHelper");
const ReplyTableTestHelper = require("../../../../tests/ReplyTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const AddedReply = require("../../../Domains/replies/entities/AddedReply");
const AddReply = require("../../../Domains/replies/entities/AddReply");
const DeleteReply = require("../../../Domains/replies/entities/DeleteReply");
const pool = require("../../database/postgres/pool");
const ReplyRepositoryPostgres = require("../ReplyRepositoryPostgres");

describe("ReplyRepositoryPostgres", () => {
  afterEach(async () => {
    await ReplyTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addReply function", () => {
    it("should persist add reply and return added reply correctly", async () => {
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
      const addReply = new AddReply({
        owner: "user-123",
        thread: "thread-123",
        comment: "comment-123",
        content: "test aja",
      });
      const fakeIdGenerator = () => "123"; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await replyRepositoryPostgres.addReply(addReply);

      // Assert
      const replies = await ReplyTableTestHelper.findRepliesById(
        "reply-123"
      );
      expect(replies).toHaveLength(1);
    });

    it("should return added reply correctly", async () => {
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
      const addReply = new AddReply({
        owner: "user-123",
        thread: "thread-123",
        comment: "comment-123",
        content: "test aja",
      });
      const fakeIdGenerator = () => "123"; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const addedReply = await replyRepositoryPostgres.addReply(
        addReply
      );

      // Assert
      expect(addedReply).toStrictEqual(
        new AddedReply({
          id: "reply-123",
          content: "test aja",
          owner: "user-123",
        })
      );
    });
  });

  describe("deleteReply function", () => {
    it("should success soft delete reply", async () => {
      await UsersTableTestHelper.addUser({ username: "dicoding" });
      await ThreadsTableTestHelper.addThread({
        owner: "user-123",
        title: "test",
        body: "test aja",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
      });
      await ReplyTableTestHelper.addReply({
        id: "reply-123",
      });

      // Arrange
      const deleteReply = new DeleteReply({
        owner: "user-123",
        thread: "thread-123",
        comment: "comment-123",
        reply: "reply-123"
      });
      const fakeIdGenerator = () => "123"; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await replyRepositoryPostgres.deleteReply(deleteReply);

      // Assert
      const replies = await ReplyTableTestHelper.findRepliesById(
        "reply-123"
      );
      expect(replies).toHaveLength(1);
      expect(replies[0].is_delete).toEqual(true);
    });
  });

  describe("verifyAvailableReply function", () => {
    it("should resolves reply found", async () => {
      await UsersTableTestHelper.addUser({ username: "dicoding" });
      await ThreadsTableTestHelper.addThread({
        owner: "user-123",
        title: "test",
        body: "test aja",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
      });
      await ReplyTableTestHelper.addReply({
        id: "reply-123",
      });

      // Arrange
      const fakeIdGenerator = () => "123"; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Assert
      await expect(
        replyRepositoryPostgres.verifyAvailableReply("reply-123")
      ).resolves.toBeUndefined();
    });
    it("should error 404 reply not found", async () => {
      // Arrange
      const fakeIdGenerator = () => "123"; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Assert
      await expect(
        replyRepositoryPostgres.verifyAvailableReply("reply-123")
      ).rejects.toThrow(new NotFoundError("reply tidak ditemukan"));
    });
  });

  describe("verifyReplyOwner function", () => {
    it("should resolves user has reply", async () => {
      await UsersTableTestHelper.addUser({ username: "dicoding" });
      await ThreadsTableTestHelper.addThread({
        owner: "user-123",
        title: "test",
        body: "test aja",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
      });
      await ReplyTableTestHelper.addReply({
        id: "reply-123",
      });

      // Arrange
      const fakeIdGenerator = () => "123"; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Assert
      await expect(
        replyRepositoryPostgres.verifyReplyOwner("user-123", "reply-123")
      ).resolves.toBeUndefined();
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
      await ReplyTableTestHelper.addReply({
        id: "reply-123",
      });

      // Arrange
      const fakeIdGenerator = () => "123"; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Assert
      await expect(
        replyRepositoryPostgres.verifyReplyOwner("user-1233", "reply-123")
      ).rejects.toThrow(new AuthorizationError(
        "Hanya pemilik balasan yang dapat menghapus balasan"
      ));
    });
  });

  describe("getRepliesByComment function", () => {
    it("should success getRepliesByComment", async () => {
      await UsersTableTestHelper.addUser({ username: "dicoding" });
      await ThreadsTableTestHelper.addThread({
        owner: "user-123",
        title: "test",
        body: "test aja",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
      });
      await ReplyTableTestHelper.addReply({
        id: "reply-123",
      });

      const fakeIdGenerator = () => "123"; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const replies = await replyRepositoryPostgres.getRepliesByComment("comment-123");

      // Assert
      expect(replies).toHaveLength(1);
    });
  });
});
