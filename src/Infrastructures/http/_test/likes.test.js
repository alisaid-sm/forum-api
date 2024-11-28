const pool = require("../../database/postgres/pool");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const container = require("../../container");
const createServer = require("../createServer");
const ThreadsTableTestHelper = require("../../../../tests/ThreadTableTestHelper");
const AuthenticationTokenManager = require("../../../Applications/security/AuthenticationTokenManager");
const CommentsTableTestHelper = require("../../../../tests/CommentTableTestHelper");
const ReplyTableTestHelper = require("../../../../tests/ReplyTableTestHelper");
const LikeTableTestHelper = require("../../../../tests/LikeTableTestHelper");

let accessToken;
let authenticationTokenManager;

describe("/threads/{threadId}/comments/{commentId}/replies endpoint", () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ username: "dicoding" });

    authenticationTokenManager = container.getInstance(
      AuthenticationTokenManager.name
    );
    accessToken = await authenticationTokenManager.createAccessToken({
      username: "dicoding",
      id: "user-123",
    });
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  afterEach(async () => {
    await LikeTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  describe("when PUT /threads/{threadId}/comments/{commentId}/likes", () => {
    beforeEach(async () => {
      await ThreadsTableTestHelper.addThread({
        owner: "user-123",
        title: "test",
        body: "test aja",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
      });
    });

    it("should response 200", async () => {
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "PUT",
        url: "/threads/thread-123/comments/comment-123/likes",
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
    });

    it("should response 401 when no access token", async () => {
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "PUT",
        url: "/threads/thread-123/comments/comment-123/likes",
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual("Missing authentication");
    });

    it("should response 404 when thread not found", async () => {
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "PUT",
        url: "/threads/xxx/comments/comment-123/likes",
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("thread tidak ditemukan");
    });

    it("should response 404 when comment not found", async () => {
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "PUT",
        url: "/threads/thread-123/comments/xxx/likes",
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("comment tidak ditemukan");
    });
  });
});
