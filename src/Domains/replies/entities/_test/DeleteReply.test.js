const DeleteReply = require("../DeleteReply");

describe("a DeleteReply entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      owner: "user-1",
      thread: "thread-1",
      comment: "comment-1",
    };

    // Action and Assert
    expect(() => new DeleteReply(payload)).toThrow(
      "DELETE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      owner: "user-1",
      thread: "thread-1",
      comment: "comment-1",
      reply: true,
    };

    // Action and Assert
    expect(() => new DeleteReply(payload)).toThrow(
      "DELETE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create deleteReply object correctly", () => {
    // Arrange
    const payload = {
      owner: "user-1",
      thread: "thread-1",
      comment: "comment-1",
      reply: "reply-1",
    };

    // Action
    const { owner, thread, comment, reply } = new DeleteReply(payload);

    // Assert
    expect(owner).toEqual(payload.owner);
    expect(thread).toEqual(payload.thread);
    expect(comment).toEqual(payload.comment);
    expect(reply).toEqual(payload.reply);
  });
});
