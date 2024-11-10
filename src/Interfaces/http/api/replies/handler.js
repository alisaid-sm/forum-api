const ReplyUseCase = require("../../../../Applications/use_case/ReplyUseCase");

class RepliesHandler {
  constructor(container) {
    this._container = container;

    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
  }

  async postReplyHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { threadId, commentId } = request.params;

    request.payload.owner = credentialId;
    request.payload.thread = threadId;
    request.payload.comment = commentId;

    const addReplyUseCase = this._container.getInstance(ReplyUseCase.name);

    const addedReply = await addReplyUseCase.addReply(request.payload);

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  async deleteReplyHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { threadId, commentId, replyId } = request.params;

    request.payload = {};

    request.payload.owner = credentialId;
    request.payload.thread = threadId;
    request.payload.comment = commentId;
    request.payload.reply = replyId;

    const replyUseCase = this._container.getInstance(ReplyUseCase.name);

    await replyUseCase.deleteReply(request.payload);

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = RepliesHandler;
