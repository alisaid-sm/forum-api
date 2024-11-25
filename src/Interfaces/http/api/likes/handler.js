const AddLikeUseCase = require("../../../../Applications/use_case/AddLikeUseCase");

class RepliesHandler {
  constructor(container) {
    this._container = container;

    this.putLikeHandler = this.putLikeHandler.bind(this);
  }

  async putLikeHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { threadId, commentId } = request.params;

    const payload = {
      owner: credentialId,
      thread: threadId,
      comment: commentId
    };

    const addLikeUseCase = this._container.getInstance(AddLikeUseCase.name);

    await addLikeUseCase.execute(payload);

    const response = h.response({
      status: 'success'
    });
    response.code(200);
    return response;
  }
}

module.exports = RepliesHandler;
