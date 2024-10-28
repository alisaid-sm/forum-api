const AddComment = require("../../Domains/comments/entities/AddComment");

class CommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  // a.k.a addCommentUseCase
  addComment(useCasePayload) {
    const addComment = new AddComment(useCasePayload);
    return this._commentRepository.addComment(addComment);
  }

  // a.k.a getCommentUseCase
  getComment(useCasePayload) {
    // const addComment = new AddComment(useCasePayload);
    // return this._commentRepository.addComment(addComment);
  }

  // a.k.a deleteCommentUseCase
  deleteComment(useCasePayload) {
    // const addComment = new AddComment(useCasePayload);
    // return this._commentRepository.addComment(addComment);
  }
}

module.exports = CommentUseCase;
