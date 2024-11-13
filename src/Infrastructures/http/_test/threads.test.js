const pool = require("../../database/postgres/pool");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const container = require("../../container");
const createServer = require("../createServer");
const ThreadsTableTestHelper = require("../../../../tests/ThreadTableTestHelper");
const AuthenticationTokenManager = require("../../../Applications/security/AuthenticationTokenManager");
const CommentsTableTestHelper = require("../../../../tests/CommentTableTestHelper");

let accessToken;

describe("/threads endpoint", () => {
  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ username: "dicoding" });
    const authenticationTokenManager = container.getInstance(
      AuthenticationTokenManager.name
    );
    accessToken = await authenticationTokenManager.createAccessToken({
      username: "dicoding",
      id: "user-123",
    });
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });

  describe("when POST /threads", () => {
    it("should response 201 and persisted thread", async () => {
      // Arrange
      const requestPayload = {
        title: "test",
        body: "test aja",
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.addedThread).toBeDefined();
    });

    it("should response 400 when request payload not contain needed property", async () => {
      // Arrange
      const requestPayload = {
        title: "test",
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada"
      );
    });

    it("should response 400 when request payload not meet data type specification", async () => {
      // Arrange
      const requestPayload = {
        title: "test",
        body: ["test aja"],
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "tidak dapat membuat thread baru karena tipe data tidak sesuai"
      );
    });

    it("should response 401 when no access token", async () => {
      // Arrange
      const requestPayload = {
        title: "test",
        body: "test aja",
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual(
        "Missing authentication"
      );
    });

    describe("when GET /threads/{threadId}", () => {
      beforeEach(async () => {
        await ThreadsTableTestHelper.addThread({
          owner: "user-123",
          title: "test",
          body: "test aja",
        });
        await CommentsTableTestHelper.addComment({
          id: "comment-123",
        });
      })
  
      it("should response 200 and get thread", async () => {
        const server = await createServer(container);
  
        // Action
        const response = await server.inject({
          method: "GET",
          url: "/threads/thread-123"
        });
  
        // Assert
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toEqual(200);
        expect(responseJson.status).toEqual("success");
        expect(responseJson.data.thread).toBeDefined();
      });
  
      it('should response 404 when thread not found', async () => {
        // Arrange
        const requestPayload = {};
  
        const server = await createServer(container);
  
        // Action
        const response = await server.inject({
          method: "GET",
          url: "/threads/xxx"
        });
  
        // Assert
        const responseJson = JSON.parse(response.payload);
  
        expect(response.statusCode).toEqual(404);
        expect(responseJson.status).toEqual('fail');
        expect(responseJson.message).toEqual('thread tidak ditemukan');
      });
    });
  });
});
