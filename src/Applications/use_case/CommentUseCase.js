const AddComment = require("../../Domains/comments/entities/AddComment");
const DeleteComment = require("../../Domains/comments/entities/DeleteComment");

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
  getComment(useCasePayload) {
    // const addComment = new AddComment(useCasePayload);
    // return this._commentRepository.addComment(addComment);
  }

  // a.k.a deleteCommentUseCase
  async deleteComment(useCasePayload) {
    const deleteComment = new DeleteComment(useCasePayload);
    await this._commentRepository.verifyCommentOwner(deleteComment.owner);
    await this._commentRepository.verifyAvailableThread(deleteComment.thread);
    await this._commentRepository.verifyAvailableComment(deleteComment.comment);
    return this._commentRepository.deleteComment(deleteComment);
  }
}

module.exports = CommentUseCase;
