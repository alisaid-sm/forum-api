const DeleteComment = require("../DeleteComment");

describe("a DeleteComment entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      owner: "user-1",
      thread: "thread-1",
    };

    // Action and Assert
    expect(() => new DeleteComment(payload)).toThrow(
      "DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      owner: "user-1",
      thread: "thread-1",
      comment: true,
    };

    // Action and Assert
    expect(() => new DeleteComment(payload)).toThrow(
      "DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create deleteComment object correctly", () => {
    // Arrange
    const payload = {
      owner: "user-1",
      thread: "thread-1",
      comment: "comment-1",
    };

    // Action
    const { owner, thread, comment } = new DeleteComment(payload);

    // Assert
    expect(owner).toEqual(payload.owner);
    expect(thread).toEqual(payload.thread);
    expect(comment).toEqual(payload.comment);
  });
});
