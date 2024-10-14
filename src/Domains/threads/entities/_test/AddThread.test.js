const AddThread = require("../AddThread");

describe("a AddThread entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      owner: "user-1",
      title: "test",
    };

    // Action and Assert
    expect(() => new AddThread(payload)).toThrow(
      "ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      owner: "user-1",
      title: "test",
      body: true,
    };

    // Action and Assert
    expect(() => new AddThread(payload)).toThrow(
      "ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create addThread object correctly", () => {
    // Arrange
    const payload = {
      owner: "user-1",
      title: "test",
      body: "test aja",
    };

    // Action
    const { owner, title, body } = new AddThread(payload);

    // Assert
    expect(owner).toEqual(payload.owner);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
  });
});
