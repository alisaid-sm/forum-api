const AddedThread = require("../../../Domains/threads/entities/AddedThread");
const AddThread = require("../../../Domains/threads/entities/AddThread");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const AddThreadUseCase = require("../AddThreadUseCase");

describe("AddThreadUseCase", () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it("should orchestrating the add thread action correctly", async () => {
    // Arrange
    const useCasePayload = {
      owner: "user-1",
      title: "Test",
      body: "Test Aja",
    };

    const mockAddedThread = new AddedThread({
      id: "thread-123",
      owner: useCasePayload.owner,
      title: useCasePayload.title,
      body: useCasePayload.body,
      date: new Date(),
    });

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.addThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockAddedThread));

    /** creating use case instance */
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThread = await addThreadUseCase.execute(useCasePayload);

    // Assert
    expect(addedThread).toStrictEqual(
      new AddedThread(mockAddedThread)
    );
    expect(mockThreadRepository.addThread).toHaveBeenCalledWith(
      new AddThread({
        owner: useCasePayload.owner,
        title: useCasePayload.title,
        body: useCasePayload.body,
      })
    );
  });
});
