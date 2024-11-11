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
      cleanComment.replies = comments[i].replies;

      comments[i] = cleanComment;

      if (
        !comments[i].id ||
        !comments[i].username ||
        !comments[i].date ||
        !comments[i].content ||
        !comments[i].replies
      ) {
        throw new Error("GOT_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY");
      }

      if (
        typeof comments[i].id !== "string" ||
        typeof comments[i].username !== "string" ||
        typeof comments[i].date !== "object" ||
        typeof comments[i].content !== "string" ||
        typeof comments[i].replies !== "object"
      ) {
        throw new Error("GOT_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION");
      }

      for (let j = 0; j < comments[i].replies.length; j++) {
        const cleanReply = {};

        cleanReply.id = comments[i].replies[j].id;
        cleanReply.username = comments[i].replies[j].username;
        cleanReply.date = comments[i].replies[j].date;
        cleanReply.content = comments[i].replies[j].content;

        comments[i].replies[j] = cleanReply;

        if (
          !comments[i].replies[j].id ||
          !comments[i].replies[j].username ||
          !comments[i].replies[j].date ||
          !comments[i].replies[j].content
        ) {
          throw new Error("GOT_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY");
        }

        if (
          typeof comments[i].replies[j].id !== "string" ||
          typeof comments[i].replies[j].username !== "string" ||
          typeof comments[i].replies[j].date !== "object" ||
          typeof comments[i].replies[j].content !== "string"
        ) {
          throw new Error("GOT_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION");
        }
      }
    }
  }
}

module.exports = GotComment;
