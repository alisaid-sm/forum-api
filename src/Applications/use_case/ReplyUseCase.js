const AddReply = require("../../Domains/replies/entities/AddReply");
const DeleteReply = require("../../Domains/replies/entities/DeleteReply");

class ReplyUseCase {
  constructor({ replyRepository }) {
    this._replyRepository = replyRepository;
  }

  // a.k.a addReplyUseCase
  async addReply(useCasePayload) {
    const addReply = new AddReply(useCasePayload);
    await this._replyRepository.verifyAvailableThread(addReply.thread);
    await this._replyRepository.verifyAvailableComment(addReply.comment);
    return this._replyRepository.addReply(addReply);
  }

  // a.k.a deleteReplyUseCase
  async deleteReply(useCasePayload) {
    const deleteReply = new DeleteReply(useCasePayload);
    await this._replyRepository.verifyAvailableThread(deleteReply.thread);
    await this._replyRepository.verifyAvailableComment(deleteReply.comment);
    await this._replyRepository.verifyAvailableReply(deleteReply.reply);
    await this._replyRepository.verifyReplyOwner(deleteReply.owner, deleteReply.reply);
    return this._replyRepository.deleteReply(deleteReply);
  }
}

module.exports = ReplyUseCase;
