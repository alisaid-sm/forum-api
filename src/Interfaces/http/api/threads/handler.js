const AddThreadUseCase = require("../../../../Applications/use_case/AddThreadUseCase");
const GetThreadUseCase = require("../../../../Applications/use_case/GetThreadUseCase");

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadHandler = this.getThreadHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;

    request.payload.owner = credentialId;

    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);

    const addedThread = await addThreadUseCase.execute(request.payload);

    const response = h.response({
      status: "success",
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async getThreadHandler(request, h) {
    const { threadId } = request.params;

    request.payload = {};

    request.payload.thread = threadId;

    const threadUseCase = this._container.getInstance(GetThreadUseCase.name);

    const thread = await threadUseCase.execute(request.payload);

    const response = h.response({
      status: "success",
      data: {
        thread,
      },
    });
    response.code(200);
    return response;
  }
}

module.exports = ThreadsHandler;
