exports.up = (pgm) => {
  pgm.createTable("comments", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    owner: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    thread: {
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
    }
  });

  pgm.addConstraint(
    "comments",
    "fk_comment.thread.id",
    `FOREIGN KEY("thread") REFERENCES threads(id) ON DELETE CASCADE`
  );
  pgm.addConstraint(
    "comments",
    "fk_comment.user.id",
    `FOREIGN KEY("owner") REFERENCES users(id) ON DELETE CASCADE`
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint("comments", "fk_comment.thread.id");
  pgm.dropConstraint("comments", "fk_comment.user.id");
  pgm.dropTable("comments");
};
