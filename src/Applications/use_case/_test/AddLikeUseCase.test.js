const CommentRepository = require("../../../Domains/comments/CommentRepository");
const LikeRepository = require("../../../Domains/likes/LikeRepository");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const AddLikeUseCase = require("../AddLikeUseCase");

describe("LikeUseCase", () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it("should orchestrating the add like action correctly", async () => {
    // Arrange
    const useCasePayload = {
      owner: "user-1",
      thread: "thread-1",
      comment: "comment-1",
    };

    const mockLikeRepository = new LikeRepository();

    mockLikeRepository.addLike = jest.fn(() => Promise.resolve());
    mockLikeRepository.verifyAvailableLikeInComment = jest.fn(() =>
      Promise.resolve([])
    );

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyAvailableThread = jest.fn(() =>
      Promise.resolve()
    );

    const mockCommentRepository = new CommentRepository();

    mockCommentRepository.verifyAvailableComment = jest.fn(() =>
      Promise.resolve()
    );

    /** creating use case instance */
    const addLikeUseCase = new AddLikeUseCase({
      likeRepository: mockLikeRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await addLikeUseCase.execute(useCasePayload);

    // Assert
    expect(mockLikeRepository.addLike).toHaveBeenCalledWith(
      useCasePayload.comment,
      useCasePayload.owner
    );
    expect(
      mockLikeRepository.verifyAvailableLikeInComment
    ).toHaveBeenCalledWith(useCasePayload.comment, useCasePayload.owner);
    expect(mockThreadRepository.verifyAvailableThread).toHaveBeenCalledWith(
      useCasePayload.thread
    );
    expect(mockCommentRepository.verifyAvailableComment).toHaveBeenCalledWith(
      useCasePayload.comment
    );
  });

  it("should orchestrating the delete like action correctly", async () => {
    const useCasePayload = {
      owner: "user-1",
      thread: "thread-1",
      comment: "comment-1",
    };

    const mockLikeRepository = new LikeRepository();

    mockLikeRepository.deleteLike = jest.fn(() => Promise.resolve());
    mockLikeRepository.verifyAvailableLikeInComment = jest.fn(() =>
      Promise.resolve([{ is_delete: false }])
    );

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyAvailableThread = jest.fn(() =>
      Promise.resolve()
    );

    const mockCommentRepository = new CommentRepository();

    mockCommentRepository.verifyAvailableComment = jest.fn(() =>
      Promise.resolve()
    );

    /** creating use case instance */
    const addLikeUseCase = new AddLikeUseCase({
      likeRepository: mockLikeRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await addLikeUseCase.execute(useCasePayload);

    // Assert
    expect(mockLikeRepository.deleteLike).toHaveBeenCalledWith(
      useCasePayload.comment,
      useCasePayload.owner
    );
    expect(
      mockLikeRepository.verifyAvailableLikeInComment
    ).toHaveBeenCalledWith(useCasePayload.comment, useCasePayload.owner);
    expect(mockThreadRepository.verifyAvailableThread).toHaveBeenCalledWith(
      useCasePayload.thread
    );
    expect(mockCommentRepository.verifyAvailableComment).toHaveBeenCalledWith(
      useCasePayload.comment
    );
  });

  it("should orchestrating the restore like action correctly", async () => {
    const useCasePayload = {
      owner: "user-1",
      thread: "thread-1",
      comment: "comment-1",
    };

    const mockLikeRepository = new LikeRepository();

    mockLikeRepository.restoreLike = jest.fn(() => Promise.resolve());
    mockLikeRepository.verifyAvailableLikeInComment = jest.fn(() =>
      Promise.resolve([{ is_delete: true }])
    );

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyAvailableThread = jest.fn(() =>
      Promise.resolve()
    );

    const mockCommentRepository = new CommentRepository();

    mockCommentRepository.verifyAvailableComment = jest.fn(() =>
      Promise.resolve()
    );

    /** creating use case instance */
    const addLikeUseCase = new AddLikeUseCase({
      likeRepository: mockLikeRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await addLikeUseCase.execute(useCasePayload);

    // Assert
    expect(mockLikeRepository.restoreLike).toHaveBeenCalledWith(
      useCasePayload.comment,
      useCasePayload.owner
    );
    expect(
      mockLikeRepository.verifyAvailableLikeInComment
    ).toHaveBeenCalledWith(useCasePayload.comment, useCasePayload.owner);
    expect(mockThreadRepository.verifyAvailableThread).toHaveBeenCalledWith(
      useCasePayload.thread
    );
    expect(mockCommentRepository.verifyAvailableComment).toHaveBeenCalledWith(
      useCasePayload.comment
    );
  });
});
