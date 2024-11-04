class GotComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, title, body, date, username, comments } = payload;

    this.id = id;
    this.title = title;
    this.body = body;
    this.date = date;
    this.username = username;
    this.comments = comments;
  }

  _verifyPayload({ id, title, body, date, username, comments }) {
    if (!id || !title || !body || !date || !username || !comments) {
      throw new Error("GOT_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof id !== "string" ||
      typeof title !== "string" ||
      typeof body !== "string" ||
      typeof date !== "string" ||
      typeof username !== "string" ||
      typeof comments !== "object"
    ) {
      throw new Error("GOT_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }

    for (let comment of comments) {
      if (!comment.id || !comment.username || !comment.date || !comment.content) {
        throw new Error("GOT_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY");
      }

      if (
        typeof comment.id !== "string" ||
        typeof comment.username !== "string" ||
        typeof comment.date !== "string" ||
        typeof comment.content !== "string"
      ) {
        throw new Error("GOT_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION");
      }
    }
  }
}

module.exports = GotComment;
