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
      typeof date !== "object" ||
      typeof username !== "string" ||
      typeof comments !== "object"
    ) {
      throw new Error("GOT_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }

    for (let i = 0; i < comments.length; i++) {
      const cleanComment = {};

      cleanComment.id = comments[i].id;
      cleanComment.username = comments[i].username;
      cleanComment.date = comments[i].date;
      cleanComment.content = comments[i].content;

      comments[i] = cleanComment;

      if (!comments[i].id || !comments[i].username || !comments[i].date || !comments[i].content) {
        throw new Error("GOT_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY");
      }

      if (
        typeof comments[i].id !== "string" ||
        typeof comments[i].username !== "string" ||
        typeof comments[i].date !== "object" ||
        typeof comments[i].content !== "string"
      ) {
        throw new Error("GOT_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION");
      }
    }
  }
}

module.exports = GotComment;
