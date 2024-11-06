const CommentRepository = require("../../../Domains/comments/CommentRepository");
const AddComment = require("../../../Domains/comments/entities/AddComment");
const AddedComment = require("../../../Domains/comments/entities/AddedComment");
const DeleteComment = require("../../../Domains/comments/entities/DeleteComment");
const GetComment = require("../../../Domains/comments/entities/GetComment");
const GotComment = require("../../../Domains/comments/entities/GotComment");
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

    mockCommentRepository.verifyAvailableThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

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
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.verifyCommentOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.verifyAvailableThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.verifyAvailableComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const commentUseCase = new CommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    await commentUseCase.deleteComment(useCasePayload);

    // Assert
    expect(mockCommentRepository.deleteComment).toHaveBeenCalledWith(
      new DeleteComment(useCasePayload)
    );
  });
  it("should orchestrating the get comment action correctly", async () => {
    // Arrange
    const useCasePayload = {
      thread: "thread-123",
    };

    const mockGotComment = new GotComment({
      id: "thread-123",
      title: "sebuah thread",
      body: "sebuah body thread",
      date: new Date(),
      username: "dicoding",
      comments: [
        {
          id: "comment-_pby2_tmXV6bcvcdev8xk",
          username: "johndoe",
          date: new Date(),
          content: "sebuah comment",
        },
        {
          id: "comment-yksuCoxM2s4MMrZJO-qVD",
          username: "dicoding",
          date: new Date(),
          content: "**komentar telah dihapus**",
        },
      ],
    });

    const mockCommentRepository = new CommentRepository();

    mockCommentRepository.getComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockGotComment));

    /** creating use case instance */
    const commentUseCase = new CommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    const gotComment = await commentUseCase.getComment(useCasePayload);

    // Assert
    expect(gotComment).toStrictEqual(mockGotComment);

    expect(mockCommentRepository.getComment).toHaveBeenCalledWith(
      new GetComment(useCasePayload)
    );
  });
});
