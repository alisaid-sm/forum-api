const AddLike = require("../AddLike");

describe("a AddLike entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      owner: "user-1",
      thread: "thread-1",
    };

    // Action and Assert
    expect(() => new AddLike(payload)).toThrow(
      "ADD_LIKE.NOT_CONTAIN_NEEDED_PROPERTY"
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
    expect(() => new AddLike(payload)).toThrow(
      "ADD_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create addLike object correctly", () => {
    // Arrange
    const payload = {
      owner: "user-1",
      thread: "thread-1",
      comment: "comment-1",
    };

    // Action
    const { owner, thread, comment } = new AddLike(payload);

    // Assert
    expect(owner).toEqual(payload.owner);
    expect(thread).toEqual(payload.thread);
    expect(comment).toEqual(payload.comment);
  });
});
