const ThreadsTableTestHelper = require("../../../../tests/ThreadTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const AddThread = require("../../../Domains/threads/entities/AddThread");
const AddedThread = require("../../../Domains/threads/entities/AddedThread");
const pool = require("../../database/postgres/pool");
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");

describe("ThreadRepositoryPostgres", () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addThread function", () => {
    it("should persist add thread and return added thread correctly", async () => {
      await UsersTableTestHelper.addUser({ username: "dicoding" });

      // Arrange
      const addThread = new AddThread({
        owner: "user-123",
        title: "test",
        body: "test aja",
      });
      const fakeIdGenerator = () => "123"; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await threadRepositoryPostgres.addThread(addThread);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadsById(
        "thread-123"
      );
      expect(threads).toHaveLength(1);
    });

    it("should return added thread correctly", async () => {
      await UsersTableTestHelper.addUser({ username: "dicoding" });

      // Arrange
      const addThread = new AddThread({
        owner: "user-123",
        title: "test",
        body: "test aja",
      });
      const fakeIdGenerator = () => "123"; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(addThread);

      // Assert
      expect(addedThread).toStrictEqual(
        new AddedThread({
          id: "thread-123",
          title: "test",
          owner: "user-123",
        })
      );
    });
  });

  describe("verifyAvailableThread function", () => {
    it("should resolve thread available", async () => {
      await UsersTableTestHelper.addUser({ username: "dicoding" });
      await ThreadsTableTestHelper.addThread({ id: "thread-123" });

      const fakeIdGenerator = () => "123"; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Assert
      await expect(
        threadRepositoryPostgres.verifyAvailableThread("thread-123")
      ).resolves.toBeUndefined();
    });
    it("should error thread not found", async () => {
      const fakeIdGenerator = () => "123"; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Assert
      await expect(
        threadRepositoryPostgres.verifyAvailableThread("thread-123")
      ).rejects.toThrow(new NotFoundError("thread tidak ditemukan"));
    });
  });

  describe("getThread function", () => {
    it("should success get thread", async () => {
      await UsersTableTestHelper.addUser({ username: "dicoding" });
      await ThreadsTableTestHelper.addThread({ id: "thread-123" });

      const fakeIdGenerator = () => "123"; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const thread = await threadRepositoryPostgres.getThread("thread-123");

      // Assert
      expect(thread).toStrictEqual({
        id: "thread-123",
        title: "test",
        date: thread.date,
        body: "test aja",
        username: "dicoding",
      });
    });
  });
});
