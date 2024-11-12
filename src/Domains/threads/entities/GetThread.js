class GetThread {
  constructor(payload) {
    this._verifyPayload(payload);

    const { thread } = payload;

    this.thread = thread;
  }

  _verifyPayload({ thread }) {
    if (!thread) {
      throw new Error("GET_THREAD.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (typeof thread !== "string") {
      throw new Error("GET_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = GetThread;
