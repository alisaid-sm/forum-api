const GotThread = require("../GotThread");

describe("a GotThread entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      id: "thread-123",
      title: "sebuah thread",
    };

    // Action and Assert
    expect(() => new GotThread(payload)).toThrow(
      "GOT_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not contain needed property in comments", () => {
    // Arrange
    const payload = {
      id: "thread-123",
      title: "sebuah thread",
      body: "sebuah body thread",
      date: new Date(),
      username: "dicoding",
      comments: [
        {
          id: "comment-_pby2_tmXV6bcvcdev8xk",
          username: "johndoe",
          date: new Date(),
        },
        {
          id: "comment-_pby2_tmXV6bcvcdev8xk",
          username: "dicoding",
          date: new Date(),
        },
      ],
    };

    // Action and Assert
    expect(() => new GotThread(payload)).toThrow(
      "GOT_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not contain needed property in replies", () => {
    // Arrange
    const payload = {
      id: "thread-123",
      title: "sebuah thread",
      body: "sebuah body thread",
      date: new Date(),
      username: "dicoding",
      comments: [
        {
          id: "comment-q_0uToswNf6i24RDYZJI3",
          username: "johndoe",
          date: new Date(),
          content: "sebuah comment",
          replies: [
            {
              id: 1,
              content: "**balasan telah dihapus**",
              date: "2021-08-08T07:59:48.766Z"
            },
          ],
        },
        {
          id: "comment-q_0uToswNf6i24RDYZJIs",
          username: "dicoding",
          date: new Date(),
          content: "**komentar telah dihapus**",
          replies: [
            {
              id: 1,
              content: "**balasan telah dihapus**",
              date: "2021-08-08T07:59:48.766Z"
            }
          ],
        },
      ],
    };

    // Action and Assert
    expect(() => new GotThread(payload)).toThrow(
      "GOT_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      id: "thread-123",
      title: "sebuah thread",
      body: "sebuah body thread",
      date: "2021-08-08T07:19:09.775Z",
      username: "dicoding",
      comments: [
        {
          id: 1,
          username: "johndoe",
          date: "2021-08-08T07:22:33.555Z",
          content: "sebuah comment",
        },
        {
          id: 2,
          username: "dicoding",
          date: "2021-08-08T07:26:21.338Z",
          content: "**komentar telah dihapus**",
        },
      ],
    };

    // Action and Assert
    expect(() => new GotThread(payload)).toThrow(
      "GOT_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should throw error when payload did not meet data type specification in comments", () => {
    // Arrange
    const payload = {
      id: "thread-123",
      title: "sebuah thread",
      body: "sebuah body thread",
      date: new Date(),
      username: "dicoding",
      comments: [
        {
          id: 1,
          username: "johndoe",
          date: "2021-08-08T07:22:33.555Z",
          content: "sebuah comment",
          replies: [],
        },
        {
          id: 2,
          username: "dicoding",
          date: "2021-08-08T07:26:21.338Z",
          content: "**komentar telah dihapus**",
          replies: [],
        },
      ],
    };

    // Action and Assert
    expect(() => new GotThread(payload)).toThrow(
      "GOT_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should throw error when payload did not meet data type specification in replies", () => {
    // Arrange
    const payload = {
      id: "thread-123",
      title: "sebuah thread",
      body: "sebuah body thread",
      date: new Date(),
      username: "dicoding",
      comments: [
        {
          id: "comment-q_0uToswNf6i24RDYZJI3",
          username: "johndoe",
          date: new Date(),
          content: "sebuah comment",
          replies: [
            {
              id: 1,
              content: "**balasan telah dihapus**",
              date: "2021-08-08T07:59:48.766Z",
              username: "johndoe",
            },
          ],
        },
        {
          id: "comment-q_0uToswNf6i24RDYZJIs",
          username: "dicoding",
          date: new Date(),
          content: "**komentar telah dihapus**",
          replies: [
            {
              id: 1,
              content: "**balasan telah dihapus**",
              date: "2021-08-08T07:59:48.766Z",
              username: "johndoe",
            }
          ],
        },
      ],
    };

    // Action and Assert
    expect(() => new GotThread(payload)).toThrow(
      "GOT_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create gotThread object correctly", () => {
    // Arrange
    const payload = {
      id: "thread-123",
      title: "sebuah thread",
      body: "sebuah body thread",
      date: new Date(),
      username: "dicoding",
      comments: [
        {
          id: "comment-_pby2_tmXV6bcvcdev8xk",
          username: "johndoe",
          date: new Date(),
          content: "sebuah comment",
          replies: [
            {
              id: "reply-123",
              content: "**balasan telah dihapus**",
              date: new Date(),
              username: "johndoe",
            },
          ],
        },
        {
          id: "comment-yksuCoxM2s4MMrZJO-qVD",
          username: "dicoding",
          date: new Date(),
          content: "**komentar telah dihapus**",
          replies: [
            {
              id: "reply-124",
              content: "coba balas saja",
              date: new Date(),
              username: "johndoe",
            },
          ],
        },
      ],
    };

    // Action
    const gotThread = new GotThread(payload);

    // Assert
    expect(gotThread.id).toEqual(payload.id);
    expect(gotThread.title).toEqual(payload.title);
    expect(gotThread.body).toEqual(payload.body);
    expect(gotThread.date).toEqual(payload.date);
    expect(gotThread.username).toEqual(payload.username);
    expect(gotThread.comments).toEqual(payload.comments);
  });
});
