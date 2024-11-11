const AddedComment = require("../AddedComment");
const GotComment = require("../GotComment");

describe("a GotComment entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      id: "thread-123",
      title: "sebuah thread",
    };

    // Action and Assert
    expect(() => new GotComment(payload)).toThrow(
      "GOT_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
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
    expect(() => new GotComment(payload)).toThrow(
      "GOT_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
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
    expect(() => new GotComment(payload)).toThrow(
      "GOT_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
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
    expect(() => new GotComment(payload)).toThrow(
      "GOT_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION"
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
    expect(() => new GotComment(payload)).toThrow(
      "GOT_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION"
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
    expect(() => new GotComment(payload)).toThrow(
      "GOT_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create gotComment object correctly", () => {
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
          replies: [],
        },
        {
          id: "comment-yksuCoxM2s4MMrZJO-qVD",
          username: "dicoding",
          date: new Date(),
          content: "**komentar telah dihapus**",
          replies: [],
        },
      ],
    };

    // Action
    const gotComment = new GotComment(payload);

    // Assert
    expect(gotComment.id).toEqual(payload.id);
    expect(gotComment.title).toEqual(payload.title);
    expect(gotComment.body).toEqual(payload.body);
    expect(gotComment.date).toEqual(payload.date);
    expect(gotComment.username).toEqual(payload.username);
    expect(gotComment.comments).toEqual(payload.comments);
  });
});
