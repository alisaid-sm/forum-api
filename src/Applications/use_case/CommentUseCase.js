const AddComment = require("../../Domains/comments/entities/AddComment");
const DeleteComment = require("../../Domains/comments/entities/DeleteComment");
const GetComment = require("../../Domains/comments/entities/GetComment");

class CommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  // a.k.a addCommentUseCase
  async addComment(useCasePayload) {
    const addComment = new AddComment(useCasePayload);
    await this._commentRepository.verifyAvailableThread(addComment.thread);
    return this._commentRepository.addComment(addComment);
  }

  // a.k.a getCommentUseCase
  async getComment(useCasePayload) {
    const getComment = new GetComment(useCasePayload);
    await this._commentRepository.verifyAvailableThread(getComment.thread);
    return this._commentRepository.getComment(getComment);
  }

  // a.k.a deleteCommentUseCase
  async deleteComment(useCasePayload) {
    const deleteComment = new DeleteComment(useCasePayload);
    await this._commentRepository.verifyAvailableThread(deleteComment.thread);
    await this._commentRepository.verifyAvailableComment(deleteComment.comment);
    await this._commentRepository.verifyCommentOwner(deleteComment.owner, deleteComment.comment);
    return this._commentRepository.deleteComment(deleteComment);
  }
}

module.exports = CommentUseCase;
