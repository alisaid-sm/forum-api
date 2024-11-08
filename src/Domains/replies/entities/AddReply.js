class AddReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const { owner, thread, comment, content } = payload;

    this.owner = owner;
    this.thread = thread;
    this.comment = comment;
    this.content = content;
  }

  _verifyPayload({ owner, thread, comment, content }) {
    if (!owner || !thread || !comment || !content) {
      throw new Error("ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof owner !== "string" ||
      typeof thread !== "string" ||
      typeof comment !== "string" ||
      typeof content !== "string"
    ) {
      throw new Error("ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = AddReply;
