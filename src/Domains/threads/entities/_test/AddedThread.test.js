const AddedThread = require("../AddedThread");

describe("a AddedThread entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      title: "Test",
      body: "Test aja",
    };

    // Action and Assert
    expect(() => new AddedThread(payload)).toThrow(
      "ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      id: 123,
      owner: "ali",
      title: {},
      body: {},
      date: {},
    };

    // Action and Assert
    expect(() => new AddedThread(payload)).toThrow(
      "ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create addThread object correctly", () => {
    // Arrange
    const payload = {
      id: "thread-pertama",
      owner: "ali",
      title: "Test",
      body: "Test Aja",
      date: new Date(),
    };

    // Action
    const addedThread = new AddedThread(payload);

    // Assert
    expect(addedThread.id).toEqual(payload.id);
    expect(addedThread.owner).toEqual(payload.owner);
    expect(addedThread.title).toEqual(payload.title);
    expect(addedThread.body).toEqual(payload.body);
    expect(addedThread.date).toEqual(payload.date);
  });
});
