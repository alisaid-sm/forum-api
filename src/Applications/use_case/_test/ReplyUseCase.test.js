const AddedReply = require("../../../Domains/replies/entities/AddedReply");
const AddReply = require("../../../Domains/replies/entities/AddReply");
const DeleteReply = require("../../../Domains/replies/entities/DeleteReply");
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");
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

    mockReplyRepository.verifyAvailableThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockReplyRepository.verifyAvailableComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const replyUseCase = new ReplyUseCase({
      replyRepository: mockReplyRepository,
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
      .mockImplementation(() => Promise.resolve());

    mockReplyRepository.verifyReplyOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockReplyRepository.verifyAvailableThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockReplyRepository.verifyAvailableComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockReplyRepository.verifyAvailableReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const replyUseCase = new ReplyUseCase({
      replyRepository: mockReplyRepository,
    });

    // Action
    await replyUseCase.deleteReply(useCasePayload);

    // Assert
    expect(mockReplyRepository.deleteReply).toHaveBeenCalledWith(
      new DeleteReply(useCasePayload)
    );
  });
});
