class AddThread {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, owner, title, body, date } = payload;

    this.id = id;
    this.owner = owner;
    this.title = title;
    this.body = body;
    this.date = date;
  }

  _verifyPayload({ id, owner, title, body, date }) {
    if (!id || !owner || !title || !body || !date) {
      throw new Error('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof owner !== 'string' || typeof title !== 'string' || typeof body !== 'string' || !(date instanceof Date)) {
      throw new Error('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddThread;
