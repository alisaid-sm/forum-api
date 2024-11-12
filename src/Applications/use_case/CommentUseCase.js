const AddComment = require("../../Domains/comments/entities/AddComment");
const DeleteComment = require("../../Domains/comments/entities/DeleteComment");
const GetComment = require("../../Domains/threads/entities/GetThread");

class CommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  // a.k.a addCommentUseCase
  async addComment(useCasePayload) {
    const addComment = new AddComment(useCasePayload);
    await this._threadRepository.verifyAvailableThread(addComment.thread);
    return this._commentRepository.addComment(addComment);
  }

  // a.k.a deleteCommentUseCase
  async deleteComment(useCasePayload) {
    const deleteComment = new DeleteComment(useCasePayload);
    await this._threadRepository.verifyAvailableThread(deleteComment.thread);
    await this._commentRepository.verifyAvailableComment(deleteComment.comment);
    await this._commentRepository.verifyCommentOwner(deleteComment.owner, deleteComment.comment);
    return this._commentRepository.deleteComment(deleteComment);
  }
}

module.exports = CommentUseCase;
