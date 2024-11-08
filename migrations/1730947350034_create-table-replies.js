exports.up = (pgm) => {
  pgm.createTable("replies", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    owner: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    comment: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    content: {
      type: "TEXT",
      notNull: true,
    },
    date: {
      type: "TIMESTAMP",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    is_delete: {
      type: "BOOLEAN",
      default: false,
    },
  });

  pgm.addConstraint(
    "replies",
    "fk_reply.comment.id",
    `FOREIGN KEY("comment") REFERENCES comments(id) ON DELETE CASCADE`
  );
  pgm.addConstraint(
    "replies",
    "fk_reply.user.id",
    `FOREIGN KEY("owner") REFERENCES users(id) ON DELETE CASCADE`
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint("replies", "fk_reply.comment.id");
  pgm.dropConstraint("replies", "fk_reply.user.id");
  pgm.dropTable("replies");
};
