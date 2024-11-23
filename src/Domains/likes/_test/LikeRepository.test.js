const LikeRepository = require("../LikeRepository");

describe("LikeRepository interface", () => {
  it("should throw error when invoke abstract behavior addLike", async () => {
    // Arrange
    const likeRepository = new LikeRepository();

    // Action and Assert
    await expect(likeRepository.addLike({})).rejects.toThrow(
      "LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
  });

  it("should throw error when invoke abstract behavior deleteLike", async () => {
    // Arrange
    const likeRepository = new LikeRepository();

    // Action and Assert
    await expect(likeRepository.deleteLike({})).rejects.toThrow(
      "LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
  });

  it("should throw error when invoke abstract behavior verifyAvailableLike", async () => {
    // Arrange
    const likeRepository = new LikeRepository();

    // Action and Assert
    await expect(likeRepository.verifyAvailableLikeInComment({})).rejects.toThrow(
      "LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
  });

  it("should throw error when invoke abstract behavior verifyLikeOwner", async () => {
    // Arrange
    const likeRepository = new LikeRepository();

    // Action and Assert
    await expect(likeRepository.verifyLikeOwner({})).rejects.toThrow(
      "LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
  });

  it("should throw error when invoke abstract behavior getTotalLikesByComments", async () => {
    // Arrange
    const likeRepository = new LikeRepository();

    // Action and Assert
    await expect(likeRepository.getTotalLikesByComments({})).rejects.toThrow(
      "LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
  });
});
