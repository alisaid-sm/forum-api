const GetThread = require("../../Domains/threads/entities/GetThread");
const GotThread = require("../../Domains/threads/entities/GotThread");

class GetThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const getThread = new GetThread(useCasePayload);
    await this._threadRepository.verifyAvailableThread(getThread.thread);
    const thread = await this._threadRepository.getThread(getThread.thread);
    const comments = await this._commentRepository.getCommentsByThread(
      getThread.thread
    );

    for (let i = 0; i < comments.length; i++) {
      if (comments[i].is_delete) {
        comments[i].content = "**komentar telah dihapus**";
      }

      delete comments[i].is_delete;

      comments[i].replies = await this._replyRepository.getRepliesByComment(
        comments[i].id
      );

      for (let j = 0; j < comments[i].replies.length; j++) {
        if (comments[i].replies[j].is_delete) {
          comments[i].replies[j].content = "**balasan telah dihapus**";
        }

        delete comments[i].replies[j].is_delete;
      }
    }

    thread.comments = comments;

    return new GotThread(thread);
  }
}

module.exports = GetThreadUseCase;
