const AddReply = require("../../Domains/replies/entities/AddReply");
const DeleteReply = require("../../Domains/replies/entities/DeleteReply");

class ReplyUseCase {
  constructor({ replyRepository, threadRepository, commentRepository }) {
    this._replyRepository = replyRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  // a.k.a addReplyUseCase
  async addReply(useCasePayload) {
    const addReply = new AddReply(useCasePayload);
    await this._threadRepository.verifyAvailableThread(addReply.thread);
    await this._commentRepository.verifyAvailableComment(addReply.comment);
    return this._replyRepository.addReply(addReply);
  }

  // a.k.a deleteReplyUseCase
  async deleteReply(useCasePayload) {
    const deleteReply = new DeleteReply(useCasePayload);
    await this._threadRepository.verifyAvailableThread(deleteReply.thread);
    await this._commentRepository.verifyAvailableComment(deleteReply.comment);
    await this._replyRepository.verifyAvailableReply(deleteReply.reply);
    await this._replyRepository.verifyReplyOwner(deleteReply.owner, deleteReply.reply);
    await this._replyRepository.deleteReply(deleteReply);
  }
}

module.exports = ReplyUseCase;
