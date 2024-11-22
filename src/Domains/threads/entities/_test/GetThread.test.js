const GetThread = require("../GetThread");

describe("a GetThread entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {};

    // Action and Assert
    expect(() => new GetThread(payload)).toThrow(
      "GET_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      thread: 1,
    };

    // Action and Assert
    expect(() => new GetThread(payload)).toThrow(
      "GET_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create getThread object correctly", () => {
    // Arrange
    const payload = {
      thread: "thread-1"
    };

    // Action
    const { thread } = new GetThread(payload);

    // Assert
    expect(thread).toEqual(payload.thread);
  });
});
