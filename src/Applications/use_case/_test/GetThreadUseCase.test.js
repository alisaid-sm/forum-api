const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");
const GotThread = require("../../../Domains/threads/entities/GotThread");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const GetThreadUseCase = require("../GetThreadUseCase");

describe("GetThreadUseCase", () => {
  it("should orchestrating the get thread action correctly", async () => {
    // Arrange
    const useCasePayload = {
      thread: "thread-123",
    };

    const mockGotThread = {
      id: "thread-123",
      title: "sebuah thread",
      body: "sebuah body thread",
      date: new Date(),
      username: "dicoding",
    };

    const mockGotComments = [
      {
        id: "comment-_pby2_tmXV6bcvcdev8xk",
        username: "johndoe",
        date: new Date(),
        content: "sebuah comment",
        is_delete: false,
      },
      {
        id: "comment-yksuCoxM2s4MMrZJO-qVD",
        username: "dicoding",
        date: new Date(),
        content: "**komentar telah dihapus**",
        is_delete: true,
      },
    ];

    const mockGotReplies = [
      {
        id: "reply-_pby2_tmXV6bcvcdev8xk",
        username: "johndoe",
        date: new Date(),
        content: "sebuah reply",
        comment: "comment-_pby2_tmXV6bcvcdev8xk",
        is_delete: false,
      },
      {
        id: "reply-_pby2_tmXV6bcvcdev8xk",
        username: "johndoe",
        date: new Date(),
        content: "**balasan telah dihapus**",
        comment: "comment-yksuCoxM2s4MMrZJO-qVD",
        is_delete: true,
      },
    ];

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.getThread = jest.fn(() =>
      Promise.resolve(mockGotThread)
    );

    mockThreadRepository.verifyAvailableThread = jest.fn(() =>
      Promise.resolve()
    );

    const mockCommentRepository = new CommentRepository();

    mockCommentRepository.getCommentsByThread = jest.fn(() =>
      Promise.resolve(mockGotComments)
    );

    const mockReplyRepository = new ReplyRepository();

    mockReplyRepository.getRepliesByComments = jest.fn(() =>
      Promise.resolve(mockGotReplies)
    );

    /** creating use case instance */
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const gotThread = await getThreadUseCase.execute(useCasePayload);

    // Assert
    expect(gotThread).toStrictEqual(
      new GotThread({
        id: "thread-123",
        title: "sebuah thread",
        body: "sebuah body thread",
        date: gotThread.date,
        username: "dicoding",
        comments: [
          {
            id: "comment-_pby2_tmXV6bcvcdev8xk",
            username: "johndoe",
            date: gotThread.comments[0].date,
            content: "sebuah comment",
            replies: [
              {
                id: "reply-_pby2_tmXV6bcvcdev8xk",
                username: "johndoe",
                date: gotThread.comments[0].replies[0].date,
                content: "sebuah reply",
              },
            ],
          },
          {
            id: "comment-yksuCoxM2s4MMrZJO-qVD",
            username: "dicoding",
            date: gotThread.comments[1].date,
            content: "**komentar telah dihapus**",
            replies: [
              {
                id: "reply-_pby2_tmXV6bcvcdev8xk",
                username: "johndoe",
                date: gotThread.comments[1].replies[0].date,
                content: "**balasan telah dihapus**",
              },
            ],
          },
        ],
      })
    );

    expect(mockThreadRepository.getThread).toHaveBeenCalledWith(
      useCasePayload.thread
    );
    expect(mockThreadRepository.verifyAvailableThread).toHaveBeenCalledWith(
      useCasePayload.thread
    );
    expect(mockCommentRepository.getCommentsByThread).toHaveBeenCalledWith(
      useCasePayload.thread
    );
    expect(mockReplyRepository.getRepliesByComments).toHaveBeenCalledWith(
      mockGotComments.map(v => v.id)
    );
  });
});
