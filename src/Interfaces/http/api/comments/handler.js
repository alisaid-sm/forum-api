const CommentUseCase = require('../../../../Applications/use_case/CommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
    this.getCommentHandler = this.getCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { threadId } = request.params;

    request.payload.owner = credentialId;
    request.payload.thread = threadId;

    const addCommentUseCase = this._container.getInstance(CommentUseCase.name);

    const addedComment = await addCommentUseCase.addComment(request.payload);

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { threadId, commentId } = request.params;

    request.payload = {};

    request.payload.owner = credentialId;
    request.payload.thread = threadId;
    request.payload.comment = commentId;

    const commentUseCase = this._container.getInstance(CommentUseCase.name);

    await commentUseCase.deleteComment(request.payload);

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }

  async getCommentHandler(request, h) {
    const { threadId } = request.params;

    request.payload = {};

    request.payload.thread = threadId;

    const commentUseCase = this._container.getInstance(CommentUseCase.name);

    const thread = await commentUseCase.getComment(request.payload);

    const response = h.response({
      status: 'success',
      data: {
        thread,
      },
    });
    response.code(200);
    return response;
  }
}

module.exports = CommentsHandler;
