const AddReply = require("../AddReply");

describe("a AddReply entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      owner: "user-1",
      thread: "thread-1",
      comment: "comment-1",
    };

    // Action and Assert
    expect(() => new AddReply(payload)).toThrow(
      "ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      owner: "user-1",
      thread: "thread-1",
      comment: "comment-1",
      content: true,
    };

    // Action and Assert
    expect(() => new AddReply(payload)).toThrow(
      "ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create addReply object correctly", () => {
    // Arrange
    const payload = {
      owner: "user-1",
      thread: "thread-1",
      comment: "comment-1",
      content: "ini comment",
    };

    // Action
    const { owner, thread, comment, content } = new AddReply(payload);

    // Assert
    expect(owner).toEqual(payload.owner);
    expect(thread).toEqual(payload.thread);
    expect(comment).toEqual(payload.comment);
    expect(content).toEqual(payload.content);
  });
});
