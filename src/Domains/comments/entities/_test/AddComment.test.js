const AddComment = require("../AddComment");

describe("a AddComment entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      owner: "user-1",
      thread: "thread-1",
    };

    // Action and Assert
    expect(() => new AddComment(payload)).toThrow(
      "ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      owner: "user-1",
      thread: "thread-1",
      content: true,
    };

    // Action and Assert
    expect(() => new AddComment(payload)).toThrow(
      "ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create addComment object correctly", () => {
    // Arrange
    const payload = {
      owner: "user-1",
      thread: "thread-1",
      content: "ini comment",
    };

    // Action
    const { owner, thread, content } = new AddComment(payload);

    // Assert
    expect(owner).toEqual(payload.owner);
    expect(thread).toEqual(payload.thread);
    expect(content).toEqual(payload.content);
  });
});
