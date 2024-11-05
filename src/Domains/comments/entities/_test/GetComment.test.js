const GetComment = require("../GetComment");

describe("a GetComment entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {};

    // Action and Assert
    expect(() => new GetComment(payload)).toThrow(
      "GET_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      thread: 1,
    };

    // Action and Assert
    expect(() => new GetComment(payload)).toThrow(
      "GET_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create getComment object correctly", () => {
    // Arrange
    const payload = {
      thread: "thread-1"
    };

    // Action
    const { thread } = new GetComment(payload);

    // Assert
    expect(thread).toEqual(payload.thread);
  });
});
