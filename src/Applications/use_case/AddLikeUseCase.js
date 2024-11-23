const AddLike = require("../../Domains/likes/entities/AddLike");

class AddLikeUseCase {
  constructor({ likeRepository, threadRepository, commentRepository }) {
    this._likeRepository = likeRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const addLike = new AddLike(useCasePayload);
    await this._threadRepository.verifyAvailableThread(addLike.thread);
    await this._commentRepository.verifyAvailableComment(addLike.comment);
    const isAvailable = await this._likeRepository.verifyAvailableLikeInComment(addLike.comment, addLike.owner);

    if (isAvailable) {
        await this._likeRepository.deleteLike(addLike.comment, addLike.owner);
    } else {
        await this._likeRepository.addLike(addLike.comment, addLike.owner);
    }
  }
}

module.exports = AddLikeUseCase;
