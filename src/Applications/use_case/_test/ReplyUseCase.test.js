const CommentRepository = require("../../../Domains/comments/CommentRepository");
const AddedReply = require("../../../Domains/replies/entities/AddedReply");
const AddReply = require("../../../Domains/replies/entities/AddReply");
const DeleteReply = require("../../../Domains/replies/entities/DeleteReply");
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const ReplyUseCase = require("../ReplyUseCase");

describe("ReplyUseCase", () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it("should orchestrating the add reply action correctly", async () => {
    // Arrange
    const useCasePayload = {
      owner: "user-1",
      thread: "thread-1",
      comment: "comment-1",
      content: "ini comment",
    };

    const mockAddedReply = new AddedReply({
      id: "reply-123",
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    });

    const mockReplyRepository = new ReplyRepository();

    mockReplyRepository.addReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockAddedReply));

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyAvailableThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const mockCommentRepository = new CommentRepository();

    mockCommentRepository.verifyAvailableComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const replyUseCase = new ReplyUseCase({
      replyRepository: mockReplyRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const addedReply = await replyUseCase.addReply(useCasePayload);

    // Assert
    expect(addedReply).toStrictEqual(
      new AddedReply({
        id: "reply-123",
        content: useCasePayload.content,
        owner: useCasePayload.owner,
      })
    );
    expect(mockReplyRepository.addReply).toHaveBeenCalledWith(
      new AddReply(useCasePayload)
    );
    expect(mockThreadRepository.verifyAvailableThread).toHaveBeenCalledWith(
      useCasePayload.thread
    );
    expect(mockCommentRepository.verifyAvailableComment).toHaveBeenCalledWith(
      useCasePayload.comment
    );
  });
  it("should orchestrating the delete reply action correctly", async () => {
    // Arrange
    const useCasePayload = {
      owner: "user-1",
      thread: "thread-123",
      comment: "comment-1",
      reply: "reply-1",
    };

    const mockReplyRepository = new ReplyRepository();

    mockReplyRepository.deleteReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve({
        rows: [ { id: useCasePayload.reply } ],
      }));

    mockReplyRepository.verifyReplyOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyAvailableReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyAvailableThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const mockCommentRepository = new CommentRepository();

    mockCommentRepository.verifyAvailableComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const replyUseCase = new ReplyUseCase({
      replyRepository: mockReplyRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository
    });

    // Action
    const deleteReply = await replyUseCase.deleteReply(useCasePayload);

    // Assert
    expect(deleteReply.rows[0].id).toBe(useCasePayload.reply);
    expect(mockReplyRepository.deleteReply).toHaveBeenCalledWith(
      new DeleteReply(useCasePayload)
    );
    expect(mockThreadRepository.verifyAvailableThread).toHaveBeenCalledWith(
      useCasePayload.thread
    );
    expect(mockCommentRepository.verifyAvailableComment).toHaveBeenCalledWith(
      useCasePayload.comment
    );
    expect(mockReplyRepository.verifyAvailableReply).toHaveBeenCalledWith(
      useCasePayload.reply
    );
  });
});
