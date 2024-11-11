const CommentsTableTestHelper = require("../../../../tests/CommentTableTestHelper");
const ReplyTableTestHelper = require("../../../../tests/ReplyTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const AddComment = require("../../../Domains/comments/entities/AddComment");
const AddedComment = require("../../../Domains/comments/entities/AddedComment");
const DeleteComment = require("../../../Domains/comments/entities/DeleteComment");
const GetComment = require("../../../Domains/comments/entities/GetComment");
const GotComment = require("../../../Domains/comments/entities/GotComment");
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
      await commentRepositoryPostgres.deleteComment(deleteComment);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById(
        "comment-123"
      );
      expect(comments).toHaveLength(1);
      expect(comments[0].is_delete).toEqual(true);
    });
  });

  describe("getComment function", () => {
    it("should success get comment and return got comment correctly", async () => {
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
      const getComment = new GetComment({
        thread: "thread-123",
      });
      const fakeIdGenerator = () => "123"; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const gotComment = await commentRepositoryPostgres.getComment(getComment);

      // Assert
      expect(gotComment.comments).toHaveLength(1);
      expect(gotComment).toStrictEqual(
        new GotComment({
          id: "thread-123",
          title: "test",
          body: "test aja",
          date: gotComment.date,
          username: "dicoding",
          comments: [
            {
              id: "comment-123",
              username: "dicoding",
              date: gotComment.comments[0].date,
              content: "test aja",
              replies: [],
            },
          ],
        })
      );
    });
    it("should success get comment with reply and return got comment with reply correctly", async () => {
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
      const getComment = new GetComment({
        thread: "thread-123",
      });
      const fakeIdGenerator = () => "123"; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const gotComment = await commentRepositoryPostgres.getComment(getComment);

      // Assert
      expect(gotComment.comments).toHaveLength(1);
      expect(gotComment).toStrictEqual(
        new GotComment({
          id: "thread-123",
          title: "test",
          body: "test aja",
          date: gotComment.date,
          username: "dicoding",
          comments: [
            {
              id: "comment-123",
              username: "dicoding",
              date: gotComment.comments[0].date,
              content: "test aja",
              replies: [
                {
                  id: "reply-123",
                  username: "dicoding",
                  date: gotComment.comments[0].replies[0].date,
                  content: "test aja",
                },
              ],
            },
          ],
        })
      );
    });
    it("should success get comment with deleted comment and return got comment correctly", async () => {
      await UsersTableTestHelper.addUser({ username: "dicoding" });
      await ThreadsTableTestHelper.addThread({
        owner: "user-123",
        title: "test",
        body: "test aja",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        is_delete: true,
      });

      // Arrange
      const getComment = new GetComment({
        thread: "thread-123",
      });
      const fakeIdGenerator = () => "123"; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const gotComment = await commentRepositoryPostgres.getComment(getComment);

      // Assert
      expect(gotComment.comments).toHaveLength(1);
      expect(gotComment).toStrictEqual(
        new GotComment({
          id: "thread-123",
          title: "test",
          body: "test aja",
          date: gotComment.date,
          username: "dicoding",
          comments: [
            {
              id: "comment-123",
              username: "dicoding",
              date: gotComment.comments[0].date,
              content: "**komentar telah dihapus**",
              replies: [],
            },
          ],
        })
      );
    });
    it("should success get comment with reply with deleted reply and return got comment correctly", async () => {
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
        is_delete: true
      });

      // Arrange
      const getComment = new GetComment({
        thread: "thread-123",
      });
      const fakeIdGenerator = () => "123"; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const gotComment = await commentRepositoryPostgres.getComment(getComment);

      // Assert
      expect(gotComment.comments).toHaveLength(1);
      expect(gotComment).toStrictEqual(
        new GotComment({
          id: "thread-123",
          title: "test",
          body: "test aja",
          date: gotComment.date,
          username: "dicoding",
          comments: [
            {
              id: "comment-123",
              username: "dicoding",
              date: gotComment.comments[0].date,
              content: "test aja",
              replies: [
                {
                  id: "reply-123",
                  username: "dicoding",
                  date: gotComment.comments[0].replies[0].date,
                  content: "**balasan telah dihapus**",
                },
              ],
            },
          ],
        })
      );
    });
  });
});
