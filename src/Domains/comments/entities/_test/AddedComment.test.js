const AddedComment = require("../AddedComment");

describe("a AddedComment entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      owner: "user-1",
      content: "ini comment",
    };

    // Action and Assert
    expect(() => new AddedComment(payload)).toThrow(
      "ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      id: 123,
      owner: "user-1",
      content: ["ini comment"],
    };

    // Action and Assert
    expect(() => new AddedComment(payload)).toThrow(
      "ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create addComment object correctly", () => {
    // Arrange
    const payload = {
      id: "comment-1",
      owner: "user-1",
      content: "ini comment",
    };

    // Action
    const addedComment = new AddedComment(payload);

    // Assert
    expect(addedComment.id).toEqual(payload.id);
    expect(addedComment.owner).toEqual(payload.owner);
    expect(addedComment.content).toEqual(payload.content);
  });
});
