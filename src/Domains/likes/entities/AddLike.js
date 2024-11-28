class AddLike {
  constructor(payload) {
    this._verifyPayload(payload);

    const { owner, thread, comment } = payload;

    this.owner = owner;
    this.thread = thread;
    this.comment = comment;
  }

  _verifyPayload({ owner, thread, comment }) {
    if (!owner || !thread || !comment) {
      throw new Error("ADD_LIKE.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof owner !== "string" ||
      typeof thread !== "string" ||
      typeof comment !== "string"
    ) {
      throw new Error("ADD_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = AddLike;
