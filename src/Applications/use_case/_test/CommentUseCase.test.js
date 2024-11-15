const CommentRepository = require("../../../Domains/comments/CommentRepository");
const AddComment = require("../../../Domains/comments/entities/AddComment");
const AddedComment = require("../../../Domains/comments/entities/AddedComment");
const DeleteComment = require("../../../Domains/comments/entities/DeleteComment");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
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

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyAvailableThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const commentUseCase = new CommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
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
    expect(mockThreadRepository.verifyAvailableThread).toHaveBeenCalledWith(
      useCasePayload.thread
    );
  });
  it("should orchestrating the delete comment action correctly", async () => {
    // Arrange
    const useCasePayload = {
      owner: "user-1",
      thread: "thread-123",
      comment: "comment-1",
    };

    const mockCommentRepository = new CommentRepository();

    mockCommentRepository.deleteComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve({
        rows: [ { id: useCasePayload.comment } ],
      }));

    mockCommentRepository.verifyCommentOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.verifyAvailableComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyAvailableThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const commentUseCase = new CommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository
    });

    // Action
    const deleteComment = await commentUseCase.deleteComment(useCasePayload);

    // Assert
    expect(deleteComment.rows[0].id).toBe(useCasePayload.comment);
    expect(mockCommentRepository.deleteComment).toHaveBeenCalledWith(
      new DeleteComment(useCasePayload)
    );
    expect(mockCommentRepository.verifyCommentOwner).toHaveBeenCalledWith(useCasePayload.owner, useCasePayload.comment);
    expect(mockCommentRepository.verifyAvailableComment).toHaveBeenCalledWith(useCasePayload.comment);
    expect(mockThreadRepository.verifyAvailableThread).toHaveBeenCalledWith(useCasePayload.thread);
  });
});
