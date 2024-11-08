class DeleteReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const { owner, thread, comment, reply } = payload;

    this.owner = owner;
    this.thread = thread;
    this.comment = comment;
    this.reply = reply;
  }

  _verifyPayload({ owner, thread, comment, reply }) {
    if (!owner || !thread || !comment || !reply) {
      throw new Error("DELETE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof owner !== "string" ||
      typeof thread !== "string" ||
      typeof comment !== "string" ||
      typeof reply !== "string"
    ) {
      throw new Error("DELETE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = DeleteReply;
