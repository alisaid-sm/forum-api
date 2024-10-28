const CommentRepository = require("../../../Domains/comments/CommentRepository");
const AddComment = require("../../../Domains/comments/entities/AddComment");
const AddedComment = require("../../../Domains/comments/entities/AddedComment");
const CommentUseCase = require("../CommentUseCase");

describe("CommentUseCase", () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it("should orchestrating the add comment action correctly", async () => {
    // Arrange
    const useCasePayload = {
      owner: "user-1",
      thread: "thread-123",
      content: "Test Aja",
    };

    const mockAddedComment = new AddedComment({
      id: "comment-123",
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    });

    const mockCommentRepository = new CommentRepository();

    mockCommentRepository.addComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockAddedComment));

    /** creating use case instance */
    const commentUseCase = new CommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    const addedComment = await commentUseCase.addComment(useCasePayload);

    // Assert
    expect(addedComment).toStrictEqual(
      new AddedComment({
        id: "comment-123",
        content: useCasePayload.content,
        owner: useCasePayload.owner,
      })
    );
    expect(mockCommentRepository.addComment).toHaveBeenCalledWith(
      new AddComment(useCasePayload)
    );
  });
});
